import re
from typing import List, Set
from urllib.parse import urlparse


def clean_text(text: str) -> str:
    """Removes excess whitespace and normalizes raw text string."""
    if not text:
        return ""
    # Replace non-breaking spaces and redundant whitespaces
    text = text.replace("\xa0", " ").replace("\r\n", "\n")
    return re.sub(r"\s+", " ", text).strip()


def extract_keywords(text: str) -> Set[str]:
    """Extract lowercase keywords (alphanumeric words > 3 chars) from text."""
    words = re.findall(r"\b[a-zA-Z0-9]{3,}\b", text.lower())
    stop_words = {
        "this", "that", "with", "from", "have", "more", "will", "been", "were",
        "they", "their", "what", "which", "when", "where", "who", "does", "about",
        "into", "than", "some", "them", "these", "other", "then", "also"
    }
    return {w for w in words if w not in stop_words}


def compute_text_relevance(query: str, text: str) -> float:
    """
    Computes a basic keyword overlap relevance score between 0.0 and 1.0.
    """
    query_kw = extract_keywords(query)
    if not query_kw:
        return 0.5

    text_kw = extract_keywords(text)
    if not text_kw:
        return 0.0

    overlap = query_kw.intersection(text_kw)
    score = len(overlap) / len(query_kw)
    return min(max(score, 0.0), 1.0)
