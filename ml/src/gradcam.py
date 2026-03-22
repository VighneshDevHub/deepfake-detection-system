# ml/src/gradcam.py

import sys
import cv2
import numpy as np
import torch
import torch.nn.functional as F
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from pathlib import Path
from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from model import build_model
from transforms import get_val_transform

BASE      = Path(__file__).resolve().parent.parent
CKPT_PATH = BASE / "checkpoints" / "best_model.pth"
OUT_DIR   = BASE / "output" / "gradcam"
OUT_DIR.mkdir(parents=True, exist_ok=True)

DEVICE  = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CLASSES = ["real", "fake"]


# ── Grad-CAM core ──────────────────────────────────────────────────────────
class GradCAM:
    """
    Computes Grad-CAM heatmap for EfficientNet-B4.
    Hooks into the last conv block of the backbone.
    """

    def __init__(self, model: torch.nn.Module):
        self.model      = model
        self.gradients  = None
        self.activations = None

        # Target layer — last conv block of EfficientNet-B4
        target_layer = model.backbone.blocks[-1]

        # Register forward + backward hooks
        target_layer.register_forward_hook(self._save_activation)
        target_layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module, input, output):
        self.activations = output.detach()

    def _save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def compute(self, image_tensor: torch.Tensor, class_idx: int = None):
        """
        Args:
            image_tensor : (1, 3, 224, 224) normalized tensor on DEVICE
            class_idx    : 0=real, 1=fake. If None uses predicted class.

        Returns:
            heatmap : (224, 224) numpy array, values 0-1
            pred_class : predicted class index
            confidence : confidence % of predicted class
        """
        self.model.eval()
        image_tensor = image_tensor.requires_grad_(True)

        # Forward pass
        logits = self.model(image_tensor)           # (1, 2)
        probs  = torch.softmax(logits, dim=1)

        pred_class = logits.argmax(dim=1).item()
        confidence = probs[0][pred_class].item() * 100

        # Use predicted class if not specified
        if class_idx is None:
            class_idx = pred_class

        # Backward pass for target class
        self.model.zero_grad()
        logits[0, class_idx].backward()

        # Grad-CAM computation
        # Global average pool the gradients
        weights = self.gradients.mean(dim=(2, 3), keepdim=True)  # (1, C, 1, 1)

        # Weighted sum of activation maps
        cam = (weights * self.activations).sum(dim=1, keepdim=True)  # (1, 1, H, W)
        cam = F.relu(cam)                                              # keep positives

        # Resize to input size
        cam = F.interpolate(
            cam, size=(224, 224),
            mode="bilinear", align_corners=False
        )

        # Normalize to [0, 1]
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

        return cam, pred_class, confidence


# ── Visualization helpers ──────────────────────────────────────────────────
def overlay_heatmap(image_np: np.ndarray, heatmap: np.ndarray, alpha: float = 0.45):
    """
    Overlays Grad-CAM heatmap on original image.

    Args:
        image_np : (H, W, 3) uint8 RGB image
        heatmap  : (H, W) float array 0-1
        alpha    : heatmap opacity

    Returns:
        overlaid : (H, W, 3) uint8 RGB image
    """
    # Convert heatmap to colormap (jet)
    heatmap_uint8 = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_rgb   = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

    # Resize to match image
    heatmap_rgb = cv2.resize(heatmap_rgb, (image_np.shape[1], image_np.shape[0]))

    # Blend
    overlaid = cv2.addWeighted(image_np, 1 - alpha, heatmap_rgb, alpha, 0)
    return overlaid


def load_image(image_path: str):
    """
    Loads image, returns:
        image_np    : (H, W, 3) uint8 for display
        image_tensor: (1, 3, 224, 224) normalized for model
    """
    transform = get_val_transform()

    image_np = cv2.imread(image_path)
    image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
    image_np = cv2.resize(image_np, (224, 224))

    augmented     = transform(image=image_np)
    image_tensor  = augmented["image"].unsqueeze(0).to(DEVICE)

    return image_np, image_tensor


# ── Single image ───────────────────────────────────────────────────────────
def explain_single(image_path: str, gradcam: GradCAM, save: bool = True):
    """
    Generates Grad-CAM for one image.
    Shows: original | heatmap | overlay
    """
    image_np, image_tensor = load_image(image_path)
    heatmap, pred_class, confidence = gradcam.compute(image_tensor)
    overlay = overlay_heatmap(image_np, heatmap)

    label = CLASSES[pred_class]
    color = "red" if pred_class == 1 else "green"

    fig, axes = plt.subplots(1, 3, figsize=(12, 4))
    fig.suptitle(
        f"Grad-CAM — Predicted: {label.upper()}  ({confidence:.1f}% confidence)",
        fontsize=13, color=color, fontweight="bold"
    )

    axes[0].imshow(image_np)
    axes[0].set_title("Original")
    axes[0].axis("off")

    axes[1].imshow(heatmap, cmap="jet")
    axes[1].set_title("Heatmap")
    axes[1].axis("off")

    axes[2].imshow(overlay)
    axes[2].set_title("Overlay")
    axes[2].axis("off")

    plt.tight_layout()

    if save:
        name = Path(image_path).stem
        path = OUT_DIR / f"gradcam_{name}.png"
        plt.savefig(path, dpi=150, bbox_inches="tight")
        print(f"Saved → {path}")

    plt.show()
    return heatmap, pred_class, confidence


# ── Batch grid ─────────────────────────────────────────────────────────────
def explain_batch(image_paths: list, gradcam: GradCAM, save: bool = True):
    """
    Generates Grad-CAM grid for multiple images.
    Each row: original | overlay | label
    """
    n    = len(image_paths)
    fig  = plt.figure(figsize=(10, 4 * n))
    gs   = gridspec.GridSpec(n, 3, figure=fig)
    fig.suptitle("Grad-CAM — Batch Explanation", fontsize=14, fontweight="bold")

    for i, img_path in enumerate(image_paths):
        image_np, image_tensor = load_image(img_path)
        heatmap, pred_class, conf = gradcam.compute(image_tensor)
        overlay = overlay_heatmap(image_np, heatmap)

        label = CLASSES[pred_class]
        color = "red" if pred_class == 1 else "green"

        ax0 = fig.add_subplot(gs[i, 0])
        ax1 = fig.add_subplot(gs[i, 1])
        ax2 = fig.add_subplot(gs[i, 2])

        ax0.imshow(image_np);  ax0.axis("off"); ax0.set_title("Original")
        ax1.imshow(overlay);   ax1.axis("off"); ax1.set_title("Grad-CAM overlay")
        ax2.imshow(heatmap, cmap="jet"); ax2.axis("off"); ax2.set_title("Heatmap")

        ax0.set_ylabel(
            f"{label.upper()}\n{conf:.1f}%",
            fontsize=11, color=color, rotation=0,
            labelpad=60, va="center"
        )

    plt.tight_layout()

    if save:
        path = OUT_DIR / "gradcam_batch.png"
        plt.savefig(path, dpi=150, bbox_inches="tight")
        print(f"Saved → {path}")

    plt.show()


# ── Entry point ────────────────────────────────────────────────────────────
def load_gradcam_model():
    model = build_model(pretrained=False).to(DEVICE)
    ckpt  = torch.load(CKPT_PATH, map_location=DEVICE)
    model.load_state_dict(ckpt["model_state"])
    model.eval()
    print(f"Loaded checkpoint — epoch {ckpt['epoch']} "
          f"val_acc {ckpt['val_acc']:.4f}")
    return GradCAM(model)


if __name__ == "__main__":
    import random, glob

    gradcam = load_gradcam_model()

    # Pick 2 real + 2 fake from val set
    real_imgs = random.sample(
        glob.glob(str(BASE / "data/split/val/real/*.jpg")), 2
    )
    fake_imgs = random.sample(
        glob.glob(str(BASE / "data/split/val/fake/*.jpg")), 2
    )

    # Single image demo
    print("\n--- Single image Grad-CAM ---")
    explain_single(fake_imgs[0], gradcam)

    # Batch grid demo
    print("\n--- Batch Grad-CAM ---")
    explain_batch(real_imgs + fake_imgs, gradcam)

    print(f"\nAll outputs saved to {OUT_DIR}")