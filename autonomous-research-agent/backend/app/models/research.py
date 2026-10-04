from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class ResearchRequest(BaseModel):
    """Request model for starting a research task."""
    question: str = Field(
        ...,
        min_length=5,
        max_length=1000,
        description="The research question or topic to investigate."
    )

    @field_validator("question")
    @classmethod
    def validate_question(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Research question cannot be empty or only whitespace.")
        if len(cleaned) < 5:
            raise ValueError("Research question must be at least 5 characters long.")
        return cleaned


class Source(BaseModel):
    """Model representing a web search result source."""
    title: str = Field(..., description="Title of the webpage/source.")
    url: str = Field(..., description="URL of the source.")
    snippet: str = Field(..., description="Excerpt or snippet of content from the source.")
    source_name: str = Field(default="Unknown Domain", description="Domain or publisher name.")
    relevance_score: float = Field(default=0.0, ge=0.0, le=1.0, description="Score indicating relevance to question.")
    credibility_score: str = Field(default="Unknown", description="Credibility assessment (High, Medium, Low, Unknown).")


class Claim(BaseModel):
    """Model representing a key claim extracted and fact-checked."""
    claim: str = Field(..., description="Statement of claim analyzed.")
    verdict: str = Field(
        default="Unverified",
        description="Verdict: Supported, Partially Supported, Contradicted, or Unverified."
    )
    confidence: float = Field(default=0.0, ge=0.0, le=1.0, description="Confidence score from 0.0 to 1.0.")
    explanation: str = Field(..., description="Reasoning behind the verdict based on evidence.")
    supporting_sources: List[str] = Field(default_factory=list, description="URLs or names of supporting sources.")


class ResearchMetadata(BaseModel):
    """Metadata regarding the execution of the research process."""
    search_count: int = Field(default=0, ge=0)
    source_count: int = Field(default=0, ge=0)
    processing_time: float = Field(default=0.0, ge=0.0, description="Time taken in seconds.")
