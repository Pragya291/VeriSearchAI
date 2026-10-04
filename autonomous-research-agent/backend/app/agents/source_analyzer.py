import logging
from typing import List
from app.models.research import Source
from app.utils.text_processing import compute_text_relevance

logger = logging.getLogger("source_analyzer")


class SourceAnalyzer:
    """
    Agent responsible for evaluating source quality, domain publisher attributes,
    text relevance, and credibility indicators.
    """

    # Well-known domain categories for heuristic context (not absolute truth)
    KNOWN_HIGH_CREDIBILITY_DOMAINS = {
        "iea.org", "who.int", "cdc.gov", "nasa.gov", "nature.com", "science.org",
        "reuters.com", "apnews.com", "bbc.com", "bloomberg.com", "ft.com",
        "worldbank.org", "un.org", "arxiv.org", "nih.gov", "statista.com"
    }

    KNOWN_LOW_CREDIBILITY_DOMAINS = {
        "clickbait.net", "fake-news.com", "gossip.org"
    }

    def analyze_source(self, source: Source, query: str) -> Source:
        """
        Analyzes a single source for relevance and credibility indicators.
        Modifies and returns the updated Source instance.
        """
        combined_text = f"{source.title} {source.snippet}"
        
        # Calculate dynamic text relevance score
        calculated_relevance = compute_text_relevance(query, combined_text)
        # Blend Tavily's score with content overlap
        final_relevance = round((source.relevance_score * 0.4) + (calculated_relevance * 0.6), 2)
        source.relevance_score = min(max(final_relevance, 0.1), 1.0)

        # Assess Credibility
        domain = source.source_name.lower()

        if domain in self.KNOWN_HIGH_CREDIBILITY_DOMAINS:
            source.credibility_score = "High"
        elif domain in self.KNOWN_LOW_CREDIBILITY_DOMAINS:
            source.credibility_score = "Low"
        elif domain.endswith(".edu") or domain.endswith(".gov") or domain.endswith(".org"):
            # Mark as Medium with clear domain indicator, avoiding absolute claim of truth
            source.credibility_score = "Medium"
        elif domain.endswith(".com") or domain.endswith(".io") or domain.endswith(".co"):
            source.credibility_score = "Medium"
        else:
            # Default to Unknown if credibility cannot be objectively verified
            source.credibility_score = "Unknown"

        return source

    def analyze_sources(self, sources: List[Source], query: str) -> List[Source]:
        """
        Analyzes and ranks a collection of search sources.
        """
        analyzed = [self.analyze_source(src, query) for src in sources]
        # Sort by relevance score descending
        analyzed.sort(key=lambda s: s.relevance_score, reverse=True)
        logger.info(f"Analyzed {len(analyzed)} sources for query '{query}'.")
        return analyzed


# Singleton instance
source_analyzer = SourceAnalyzer()
