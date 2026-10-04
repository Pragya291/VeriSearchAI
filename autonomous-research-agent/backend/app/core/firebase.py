import os
import json
import logging
from typing import Optional, Any
from app.core.config import settings

logger = logging.getLogger("firebase_core")

_firestore_db = None
_is_firebase_initialized = False


def initialize_firebase() -> Optional[Any]:
    """
    Initializes the Firebase Admin SDK using credentials from environment variables,
    service account file, or default Application Default Credentials.
    """
    global _firestore_db, _is_firebase_initialized

    if _is_firebase_initialized:
        return _firestore_db

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if firebase_admin._apps:
            logger.info("Firebase Admin app already initialized.")
            _firestore_db = firestore.client()
            _is_firebase_initialized = True
            return _firestore_db

        cred = None

        # Option 1: File path to credentials JSON
        if settings.FIREBASE_CREDENTIALS_FILE and os.path.exists(settings.FIREBASE_CREDENTIALS_FILE):
            logger.info(f"Loading Firebase credentials from file: {settings.FIREBASE_CREDENTIALS_FILE}")
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_FILE)

        # Option 2: Environment variables for project_id, client_email, private_key
        elif settings.FIREBASE_PROJECT_ID and settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
            logger.info(f"Loading Firebase credentials for project '{settings.FIREBASE_PROJECT_ID}' from environment variables.")
            private_key = settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n")
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": private_key,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            cred = credentials.Certificate(cred_dict)

        if cred:
            firebase_admin.initialize_app(cred)
            _firestore_db = firestore.client()
            _is_firebase_initialized = True
            logger.info("Firebase Admin SDK successfully initialized.")
            return _firestore_db

        # Option 3: Attempt Application Default Credentials (ADC) if project id is set
        elif settings.FIREBASE_PROJECT_ID:
            logger.info("Attempting Application Default Credentials for Firebase...")
            firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
            _firestore_db = firestore.client()
            _is_firebase_initialized = True
            return _firestore_db

        else:
            logger.warning("Firebase credentials not configured. Backend will operate using in-memory mock database store.")
            _is_firebase_initialized = False
            return None

    except Exception as e:
        logger.error(f"Error during Firebase Admin initialization: {e}")
        _is_firebase_initialized = False
        return None


def get_firestore_client() -> Optional[Any]:
    """Returns the initialized Firestore database client."""
    global _firestore_db
    if _firestore_db is None:
        return initialize_firebase()
    return _firestore_db
