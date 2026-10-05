import logging
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse
from app.core.config import settings
from app.models.research import Source

logger = logging.getLogger("tavily_service")


class TavilyServiceError(RuntimeError):
    """Raised when source search is unavailable or fails."""


class TavilyService:
    """Service to perform web research queries via the Tavily Search API."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key if api_key is not None else settings.TAVILY_API_KEY
        self._client = None
        self.last_answer = ""
        if self.api_key:
            try:
                from tavily import TavilyClient
                self._client = TavilyClient(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize TavilyClient: {e}")

    def extract_domain(self, url: str) -> str:
        """Extract domain name from URL for readable source attribution."""
        try:
            parsed = urlparse(url)
            domain = parsed.netloc or parsed.path
            if domain.startswith("www."):
                domain = domain[4:]
            return domain if domain else "Unknown Domain"
        except Exception:
            return "Unknown Domain"

    def search(self, query: str, max_results: int = 7) -> List[Source]:
        """
        Executes web search on Tavily for a given research query.
        Returns a list of structured Source objects.
        """
        if not self.api_key:
            raise TavilyServiceError("TAVILY_API_KEY is not configured.")

        if not self._client:
            try:
                from tavily import TavilyClient
                self._client = TavilyClient(api_key=self.api_key)
            except Exception as e:
                logger.error("TavilyClient unavailable.", exc_info=True)
                raise TavilyServiceError("Source search is unavailable.") from e

        try:
            logger.info(f"Initiating Tavily web search for query: '{query}'")
            response = self._client.search(
                query=query,
                search_depth="advanced",
                max_results=max_results,
                include_answer=True,
                include_raw_content=True
            )

            self.last_answer = response.get("answer") or ""

            raw_results = response.get("results", [])
            if not raw_results:
                logger.warning(f"No search results returned by Tavily for query: '{query}'")
                return []

            sources: List[Source] = []
            for item in raw_results:
                url = item.get("url", "")
                title = (item.get("title") or "Untitled Source").strip()
                raw_c = (item.get("raw_content") or "").strip()
                content = (item.get("content") or "").strip()
                snip = (item.get("snippet") or "").strip()
                evidence = raw_c or content or snip
                snippet = evidence[:6000]
                score = float(item.get("score") or 0.8)

                # Normalize score to [0.0, 1.0]
                relevance_score = min(max(score, 0.0), 1.0)
                domain = self.extract_domain(url)

                sources.append(
                    Source(
                        title=title if title else "Untitled Web Page",
                        url=url,
                        snippet=snippet,
                        source_name=domain,
                        relevance_score=round(relevance_score, 2),
                        credibility_score="Unknown",  # Will be assessed by SourceAnalyzer
                        published_date=item.get("published_date") or item.get("date")
                    )
                )

            logger.info(f"Successfully retrieved {len(sources)} sources from Tavily.")
            return sources

        except Exception as e:
            logger.error("Error occurred during Tavily search execution.", exc_info=True)
            raise TavilyServiceError("Unable to retrieve sources. Please try again.") from e


# Singleton service instance
tavily_service = TavilyService()
