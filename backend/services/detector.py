"""
============================================================
PolySort-AI
Image Analyzer / Plastic Detector
============================================================

This module handles:
1. Image validation
2. YOLO classification
3. YOLO object detection
4. Multiple plastic object detection
5. Material normalization
6. Confidence calculation
7. Bounding-box extraction

Supported materials:
PET, HDPE, PVC, LDPE, PP, PS, OTHER
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
    "OTHER",
]


# ============================================================
# MATERIAL ALIASES
# ============================================================

MATERIAL_ALIASES = {

    "POLYETHYLENE TEREPHTHALATE": "PET",
    "PETE": "PET",

    "HIGH DENSITY POLYETHYLENE": "HDPE",
    "HIGH-DENSITY POLYETHYLENE": "HDPE",

    "LOW DENSITY POLYETHYLENE": "LDPE",
    "LOW-DENSITY POLYETHYLENE": "LDPE",

    "POLYVINYL CHLORIDE": "PVC",

    "POLYPROPYLENE": "PP",

    "POLYSTYRENE": "PS",
    "POLYSTYRENE FOAM": "PS",

}


# ============================================================
# IMAGE VALIDATION
# ============================================================

def validate_image(image_path: str) -> Dict:
    """
    Validate uploaded image and return image metadata.
    """

    path = Path(image_path)

    # --------------------------------------------------------
    # Check file exists
    # --------------------------------------------------------

    if not path.exists():

        return {
            "valid": False,
            "message": "Image file does not exist."
        }

    try:

        with Image.open(path) as image:

            width, height = image.size

            # ------------------------------------------------
            # Minimum image size
            # ------------------------------------------------

            if width < 32 or height < 32:

                return {
                    "valid": False,
                    "message": (
                        "Image is too small. "
                        "Minimum size is 32x32 pixels."
                    )
                }

            # ------------------------------------------------
            # Force image decoding
            # ------------------------------------------------

            image.convert("RGB").load()

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
# MODEL PATH
# ============================================================

def get_model_path():
    """
    Find the first YOLO .pt model inside backend/model/.
    """

    if not MODEL_DIR.exists():

        return None

    model_files = sorted(
        MODEL_DIR.glob("*.pt")
    )

    if not model_files:

        return None

    return model_files[0]


# ============================================================
# MODEL AVAILABLE
# ============================================================

def model_available() -> bool:
    """
    Check whether a trained YOLO model exists.
    """

    return get_model_path() is not None


# ============================================================
# MATERIAL NORMALIZATION
# ============================================================

def normalize_material(label: str) -> str:
    """
    Convert model class names into PolySort material names.
    """

    normalized = str(
        label or "OTHER"
    ).strip().upper()

    # Direct match

    if normalized in SUPPORTED_MATERIALS:

        return normalized

    # Alias match

    if normalized in MATERIAL_ALIASES:

        return MATERIAL_ALIASES[normalized]

    # Unknown material

    return "OTHER"


# ============================================================
# IMAGE METADATA
# ============================================================

def get_image_metadata(image_info: Dict) -> Dict:
    """
    Return clean image metadata.
    """

    return {

        "width": image_info["width"],

        "height": image_info["height"],

        "format": image_info["format"]

    }


# ============================================================
# AI PLASTIC DETECTION
# ============================================================

def detect_plastic(image_path: str) -> Dict:
    """
    Analyze an image using a YOLO model.

    Supports:

    1. YOLO classification models
    2. YOLO object detection models

    Detection models can return multiple objects.
    Classification models return one image-level prediction.
    """

    # ========================================================
    # STEP 1 — VALIDATE IMAGE
    # ========================================================

    image_info = validate_image(
        image_path
    )

    if not image_info.get("valid"):

        return {

            "success": False,

            "model_loaded": False,

            "material": "OTHER",

            "confidence": 0.0,

            "objects": [],

            "message": image_info.get(
                "message",
                "Invalid image."
            )

        }


    # ========================================================
    # STEP 2 — FIND MODEL
    # ========================================================

    model_path = get_model_path()


    # ========================================================
    # MODEL NOT AVAILABLE
    # ========================================================

    if model_path is None:

        return {

            "success": True,

            "model_loaded": False,

            "model_type": None,

            "material": "OTHER",

            "confidence": 0.0,

            "object_count": 0,

            "objects": [],

            "message": (
                "Image received successfully, "
                "but no trained AI model was found. "
                "Add a trained YOLO .pt model "
                "to backend/model/."
            ),

            "image": get_image_metadata(
                image_info
            )

        }


    # ========================================================
    # STEP 3 — LOAD YOLO
    # ========================================================

    try:

        from ultralytics import YOLO

        model = YOLO(
            str(model_path)
        )


        # ====================================================
        # STEP 4 — RUN AI PREDICTION
        # ====================================================

        results = model(
            image_path,
            verbose=False
        )


        # ====================================================
        # NO RESULT
        # ====================================================

        if not results:

            return {

                "success": False,

                "model_loaded": True,

                "material": "OTHER",

                "confidence": 0.0,

                "objects": [],

                "message": (
                    "The AI model returned "
                    "no result."
                ),

                "image": get_image_metadata(
                    image_info
                )

            }


        result = results[0]


        # ====================================================
        # CASE 1
        # YOLO CLASSIFICATION MODEL
        # ====================================================

        if getattr(
            result,
            "probs",
            None
        ) is not None:

            probs = result.probs


            # Highest probability class

            class_id = int(
                probs.top1
            )


            # Confidence

            confidence = float(
                probs.top1conf
            )


            # Class label

            label = result.names.get(
                class_id,
                "OTHER"
            )


            # Normalize material

            material = normalize_material(
                label
            )


            return {

                "success": True,

                "model_loaded": True,

                "model_type": "classification",

                "material": material,

                "confidence": round(
                    confidence,
                    4
                ),

                "object_count": 1,

                "objects": [

                    {

                        "material": material,

                        "label": str(
                            label
                        ),

                        "confidence": round(
                            confidence,
                            4
                        )

                    }

                ],

                "message": (
                    "Plastic material "
                    "classified successfully."
                ),

                "image": get_image_metadata(
                    image_info
                )

            }


        # ====================================================
        # CASE 2
        # YOLO OBJECT DETECTION MODEL
        # ====================================================

        boxes = getattr(
            result,
            "boxes",
            None
        )


        # ====================================================
        # NO OBJECTS
        # ====================================================

        if boxes is None or len(boxes) == 0:

            return {

                "success": False,

                "model_loaded": True,

                "model_type": "detection",

                "material": "OTHER",

                "confidence": 0.0,

                "object_count": 0,

                "objects": [],

                "message": (
                    "No plastic object "
                    "detected in the image."
                ),

                "image": get_image_metadata(
                    image_info
                )

            }


        # ====================================================
        # EXTRACT DETECTIONS
        # ====================================================

        confidence_values = (
            boxes.conf
            .cpu()
            .numpy()
        )


        class_values = (
            boxes.cls
            .cpu()
            .numpy()
        )


        coordinates = (
            boxes.xyxy
            .cpu()
            .numpy()
        )


        detected_names = result.names


        objects = []


        # ====================================================
        # PROCESS EVERY OBJECT
        # ====================================================

        for index, confidence_value in enumerate(
            confidence_values
        ):

            confidence = float(
                confidence_value
            )


            class_id = int(
                class_values[index]
            )


            label = detected_names.get(
                class_id,
                "OTHER"
            )


            material = normalize_material(
                label
            )


            # Bounding box

            x1, y1, x2, y2 = [
                float(value)
                for value in coordinates[index]
            ]


            objects.append({

                "material": material,

                "label": str(
                    label
                ),

                "confidence": round(
                    confidence,
                    4
                ),

                "box": {

                    "x1": round(
                        x1,
                        2
                    ),

                    "y1": round(
                        y1,
                        2
                    ),

                    "x2": round(
                        x2,
                        2
                    ),

                    "y2": round(
                        y2,
                        2
                    )

                }

            })


        # ====================================================
        # SORT BY CONFIDENCE
        # ====================================================

        objects.sort(
            key=lambda item: item["confidence"],
            reverse=True
        )


        # ====================================================
        # BEST DETECTION
        # ====================================================

        best = objects[0]


        material = best[
            "material"
        ]


        confidence = best[
            "confidence"
        ]


        # ====================================================
        # FINAL DETECTION RESPONSE
        # ====================================================

        return {

            "success": True,

            "model_loaded": True,

            "model_type": "detection",

            "material": material,

            "confidence": confidence,

            "object_count": len(
                objects
            ),

            "objects": objects,

            "message": (
                "Plastic objects "
                "detected successfully."
            ),

            "image": get_image_metadata(
                image_info
            )

        }


    # ========================================================
    # ULTRALYTICS NOT INSTALLED
    # ========================================================

    except ImportError:

        return {

            "success": False,

            "model_loaded": False,

            "material": "OTHER",

            "confidence": 0.0,

            "objects": [],

            "message": (
                "Ultralytics is not installed. "
                "Run: pip install -r requirements.txt"
            )

        }


    # ========================================================
    # GENERAL AI ERROR
    # ========================================================

    except Exception as error:

        return {

            "success": False,

            "model_loaded": True,

            "material": "OTHER",

            "confidence": 0.0,

            "objects": [],

            "message": (
                f"AI detection error: {str(error)}"
            )

        }