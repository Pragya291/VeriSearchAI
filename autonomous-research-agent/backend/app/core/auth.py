from fastapi import Depends, HTTPException, Request, status

from app.core.config import settings
from app.services.auth_service import AuthService, auth_service


def get_auth_service() -> AuthService:
    return auth_service


def get_current_user(
    request: Request,
    service: AuthService = Depends(get_auth_service),
) -> dict:
    token = request.cookies.get(settings.AUTH_COOKIE_NAME)
    user = service.get_session_user(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )
    return user