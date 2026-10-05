import os
import json
import re
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.models.research import Source, Claim

logger = logging.getLogger("gemini_service")


class GeminiServiceError(RuntimeError):
    """Raised when Gemini cannot complete evidence analysis."""


class GeminiService:
    """Service to interact with Google Gemini API for fact-checking and report generation."""

    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-2.5-flash"):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name
        self._client = None
        
        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")

    def _extract_json_from_text(self, text: str) -> Any:
        """Extract and parse JSON object or array from model response string."""
        cleaned = text.strip()
        # Remove Markdown code fence formatting if present
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\n?", "", cleaned, flags=re.MULTILINE)
            cleaned = re.sub(r"\n?```$", "", cleaned, flags=re.MULTILINE).strip()
        
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Fallback regex search for JSON substring
            match = re.search(r"(\[.*\]|\{.*\})", cleaned, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except json.JSONDecodeError as err:
                    logger.error(f"JSON regex extraction failed: {err}")
            raise ValueError(f"Could not parse valid JSON from text: {text[:200]}")

    def _call_gemini(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Calls Gemini API with strict validation and timeout protection."""
        if not self.api_key or not self.api_key.startswith("AIza"):
            raise GeminiServiceError("GEMINI_API_KEY is not configured or invalid. A valid AIza... key is required.")

        if not self._client:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error("Gemini client initialization failed.", exc_info=True)
                raise GeminiServiceError("Gemini analysis is unavailable.") from e

        try:
            logger.info(f"Calling Gemini model '{self.model_name}'...")
            
            config = {}
            if system_instruction:
                config["system_instruction"] = system_instruction

            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(
                    self._client.models.generate_content,
                    model=self.model_name,
                    contents=prompt,
                    config=config if config else None
                )
                response = future.result(timeout=12)
            return response.text or ""
        except concurrent.futures.TimeoutError as te:
            logger.warning("Gemini API call timed out after 12 seconds.")
            raise GeminiServiceError("Gemini analysis timed out.") from te
        except Exception as e:
            logger.error("Gemini API call failed.", exc_info=True)
            raise GeminiServiceError("Gemini analysis is temporarily unavailable.") from e

    def extract_claims(self, question: str, sources: List[Source]) -> List[str]:
        """
        Extract major factual claims related to the question from collected evidence sources.
        """
        if not sources:
            return []

        sources_text = "\n\n".join([
            f"Source [{i+1}] ({s.source_name} - {s.url}):\n{s.snippet}"
            for i, s in enumerate(sources)
        ])

        system_instruction = (
            "You are an objective research extraction agent. Extract testable, factual claims "
            "present in the provided evidence snippets related to the research question. "
            "Do NOT invent claims. Do NOT add outside knowledge. Return output ONLY as a JSON list of strings."
        )

        prompt = f"""Research Question: "{question}"

Collected Evidence Sources:
{sources_text}

Extract 3 to 6 distinct, testable factual claims made by these sources regarding the question.
Format your output strictly as a JSON array of strings:
["Claim 1...", "Claim 2...", ...]
"""

        try:
            raw_response = self._call_gemini(prompt, system_instruction=system_instruction)
            extracted = self._extract_json_from_text(raw_response)
            if isinstance(extracted, list):
                return [str(c).strip() for c in extracted if str(c).strip()]
            return []
        except Exception as e:
            logger.error("Failed to extract claims with Gemini.", exc_info=True)
            raise GeminiServiceError("Gemini could not extract claims from the retrieved evidence.") from e

    def verify_claim(self, claim: str, question: str, sources: List[Source]) -> Dict[str, Any]:
        """
        Compare a single claim against available evidence sources to evaluate verdict and confidence.
        """
        if not sources:
            return {
                "claim": claim,
                "verdict": "Unverified",
                "confidence": 0.0,
                "explanation": "Insufficient evidence to verify this claim because no sources were retrieved.",
                "supporting_sources": []
            }

        sources_text = "\n\n".join([
            f"Source [{i+1}] Name: {s.source_name} | URL: {s.url}\nTitle: {s.title}\nSnippet: {s.snippet}"
            for i, s in enumerate(sources)
        ])

        system_instruction = (
            "You are a strict, objective fact-checking model. Evaluate the claim STRICTLY using only the provided sources. "
            "Safety and accuracy rules:\n"
            "1. Do NOT assume something is true simply because you believe it; only rely on the provided evidence snippets.\n"
            "2. Verdicts must be one of: 'Supported', 'Partially Supported', 'Contradicted', or 'Unverified'.\n"
            "3. If evidence is missing, conflicting, or inconclusive, assign 'Unverified' or 'Partially Supported' and explain.\n"
            "4. Assign a confidence score from 0.0 to 1.0 based on evidence strength.\n"
            "5. Never fabricate URLs or source names.\n"
            "6. Output strictly JSON matching the required object format."
        )

        prompt = f"""Research Question: "{question}"
Claim to Fact-Check: "{claim}"

Available Evidence Sources:
{sources_text}

Evaluate this claim. Output strictly a JSON object formatted as:
{{
  "verdict": "Supported" | "Partially Supported" | "Contradicted" | "Unverified",
  "confidence": 0.85,
  "explanation": "Clear explanation referencing source evidence...",
  "supporting_sources": ["URL1", "URL2"]
}}
"""

        try:
            raw_response = self._call_gemini(prompt, system_instruction=system_instruction)
            data = self._extract_json_from_text(raw_response)

            valid_verdicts = {"Supported", "Partially Supported", "Contradicted", "Unverified"}
            verdict = data.get("verdict", "Unverified")
            if verdict not in valid_verdicts:
                verdict = "Unverified"

            confidence = float(data.get("confidence", 0.5))
            confidence = min(max(confidence, 0.0), 1.0)
            allowed_sources = {source.url for source in sources}
            candidate_sources = data.get("supporting_sources", [])
            if not isinstance(candidate_sources, list):
                candidate_sources = []
            supporting_sources = [
                source_url
                for source_url in candidate_sources
                if isinstance(source_url, str) and source_url in allowed_sources
            ]

            return {
                "claim": claim,
                "verdict": verdict,
                "confidence": round(confidence, 2),
                "explanation": data.get("explanation", "Evaluated based on provided web sources."),
                "supporting_sources": supporting_sources
            }
        except Exception as e:
            logger.error("Gemini claim verification failed.", exc_info=True)
            raise GeminiServiceError("Gemini could not verify a claim against the retrieved evidence.") from e

    def detect_contradictions(self, claims: List[Claim], sources: List[Source]) -> List[str]:
        """Detect any conflicting claims or evidence between sources."""
        if not sources or not claims:
            return []

        sources_text = "\n\n".join([
            f"Source [{i+1}] ({s.source_name}): {s.snippet}" for i, s in enumerate(sources)
        ])
        claims_text = "\n".join([f"- {c.claim} (Verdict: {c.verdict})" for c in claims])

        system_instruction = (
            "You are an analytical evidence auditor. Identify explicit contradictions or conflicting numbers/findings "
            "between the provided sources and claims. Return strictly a JSON list of strings detailing any conflicts. "
            "If no contradictions are found, return empty array []."
        )

        prompt = f"""Evaluated Claims:
{claims_text}

Evidence Sources:
{sources_text}

Identify any contradictory statements, conflicting figures, or opposing viewpoints between sources.
Return strictly JSON array:
["Contradiction 1 details...", "Contradiction 2 details..."]
"""

        try:
            raw_response = self._call_gemini(prompt, system_instruction=system_instruction)
            res = self._extract_json_from_text(raw_response)
            if isinstance(res, list):
                return [str(item) for item in res if str(item).strip()]
            return []
        except Exception as e:
            logger.error("Gemini contradiction analysis failed.", exc_info=True)
            raise GeminiServiceError("Gemini could not compare the retrieved evidence.") from e

    def generate_summary_and_report(
        self,
        question: str,
        claims: List[Claim],
        sources: List[Source],
        contradictions: List[str]
    ) -> Dict[str, str]:
        """
        Generates an executive summary and comprehensive research report in Markdown.
        """
        sources_text = "\n".join([
            f"- [{s.title}]({s.url}) (Domain: {s.source_name}, Credibility: {s.credibility_score})\n  Snippet: {s.snippet}"
            for s in sources
        ])
        claims_text = "\n".join([
            f"- **Claim**: {c.claim}\n  - **Verdict**: {c.verdict} (Confidence: {int(c.confidence*100)}%)\n  - **Explanation**: {c.explanation}"
            for c in claims
        ])
        contradictions_text = "\n".join([f"- {c}" for c in contradictions]) if contradictions else "None detected."

        system_instruction = (
            "You are a professional autonomous fact-checking researcher. Write a comprehensive, objective report. "
            "Strict guidelines:\n"
            "1. Base findings ONLY on provided evidence sources.\n"
            "2. Distinguish clearly between verified facts, partial findings, and uncertainties.\n"
            "3. Explicitly state 'Insufficient evidence to verify this claim' where evidence is missing.\n"
            "4. Do NOT fabricate URLs or external sources.\n"
            "5. Format the output with clear Markdown headers, summary, claim analysis table, and conclusion."
        )

        prompt = f"""Research Question: "{question}"

Fact-Checked Claims:
{claims_text}

Detected Contradictions:
{contradictions_text}

Evaluated Sources:
{sources_text}

Provide your response in JSON format containing two fields:
"summary": A concise 2-4 sentence executive summary answering the question based strictly on evidence.
"report": A detailed Markdown research report structured with:
  # Executive Summary
  # Fact-Checking Matrix
  # Source Reliability & Evidence Analysis
  # Contradictions & Uncertainties
  # Conclusion & Limitations
"""

        try:
            raw_response = self._call_gemini(prompt, system_instruction=system_instruction)
            data = self._extract_json_from_text(raw_response)
            summary = data.get("summary")
            report = data.get("report")
            if not isinstance(summary, str) or not summary.strip() or not isinstance(report, str) or not report.strip():
                raise ValueError("Gemini returned an incomplete research report.")
            return {"summary": summary, "report": report}
        except Exception as e:
            logger.error("Gemini report generation failed.", exc_info=True)
            raise GeminiServiceError("Gemini could not generate the evidence-backed report.") from e


# Singleton service instance
gemini_service = GeminiService()
