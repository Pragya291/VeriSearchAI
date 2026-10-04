import time
import logging
from datetime import datetime, timezone
from typing import Optional
from app.models.research import ResearchMetadata, Claim, Source
from app.models.report import ResearchResponse
from app.services.tavily_service import TavilyServiceError, tavily_service
from app.services.gemini_service import gemini_service
from app.services.gemini_service import GeminiServiceError
from app.services.firebase_service import firebase_service
from app.agents.source_analyzer import source_analyzer
from app.agents.fact_checker import fact_checker

logger = logging.getLogger("research_agent")


class ResearchAgent:
    """
    Autonomous Research Agent coordinating search, claim extraction,
    fact-checking, contradiction detection, and report persistence.
    """

    @staticmethod
    def _calculate_confidence(sources, claims, contradictions) -> int:
        if not sources:
            return 0

        credibility_values = {"high": 1.0, "medium": 0.7, "low": 0.25, "unknown": 0.5}
        source_quality = sum(
            credibility_values.get(source.credibility_score.lower(), 0.5)
            for source in sources
        ) / len(sources)
        relevance = sum(source.relevance_score for source in sources) / len(sources)
        claim_confidence = (
            sum(claim.confidence for claim in claims) / len(claims)
            if claims else 0.25
        )
        agreement = (
            max(0.0, 1.0 - len(contradictions) / max(len(claims), 1))
            if claims else 0.5
        )
        freshness_scores = []
        for source in sources:
            if not source.published_date:
                freshness_scores.append(0.5)
                continue
            try:
                published = datetime.fromisoformat(source.published_date.replace("Z", "+00:00"))
                if published.tzinfo is None:
                    published = published.replace(tzinfo=timezone.utc)
                age_days = max((datetime.now(timezone.utc) - published).days, 0)
                freshness_scores.append(max(0.0, 1.0 - age_days / (365 * 5)))
            except ValueError:
                freshness_scores.append(0.5)
        freshness = sum(freshness_scores) / len(freshness_scores)
        coverage = min(len(sources) / 5, 1.0)

        score = (
            source_quality * 0.24
            + relevance * 0.23
            + claim_confidence * 0.23
            + agreement * 0.15
            + freshness * 0.08
            + coverage * 0.07
        )
        return round(score * 100)

    def run_research(
        self,
        question: str,
        research_id: Optional[str] = None,
        owner_id: Optional[str] = None,
    ) -> ResearchResponse:
        """
        Executes the autonomous research & fact-checking workflow.
        """
        start_time = time.time()

        # Step 1: Create or fetch research record
        if not research_id:
            research_id = firebase_service.create_research(question, owner_id=owner_id)
        
        firebase_service.update_research_status(research_id, "processing")
        logger.info(f"Started autonomous research pipeline for ID '{research_id}' with question: '{question}'")

        try:
            # Step 2: Tavily Search for Evidence
            logger.info("Step 2: Conducting Tavily web search...")
            raw_sources = tavily_service.search(query=question, max_results=7)
            search_count = 1 if raw_sources else 0

            # Step 3: Analyze and Rank Sources
            logger.info("Step 3: Analyzing source credibility and relevance...")
            analyzed_sources = source_analyzer.analyze_sources(raw_sources, question)

            # Handle case where no sources are found
            if not analyzed_sources:
                logger.warning(f"No web sources found for question: '{question}'")
                no_sources_summary = f"No reliable sources were found for the research question: '{question}'."
                no_sources_report = (
                    f"# Research Report: {question}\n\n"
                    "## Executive Summary\n"
                    "No reliable sources were returned for this query, so claims could not be verified.\n\n"
                    "## Fact-Checking Matrix\n"
                    "No claims could be extracted or fact-checked.\n\n"
                    "## Conclusion\n"
                    "Please refine or broaden your research question."
                )
                
                processing_time = round(time.time() - start_time, 2)
                metadata = ResearchMetadata(
                    search_count=search_count,
                    source_count=0,
                    processing_time=processing_time
                )

                response = ResearchResponse(
                    research_id=research_id,
                    question=question,
                    status="insufficient_evidence",
                    summary=no_sources_summary,
                    claims=[],
                    sources=[],
                    report=no_sources_report,
                    metadata=metadata,
                    confidence=0,
                    contradictions=[]
                )

                firebase_service.save_research_result(research_id, response.model_dump())
                return response

            # Step 4: Extract Factual Claims from Evidence
            logger.info("Step 4: Extracting factual claims from evidence snippets...")
            extracted_claim_texts = gemini_service.extract_claims(question, analyzed_sources)

            # Step 5: Fact-Check Claims
            logger.info("Step 5: Fact-checking extracted claims...")
            evaluated_claims = fact_checker.fact_check_claims(extracted_claim_texts, question, analyzed_sources)

            # Step 6: Check for Evidence Contradictions
            logger.info("Step 6: Auditing evidence for conflicting claims...")
            contradictions = gemini_service.detect_contradictions(evaluated_claims, analyzed_sources)

            # Step 7: Generate Final Report and Executive Summary
            logger.info("Step 7: Generating research report with Gemini...")
            report_data = gemini_service.generate_summary_and_report(
                question=question,
                claims=evaluated_claims,
                sources=analyzed_sources,
                contradictions=contradictions
            )
            confidence = self._calculate_confidence(analyzed_sources, evaluated_claims, contradictions)

            processing_time = round(time.time() - start_time, 2)
            metadata = ResearchMetadata(
                search_count=search_count,
                source_count=len(analyzed_sources),
                processing_time=processing_time
            )

            # Step 8: Build Final Response Object
            response = ResearchResponse(
                research_id=research_id,
                question=question,
                status="completed",
                summary=report_data["summary"],
                claims=evaluated_claims,
                sources=analyzed_sources,
                report=report_data["report"],
                metadata=metadata,
                confidence=confidence,
                contradictions=contradictions,
            )

            # Step 9: Save to Database
            firebase_service.save_research_result(research_id, response.model_dump())
            logger.info(f"Autonomous research completed successfully in {processing_time}s for ID '{research_id}'")
            return response

        except Exception as e:
            logger.error(f"Error in research agent execution for ID '{research_id}': {e}", exc_info=True)
            firebase_service.update_research_status(research_id, "failed", error_message=str(e))
            if isinstance(e, (GeminiServiceError, TavilyServiceError)):
                raise
            raise RuntimeError("Research processing failed.") from e


# Singleton agent instance
research_agent = ResearchAgent()
