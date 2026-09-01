"""
============================================================
PolySort-AI
Knowledge Base
============================================================

This module loads plastic material information from
materials.json and provides helper functions to access it.
"""

import json
from pathlib import Path
from typing import Dict, Optional


# ============================================================
# FILE PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MATERIALS_FILE = BASE_DIR / "materials.json"


# ============================================================
# LOAD KNOWLEDGE BASE
# ============================================================

def load_materials() -> Dict:
    """
    Load plastic material information from materials.json.
    """

    try:
        with open(
            MATERIALS_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except FileNotFoundError:

        print(
            f"Knowledge base file not found: {MATERIALS_FILE}"
        )

        return {}

    except json.JSONDecodeError:

        print(
            "Error: materials.json contains invalid JSON."
        )

        return {}


# ============================================================
# MATERIAL DATABASE
# ============================================================

MATERIALS = load_materials()


# ============================================================
# GET MATERIAL INFORMATION
# ============================================================

def get_material(material: str) -> Optional[Dict]:
    """
    Get information about a specific plastic material.

    Example:
        get_material("PET")
    """

    if not material:
        return None

    material = material.upper().strip()

    return MATERIALS.get(material)


# ============================================================
# GET ALL MATERIALS
# ============================================================

def get_all_materials() -> Dict:
    """
    Return complete plastic material knowledge base.
    """

    return MATERIALS


# ============================================================
# CHECK MATERIAL
# ============================================================

def material_exists(material: str) -> bool:
    """
    Check whether a plastic material exists
    in the knowledge base.
    """

    if not material:
        return False

    material = material.upper().strip()

    return material in MATERIALS


# ============================================================
# GET RECYCLING RECOMMENDATION
# ============================================================

def get_recommendation(material: str) -> str:
    """
    Return recycling recommendation for a material.
    """

    material_info = get_material(material)

    if not material_info:
        return "No recycling information available."

    return material_info.get(
        "recommendation",
        "No recycling recommendation available."
    )


# ============================================================
# GET RECYCLING STATUS
# ============================================================

def is_recyclable(material: str) -> bool:
    """
    Check whether a material is marked as recyclable.
    """

    material_info = get_material(material)

    if not material_info:
        return False

    return bool(
        material_info.get(
            "recyclable",
            False
        )
    )