import logging
from typing import List
from app.models.research import Source, Claim
from app.services.gemini_service import gemini_service

logger = logging.getLogger("fact_checker")


class FactChecker:
    """
    Agent responsible for evaluating claims against collected evidence sources.
    Ensures verdicts are evidence-grounded and never hallucinated.
    """

    def check_claim(self, claim_text: str, question: str, sources: List[Source]) -> Claim:
        """
        Fact-checks a single claim string against provided evidence sources.
        """
        if not sources:
            return Claim(
                claim=claim_text,
                verdict="Unverified",
                confidence=0.0,
                explanation="Insufficient evidence to verify this claim because no relevant search sources were found.",
                supporting_sources=[]
            )

        try:
            eval_result = gemini_service.verify_claim(claim_text, question, sources)
            
            return Claim(
                claim=claim_text,
                verdict=eval_result.get("verdict", "Unverified"),
                confidence=eval_result.get("confidence", 0.0),
                explanation=eval_result.get("explanation", "Insufficient evidence to verify this claim."),
                supporting_sources=eval_result.get("supporting_sources", [])
            )
        except Exception as e:
            logger.error(f"Error during fact check of claim '{claim_text}': {e}")
            return Claim(
                claim=claim_text,
                verdict="Unverified",
                confidence=0.0,
                explanation=f"Error evaluating claim: {str(e)}. Insufficient evidence to verify this claim.",
                supporting_sources=[]
            )

    def fact_check_claims(self, claim_texts: List[str], question: str, sources: List[Source]) -> List[Claim]:
        """
        Fact-checks a list of claim strings against collected sources.
        """
        evaluated_claims: List[Claim] = []
        for claim_text in claim_texts:
            evaluated = self.check_claim(claim_text, question, sources)
            evaluated_claims.append(evaluated)
        
        logger.info(f"Fact-checked {len(evaluated_claims)} claims for research question.")
        return evaluated_claims


# Singleton instance
fact_checker = FactChecker()
