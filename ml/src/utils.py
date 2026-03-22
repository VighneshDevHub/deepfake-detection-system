# ml/src/utils.py

import os
import torch
import random
import numpy as np
from pathlib import Path


def set_seed(seed: int = 42):
    """Fix all random seeds for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark     = False


def get_device() -> torch.device:
    """Return GPU if available, else CPU."""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    if device.type == "cuda":
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    return device


def save_checkpoint(model, optimizer, epoch, val_acc, val_loss, path: str):
    """Save model checkpoint with metadata."""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    torch.save({
        "epoch":          epoch,
        "model_state":    model.state_dict(),
        "optimizer_state": optimizer.state_dict(),
        "val_acc":        val_acc,
        "val_loss":       val_loss,
    }, path)
    print(f"  Checkpoint saved → {path}")


def load_checkpoint(model, optimizer, path: str, device):
    """Load checkpoint and return epoch + best metrics."""
    ckpt = torch.load(path, map_location=device)
    model.load_state_dict(ckpt["model_state"])
    optimizer.load_state_dict(ckpt["optimizer_state"])
    print(f"Checkpoint loaded from {path}")
    print(f"  Epoch {ckpt['epoch']} | val_acc={ckpt['val_acc']:.4f}")
    return ckpt["epoch"], ckpt["val_acc"]


def count_parameters(model) -> int:
    """Count trainable parameters."""
    n = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Trainable parameters: {n:,}")
    return n