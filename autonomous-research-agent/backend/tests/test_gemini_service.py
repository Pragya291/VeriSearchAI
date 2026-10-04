import json
from unittest.mock import MagicMock, patch
import pytest
from app.services.gemini_service import GeminiService
from app.models.research import Source, Claim


def test_json_extraction_from_markdown():
    service = GeminiService(api_key="mock_key")
    
    # Test JSON in code fences
    fenced_text = '```json\n{"verdict": "Supported", "confidence": 0.9}\n```'
    parsed = service._extract_json_from_text(fenced_text)
    assert parsed["verdict"] == "Supported"
    assert parsed["confidence"] == 0.9

    # Test raw JSON list
    list_text = '["claim 1", "claim 2"]'
    parsed_list = service._extract_json_from_text(list_text)
    assert len(parsed_list) == 2
    assert parsed_list[0] == "claim 1"


@patch("google.genai.Client")
def test_extract_claims(mock_client_cls):
    mock_client = MagicMock()
    mock_client_cls.return_value = mock_client
    mock_response = MagicMock()
    mock_response.text = '["Global EV sales grew in 2023.", "China leads EV market."]'
    mock_client.models.generate_content.return_value = mock_response

    service = GeminiService(api_key="mock_key")
    sources = [
        Source(title="EV Growth", url="https://example.com/ev", snippet="EV sales grew by 35%. China leads.", source_name="example.com")
    ]
    claims = service.extract_claims("EV growth worldwide", sources)

    assert len(claims) == 2
    assert "Global EV sales grew in 2023." in claims


@patch("google.genai.Client")
def test_verify_claim(mock_client_cls):
    mock_client = MagicMock()
    mock_client_cls.return_value = mock_client
    mock_response = MagicMock()
    mock_response.text = json.dumps({
        "verdict": "Supported",
        "confidence": 0.95,
        "explanation": "Evidence directly confirms 35% growth.",
        "supporting_sources": ["https://example.com/ev"]
    })
    mock_client.models.generate_content.return_value = mock_response

    service = GeminiService(api_key="mock_key")
    sources = [
        Source(title="EV Growth", url="https://example.com/ev", snippet="EV sales grew by 35%.", source_name="example.com")
    ]
    result = service.verify_claim("EV sales grew by 35%", "Is EV adoption increasing?", sources)

    assert result["verdict"] == "Supported"
    assert result["confidence"] == 0.95
    assert "https://example.com/ev" in result["supporting_sources"]


@patch("google.genai.Client")
def test_verify_claim_discards_sources_not_in_retrieved_evidence(mock_client_cls):
    mock_client = MagicMock()
    mock_client_cls.return_value = mock_client
    mock_response = MagicMock()
    mock_response.text = json.dumps({
        "verdict": "Supported",
        "confidence": 0.9,
        "explanation": "Verified by the provided evidence.",
        "supporting_sources": ["https://example.com/evidence", "https://invented.example/fake"],
    })
    mock_client.models.generate_content.return_value = mock_response
    service = GeminiService(api_key="mock_key")
    sources = [Source(title="Evidence", url="https://example.com/evidence", snippet="Evidence text.")]

    result = service.verify_claim("Evidence claim", "Evidence question", sources)

    assert result["supporting_sources"] == ["https://example.com/evidence"]


def test_verify_claim_no_sources():
    service = GeminiService(api_key="mock_key")
    result = service.verify_claim("Random unevidenced claim", "Question?", sources=[])
    assert result["verdict"] == "Unverified"
    assert result["confidence"] == 0.0
    assert "Insufficient evidence" in result["explanation"]
