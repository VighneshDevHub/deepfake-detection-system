# backend/app/services/gradcam.py

import base64
import io
import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image

from app.core.logging import get_logger

logger = get_logger(__name__)


class GradCAMService:
    """
    Computes Grad-CAM heatmap using the PyTorch model.
    Separate from InferenceService because Grad-CAM needs
    the full PyTorch model with gradients — not the ONNX session.
    """

    def __init__(self):
        self._model      = None
        self._gradients  = None
        self._activations = None

    def load(self, model_path: str, device: str = "cpu") -> None:
        """
        Loads the PyTorch .pth checkpoint — separate from ONNX.
        Called once at startup alongside the ONNX model.
        """
        import timm
        import torch.nn as nn

        class DeepfakeDetector(nn.Module):
            def __init__(self):
                super().__init__()
                self.backbone = timm.create_model(
                    "efficientnet_b4",
                    pretrained=False,
                    num_classes=0,
                    global_pool="avg",
                )
                feat_dim = self.backbone.num_features
                self.head = nn.Sequential(
                    nn.Dropout(0.3),
                    nn.Linear(feat_dim, 256),
                    nn.ReLU(),
                    nn.Dropout(0.15),
                    nn.Linear(256, 2),
                )

            def forward(self, x):
                return self.head(self.backbone(x))

        self._device = torch.device(device)
        model        = DeepfakeDetector().to(self._device)
        ckpt         = torch.load(model_path, map_location=self._device)
        model.load_state_dict(ckpt["model_state"])
        model.eval()
        self._model = model

        # Hook into last conv block
        target = model.backbone.blocks[-1]
        target.register_forward_hook(self._save_activation)
        target.register_full_backward_hook(self._save_gradient)

        logger.info(f"Grad-CAM model loaded from {model_path}")

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def _save_activation(self, module, input, output):
        self._activations = output.detach()

    def _save_gradient(self, module, grad_input, grad_output):
        self._gradients = grad_output[0].detach()

    def _compute_heatmap(self, image_tensor: torch.Tensor) -> tuple:
        """
        Returns:
            heatmap     : (224, 224) float array 0-1
            pred_class  : 0=real, 1=fake
            confidence  : float %
        """
        image_tensor = image_tensor.to(self._device).requires_grad_(True)

        logits     = self._model(image_tensor)
        probs      = torch.softmax(logits, dim=1)
        pred_class = logits.argmax(dim=1).item()
        confidence = probs[0][pred_class].item() * 100

        self._model.zero_grad()
        logits[0, pred_class].backward()

        weights = self._gradients.mean(dim=(2, 3), keepdim=True)
        cam     = (weights * self._activations).sum(dim=1, keepdim=True)
        cam     = F.relu(cam)
        cam     = F.interpolate(cam, size=(224, 224),
                                mode="bilinear", align_corners=False)
        cam     = cam.squeeze().cpu().numpy()
        cam     = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

        return cam, pred_class, confidence

    def _preprocess(self, file_bytes: bytes) -> tuple:
        """Returns (image_np uint8, image_tensor float32)."""
        MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

        nparr    = np.frombuffer(file_bytes, np.uint8)
        img      = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img      = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img      = cv2.resize(img, (224, 224))
        image_np = img.copy()

        img_f    = img.astype(np.float32) / 255.0
        img_f    = (img_f - MEAN) / STD
        tensor   = torch.tensor(img_f).permute(2, 0, 1).unsqueeze(0)

        return image_np, tensor

    def _overlay(self, image_np: np.ndarray,
                 heatmap: np.ndarray, alpha: float = 0.45) -> np.ndarray:
        hm_uint8 = np.uint8(255 * heatmap)
        hm_color = cv2.applyColorMap(hm_uint8, cv2.COLORMAP_JET)
        hm_rgb   = cv2.cvtColor(hm_color, cv2.COLOR_BGR2RGB)
        hm_rgb   = cv2.resize(hm_rgb, (image_np.shape[1], image_np.shape[0]))
        return cv2.addWeighted(image_np, 1 - alpha, hm_rgb, alpha, 0)

    def _to_base64(self, image_np: np.ndarray) -> str:
        """Converts numpy RGB image to base64 PNG string."""
        pil_img = Image.fromarray(image_np.astype(np.uint8))
        buffer  = io.BytesIO()
        pil_img.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _top_regions(self, heatmap: np.ndarray, n: int = 3) -> list[dict]:
        """
        Returns top N activation regions with their
        position and relative intensity.
        """
        h, w    = heatmap.shape
        regions = []

        # Divide into 3x3 grid, find top activated cells
        cell_h, cell_w = h // 3, w // 3
        grid_labels = [
            ["top-left",    "top-center",    "top-right"],
            ["middle-left", "face-center",   "middle-right"],
            ["bottom-left", "bottom-center", "bottom-right"],
        ]

        for row in range(3):
            for col in range(3):
                cell = heatmap[
                    row * cell_h:(row + 1) * cell_h,
                    col * cell_w:(col + 1) * cell_w,
                ]
                regions.append({
                    "region"   : grid_labels[row][col],
                    "intensity": round(float(cell.mean()), 4),
                })

        # Return top N by intensity
        regions.sort(key=lambda x: x["intensity"], reverse=True)
        return regions[:n]

    def explain(self, file_bytes: bytes) -> dict:
        """
        Main entry point called by the router.

        Returns:
            gradcam_image : base64 PNG of overlay
            heatmap_image : base64 PNG of raw heatmap
            top_regions   : list of most activated face regions
        """
        if not self.is_loaded:
            logger.warning("Grad-CAM model not loaded — skipping explanation")
            return {}

        image_np, tensor = self._preprocess(file_bytes)
        heatmap, _, _    = self._compute_heatmap(tensor)
        overlay          = self._overlay(image_np, heatmap)

        # Heatmap as colored image
        hm_colored = cv2.applyColorMap(
            np.uint8(255 * heatmap), cv2.COLORMAP_JET
        )
        hm_colored = cv2.cvtColor(hm_colored, cv2.COLOR_BGR2RGB)

        return {
            "gradcam_image": self._to_base64(overlay),
            "heatmap_image": self._to_base64(hm_colored),
            "top_regions"  : self._top_regions(heatmap),
        }


# Single instance — loaded once at startup
gradcam_service = GradCAMService()