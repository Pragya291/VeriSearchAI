import time
import logging
from typing import Optional
from app.models.research import ResearchMetadata, Claim, Source
from app.models.report import ResearchResponse
from app.services.tavily_service import tavily_service
from app.services.gemini_service import gemini_service
from app.services.firebase_service import firebase_service
from app.agents.source_analyzer import source_analyzer
from app.agents.fact_checker import fact_checker

logger = logging.getLogger("research_agent")


class ResearchAgent:
    """
    Autonomous Research Agent coordinating search, claim extraction,
    fact-checking, contradiction detection, and report persistence.
    """

    def run_research(self, question: str, research_id: Optional[str] = None) -> ResearchResponse:
        """
        Executes the autonomous research & fact-checking workflow.
        """
        start_time = time.time()

        # Step 1: Create or fetch research record
        if not research_id:
            research_id = firebase_service.create_research(question)
        
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
                no_sources_summary = f"No web sources were found to answer the research question: '{question}'."
                no_sources_report = (
                    f"# Research Report: {question}\n\n"
                    "## Executive Summary\n"
                    "Insufficient evidence to verify this claim because web search returned 0 results.\n\n"
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
                    status="completed",
                    summary=no_sources_summary,
                    claims=[],
                    sources=[],
                    report=no_sources_report,
                    metadata=metadata
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
                metadata=metadata
            )

            # Step 9: Save to Database
            firebase_service.save_research_result(research_id, response.model_dump())
            logger.info(f"Autonomous research completed successfully in {processing_time}s for ID '{research_id}'")
            return response

        except Exception as e:
            logger.error(f"Error in research agent execution for ID '{research_id}': {e}", exc_info=True)
            firebase_service.update_research_status(research_id, "failed", error_message=str(e))
            raise RuntimeError(f"Research processing failed: {str(e)}")


# Singleton agent instance
research_agent = ResearchAgent()
