from unittest.mock import MagicMock, patch
from datetime import datetime, timezone
import pytest
from app.agents.source_analyzer import source_analyzer
from app.agents.fact_checker import fact_checker
from app.agents.research_agent import research_agent
from app.models.research import Source, Claim
from app.services.tavily_service import TavilyServiceError


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
@patch("app.services.gemini_service.gemini_service.detect_contradictions")
@patch("app.services.gemini_service.gemini_service.generate_summary_and_report")
def test_research_agent_orchestration(
    mock_gen_report, mock_contradictions, mock_verify, mock_claims, mock_tavily
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
    mock_contradictions.return_value = []

    result = research_agent.run_research("Is electric vehicle adoption increasing worldwide?")

    assert result.status == "completed"
    assert result.question == "Is electric vehicle adoption increasing worldwide?"
    assert result.summary == "EV sales grew significantly worldwide."
    assert len(result.claims) == 1
    assert result.claims[0].verdict == "Supported"
    assert len(result.sources) == 1
    assert result.metadata.source_count == 1


@patch("app.services.tavily_service.tavily_service.search")
@patch("app.services.gemini_service.gemini_service.extract_claims")
@patch("app.services.gemini_service.gemini_service.verify_claim")
@patch("app.services.gemini_service.gemini_service.detect_contradictions")
@patch("app.services.gemini_service.gemini_service.generate_summary_and_report")
def test_five_different_queries_produce_query_specific_reports(
    mock_report, mock_conflicts, mock_verify, mock_claims, mock_search
):
    queries = [
        "What are the latest developments in artificial intelligence?",
        "Is electric vehicle adoption increasing in India?",
        "What are the benefits and risks of nuclear energy?",
        "How does cloud computing work?",
        "Is social media affecting student education?",
    ]
    evidence = {
        queries[0]: ("arxiv.org", "Recent artificial intelligence research evaluates capable language models."),
        queries[1]: ("vahan.parivahan.gov.in", "India vehicle registration data tracks electric vehicle adoption."),
        queries[2]: ("iaea.org", "Nuclear energy produces low-carbon electricity and requires waste controls."),
        queries[3]: ("nist.gov", "Cloud computing provides on-demand network access to configurable resources."),
        queries[4]: ("unesco.org", "Research examines social media use and student learning outcomes."),
    }

    def search(query, max_results):
        domain, snippet = evidence[query]
        return [Source(
            title=f"Evidence about {query}",
            url=f"https://{domain}/research",
            snippet=snippet,
            source_name=domain,
            relevance_score=0.6 + queries.index(query) * 0.07,
            credibility_score="High",
            published_date=datetime.now(timezone.utc).isoformat(),
        )]

    mock_search.side_effect = search
    mock_claims.side_effect = lambda query, sources: [f"Evidence-backed finding about {query}"]
    mock_verify.side_effect = lambda claim, query, sources: {
        "verdict": "Supported",
        "confidence": 0.65 + queries.index(query) * 0.06,
        "explanation": f"The retrieved source addresses {query}.",
        "supporting_sources": [sources[0].url],
    }
    mock_conflicts.return_value = []
    mock_report.side_effect = lambda question, claims, sources, contradictions: {
        "summary": f"Evidence summary for {question}",
        "report": f"# Research Report: {question}\n\n{sources[0].snippet}",
    }

    results = [
        research_agent.run_research(query, owner_id="five-query-test-user")
        for query in queries
    ]

    assert [result.question for result in results] == queries
    assert [result.sources[0].source_name for result in results] == [item[0] for item in evidence.values()]
    assert [result.claims[0].claim for result in results] == [f"Evidence-backed finding about {query}" for query in queries]
    assert len({result.report for result in results}) == len(queries)
    assert len({result.confidence for result in results}) > 1
    assert [call.kwargs["query"] for call in mock_search.call_args_list] == queries


@patch("app.services.tavily_service.tavily_service.search", return_value=[])
def test_no_sources_returns_insufficient_evidence_without_mock_report(mock_search):
    query = "How does blockchain work?"

    result = research_agent.run_research(query, owner_id="no-source-test-user")

    assert result.question == query
    assert result.status == "insufficient_evidence"
    assert result.confidence == 0
    assert result.sources == []
    assert "No reliable sources were found" in result.summary
    assert "electric vehicle" not in result.report.lower()


@patch("app.services.tavily_service.tavily_service.search", side_effect=TavilyServiceError("TAVILY_API_KEY is not configured."))
def test_search_provider_failure_is_not_converted_to_a_report(mock_search):
    with pytest.raises(TavilyServiceError, match="TAVILY_API_KEY is not configured"):
        research_agent.run_research("How does blockchain work?", owner_id="provider-error-user")


def test_confidence_changes_with_source_quality_and_agreement():
    recent = datetime.now(timezone.utc).isoformat()
    strong_source = Source(
        title="High quality source",
        url="https://nature.com/research",
        snippet="Relevant evidence.",
        source_name="nature.com",
        relevance_score=0.95,
        credibility_score="High",
        published_date=recent,
    )
    weak_source = Source(
        title="Low quality source",
        url="https://clickbait.net/research",
        snippet="Weakly relevant evidence.",
        source_name="clickbait.net",
        relevance_score=0.2,
        credibility_score="Low",
        published_date="2018-01-01",
    )
    strong_claim = Claim(claim="Supported", verdict="Supported", confidence=0.95, explanation="Clear support.")
    weak_claim = Claim(claim="Unclear", verdict="Partially Supported", confidence=0.25, explanation="Mixed support.")

    strong_confidence = research_agent._calculate_confidence([strong_source] * 5, [strong_claim], [])
    weak_confidence = research_agent._calculate_confidence([weak_source], [weak_claim], ["Sources disagree."])

    assert strong_confidence > weak_confidence
