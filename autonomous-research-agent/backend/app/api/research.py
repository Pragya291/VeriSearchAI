import logging
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.auth import get_current_user
from app.models.research import ResearchRequest
from app.models.report import ResearchResponse, ResearchHistoryResponse
from app.agents.research_agent import research_agent
from app.services.firebase_service import firebase_service
from app.services.gemini_service import GeminiServiceError
from app.services.tavily_service import TavilyServiceError

logger = logging.getLogger("api_research")

router = APIRouter(
    prefix="/research",
    tags=["Research"],
    dependencies=[Depends(get_current_user)],
)


@router.post(
    "",
    response_model=ResearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Start new autonomous research task",
    description="Accepts a research question, performs web search, claim extraction, fact checking, and report generation."
)
async def start_research(request: ResearchRequest, user: dict = Depends(get_current_user)):
    """
    Endpoint to trigger autonomous research and fact-checking workflow.
    """
    logger.info(f"Received research request for question: '{request.question}'")
    try:
        response = research_agent.run_research(question=request.question, owner_id=user["id"])
        return response
    except TavilyServiceError as error:
        logger.warning("Source retrieval failed: %s", error)
        detail = (
            "Web search is not configured. Set TAVILY_API_KEY on the backend."
            if "not configured" in str(error)
            else "Unable to retrieve sources. Please try again."
        )
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)
    except GeminiServiceError as error:
        logger.warning("Gemini analysis failed: %s", error)
        detail = (
            "Gemini analysis is not configured. Set GEMINI_API_KEY on the backend."
            if "not configured" in str(error)
            else "Gemini analysis failed or its API limit was reached. Please try again later."
        )
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)
    except ValueError as ve:
        logger.warning(f"Validation error processing research request: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Unexpected error executing research: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while executing the research request. Please try again later."
        )


@router.get(
    "/{research_id}",
    response_model=ResearchResponse,
    summary="Retrieve research session by ID",
    description="Fetches stored research report, fact-check matrix, and sources from Firestore."
)
async def get_research(research_id: str, user: dict = Depends(get_current_user)):
    """
    Retrieve stored research session details by research_id.
    """
    logger.info(f"Fetching research report for ID: '{research_id}'")
    session_data = firebase_service.get_research(research_id, owner_id=user["id"])
    if not session_data:
        logger.warning(f"Research session with ID '{research_id}' not found.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research report with ID '{research_id}' was not found."
        )
    
    try:
        return ResearchResponse(**session_data)
    except Exception as e:
        logger.error(f"Error parsing stored research session for ID '{research_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving research session data."
        )


@router.get(
    "",
    response_model=ResearchHistoryResponse,
    summary="List historical research sessions",
    description="Returns paginated list of previously completed research sessions."
)
async def get_research_history(
    page: int = Query(default=1, ge=1, description="Page number starting at 1"),
    limit: int = Query(default=10, ge=1, le=50, description="Items per page (1 to 50)"),
    user: dict = Depends(get_current_user),
):
    """
    Fetch paginated research history items sorted by creation time descending.
    """
    logger.info(f"Fetching research history - page={page}, limit={limit}")
    try:
        history = firebase_service.get_research_history(page=page, limit=limit, owner_id=user["id"])
        return ResearchHistoryResponse(**history)
    except Exception as e:
        logger.error(f"Error fetching research history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve research history."
        )
