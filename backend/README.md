# DeepFakeDetect: Forensic Backend Engine

The backend for DeepFakeDetect is a high-performance FastAPI service designed for real-time media forensics. It integrates face extraction and ONNX-optimized model inference.

## ⚙️ Core Components

- **FastAPI Gateway**: Asynchronous REST API with automatic documentation.
- **MTCNN Face Detector**: Reliable face localization and alignment for forensic analysis.
- **ONNX Runtime Engine**: Hardware-accelerated inference for the EfficientNet-B4 backbone.
- **Grad-CAM Explainer**: Real-time generation of base64-encoded activation heatmaps.
- **Video Temporal Service**: Evenly spaced frame extraction and multi-frame analysis.

## 🚀 API Endpoints

| Method | Endpoint               | Description                                           |
| ------ | ---------------------- | ----------------------------------------------------- |
| `GET`  | `/`                    | Root — service and version information                |
| `GET`  | `/api/v1/health`       | Health Check — verifies model loading status          |
| `POST` | `/api/v1/detect/image` | Image Scan — returns verdict, confidence, and heatmap |
| `POST` | `/api/v1/detect/video` | Video Scan — returns verdict and per-frame breakdown  |

## 🛠️ Environment Variables

Configure these in `backend/.env`:

```env
APP_NAME="DeepFakeDetect"
DEBUG=True
MAX_FILE_SIZE_BYTES=52428800 # 50MB
MODEL_PATH="app/models/best_model.onnx"
GRADCAM_MODEL_PATH="app/models/best_model.pth"
```

## 📦 Setup & Execution

1.  **Installation**:

    ```bash
    pip install -r requirements.txt
    ```

2.  **Execution**:

    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```

3.  **Documentation**:
    Navigate to `http://localhost:8000/docs` to view the interactive API playground.

## ⚖️ Forensic Disclaimer

This backend provides high-confidence forensic data but is not infallible. Results should be cross-verified using other investigative techniques.
