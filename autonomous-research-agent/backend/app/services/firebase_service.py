import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.firebase import get_firestore_client

logger = logging.getLogger("firebase_service")


class FirebaseService:
    """Service to handle CRUD operations on Firebase Firestore 'researches' collection."""

    COLLECTION_NAME = "researches"

    def __init__(self):
        # In-memory store fallback when Firestore credentials are not configured
        self._in_memory_store: Dict[str, Dict[str, Any]] = {}

    def _get_db(self):
        return get_firestore_client()

    def create_research(self, question: str, owner_id: Optional[str] = None) -> str:
        """
        Creates a new research session record with status 'created'.
        Returns generated research_id.
        """
        research_id = str(uuid.uuid4())
        now_iso = datetime.now(timezone.utc).isoformat()

        doc_data = {
            "research_id": research_id,
            "owner_id": owner_id,
            "question": question,
            "status": "created",
            "summary": "",
            "report": "",
            "claims": [],
            "sources": [],
            "metadata": {
                "search_count": 0,
                "source_count": 0,
                "processing_time": 0.0
            },
            "confidence": 0,
            "contradictions": [],
            "created_at": now_iso,
            "completed_at": None,
            "error": None
        }

        db = self._get_db()
        if db is not None:
            try:
                db.collection(self.COLLECTION_NAME).document(research_id).set(doc_data)
                logger.info(f"Created research record in Firestore: {research_id}")
                return research_id
            except Exception as e:
                logger.error(f"Firestore error in create_research: {e}. Falling back to in-memory store.")

        # Fallback to in-memory store
        self._in_memory_store[research_id] = doc_data
        logger.info(f"Created research record in memory store: {research_id}")
        return research_id

    def update_research_status(
        self,
        research_id: str,
        status: str,
        error_message: Optional[str] = None
    ) -> bool:
        """Updates status of an ongoing research session."""
        db = self._get_db()
        update_data = {
            "status": status,
            "error": error_message
        }

        if db is not None:
            try:
                db.collection(self.COLLECTION_NAME).document(research_id).update(update_data)
                logger.info(f"Updated status to '{status}' for research_id '{research_id}' in Firestore.")
                return True
            except Exception as e:
                logger.error(f"Firestore error in update_research_status: {e}")

        if research_id in self._in_memory_store:
            self._in_memory_store[research_id]["status"] = status
            self._in_memory_store[research_id]["error"] = error_message
            return True

        return False

    def save_research_result(self, research_id: str, research_data: Dict[str, Any]) -> bool:
        """
        Saves completed research findings (summary, claims, sources, report, metadata).
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        save_payload = {
            "status": research_data.get("status", "completed"),
            "summary": research_data.get("summary", ""),
            "report": research_data.get("report", ""),
            "claims": research_data.get("claims", []),
            "sources": research_data.get("sources", []),
            "metadata": research_data.get("metadata", {}),
            "confidence": research_data.get("confidence", 0),
            "contradictions": research_data.get("contradictions", []),
            "completed_at": now_iso
        }

        db = self._get_db()
        if db is not None:
            try:
                db.collection(self.COLLECTION_NAME).document(research_id).update(save_payload)
                logger.info(f"Successfully saved research results for ID '{research_id}' to Firestore.")
                return True
            except Exception as e:
                logger.error(f"Firestore error in save_research_result: {e}")

        if research_id in self._in_memory_store:
            self._in_memory_store[research_id].update(save_payload)
            logger.info(f"Saved research results for ID '{research_id}' in memory store.")
            return True

        return False

    def get_research(self, research_id: str, owner_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Retrieves a research session by ID."""
        db = self._get_db()
        if db is not None:
            try:
                doc = db.collection(self.COLLECTION_NAME).document(research_id).get()
                if doc.exists:
                    data = doc.to_dict()
                    if owner_id is None or data.get("owner_id") == owner_id:
                        return data
            except Exception as e:
                logger.error(f"Firestore error in get_research: {e}")

        data = self._in_memory_store.get(research_id)
        if data and (owner_id is None or data.get("owner_id") == owner_id):
            return data
        return None

    def get_research_history(
        self,
        page: int = 1,
        limit: int = 10,
        owner_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Returns paginated history of research sessions sorted by creation time descending.
        """
        page = max(page, 1)
        limit = max(min(limit, 50), 1)

        all_items: List[Dict[str, Any]] = []

        db = self._get_db()
        if db is not None:
            try:
                query = db.collection(self.COLLECTION_NAME).order_by(
                    "created_at", direction="DESCENDING"
                )
                docs = query.stream()
                for doc in docs:
                    all_items.append(doc.to_dict())
            except Exception as e:
                logger.error(f"Firestore error in get_research_history: {e}")
                all_items = list(self._in_memory_store.values())
        else:
            all_items = list(self._in_memory_store.values())

        # Sort descending by created_at
        if owner_id is not None:
            all_items = [item for item in all_items if item.get("owner_id") == owner_id]
        all_items.sort(key=lambda x: x.get("created_at") or "", reverse=True)

        total = len(all_items)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_raw = all_items[start_idx:end_idx]

        items = []
        for d in paginated_raw:
            items.append({
                "research_id": d.get("research_id", ""),
                "question": d.get("question", ""),
                "status": d.get("status", "unknown"),
                "summary": d.get("summary", ""),
                "created_at": d.get("created_at"),
                "completed_at": d.get("completed_at"),
                "source_count": len(d.get("sources", [])),
                "claim_count": len(d.get("claims", [])),
                "confidence": d.get("confidence", 0),
            })

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "items": items
        }


# Singleton service instance
firebase_service = FirebaseService()
