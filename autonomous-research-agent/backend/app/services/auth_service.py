import base64
import hashlib
import hmac
import secrets
import sqlite3
import time
import uuid
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator, Optional

from app.core.config import settings


class DuplicateEmailError(Exception):
    """Raised when an account already exists for an email address."""


class AuthService:
    """Persist user credentials and revocable sessions in a local SQLite store."""

    def __init__(self, database_path: Optional[str] = None):
        default_path = Path(__file__).resolve().parents[2] / "data" / "auth.sqlite3"
        self.database_path = Path(database_path or settings.AUTH_DATABASE_PATH or default_path)
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize_database()

    @contextmanager
    def _connection(self) -> Iterator[sqlite3.Connection]:
        connection = sqlite3.connect(self.database_path, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        try:
            yield connection
            connection.commit()
        finally:
            connection.close()

    def _initialize_database(self) -> None:
        with self._connection() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    full_name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    token_hash TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL
                );
                CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
                """
            )

    @staticmethod
    def _hash_password(password: str, salt: Optional[bytes] = None) -> str:
        salt = salt or secrets.token_bytes(16)
        derived = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1, dklen=64)
        encode = lambda value: base64.urlsafe_b64encode(value).decode("ascii")
        return f"scrypt$16384$8$1${encode(salt)}${encode(derived)}"

    @staticmethod
    def _verify_password(password: str, stored_hash: str) -> bool:
        try:
            algorithm, n, r, p, salt_text, expected_text = stored_hash.split("$")
            if algorithm != "scrypt":
                return False
            decode = lambda value: base64.urlsafe_b64decode(value.encode("ascii"))
            salt = decode(salt_text)
            expected = decode(expected_text)
            actual = hashlib.scrypt(
                password.encode("utf-8"),
                salt=salt,
                n=int(n),
                r=int(r),
                p=int(p),
                dklen=len(expected),
            )
            return hmac.compare_digest(actual, expected)
        except (ValueError, TypeError, MemoryError):
            return False

    @staticmethod
    def _public_user(row: sqlite3.Row) -> dict:
        return {"id": row["id"], "full_name": row["full_name"], "email": row["email"]}

    def create_account(self, full_name: str, email: str, password: str) -> dict:
        user_id = str(uuid.uuid4())
        password_hash = self._hash_password(password)
        try:
            with self._connection() as connection:
                connection.execute(
                    "INSERT INTO users (id, full_name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
                    (user_id, full_name, email, password_hash, int(time.time())),
                )
                row = connection.execute(
                    "SELECT id, full_name, email FROM users WHERE id = ?", (user_id,)
                ).fetchone()
        except sqlite3.IntegrityError as error:
            raise DuplicateEmailError from error
        return self._public_user(row)

    def create_session(self, email: str, password: str) -> Optional[tuple[str, dict]]:
        with self._connection() as connection:
            row = connection.execute(
                "SELECT id, full_name, email, password_hash FROM users WHERE email = ?", (email,)
            ).fetchone()
            if row is None or not self._verify_password(password, row["password_hash"]):
                return None

            token = secrets.token_urlsafe(32)
            token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
            expires_at = int(time.time()) + settings.AUTH_SESSION_DAYS * 24 * 60 * 60
            connection.execute(
                "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
                (token_hash, row["id"], expires_at),
            )
            connection.execute("DELETE FROM sessions WHERE expires_at <= ?", (int(time.time()),))
            return token, self._public_user(row)

    def get_session_user(self, token: Optional[str]) -> Optional[dict]:
        if not token:
            return None
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with self._connection() as connection:
            row = connection.execute(
                """
                SELECT users.id, users.full_name, users.email, sessions.expires_at
                FROM sessions JOIN users ON users.id = sessions.user_id
                WHERE sessions.token_hash = ?
                """,
                (token_hash,),
            ).fetchone()
            if row is None:
                return None
            if row["expires_at"] <= int(time.time()):
                connection.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash,))
                return None
            return self._public_user(row)

    def revoke_session(self, token: Optional[str]) -> None:
        if not token:
            return
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with self._connection() as connection:
            connection.execute("DELETE FROM sessions WHERE token_hash = ?", (token_hash,))


auth_service = AuthService()