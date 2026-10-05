from unittest.mock import patch
from app.services.firebase_service import FirebaseService


@patch("app.services.firebase_service.get_firestore_client", return_value=None)
def test_firebase_service_crud_flow(mock_get_db):
    service = FirebaseService()

    # 1. Create Research
    question = "Is electric vehicle adoption increasing worldwide?"
    research_id = service.create_research(question)
    assert research_id is not None
    assert len(research_id) > 0

    # 2. Get Research (Initial state)
    doc = service.get_research(research_id)
    assert doc is not None
    assert doc["question"] == question
    assert doc["status"] == "created"

    # 3. Update Status
    service.update_research_status(research_id, "processing")
    doc = service.get_research(research_id)
    assert doc["status"] == "processing"

    # 4. Save Results
    research_data = {
        "status": "completed",
        "summary": "EV sales are growing rapidly worldwide.",
        "report": "# Executive Summary\nEV adoption is growing.",
        "claims": [{"claim": "EV sales grew 35%", "verdict": "Supported"}],
        "sources": [{"title": "IEA", "url": "https://iea.org"}],
        "metadata": {"search_count": 1, "source_count": 1, "processing_time": 1.25},
        "confidence": 73,
        "contradictions": ["Sources disagree on the reporting period."],
    }
    saved = service.save_research_result(research_id, research_data)
    assert saved is True

    # 5. Verify retrieved saved data
    completed_doc = service.get_research(research_id)
    assert completed_doc["status"] == "completed"
    assert completed_doc["summary"] == "EV sales are growing rapidly worldwide."
    assert len(completed_doc["claims"]) == 1
    assert len(completed_doc["sources"]) == 1
    assert completed_doc["confidence"] == 73
    assert completed_doc["contradictions"] == ["Sources disagree on the reporting period."]

    # 6. Test History Pagination
    history = service.get_research_history(page=1, limit=10)
    assert history["total"] >= 1
    assert history["page"] == 1
    assert len(history["items"]) >= 1
    assert history["items"][0]["research_id"] == research_id
    assert history["items"][0]["confidence"] == 73


@patch("app.services.firebase_service.get_firestore_client", return_value=None)
def test_research_records_are_scoped_to_their_owner(mock_get_db):
    service = FirebaseService()
    research_id = service.create_research("A private research query", owner_id="user-a")
    service.save_research_result(research_id, {"status": "completed", "confidence": 73})

    assert service.get_research(research_id, owner_id="user-a") is not None
    assert service.get_research(research_id, owner_id="user-b") is None
    assert service.get_research_history(owner_id="user-a")["total"] == 1
    assert service.get_research_history(owner_id="user-b")["total"] == 0

