"""
============================================================
PolySort-AI — Intelligent Plastic Sorting System
FastAPI Backend + Frontend
============================================================
"""

import uuid
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.services.detector import detect_plastic
from backend.services.decision_engine import analyze_material


# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="PolySort-AI",
    description="AI-powered intelligent plastic sorting system",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DIRECTORIES
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

FRONTEND_DIR = BASE_DIR.parent / "frontend"


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PolySort-AI API"
    }


# ============================================================
# ANALYZE IMAGE
# ============================================================

@app.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...)
):
    """
    Receive an image and analyze the plastic material.
    """

    # --------------------------------------------------------
    # 1. Validate uploaded file
    # --------------------------------------------------------

    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                "Please upload a valid image "
                "(JPG, JPEG, PNG or WEBP)."
            )
        )

    # --------------------------------------------------------
    # 2. Check filename
    # --------------------------------------------------------

    original_filename = file.filename or "uploaded_image.jpg"

    extension = Path(original_filename).suffix.lower()

    if extension not in [".jpg", ".jpeg", ".png", ".webp"]:
        extension = ".jpg"

    # --------------------------------------------------------
    # 3. Create unique filename
    # --------------------------------------------------------

    unique_filename = f"{uuid.uuid4()}{extension}"

    file_path = UPLOAD_DIR / unique_filename

    # --------------------------------------------------------
    # 4. Save uploaded image
    # --------------------------------------------------------

    try:
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save uploaded image: {str(error)}"
        )

    # --------------------------------------------------------
    # 5. Detect plastic
    # --------------------------------------------------------

    try:
        detection_result = detect_plastic(
            str(file_path)
        )

    except Exception as error:

        return {
            "success": False,
            "stage": "plastic_detection",
            "message": "Plastic detection failed.",
            "error": str(error)
        }

    # --------------------------------------------------------
    # 6. Extract material
    # --------------------------------------------------------

    try:
        material = detection_result.get(
            "material",
            "OTHER"
        )

        confidence = float(
            detection_result.get(
                "confidence",
                0.0
            )
        )

    except Exception as error:

        return {
            "success": False,
            "stage": "result_processing",
            "message": "Could not process detection result.",
            "error": str(error)
        }

    # --------------------------------------------------------
    # 7. Generate recycling decision
    # --------------------------------------------------------

    try:

        decision = analyze_material(
            material=material,
            confidence=confidence
        )

    except Exception as error:

        return {
            "success": False,
            "stage": "decision_engine",
            "message": "Recycling decision generation failed.",
            "material": material,
            "confidence": confidence,
            "error": str(error)
        }

    # --------------------------------------------------------
    # 8. Final response
    # --------------------------------------------------------

    return {
        "success": True,
        "project": "PolySort-AI",
        "filename": original_filename,
        "detection": detection_result,
        "analysis": decision
    }


# ============================================================
# FRONTEND
# ============================================================

app.mount(
    "/",
    StaticFiles(
        directory=FRONTEND_DIR,
        html=True
    ),
    name="frontend"
)


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )