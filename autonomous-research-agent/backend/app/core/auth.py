import logging
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, Request, status

from app.core.config import settings
from app.core.firebase import initialize_firebase
from app.services.auth_service import AuthService, auth_service
from app.services.firebase_service import firebase_service

logger = logging.getLogger("auth_core")


def get_auth_service() -> AuthService:
    return auth_service


def verify_firebase_bearer_token(token: str) -> Dict[str, Any]:
    """
    Verifies Firebase ID token securely using Firebase Admin SDK.
    Synchronizes the authenticated user profile into Firestore ('users/{uid}').
    Raises HTTPException(401) on invalid or expired tokens.
    """
    try:
        initialize_firebase()
        import firebase_admin
        from firebase_admin import auth as fb_auth

        decoded = fb_auth.verify_id_token(token)
        uid = decoded.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing UID."
            )

        email = decoded.get("email") or ""
        name = decoded.get("name") or (email.split("@")[0].capitalize() if email else "Researcher")
        picture = decoded.get("picture") or ""
        provider = decoded.get("firebase", {}).get("sign_in_provider") or "google.com"

        # Persist / update user in Firestore
        try:
            persisted = firebase_service.upsert_user({
                "uid": uid,
                "name": name,
                "email": email,
                "profilePhoto": picture,
                "provider": provider,
            })
        except Exception as upsert_err:
            logger.warning(f"Could not upsert user to Firestore: {upsert_err}")
            persisted = {}

        return {
            "id": uid,
            "uid": uid,
            "full_name": persisted.get("name") or name,
            "email": persisted.get("email") or email,
            "profilePhoto": persisted.get("profilePhoto") or picture,
            "avatar_url": persisted.get("profilePhoto") or picture,
            "provider": persisted.get("provider") or provider,
            "auth_provider": provider,
            "role": "Researcher",
        }
    except HTTPException:
        raise
    except Exception as exc:
        err_msg = str(exc)
        logger.warning(f"Firebase token verification failed: {err_msg}")
        if "expired" in err_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication token has expired. Please sign in again.",
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or unauthorized authentication token.",
        )


def get_current_user(
    request: Request,
    service: AuthService = Depends(get_auth_service),
) -> dict:
    """
    Extracts and validates user identity from either:
    1. 'Authorization: Bearer <FIREBASE_ID_TOKEN>' header (Primary)
    2. Session cookie 'verisearchai_session' (Local / backwards compatibility)
    """
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        bearer_token = auth_header.split(" ", 1)[1].strip()
        if bearer_token:
            return verify_firebase_bearer_token(bearer_token)

    # Fallback to local cookie session
    cookie_token = request.cookies.get(settings.AUTH_COOKIE_NAME)
    if cookie_token:
        user = service.get_session_user(cookie_token)
        if user:
            user["uid"] = user.get("id")
            return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
    )


def get_optional_user(
    request: Request,
    service: AuthService = Depends(get_auth_service),
) -> Optional[dict]:
    """
    Returns authenticated user if a valid Bearer token or session cookie is present,
    or None if unauthenticated.
    """
    try:
        return get_current_user(request=request, service=service)
    except HTTPException:
        return None