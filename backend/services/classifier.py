"""
============================================================
PolySort-AI
Plastic Material Classifier
============================================================

This module receives a detected plastic label and gets
complete material information from the knowledge base.
"""

from typing import Dict

from knowledge_base.knowledge import (
    get_material,
    get_all_materials
)


# ============================================================
# MATERIAL ALIASES
# ============================================================

MATERIAL_ALIASES = {

    "POLYETHYLENE TEREPHTHALATE": "PET",

    "HIGH DENSITY POLYETHYLENE": "HDPE",
    "HIGH-DENSITY POLYETHYLENE": "HDPE",

    "LOW DENSITY POLYETHYLENE": "LDPE",
    "LOW-DENSITY POLYETHYLENE": "LDPE",

    "POLYVINYL CHLORIDE": "PVC",

    "POLYPROPYLENE": "PP",

    "POLYSTYRENE": "PS",

    "MIXED": "OTHER",
    "UNKNOWN": "OTHER",
    "OTHER PLASTIC": "OTHER"
}


# ============================================================
# NORMALIZE MATERIAL
# ============================================================

def normalize_material(material: str) -> str:
    """
    Convert different material names into standard
    material codes such as PET, HDPE, PVC, etc.
    """

    if not material:
        return "OTHER"

    material = material.upper().strip()

    return MATERIAL_ALIASES.get(
        material,
        material
    )


# ============================================================
# CLASSIFY MATERIAL
# ============================================================

def classify_material(material: str) -> Dict:
    """
    Get complete information about a plastic material.
    """

    material = normalize_material(material)

    material_info = get_material(material)

    # --------------------------------------------------------
    # Unknown material
    # --------------------------------------------------------

    if not material_info:

        material = "OTHER"

        material_info = get_material(
            material
        )

    # --------------------------------------------------------
    # Return structured result
    # --------------------------------------------------------

    return {
        "material": material,

        "name": material_info.get(
            "name",
            "Unknown Plastic"
        ),

        "short_name": material_info.get(
            "short_name",
            material
        ),

        "category": material_info.get(
            "category",
            "Unknown"
        ),

        "recycling_code": material_info.get(
            "recycling_code",
            7
        ),

        "recyclable": material_info.get(
            "recyclable",
            False
        ),

        "common_products": material_info.get(
            "common_products",
            []
        ),

        "properties": material_info.get(
            "properties",
            []
        ),

        "recycling_method": material_info.get(
            "recycling_method",
            "Material-specific recycling"
        ),

        "recommendation": material_info.get(
            "recommendation",
            "Further analysis recommended."
        )
    }


# ============================================================
# GET SUPPORTED MATERIALS
# ============================================================

def get_supported_materials() -> Dict:
    """
    Return all materials supported by PolySort-AI.
    """

    return get_all_materials()