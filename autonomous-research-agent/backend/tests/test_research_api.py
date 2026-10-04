from unittest.mock import patch, MagicMock
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.models.report import ResearchResponse, ResearchMetadata
from app.models.research import Claim, Source
from app.services.gemini_service import GeminiServiceError
from app.services.tavily_service import TavilyServiceError

def authenticated_client():
    client = TestClient(app)
    email = f"research-{uuid.uuid4()}@example.com"
    signup = client.post(
        "/api/auth/signup",
        json={"full_name": "Research Test User", "email": email, "password": "test-password-123"},
    )
    assert signup.status_code == 201
    login = client.post("/api/auth/login", json={"email": email, "password": "test-password-123"})
    assert login.status_code == 200
    return client


@patch("app.agents.research_agent.research_agent.run_research")
def test_start_research_success(mock_run):
    client = authenticated_client()
    mock_run.return_value = ResearchResponse(
        research_id="test-id-123",
        question="Is electric vehicle adoption increasing worldwide?",
        status="completed",
        summary="EV adoption is growing globally.",
        claims=[
            Claim(
                claim="EV sales grew 35% in 2023",
                verdict="Supported",
                confidence=0.9,
                explanation="IEA report confirms 35% growth.",
                supporting_sources=["https://iea.org/ev"]
            )
        ],
        sources=[
            Source(
                title="IEA EV Report",
                url="https://iea.org/ev",
                snippet="EV sales grew by 35%.",
                source_name="iea.org",
                relevance_score=0.95,
                credibility_score="High"
            )
        ],
        report="# Report\nEV sales are growing.",
        metadata=ResearchMetadata(search_count=1, source_count=1, processing_time=1.5)
    )

    response = client.post(
        "/api/research",
        json={"question": "Is electric vehicle adoption increasing worldwide?"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["research_id"] == "test-id-123"
    assert data["status"] == "completed"
    assert len(data["claims"]) == 1
    assert data["claims"][0]["verdict"] == "Supported"
    user_id = client.get("/api/auth/me").json()["id"]
    mock_run.assert_called_once_with(
        question="Is electric vehicle adoption increasing worldwide?",
        owner_id=user_id,
    )


@patch("app.agents.research_agent.research_agent.run_research", side_effect=TavilyServiceError("Unable to retrieve sources."))
def test_start_research_returns_source_error(mock_run):
    client = authenticated_client()

    response = client.post("/api/research", json={"question": "Latest AI developments"})

    assert response.status_code == 502
    assert response.json()["detail"] == "Unable to retrieve sources. Please try again."


@patch("app.agents.research_agent.research_agent.run_research", side_effect=GeminiServiceError("Gemini failed."))
def test_start_research_returns_gemini_error(mock_run):
    client = authenticated_client()

    response = client.post("/api/research", json={"question": "Latest AI developments"})

    assert response.status_code == 502
    assert "Gemini analysis failed" in response.json()["detail"]


def test_start_research_invalid_question():
    client = authenticated_client()
    # Empty question
    response = client.post("/api/research", json={"question": "   "})
    assert response.status_code == 400

    # Short question
    response = client.post("/api/research", json={"question": "abc"})
    assert response.status_code == 400


@patch("app.services.firebase_service.firebase_service.get_research")
def test_get_research_by_id_success(mock_get):
    client = authenticated_client()
    mock_get.return_value = {
        "research_id": "test-id-123",
        "question": "Is electric vehicle adoption increasing worldwide?",
        "status": "completed",
        "summary": "EV adoption is growing.",
        "claims": [],
        "sources": [],
        "report": "# Report\nContent",
        "created_at": "2026-10-04T10:00:00Z",
        "completed_at": "2026-10-04T10:00:05Z",
        "metadata": {"search_count": 1, "source_count": 0, "processing_time": 5.0}
    }

    response = client.get("/api/research/test-id-123")
    assert response.status_code == 200
    assert response.json()["research_id"] == "test-id-123"


@patch("app.services.firebase_service.firebase_service.get_research")
def test_get_research_by_id_not_found(mock_get):
    client = authenticated_client()
    mock_get.return_value = None
    response = client.get("/api/research/nonexistent-id")
    assert response.status_code == 404
    assert "was not found" in response.json()["detail"]


@patch("app.services.firebase_service.firebase_service.get_research_history")
def test_get_research_history(mock_history):
    client = authenticated_client()
    mock_history.return_value = {
        "total": 1,
        "page": 1,
        "limit": 10,
        "items": [
            {
                "research_id": "test-id-123",
                "question": "Is EV adoption increasing?",
                "status": "completed",
                "summary": "EV adoption is growing.",
                "created_at": "2026-10-04T10:00:00Z",
                "completed_at": "2026-10-04T10:00:05Z",
                "source_count": 2,
                "claim_count": 1
            }
        ]
    }

    response = client.get("/api/research?page=1&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["research_id"] == "test-id-123"
