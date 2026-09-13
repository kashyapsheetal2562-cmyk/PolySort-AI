"""
============================================================
PolySort-AI
Decision Engine
============================================================

This module takes the detected plastic material
and generates a recycling decision.
"""

from typing import Dict
from backend.services.classifier import classify_material


# ============================================================
# GENERATE DECISION
# ============================================================

def generate_decision(
    material: str,
    confidence: float = 0.0
) -> Dict:
    """
    Generate a complete recycling decision for a detected plastic.

    Args:
        material: Detected plastic type such as PET, HDPE, PVC, etc.
        confidence: AI model confidence score between 0 and 1.

    Returns:
        Dictionary containing classification and
        recycling recommendation.
    """

    # --------------------------------------------------------
    # Get material information
    # --------------------------------------------------------

    material_info = classify_material(material)

    # --------------------------------------------------------
    # Safely extract material information
    # --------------------------------------------------------

    material_name = material_info.get(
        "name",
        material
    )

    category = material_info.get(
        "category",
        "Unknown"
    )

    recycling_code = material_info.get(
        "recycling_code",
        "#7"
    )

    recyclable = bool(
        material_info.get(
            "recyclable",
            False
        )
    )

    common_items = material_info.get(
        "common_items",
        []
    )

    recommendation = material_info.get(
        "recommendation",
        "Manual verification is recommended."
    )

    # --------------------------------------------------------
    # Determine recycling status
    # --------------------------------------------------------

    if recyclable:

        recycling_status = "RECYCLABLE"
        priority = "HIGH"

    else:

        recycling_status = "NOT EASILY RECYCLABLE"
        priority = "LOW"

    # --------------------------------------------------------
    # Normalize confidence
    # --------------------------------------------------------

    confidence = float(confidence)

    # The AI detector normally returns confidence
    # between 0 and 1.

    if confidence > 1:
        confidence = confidence / 100

    confidence = max(
        0.0,
        min(
            1.0,
            confidence
        )
    )

    # --------------------------------------------------------
    # Confidence interpretation
    # --------------------------------------------------------

    if confidence >= 0.90:

        confidence_level = "Very High"

    elif confidence >= 0.75:

        confidence_level = "High"

    elif confidence >= 0.50:

        confidence_level = "Medium"

    else:

        confidence_level = "Low"

    # --------------------------------------------------------
    # Final decision
    # --------------------------------------------------------

    return {

        "material": material_info.get(
            "material",
            material
        ),

        "material_name": material_name,

        "category": category,

        "recycling_code": recycling_code,

        "recyclable": recyclable,

        "recycling_status": recycling_status,

        "priority": priority,

        "confidence": round(
            confidence * 100,
            2
        ),

        "confidence_level": confidence_level,

        "common_items": common_items,

        "recommendation": recommendation
    }


# ============================================================
# PUBLIC API HELPER
# ============================================================

def analyze_material(
    material: str,
    confidence: float = 0.0
) -> Dict:
    """
    Public helper function used by the FastAPI backend.
    """

    return generate_decision(
        material=material,
        confidence=confidence
    )