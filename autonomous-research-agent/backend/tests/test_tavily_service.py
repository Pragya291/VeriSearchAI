from unittest.mock import MagicMock, patch
import pytest
from app.services.tavily_service import TavilyService, TavilyServiceError


def test_tavily_domain_extraction():
    service = TavilyService(api_key="mock_key")
    assert service.extract_domain("https://www.reuters.com/technology/ai-news") == "reuters.com"
    assert service.extract_domain("http://iea.org/reports/2024") == "iea.org"
    assert service.extract_domain("invalid-url") == "invalid-url"


def test_tavily_missing_api_key():
    service = TavilyService(api_key="")
    with pytest.raises(TavilyServiceError, match="TAVILY_API_KEY is not configured"):
        service.search("What is AI?")


@patch("tavily.TavilyClient")
def test_tavily_successful_search(mock_tavily_cls):
    mock_client = MagicMock()
    mock_tavily_cls.return_value = mock_client
    mock_client.search.return_value = {
        "results": [
            {
                "title": "EV Adoption Report 2024",
                "url": "https://example.com/ev-report",
                "content": "Electric vehicle sales surged by 35% globally.",
                "raw_content": "Primary source text about electric vehicle sales and related evidence.",
                "published_date": "2025-03-14",
                "score": 0.92
            }
        ]
    }

    service = TavilyService(api_key="fake_key")
    results = service.search("EV adoption rates")

    assert len(results) == 1
    assert results[0].title == "EV Adoption Report 2024"
    assert results[0].url == "https://example.com/ev-report"
    assert results[0].source_name == "example.com"
    assert results[0].relevance_score == 0.92
    assert results[0].snippet.startswith("Primary source text")
    assert results[0].published_date == "2025-03-14"


@patch("tavily.TavilyClient")
def test_tavily_empty_results(mock_tavily_cls):
    mock_client = MagicMock()
    mock_tavily_cls.return_value = mock_client
    mock_client.search.return_value = {"results": []}

    service = TavilyService(api_key="fake_key")
    results = service.search("nonexistent query xyz123")

    assert results == []


@patch("tavily.TavilyClient")
def test_tavily_api_error_handling(mock_tavily_cls):
    mock_client = MagicMock()
    mock_tavily_cls.return_value = mock_client
    mock_client.search.side_effect = Exception("API rate limit exceeded")

    service = TavilyService(api_key="fake_key")
    with pytest.raises(TavilyServiceError, match="Unable to retrieve sources"):
        service.search("test query")
