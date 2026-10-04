import pytest
from pydantic import ValidationError
from app.models.research import ResearchRequest, Claim, Source, ResearchMetadata
from app.models.report import ResearchResponse


def test_valid_research_request():
    req = ResearchRequest(question="Is electric vehicle adoption increasing worldwide?")
    assert req.question == "Is electric vehicle adoption increasing worldwide?"


def test_invalid_short_research_request():
    with pytest.raises(ValidationError):
        ResearchRequest(question="   ab  ")


def test_empty_research_request():
    with pytest.raises(ValidationError):
        ResearchRequest(question="   ")


def test_claim_model():
    claim = Claim(
        claim="EV sales grew by 35% in 2023",
        verdict="Supported",
        confidence=0.9,
        explanation="Data from IEA shows 35% growth.",
        supporting_sources=["https://iea.org/ev-report"]
    )
    assert claim.verdict == "Supported"
    assert claim.confidence == 0.9


def test_source_model():
    src = Source(
        title="IEA Global EV Outlook 2024",
        url="https://iea.org/ev-report",
        snippet="Global electric car sales reached 14 million in 2023.",
        source_name="iea.org",
        relevance_score=0.95,
        credibility_score="High"
    )
    assert src.source_name == "iea.org"
    assert src.credibility_score == "High"
