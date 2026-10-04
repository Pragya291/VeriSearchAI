from unittest.mock import MagicMock, patch
from app.agents.source_analyzer import source_analyzer
from app.agents.fact_checker import fact_checker
from app.agents.research_agent import research_agent
from app.models.research import Source, Claim


def test_source_analyzer():
    sources = [
        Source(title="Nature AI Study", url="https://nature.com/article1", snippet="AI progress...", source_name="nature.com", relevance_score=0.8),
        Source(title="Random Blog", url="https://myblog.com/post", snippet="Unverified post...", source_name="myblog.com", relevance_score=0.5),
    ]

    analyzed = source_analyzer.analyze_sources(sources, query="AI study")
    assert len(analyzed) == 2
    assert analyzed[0].credibility_score in ["High", "Medium"]
    assert analyzed[1].credibility_score in ["Medium", "Unknown"]


def test_fact_checker_no_sources():
    claim = fact_checker.check_claim("Global warming is real", "climate change", sources=[])
    assert claim.verdict == "Unverified"
    assert claim.confidence == 0.0
    assert "Insufficient evidence" in claim.explanation


@patch("app.services.tavily_service.tavily_service.search")
@patch("app.services.gemini_service.gemini_service.extract_claims")
@patch("app.services.gemini_service.gemini_service.verify_claim")
@patch("app.services.gemini_service.gemini_service.generate_summary_and_report")
def test_research_agent_orchestration(
    mock_gen_report, mock_verify, mock_claims, mock_tavily
):
    # Mock Tavily
    mock_tavily.return_value = [
        Source(title="IEA EV Report", url="https://iea.org/ev", snippet="EV growth 35%", source_name="iea.org", relevance_score=0.9)
    ]
    # Mock Gemini claim extraction
    mock_claims.return_value = ["EV sales grew by 35% in 2023."]
    # Mock Gemini verify claim
    mock_verify.return_value = {
        "claim": "EV sales grew by 35% in 2023.",
        "verdict": "Supported",
        "confidence": 0.95,
        "explanation": "Confirmed by IEA data.",
        "supporting_sources": ["https://iea.org/ev"]
    }
    # Mock Gemini report generation
    mock_gen_report.return_value = {
        "summary": "EV sales grew significantly worldwide.",
        "report": "# EV Adoption Report\nEV sales grew by 35% in 2023."
    }

    result = research_agent.run_research("Is electric vehicle adoption increasing worldwide?")

    assert result.status == "completed"
    assert result.question == "Is electric vehicle adoption increasing worldwide?"
    assert result.summary == "EV sales grew significantly worldwide."
    assert len(result.claims) == 1
    assert result.claims[0].verdict == "Supported"
    assert len(result.sources) == 1
    assert result.metadata.source_count == 1
