from pathlib import Path
from ultralytics import YOLO


# ============================================================
# PolySort-AI - Plastic Material Classification Training
# ============================================================

# Project root directory
BASE_DIR = Path(__file__).resolve().parent

# Dataset path
DATASET_DIR = BASE_DIR / "dataset"

# Output directory
OUTPUT_DIR = BASE_DIR / "backend" / "runs"


print("=" * 60)
print("PolySort-AI - AI Model Training")
print("=" * 60)

# ------------------------------------------------------------
# Check dataset
# ------------------------------------------------------------

if not DATASET_DIR.exists():
    raise FileNotFoundError(
        f"Dataset folder not found: {DATASET_DIR}"
    )

for split in ["train", "val", "test"]:
    split_path = DATASET_DIR / split

    if not split_path.exists():
        raise FileNotFoundError(
            f"Missing dataset folder: {split_path}"
        )

print("\n✅ Dataset found")
print(f"📁 Dataset: {DATASET_DIR}")

# ------------------------------------------------------------
# Load pretrained YOLO classification model
# ------------------------------------------------------------

print("\n🤖 Loading pretrained YOLO classification model...")

model = YOLO("yolo26n-cls.pt")

print("✅ Pretrained model loaded")

# ------------------------------------------------------------
# Train model
# ------------------------------------------------------------

print("\n🚀 Starting training...")
print("⏳ This may take some time depending on your PC/GPU.\n")

results = model.train(
    data=str(DATASET_DIR),
    epochs=50,
    imgsz=224,
    batch=16,
    project=str(OUTPUT_DIR),
    name="plastic_material_classifier",
    patience=10,
    workers=2,
    verbose=True
)

# ------------------------------------------------------------
# Training completed
# ------------------------------------------------------------

print("\n" + "=" * 60)
print("🎉 TRAINING COMPLETED!")
print("=" * 60)

print("\n📁 Training results:")
print(OUTPUT_DIR / "plastic_material_classifier")

print("\n🤖 Best trained model:")
print(
    OUTPUT_DIR
    / "plastic_material_classifier"
    / "weights"
    / "best.pt"
)

print("\nNext step:")
print("Copy best.pt into:")
print("backend/model/plastic_material.pt")

print("=" * 60)