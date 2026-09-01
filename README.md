# ♻️ PolySort AI

### Intelligent Plastic Identification & Smart Sorting System

PolySort AI is an AI-powered plastic waste identification and intelligent sorting prototype designed to help improve plastic waste segregation and recycling decisions.

The system uses **Computer Vision + AI + Material Knowledge** to identify plastic materials, estimate prediction confidence, and recommend an appropriate sorting or recycling pathway.

---

## 🚀 Project Overview

Plastic waste is often mixed together, making manual segregation slow, expensive, and error-prone.

PolySort AI aims to make this process smarter by analyzing an image of plastic waste and providing:

* 🔍 Plastic material identification
* 🎯 AI prediction confidence
* ♻️ Recycling recommendation
* 🤖 Automatic sorting decision
* 👤 Human verification for uncertain predictions
* 📊 Sorting and material analytics
* 📚 Plastic material knowledge base
* 📷 Image-based waste analysis
* ⚙️ Configurable confidence threshold

The project is designed as a **hackathon prototype** demonstrating how AI can support intelligent waste-management workflows.

---

# ✨ Key Features

## 1. AI Plastic Identification

Upload an image of plastic waste and the system analyzes the sample to identify its likely material.

Supported material categories include:

| Material | Resin Code | Full Name                  |
| -------- | ---------: | -------------------------- |
| PET      |         #1 | Polyethylene Terephthalate |
| HDPE     |         #2 | High-Density Polyethylene  |
| PVC      |         #3 | Polyvinyl Chloride         |
| LDPE     |         #4 | Low-Density Polyethylene   |
| PP       |         #5 | Polypropylene              |
| PS       |         #6 | Polystyrene                |

---

## 2. Confidence-Based Decision Engine

PolySort AI does not blindly trust every prediction.

The prediction confidence is used to determine the next action.

### High Confidence

**Automatic Sorting**

When the AI confidence is sufficiently high, the sample can be sent toward an automatic sorting pathway.

### Medium Confidence

**Human Verification**

Samples with uncertain predictions can be flagged for manual verification.

### Low Confidence

**Additional Review**

Low-confidence or unknown samples can be isolated instead of being incorrectly sorted.

This approach helps reduce incorrect automated decisions.

---

# 🧠 AI Pipeline

PolySort AI follows a simple decision pipeline:

```text
Plastic Image
     ↓
Image Processing
     ↓
Computer Vision Model
     ↓
Material Detection
     ↓
Confidence Evaluation
     ↓
Material Knowledge Base
     ↓
Sorting Decision
     ↓
Recycling Recommendation
```

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      User           │
                    │  Uploads Image      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Frontend        │
                    │ HTML + CSS + JS     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Backend  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Computer Vision    │
                    │      Model          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Confidence Engine   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Material Knowledge  │
                    │       Base          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Sorting & Recycling  │
                    │    Recommendation   │
                    └─────────────────────┘
```

---

# 📁 Project Structure

```text
PolySort-AI/
│
├── backend/
│   │
│   ├── main.py
│   │
│   ├── model/
│   │   └── trained_model/
│   │
│   ├── services/
│   │   ├── prediction.py
│   │   ├── confidence.py
│   │   └── recommendation.py
│   │
│   ├── knowledge_base/
│   │   └── materials.json
│   │
│   └── uploads/
│
├── frontend/
│   │
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── dataset/
│   │
│   ├── train/
│   ├── val/
│   └── test/
│
├── requirements.txt
│
└── README.md
```

---

# 🖥️ Frontend

The PolySort AI frontend provides a modern dashboard for interacting with the AI system.

### Technologies

* HTML5
* CSS3
* JavaScript
* Responsive UI
* Drag & Drop Upload
* Interactive Dashboard
* Modal Components
* Toast Notifications

### Main Dashboard Sections

The interface contains:

* Dashboard
* Analyze Waste
* Sorting Center
* Materials
* Analytics
* How It Works
* Settings

---

# ⚙️ Backend

The backend is designed using **FastAPI**.

It handles:

* Image uploads
* AI inference
* Prediction processing
* Confidence calculation
* Material classification
* Recycling recommendations
* API responses

Example backend flow:

```text
POST /analyze
      ↓
Receive Image
      ↓
Validate Image
      ↓
Run AI Model
      ↓
Calculate Confidence
      ↓
Identify Material
      ↓
Generate Recommendation
      ↓
Return JSON Response
```

---

# 🤖 AI Model

The project architecture is designed to support an object-detection or image-classification model such as **YOLO**.

The model can be trained using plastic waste images categorized into different material classes.

Example classes:

```text
PET
HDPE
PVC
LDPE
PP
PS
```

The trained model can then be placed inside:

```text
backend/model/
```

---

# 📚 Material Knowledge Base

PolySort AI uses material information to convert an AI prediction into a meaningful recommendation.

Example:

```json
{
    "PET": {
        "polymer": "Polyethylene Terephthalate",
        "resin_code": 1,
        "family": "Thermoplastic",
        "recycling": "Widely recyclable"
    },
    "HDPE": {
        "polymer": "High-Density Polyethylene",
        "resin_code": 2,
        "family": "Thermoplastic",
        "recycling": "Widely recyclable"
    }
}
```

The knowledge base can be expanded with additional materials and recycling information.

---

# 🎯 Confidence Threshold

The prototype uses a configurable confidence threshold for automated decisions.

Example:

```text
Confidence >= 80%
        ↓
    AUTO SORT
```

```text
50% - 79%
        ↓
 HUMAN VERIFICATION
```

```text
Confidence < 50%
        ↓
 ADDITIONAL REVIEW
```

These values can be adjusted depending on model performance and real-world requirements.

---

# 📊 Analytics

The dashboard provides an analytics layer for monitoring:

* Total analyzed objects
* Average AI confidence
* Automatically sortable objects
* Human-review cases
* Material distribution
* Sorting efficiency
* Verification percentage

This can later be connected to real backend/database data.

---

# ♻️ Smart Sorting Center

The Sorting Center demonstrates how AI predictions can be converted into physical sorting decisions.

Example:

```text
PET  → PET Sorting Stream
HDPE → HDPE Sorting Stream
PP   → PP Sorting Stream
Unknown / Low Confidence → Human Review
```

The current interface includes a simulation mode for demonstrating this workflow.

---

# 📷 Image Analysis Workflow

### Step 1 — Upload

The user uploads a plastic waste image.

Supported formats:

```text
JPG
PNG
WEBP
```

Maximum recommended upload size:

```text
10 MB
```

### Step 2 — AI Detection

The backend processes the image using the computer vision model.

### Step 3 — Confidence Evaluation

The system calculates how confident the prediction is.

### Step 4 — Material Lookup

The detected material is matched against the knowledge base.

### Step 5 — Decision

The system generates:

* Material classification
* Confidence score
* Sorting decision
* Recycling recommendation

---

# 🛠️ Installation

## 1. Clone the Repository

```bash
git clone <your-github-repository-url>
```

Move into the project directory:

```bash
cd PolySort-AI
```

---

## 2. Create Virtual Environment

Windows:

```bash
python -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` is not available yet:

```bash
pip install fastapi uvicorn python-multipart pillow
```

Additional AI dependencies can be installed depending on the selected model.

---

# ▶️ Running the Backend

Navigate to the backend folder:

```bash
cd backend
```

Run the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🌐 Running the Frontend

Open the `frontend` folder and run:

```text
index.html
```

For the best development experience, use a local development server such as VS Code Live Server.

The frontend JavaScript can communicate with the FastAPI backend through the configured API endpoint.

---

# 🔌 API Example

Example request:

```http
POST /analyze
Content-Type: multipart/form-data
```

Example response:

```json
{
    "material": "PET",
    "confidence": 94,
    "polymer": "Polyethylene Terephthalate",
    "resin_code": 1,
    "family": "Thermoplastic",
    "decision": "AUTO SORT",
    "recommendation": "Suitable for recycling stream"
}
```

---

# 🔐 Safety & Reliability

PolySort AI is designed around a confidence-aware workflow.

The system should avoid automatically sorting uncertain predictions.

```text
HIGH CONFIDENCE
       ↓
Automatic Sorting

MEDIUM CONFIDENCE
       ↓
Human Verification

LOW CONFIDENCE
       ↓
Manual Review
```

This human-in-the-loop approach can help reduce the risk of incorrect material segregation.

---

# 🌍 Real-World Applications

PolySort AI can potentially be adapted for:

* ♻️ Recycling facilities
* 🏭 Waste-processing plants
* 🏙️ Smart-city waste management
* 🗑️ Municipal waste segregation
* 📦 Packaging recovery
* 🏫 Educational sustainability projects
* 🤖 Automated sorting systems
* 🌱 Environmental monitoring

---

# 🔮 Future Scope

Future versions can include:

### AI Improvements

* Custom-trained YOLO model
* Object detection for multiple plastics in one image
* Better dataset diversity
* Model accuracy tracking
* Continuous model improvement

### Hardware Integration

* Conveyor belt integration
* Industrial cameras
* Robotic sorting arms
* Sensors
* Edge AI devices

### Smart Automation

* Real-time camera detection
* Automatic conveyor routing
* PLC integration
* Robotic pick-and-place
* Live sorting statistics

### Advanced Analytics

* Historical analysis
* Material trends
* Recycling volume estimation
* Facility performance monitoring
* AI accuracy dashboard

### Cloud Integration

* Cloud-based model inference
* Centralized analytics
* Multi-facility monitoring
* Remote system management

---

# 🎯 Hackathon Value Proposition

PolySort AI focuses on a practical environmental problem:

> **How can AI help identify plastic waste and make smarter sorting decisions?**

Instead of only classifying an image, the system connects:

```text
Computer Vision
       +
Confidence Intelligence
       +
Material Knowledge
       +
Sorting Decision
       +
Recycling Guidance
```

This creates a complete intelligent decision-support pipeline rather than a standalone image classifier.

---

# 📈 Expected Impact

PolySort AI aims to contribute toward:

* Better plastic segregation
* Reduced contamination in recycling streams
* Faster waste processing
* Reduced manual sorting workload
* Improved recycling efficiency
* Data-driven waste management
* Smarter automated sorting

---

# 🧪 Current Prototype Status

| Component             | Status               |
| --------------------- | -------------------- |
| Dashboard UI          | ✅ Implemented        |
| Plastic Upload        | ✅ Implemented        |
| Analysis Interface    | ✅ Implemented        |
| Sorting Center UI     | ✅ Implemented        |
| Material Knowledge UI | ✅ Implemented        |
| Analytics UI          | ✅ Implemented        |
| Settings UI           | ✅ Implemented        |
| Responsive Design     | ✅ Implemented        |
| FastAPI Backend       | 🔄 In Development    |
| AI Model              | 🔄 Integration Stage |
| Real-time Camera      | 🔄 Planned           |
| Hardware Sorting      | 🔮 Future Scope      |

---

# 👩‍💻 Team / Project

**Project:** PolySort AI
**Domain:** Artificial Intelligence + Computer Vision + Waste Management
**Category:** Intelligent Plastic Sorting
**Type:** Hackathon Prototype

---

# 📜 License

This project is developed as an educational and hackathon prototype.

The project can be extended for research, experimentation and further development.

---

## ♻️ PolySort AI

### **See Plastic. Understand Material. Sort Smarter.**

> Building intelligent technology for a cleaner and more sustainable future.
