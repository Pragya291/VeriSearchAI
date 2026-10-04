from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.core.auth import get_auth_service, get_current_user
from app.core.config import settings
from app.models.auth import AccountCreate, AuthResponse, LoginRequest, UserResponse
from app.services.auth_service import AuthService, DuplicateEmailError

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=token,
        max_age=settings.AUTH_SESSION_DAYS * 24 * 60 * 60,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )
    response.headers["Cache-Control"] = "no-store"


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    account: AccountCreate,
    service: AuthService = Depends(get_auth_service),
):
    try:
        user = service.create_account(account.full_name, account.email, account.password)
    except DuplicateEmailError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    return {"user": user}


@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    session = service.create_session(credentials.email, credentials.password)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    token, user = session
    _set_session_cookie(response, token)
    return {"user": user}


@router.get("/me", response_model=UserResponse)
async def get_me(
    response: Response,
    user: dict = Depends(get_current_user),
):
    response.headers["Cache-Control"] = "no-store"
    return user


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    service.revoke_session(request.cookies.get(settings.AUTH_COOKIE_NAME))
    response.delete_cookie(
        key=settings.AUTH_COOKIE_NAME,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )
    response.headers["Cache-Control"] = "no-store"
    return {"message": "Logged out."}