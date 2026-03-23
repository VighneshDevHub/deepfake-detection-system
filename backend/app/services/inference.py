# backend/app/services/inference.py

import numpy as np
import onnxruntime as ort
from pathlib import Path

from app.core.exceptions import ModelNotLoadedError
from app.core.logging import get_logger

logger  = get_logger(__name__)
CLASSES = ["real", "fake"]


class InferenceService:
    """
    Wraps the ONNX model.
    Loaded once at app startup via lifespan — not per request.
    """

    def __init__(self):
        self._session: ort.InferenceSession | None = None

    def load(self, model_path: str) -> None:
        path = Path(model_path)
        if not path.exists():
            raise FileNotFoundError(f"ONNX model not found: {path}")

        self._session = ort.InferenceSession(
            str(path),
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
        )
        input_name = self._session.get_inputs()[0].name
        logger.info(f"Model loaded from {path} | input: {input_name}")

    @property
    def is_loaded(self) -> bool:
        return self._session is not None

    def predict(self, image_array: np.ndarray) -> dict:
        """
        Args:
            image_array: (1, 3, 224, 224) float32 numpy array

        Returns:
            dict with label, confidence, is_fake, real_prob, fake_prob
        """
        if not self.is_loaded:
            raise ModelNotLoadedError("Model session is not initialized")

        input_name = self._session.get_inputs()[0].name
        outputs    = self._session.run(None, {input_name: image_array})
        logits     = outputs[0][0]          # shape (2,)

        # Softmax
        exp      = np.exp(logits - np.max(logits))
        probs    = exp / exp.sum()

        fake_prob  = float(probs[1])
        real_prob  = float(probs[0])
        is_fake    = fake_prob > 0.5
        pred_class = 1 if is_fake else 0
        confidence = round((fake_prob if is_fake else real_prob) * 100, 2)

        logger.debug(
            f"Prediction: {CLASSES[pred_class]} "
            f"({confidence:.1f}%)"
        )

        return {
            "label"     : CLASSES[pred_class].upper(),
            "confidence": confidence,
            "is_fake"   : is_fake,
            "real_prob" : round(real_prob * 100, 2),
            "fake_prob" : round(fake_prob * 100, 2),
        }


# Single instance — shared across all requests
inference_service = InferenceService()