"""
============================================================
PolySort-AI
Plastic Detector
============================================================

This module handles image-based plastic detection.

The actual trained AI model will be loaded from the
model/ directory when it becomes available.
"""

from pathlib import Path
from typing import Dict, List

from PIL import Image


# ============================================================
# PATH CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "model"


# ============================================================
# SUPPORTED PLASTIC TYPES
# ============================================================

SUPPORTED_MATERIALS: List[str] = [
    "PET",
    "HDPE",
    "PVC",
    "LDPE",
    "PP",
    "PS",
    "OTHER"
]


# ============================================================
# IMAGE VALIDATION
# ============================================================

def validate_image(image_path: str) -> Dict:
    """
    Validate uploaded image before sending it
    to the AI model.
    """

    path = Path(image_path)

    if not path.exists():

        return {
            "valid": False,
            "message": "Image file does not exist."
        }

    try:

        with Image.open(path) as image:

            width, height = image.size

            return {
                "valid": True,
                "width": width,
                "height": height,
                "format": image.format,
                "mode": image.mode
            }

    except Exception as error:

        return {
            "valid": False,
            "message": f"Invalid image: {error}"
        }


# ============================================================
# MODEL CHECK
# ============================================================

def model_available() -> bool:
    """
    Check whether an AI model exists inside model/.
    """

    if not MODEL_DIR.exists():
        return False

    model_files = list(
        MODEL_DIR.glob("*.pt")
    )

    return len(model_files) > 0


# ============================================================
# GET MODEL PATH
# ============================================================

def get_model_path():
    """
    Return the first available .pt model.
    """

    model_files = list(
        MODEL_DIR.glob("*.pt")
    )

    if not model_files:
        return None

    return model_files[0]


# ============================================================
# AI PLASTIC DETECTION
# ============================================================

def detect_plastic(image_path: str) -> Dict:
    """
    Detect plastic material from an image.

    Currently the trained model is not included.
    Once a YOLO .pt model is placed inside model/,
    this function can be connected to it.
    """

    # --------------------------------------------------------
    # Validate image
    # --------------------------------------------------------

    image_info = validate_image(
        image_path
    )

    if not image_info.get("valid"):

        return {
            "success": False,
            "material": "OTHER",
            "confidence": 0.0,
            "message": image_info.get(
                "message",
                "Invalid image."
            )
        }

    # --------------------------------------------------------
    # Check AI model
    # --------------------------------------------------------

    if not model_available():

        return {
            "success": True,
            "model_loaded": False,
            "material": "OTHER",
            "confidence": 0.0,
            "message": (
                "Image received successfully. "
                "AI model is not available yet. "
                "Add a trained YOLO model to backend/model/."
            ),
            "image": {
                "width": image_info["width"],
                "height": image_info["height"],
                "format": image_info["format"]
            }
        }

    # --------------------------------------------------------
    # Model available
    # --------------------------------------------------------

    model_path = get_model_path()

    try:

        from ultralytics import YOLO

        # Load trained model
        model = YOLO(
            str(model_path)
        )

        # Run prediction
        results = model(
            image_path,
            verbose=False
        )

        # ----------------------------------------------------
        # No detection
        # ----------------------------------------------------

        if not results:

            return {
                "success": False,
                "model_loaded": True,
                "material": "OTHER",
                "confidence": 0.0,
                "message": "No object detected."
            }

        result = results[0]

        # ----------------------------------------------------
        # Check detected classes
        # ----------------------------------------------------

        if result.boxes is None or len(result.boxes) == 0:

            return {
                "success": False,
                "model_loaded": True,
                "material": "OTHER",
                "confidence": 0.0,
                "message": "No plastic object detected."
            }

        # ----------------------------------------------------
        # Get highest confidence detection
        # ----------------------------------------------------

        confidence_values = (
            result.boxes.conf
            .cpu()
            .numpy()
        )

        class_values = (
            result.boxes.cls
            .cpu()
            .numpy()
        )

        highest_index = confidence_values.argmax()

        confidence = float(
            confidence_values[highest_index]
        )

        class_id = int(
            class_values[highest_index]
        )

        # ----------------------------------------------------
        # Get class name
        # ----------------------------------------------------

        detected_names = result.names

        material = detected_names.get(
            class_id,
            "OTHER"
        )

        material = str(
            material
        ).upper()

        # ----------------------------------------------------
        # Normalize unknown labels
        # ----------------------------------------------------

        if material not in SUPPORTED_MATERIALS:

            material = "OTHER"

        return {
            "success": True,
            "model_loaded": True,
            "material": material,
            "confidence": round(
                confidence,
                4
            ),
            "message": "Plastic detected successfully.",
            "image": {
                "width": image_info["width"],
                "height": image_info["height"],
                "format": image_info["format"]
            }
        }

    except Exception as error:

        return {
            "success": False,
            "model_loaded": True,
            "material": "OTHER",
            "confidence": 0.0,
            "message": (
                f"AI detection error: {str(error)}"
            )
        }