# ml/src/evaluate.py

import sys
from pathlib import Path

import torch
import torch.nn as nn
import numpy as np
from torch.utils.data import DataLoader
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    roc_auc_score,
    roc_curve,
)
import matplotlib.pyplot as plt
import seaborn as sns

sys.path.insert(0, str(Path(__file__).parent))

from dataset import DeepfakeDataset
from transforms import get_val_transform
from model import build_model

BASE      = Path(__file__).resolve().parent.parent
SPLIT_DIR = BASE / "data"  / "split"
CKPT_PATH = BASE / "checkpoints" / "best_model.pth"
OUT_DIR   = BASE / "output"
OUT_DIR.mkdir(exist_ok=True)

DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BATCH_SIZE = 32
CLASSES    = ["real", "fake"]


def load_model():
    model = build_model(pretrained=False).to(DEVICE)
    ckpt  = torch.load(CKPT_PATH, map_location=DEVICE)
    model.load_state_dict(ckpt["model_state"])
    model.eval()
    print(f"Loaded checkpoint — epoch {ckpt['epoch']} "
          f"val_acc {ckpt['val_acc']:.4f}")
    return model


def get_predictions(model):
    """Run model over entire val set. Returns labels, preds, probs."""
    val_ds = DeepfakeDataset(
        str(SPLIT_DIR), split="val", transform=get_val_transform()
    )
    loader = DataLoader(val_ds, batch_size=BATCH_SIZE,
                        shuffle=False, num_workers=0)

    all_labels, all_preds, all_probs = [], [], []

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(DEVICE)
            logits = model(images)
            probs  = torch.softmax(logits, dim=1)[:, 1]  # fake probability
            preds  = logits.argmax(dim=1)

            all_labels.extend(labels.cpu().numpy())
            all_preds.extend(preds.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())

    return (
        np.array(all_labels),
        np.array(all_preds),
        np.array(all_probs),
    )


def plot_confusion_matrix(labels, preds):
    cm = confusion_matrix(labels, preds)
    fig, ax = plt.subplots(figsize=(6, 5))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues",
        xticklabels=CLASSES, yticklabels=CLASSES, ax=ax
    )
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    ax.set_title("Confusion Matrix — Deepfake Detection")
    plt.tight_layout()
    path = OUT_DIR / "confusion_matrix.png"
    plt.savefig(path, dpi=150)
    plt.show()
    print(f"Saved → {path}")


def plot_roc_curve(labels, probs):
    fpr, tpr, _ = roc_curve(labels, probs)
    auc         = roc_auc_score(labels, probs)

    fig, ax = plt.subplots(figsize=(6, 5))
    ax.plot(fpr, tpr, lw=2, label=f"AUC = {auc:.4f}")
    ax.plot([0, 1], [0, 1], "k--", lw=1)
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title("ROC Curve — Deepfake Detection")
    ax.legend(loc="lower right")
    ax.grid(True)
    plt.tight_layout()
    path = OUT_DIR / "roc_curve.png"
    plt.savefig(path, dpi=150)
    plt.show()
    print(f"Saved → {path}")
    return auc


def print_report(labels, preds):
    print("\nClassification Report")
    print("=" * 46)
    print(classification_report(labels, preds, target_names=CLASSES))


def evaluate():
    print("=" * 46)
    print("Stage 3 — Model Evaluation")
    print("=" * 46)

    model               = load_model()
    labels, preds, probs = get_predictions(model)

    print_report(labels, preds)
    plot_confusion_matrix(labels, preds)
    auc = plot_roc_curve(labels, probs)

    print(f"\nAUC Score : {auc:.4f}")
    print(f"Outputs   : {OUT_DIR}")
    print("=" * 46)
    print("Stage 3 PASSED — ready for ONNX export")


if __name__ == "__main__":
    evaluate()