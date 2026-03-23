# backend/tests/test_detection.py

import io
import pytest
from PIL import Image


def make_jpeg(width=224, height=224) -> bytes:
    """Creates a valid in-memory JPEG for testing."""
    img    = Image.new("RGB", (width, height), color=(120, 80, 60))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue()


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "docs" in r.json()


def test_health(client):
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert "status"       in body
    assert "model_loaded" in body
    assert "version"      in body


def test_detect_success(client, mock_predict):
    r = client.post(
        "/api/v1/detect/image",
        files={"file": ("test.jpg", make_jpeg(), "image/jpeg")},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["label"]       in {"FAKE", "REAL"}
    assert 0 <= body["confidence"] <= 100
    assert isinstance(body["is_fake"],  bool)
    assert isinstance(body["real_prob"], float)
    assert isinstance(body["fake_prob"], float)
    assert body["filename"] == "test.jpg"


def test_detect_rejects_pdf(client):
    r = client.post(
        "/api/v1/detect/image",
        files={"file": ("doc.pdf", b"%PDF-fake", "application/pdf")},
    )
    assert r.status_code == 415
    assert "error" in r.json()


def test_detect_rejects_large_file(client):
    big = b"x" * (11 * 1024 * 1024)   # 11 MB — over 10MB limit
    r   = client.post(
        "/api/v1/detect/image",
        files={"file": ("big.jpg", big, "image/jpeg")},
    )
    assert r.status_code == 413
    assert "error" in r.json()


def test_detect_rejects_corrupt_image(client):
    r = client.post(
        "/api/v1/detect/image",
        files={"file": ("bad.jpg", b"not-an-image", "image/jpeg")},
    )
    assert r.status_code == 422
    assert "error" in r.json()