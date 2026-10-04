import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.core.auth import get_auth_service
from app.main import app
from app.services.auth_service import AuthService


@pytest.fixture
def auth_client(tmp_path):
    service = AuthService(str(tmp_path / "auth.sqlite3"))
    app.dependency_overrides[get_auth_service] = lambda: service
    with TestClient(app) as client:
        yield client, service
    app.dependency_overrides.pop(get_auth_service, None)


def register(client, email="janahvi@example.com", password="secure-password-42"):
    return client.post(
        "/api/auth/signup",
        json={"full_name": "Janahvi Loke", "email": email, "password": password},
    )


def test_signup_persists_only_a_password_hash(auth_client):
    client, service = auth_client

    response = register(client)

    assert response.status_code == 201
    assert response.json()["user"] == {
        "id": response.json()["user"]["id"],
        "full_name": "Janahvi Loke",
        "email": "janahvi@example.com",
    }
    with sqlite3.connect(service.database_path) as connection:
        password_hash = connection.execute(
            "SELECT password_hash FROM users WHERE email = ?", ("janahvi@example.com",)
        ).fetchone()[0]
    assert password_hash.startswith("scrypt$")
    assert password_hash != "secure-password-42"


def test_duplicate_email_is_rejected(auth_client):
    client, _ = auth_client

    assert register(client).status_code == 201
    duplicate = register(client, email="JANAHVI@example.com")

    assert duplicate.status_code == 409
    assert duplicate.json()["detail"] == "An account with this email already exists."


def test_incorrect_password_is_rejected(auth_client):
    client, _ = auth_client
    register(client)

    response = client.post(
        "/api/auth/login",
        json={"email": "janahvi@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_login_persists_session_and_logout_revokes_it(auth_client):
    client, _ = auth_client
    register(client)

    response = client.post(
        "/api/auth/login",
        json={"email": "JANAHVI@example.com", "password": "secure-password-42"},
    )

    assert response.status_code == 200
    assert response.json()["user"]["full_name"] == "Janahvi Loke"
    cookie = response.cookies.get("verisearchai_session")
    assert cookie
    assert "httponly" in response.headers["set-cookie"].lower()
    assert client.get("/api/auth/me").json()["email"] == "janahvi@example.com"

    assert client.post("/api/auth/logout").status_code == 200
    assert client.get("/api/auth/me").status_code == 401


def test_research_api_requires_an_authenticated_session(auth_client):
    client, _ = auth_client

    response = client.get("/api/research")

    assert response.status_code == 401