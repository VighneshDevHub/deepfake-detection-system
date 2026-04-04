# ⚙️ DFFS Backend: Forensic Engine

The **DFFS Backend** is a high-performance FastAPI service designed for real-time media forensics. It serves as the bridge between the user interfaces (Dashboard & Chrome Extension) and the Deep Learning models.

## 🚀 Key Features

- **⚡ High-Performance Inference**: Optimized for speed using ONNX Runtime.
- **🖼️ Face Extraction**: Integrated MTCNN detector for precise face localization and alignment.
- **🎬 Video Processing**: Intelligent frame extraction and temporal consistency analysis.
- **🧠 Grad-CAM Support**: Generates visual heatmaps for explainable detection.
- **🛡️ Secure & Scalable**: Asynchronous request handling with automatic OpenAPI documentation.

## 🛠️ Tech Stack

- **Framework**: `FastAPI`
- **Inference**: `ONNX Runtime`
- **Computer Vision**: `OpenCV`, `MTCNN`
- **Deep Learning**: `PyTorch` (for Grad-CAM)
- **Language**: `Python 3.9+`

## 📖 API Documentation

Once the server is running, you can access the interactive documentation at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Primary Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/detect/image` | Analyze an image file for deepfake signatures. |
| `POST` | `/api/v1/detect/video` | Perform temporal analysis on a video file. |
| `GET` | `/api/v1/health` | Check the health of the service and model loading status. |

## 🚦 Installation & Usage

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Download Models
```bash
python scripts/download_models.py
```

### 3. Run the Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## 📂 Structure
- `app/core`: Configuration and logging.
- `app/routers`: API endpoint definitions.
- `app/services`: Business logic (Inference, Video Processing, Grad-CAM).
- `app/schemas`: Pydantic models for request/response validation.

---
<p align="center">🛡️ <b>DeepFake Forensic System</b> - Backend Module</p>
