<div align="center">

# DFFS Backend
### Forensic Inference Engine — FastAPI

[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-1.18-005CED?style=for-the-badge&logo=onnx&logoColor=white)](https://onnxruntime.ai)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-SQLAlchemy-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

</div>

---

## Overview

The DFFS Backend is a FastAPI service that powers the deepfake detection pipeline. It handles image and video analysis using an EfficientNet-B4 ONNX model, generates Grad-CAM explainability heatmaps via a PyTorch checkpoint, detects and crops faces with OpenCV, and persists detection history to PostgreSQL. The entire inference stack runs on CPU — no GPU required.

Interactive API docs are available at `http://localhost:8000/docs` once the server is running.

---

## Tech Stack

| Package | Version | Role |
|---------|---------|------|
| FastAPI | 0.135 | Async REST API framework |
| Uvicorn | 0.42 | ASGI server |
| ONNX Runtime | 1.18 | CPU-optimized model inference |
| PyTorch + timm | latest | Grad-CAM explainability |
| OpenCV (headless) | 4.9 | Face detection, image/video processing |
| SQLAlchemy | 2.0 | ORM for PostgreSQL |
| Alembic | 1.13 | Database migrations |
| Passlib + bcrypt | 1.7 | Password hashing |
| python-jose | 3.3 | JWT creation and verification |
| HuggingFace Hub | 1.8 | Automatic model download on startup |
| Pydantic | 2.12 | Request/response validation and settings |

---

## Project Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── exceptions.py       # Custom exception classes + FastAPI handlers
│   │   ├── logging.py          # Structured logging setup
│   │   ├── security.py         # JWT creation, token decode, password hashing
│   │   └── __init__.py
│   ├── db_models/
│   │   ├── user.py             # User SQLAlchemy model
│   │   ├── detection_history.py # DetectionHistory SQLAlchemy model
│   │   └── __init__.py
│   ├── routers/
│   │   ├── detection.py        # POST /detect/image
│   │   ├── video.py            # POST /detect/video
│   │   ├── auth.py             # POST /auth/register, /login, GET /me
│   │   ├── history.py          # GET /history, /history/stats, DELETE /history/{id}
│   │   └── health.py           # GET /health
│   ├── schemas/
│   │   ├── auth.py             # UserRegister, UserLogin, Token, UserOut
│   │   ├── detection.py        # DetectionResponse
│   │   └── video.py            # VideoDetectionResponse, FrameResult
│   ├── services/
│   │   ├── inference.py        # ONNX Runtime wrapper (InferenceService)
│   │   ├── gradcam.py          # Grad-CAM heatmap generator (GradCAMService)
│   │   ├── face_detector.py    # OpenCV Haar Cascade face detector
│   │   ├── video_service.py    # Frame extraction + aggregation (VideoService)
│   │   ├── image_utils.py      # validate_image(), preprocess_image()
│   │   └── auth_service.py     # User CRUD, JWT auth, Supabase JIT provisioning
│   ├── config.py               # Pydantic Settings (env-driven)
│   ├── database.py             # SQLAlchemy engine + session factory
│   ├── dependencies.py         # FastAPI dependency injection providers
│   └── main.py                 # App factory, lifespan, CORS, exception handlers
├── models/                     # ML model files (auto-downloaded)
│   ├── deepfake_detector.onnx  # Primary inference model
│   └── best_model.pth          # Grad-CAM PyTorch checkpoint
├── scripts/
│   └── download_models.py      # Downloads models from HuggingFace Hub
├── tests/
│   ├── conftest.py             # pytest fixtures
│   ├── test_detection.py       # Image detection endpoint tests
│   ├── test_inference.py       # ONNX inference service tests
│   └── test_gradcam_decode.py  # Grad-CAM output tests
├── Dockerfile
└── requirements.txt
```

---

## API Reference

Base URL: `/api/v1`

### Detection

**`POST /detect/image`**

Analyzes an image for deepfake signatures.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | `multipart/form-data` | Yes | JPEG / PNG / WebP, max 10MB |
| `threshold` | `float` query param | No | Fake probability cutoff, 0.1–0.9, default 0.5 |

```json
// Response 200
{
  "filename": "photo.jpg",
  "label": "FAKE",
  "confidence": 0.94,
  "is_fake": true,
  "real_prob": 0.06,
  "fake_prob": 0.94,
  "threshold_used": 0.5,
  "face_detected": true,
  "face_confidence": 0.98,
  "face_warning": null,
  "gradcam_image": "<base64-png>",
  "top_regions": [
    { "region": "left_eye", "intensity": 0.87 }
  ],
  "model_version": "efficientnet-b4-v1",
  "processing_time_ms": 87.4
}
```

**`POST /detect/video`**

Performs temporal analysis on a video file.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | `multipart/form-data` | Yes | MP4/AVI/MOV/MKV/WebM, max 50MB |
| `threshold` | `float` query param | No | Per-frame fake probability cutoff, default 0.5 |

```json
// Response 200
{
  "filename": "clip.mp4",
  "label": "FAKE",
  "confidence": 0.89,
  "is_fake": true,
  "fake_frame_count": 13,
  "real_frame_count": 3,
  "total_frames_analyzed": 16,
  "fake_frame_ratio": 0.8125,
  "threshold_used": 0.5,
  "frame_results": [
    {
      "frame_number": 0,
      "timestamp_sec": 0.0,
      "label": "FAKE",
      "confidence": 0.91,
      "is_fake": true,
      "fake_prob": 0.91,
      "real_prob": 0.09,
      "face_detected": true
    }
  ],
  "warning": null
}
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | None | Create account, returns JWT |
| `POST` | `/auth/login` | None | Email + password login, returns JWT |
| `GET`  | `/auth/me` | Bearer | Get current user profile |
| `POST` | `/auth/logout` | None | Client-side token deletion instruction |

### History

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`    | `/history` | Bearer | Paginated detection history. Query: `page`, `per_page`, `label` |
| `GET`    | `/history/stats` | Bearer | Aggregate stats: total, fake %, image/video counts |
| `DELETE` | `/history/{id}` | Bearer | Delete a specific detection record |

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | None | Service status, model load state, version |

---

## ML Services

### InferenceService (`services/inference.py`)

Wraps the ONNX Runtime session. Loaded once at startup via FastAPI's `lifespan` context — not per request.

```python
# Preprocessing pipeline
mean = [0.485, 0.456, 0.406]   # ImageNet normalization
std  = [0.229, 0.224, 0.225]
# Input shape: (1, 3, 224, 224) float32

# Output
{
  "label": "FAKE",
  "confidence": 0.94,       # probability of the winning class
  "is_fake": True,
  "real_prob": 0.06,
  "fake_prob": 0.94,
  "threshold_used": 0.5
}
```

Threshold is clamped to `[0.1, 0.9]`. A lower threshold makes the model more sensitive to fakes.

### GradCAMService (`services/gradcam.py`)

Loads the PyTorch `.pth` checkpoint separately from the ONNX model because Grad-CAM requires full gradient access. Uses the same EfficientNet-B4 architecture:

```
EfficientNet-B4 backbone (pretrained=False, global_pool=avg)
  └── Dropout(0.3)
  └── Linear(num_features → 256)
  └── ReLU
  └── Dropout(0.2)
  └── Linear(256 → 2)
```

Hooks are registered on the last convolutional block to capture activations and gradients. The resulting heatmap is upsampled, colorized with `cv2.COLORMAP_JET`, blended with the input image, and returned as a base64-encoded PNG.

### FaceDetectorService (`services/face_detector.py`)

Uses OpenCV's Haar Cascade (`haarcascade_frontalface_default.xml`) — always available with `cv2`, no extra downloads needed.

- Detects the largest face in the image
- Adds 20% padding around the bounding box
- Resizes the crop to 224×224
- Falls back to the full image if no face is detected
- Returns a `FaceDetectionResult` dataclass with `face_image`, `bbox`, `confidence`, and `warning`

### VideoService (`services/video_service.py`)

Orchestrates frame extraction and per-frame inference.

```
1. Validate extension (.mp4/.avi/.mov/.mkv/.webm) and size (≤ 50MB)
2. Write bytes to a temp file (OpenCV needs a file path)
3. Extract up to 16 evenly-spaced frames using np.linspace over total frame count
4. For each frame: FaceDetector → InferenceService → FrameResult
5. Majority vote: video is FAKE if ≥ 50% of frames are fake
6. Confidence = average fake_prob (or real_prob) across all frames
7. Clean up temp file
```

---

## Authentication

The backend supports two JWT verification strategies, tried in order:

1. **Supabase JWT** — if `SUPABASE_JWT_SECRET` is set, tokens issued by Supabase are verified using HS256. On first login, a local `User` row is created automatically (JIT provisioning) using the email from the token's `email` claim.

2. **Custom JWT** — tokens issued by `/auth/login` are HS256-signed with `SECRET_KEY`. Passwords are hashed with bcrypt via Passlib.

Detection endpoints use `get_optional_user` — they work without authentication, but history is only saved when a valid token is present.

---

## Database Schema

```sql
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE detection_history (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER REFERENCES users(id),
    filename       VARCHAR(255),
    media_type     VARCHAR(20),          -- 'image' | 'video'
    label          VARCHAR(10),          -- 'REAL' | 'FAKE'
    confidence     FLOAT,
    is_fake        BOOLEAN,
    real_prob      FLOAT,
    fake_prob      FLOAT,
    threshold_used FLOAT DEFAULT 0.5,
    face_detected  BOOLEAN DEFAULT FALSE,
    model_version  VARCHAR(50) DEFAULT 'efficientnet-b4-v1',
    created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, SECRET_KEY at minimum
```

```env
# .env
APP_NAME=Deepfake Detection API
DEBUG=False
MODEL_PATH=models/deepfake_detector.onnx
GRADCAM_MODEL_PATH=models/best_model.pth
MAX_FILE_SIZE_MB=10
ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/dffs
SECRET_KEY=your-secret-key-here
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
```

```bash
# Download ML models from HuggingFace Hub
python scripts/download_models.py

# Run development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Docker

```bash
# Build
docker build -t dffs-backend .

# Run
docker run -d \
  -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e SECRET_KEY="your-secret" \
  --name dffs-backend \
  dffs-backend
```

The container runs `scripts/download_models.py` automatically before starting Uvicorn, so models are always present on first boot.

---

## Running Tests

```bash
cd backend
pytest tests/ -v
```

| Test File | Coverage |
|-----------|----------|
| `test_detection.py` | Image detection endpoint, file validation |
| `test_inference.py` | ONNX session loading, predict() output shape |
| `test_gradcam_decode.py` | Grad-CAM base64 output, heatmap dimensions |

---

## Startup Sequence

The `lifespan` context manager in `main.py` runs this sequence on every startup:

```
1. Setup structured logging
2. Load ONNX model (InferenceService)        ← detection unavailable if this fails
3. Load PyTorch Grad-CAM model               ← heatmaps disabled if this fails
4. Load OpenCV face detector                 ← falls back to full image if this fails
5. Create database tables (SQLAlchemy)
6. Register routers: detection, video, auth, history, health
7. Start accepting requests
```

---

<div align="center">

DFFS — DeepFake Forensic System · Backend Module

<br/>

Developed by [Vighnesh Salunkhe](https://github.com/vighneshsalunkhe)

</div>
