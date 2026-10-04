from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health check endpoint")
async def health_check():
    """
    Returns system status to confirm backend service health.
    """
    return {"status": "healthy"}
