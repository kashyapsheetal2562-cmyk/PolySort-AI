from pathlib import Path

DATASET = Path("dataset")

SPLITS = ["train", "val", "test"]
CLASSES = ["PET", "HDPE", "LDPE", "PP", "PS", "PVC"]

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp"
}

print("=" * 60)
print("PolySort-AI Dataset Verification")
print("=" * 60)

all_ok = True

for split in SPLITS:
    split_path = DATASET / split

    print(f"\n📁 {split.upper()}")

    if not split_path.exists():
        print(f"❌ Missing folder: dataset/{split}")
        all_ok = False
        continue

    for class_name in CLASSES:
        class_path = split_path / class_name

        if not class_path.exists():
            print(f"❌ Missing: {split}/{class_name}")
            all_ok = False
            continue

        images = [
            file for file in class_path.iterdir()
            if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS
        ]

        if len(images) == 0:
            print(f"❌ {split}/{class_name}: 0 images")
            all_ok = False
        else:
            print(f"✅ {split}/{class_name}: {len(images)} images")

print("\n" + "=" * 60)

if all_ok:
    print("🎉 DATASET STRUCTURE IS READY!")
    print("All 3 splits and all 6 classes contain images.")
else:
    print("⚠️ DATASET NEEDS FIXING.")
    print("Check the ❌ items above.")

print("=" * 60)