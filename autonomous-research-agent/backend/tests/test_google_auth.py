from unittest.mock import patch, MagicMock
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.firebase_service import firebase_service


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_unauthenticated_request_rejected_on_api_me(client):
    response = client.get("/api/me")
    assert response.status_code == 401
    assert "Authentication required" in response.json()["detail"]


def test_invalid_bearer_token_rejected_on_api_me(client):
    response = client.get("/api/me", headers={"Authorization": "Bearer invalid_token_123"})
    assert response.status_code == 401


@patch("firebase_admin.auth.verify_id_token")
def test_valid_bearer_token_authenticated_and_persisted(mock_verify, client):
    mock_verify.return_value = {
        "uid": "google-user-789",
        "email": "dr.hayes@example.com",
        "name": "Dr. Jordan Hayes",
        "picture": "https://example.com/avatar.jpg",
        "firebase": {"sign_in_provider": "google.com"},
    }

    response = client.get("/api/me", headers={"Authorization": "Bearer valid_mock_token"})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "google-user-789"
    assert data["full_name"] == "Dr. Jordan Hayes"
    assert data["email"] == "dr.hayes@example.com"
    assert data["profilePhoto"] == "https://example.com/avatar.jpg"
    assert data["provider"] == "google.com"

    # Verify user was saved in firebase_service
    saved_user = firebase_service.get_user("google-user-789")
    assert saved_user is not None
    assert saved_user["email"] == "dr.hayes@example.com"


@patch("firebase_admin.auth.verify_id_token")
def test_user_cannot_access_another_users_research(mock_verify, client):
    # Setup: create a research session owned by user A
    res_id = firebase_service.create_research("User A query", owner_id="user-A")
    firebase_service.save_research_result(res_id, {
        "status": "completed",
        "summary": "User A summary",
        "report": "User A report",
        "confidence": 95,
    })

    # Now User B tries to access User A's research
    mock_verify.return_value = {
        "uid": "user-B",
        "email": "userB@example.com",
        "name": "User B",
        "firebase": {"sign_in_provider": "google.com"},
    }

    response = client.get(f"/api/research/{res_id}", headers={"Authorization": "Bearer token_B"})
    # Should be 404 because User B does not own this report
    assert response.status_code == 404

    # Now User A accesses their own research
    mock_verify.return_value = {
        "uid": "user-A",
        "email": "userA@example.com",
        "name": "User A",
        "firebase": {"sign_in_provider": "google.com"},
    }
    response_a = client.get(f"/api/research/{res_id}", headers={"Authorization": "Bearer token_A"})
    assert response_a.status_code == 200
    assert response_a.json()["research_id"] == res_id
