from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.research import Claim, Source, ResearchMetadata


class ResearchResponse(BaseModel):
    """Complete response returned for a research request or single history retrieval."""
    research_id: str = Field(..., description="Unique ID for the research session.")
    question: str = Field(..., description="Original research question.")
    status: str = Field(..., description="Status: completed, processing, or failed.")
    summary: str = Field(..., description="Executive summary of research findings.")
    claims: List[Claim] = Field(default_factory=list, description="Extracted claims and fact-check verdicts.")
    sources: List[Source] = Field(default_factory=list, description="Evaluated web sources.")
    report: str = Field(..., description="Full detailed research report in Markdown.")
    created_at: Optional[str] = Field(default=None, description="ISO format creation timestamp.")
    completed_at: Optional[str] = Field(default=None, description="ISO format completion timestamp.")
    metadata: Optional[ResearchMetadata] = Field(default=None, description="Execution metadata.")


class ResearchListItem(BaseModel):
    """Summary item for research history listings."""
    research_id: str
    question: str
    status: str
    summary: str
    created_at: Optional[str] = None
    completed_at: Optional[str] = None
    source_count: int = 0
    claim_count: int = 0


class ResearchHistoryResponse(BaseModel):
    """Paginated list of historical research sessions."""
    total: int = Field(..., description="Total count of research sessions.")
    page: int = Field(default=1, description="Current page number.")
    limit: int = Field(default=10, description="Items per page.")
    items: List[ResearchListItem] = Field(default_factory=list, description="List of research sessions.")
