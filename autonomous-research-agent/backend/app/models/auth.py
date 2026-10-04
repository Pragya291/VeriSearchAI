import re
from pydantic import BaseModel, Field, field_validator


class AccountCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str = Field(max_length=254)
    password: str = Field(min_length=8, max_length=1024)

    @field_validator("full_name")
    @classmethod
    def normalize_full_name(cls, value: str) -> str:
        name = " ".join(value.split())
        if len(name) < 2:
            raise ValueError("Full name must contain at least 2 characters.")
        return name

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
            raise ValueError("Enter a valid email address.")
        return email


class LoginRequest(BaseModel):
    email: str = Field(max_length=254)
    password: str = Field(min_length=1, max_length=1024)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
            raise ValueError("Enter a valid email address.")
        return email


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str


class AuthResponse(BaseModel):
    user: UserResponse