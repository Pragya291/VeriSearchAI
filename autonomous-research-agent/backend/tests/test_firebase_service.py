from app.services.firebase_service import FirebaseService


def test_firebase_service_crud_flow():
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
        "metadata": {"search_count": 1, "source_count": 1, "processing_time": 1.25}
    }
    saved = service.save_research_result(research_id, research_data)
    assert saved is True

    # 5. Verify retrieved saved data
    completed_doc = service.get_research(research_id)
    assert completed_doc["status"] == "completed"
    assert completed_doc["summary"] == "EV sales are growing rapidly worldwide."
    assert len(completed_doc["claims"]) == 1
    assert len(completed_doc["sources"]) == 1

    # 6. Test History Pagination
    history = service.get_research_history(page=1, limit=10)
    assert history["total"] >= 1
    assert history["page"] == 1
    assert len(history["items"]) >= 1
    assert history["items"][0]["research_id"] == research_id
