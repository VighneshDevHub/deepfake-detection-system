# backend/tests/conftest.py

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


@pytest.fixture
def client():
    with patch("app.services.inference.InferenceService.load"):
        from app.main import app
        with TestClient(app) as c:
            yield c


@pytest.fixture
def mock_predict():
    with patch("app.services.inference.inference_service.predict") as mock:
        mock.return_value = {
            "label"     : "FAKE",
            "confidence": 96.14,
            "is_fake"   : True,
            "real_prob" : 3.86,
            "fake_prob" : 96.14,
        }
        yield mock


@pytest.fixture
def mock_loaded():
    with patch(
        "app.services.inference.inference_service.is_loaded",
        new_callable=lambda: property(lambda self: True),
    ):
        yield