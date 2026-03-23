# backend/tests/test_inference.py

import numpy as np
import pytest
from unittest.mock import MagicMock, patch
from app.services.inference import InferenceService
from app.core.exceptions import ModelNotLoadedError


def test_predict_before_load_raises():
    svc = InferenceService()
    with pytest.raises(ModelNotLoadedError):
        svc.predict(np.zeros((1, 3, 224, 224), dtype=np.float32))


def test_predict_fake_output():
    svc = InferenceService()

    mock_session       = MagicMock()
    # logits: high fake score
    mock_session.run.return_value = [np.array([[0.1, 2.5]])]
    mock_session.get_inputs.return_value = [MagicMock(name="input")]
    svc._session = mock_session

    result = svc.predict(np.zeros((1, 3, 224, 224), dtype=np.float32))

    assert result["is_fake"]   == True
    assert result["label"]     == "FAKE"
    assert result["confidence"] > 50


def test_predict_real_output():
    svc = InferenceService()

    mock_session       = MagicMock()
    # logits: high real score
    mock_session.run.return_value = [np.array([[2.5, 0.1]])]
    mock_session.get_inputs.return_value = [MagicMock(name="input")]
    svc._session = mock_session

    result = svc.predict(np.zeros((1, 3, 224, 224), dtype=np.float32))

    assert result["is_fake"]   == False
    assert result["label"]     == "REAL"
    assert result["confidence"] > 50


def test_is_loaded_false_before_load():
    svc = InferenceService()
    assert svc.is_loaded == False


def test_load_missing_file_raises():
    svc = InferenceService()
    with pytest.raises(FileNotFoundError):
        svc.load("nonexistent/model.onnx")