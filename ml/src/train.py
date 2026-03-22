# ml/src/train.py

import sys
import time
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

sys.path.insert(0, str(Path(__file__).parent))

from dataset import DeepfakeDataset
from transforms import get_train_transform, get_val_transform
from model import build_model

# ── Config ─────────────────────────────────────────────────────────────────
BASE       = Path(__file__).resolve().parent.parent   # ml/
SPLIT_DIR  = BASE / "data" / "split"
CKPT_DIR   = BASE / "checkpoints"
CKPT_DIR.mkdir(exist_ok=True)

EPOCHS     = 10
BATCH_SIZE = 16
LR         = 3e-4
PATIENCE   = 3          # stop if val accuracy doesn't improve for 3 epochs
DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ── Data ───────────────────────────────────────────────────────────────────
def get_loaders():
    train_ds = DeepfakeDataset(str(SPLIT_DIR), split="train",
                               transform=get_train_transform())
    val_ds   = DeepfakeDataset(str(SPLIT_DIR), split="val",
                               transform=get_val_transform())

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE,
                              shuffle=True,  num_workers=0, pin_memory=True)
    val_loader   = DataLoader(val_ds,   batch_size=BATCH_SIZE,
                              shuffle=False, num_workers=0, pin_memory=True)
    return train_loader, val_loader


# ── One train epoch ────────────────────────────────────────────────────────
def train_epoch(model, loader, criterion, optimizer):
    model.train()
    total_loss, correct, total = 0.0, 0, 0

    for images, labels in loader:
        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        optimizer.zero_grad()
        outputs = model(images)
        loss    = criterion(outputs, labels)
        loss.backward()

        # Gradient clipping — prevents exploding gradients
        nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

        optimizer.step()

        total_loss += loss.item()
        preds       = outputs.argmax(dim=1)
        correct    += preds.eq(labels).sum().item()
        total      += labels.size(0)

    avg_loss = total_loss / len(loader)
    accuracy = correct / total
    return avg_loss, accuracy


# ── One val epoch ──────────────────────────────────────────────────────────
def val_epoch(model, loader, criterion):
    model.eval()
    total_loss, correct, total = 0.0, 0, 0

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            outputs = model(images)
            loss    = criterion(outputs, labels)

            total_loss += loss.item()
            preds       = outputs.argmax(dim=1)
            correct    += preds.eq(labels).sum().item()
            total      += labels.size(0)

    avg_loss = total_loss / len(loader)
    accuracy = correct / total
    return avg_loss, accuracy


# ── Main training loop ─────────────────────────────────────────────────────
def train():
    print("=" * 56)
    print("Stage 2 — EfficientNet-B4 Deepfake Detection Training")
    print("=" * 56)
    print(f"  Device     : {DEVICE}")
    print(f"  Epochs     : {EPOCHS}")
    print(f"  Batch size : {BATCH_SIZE}")
    print(f"  LR         : {LR}")
    print(f"  Checkpoint : {CKPT_DIR}")
    print("=" * 56)

    train_loader, val_loader = get_loaders()

    model     = build_model(pretrained=True).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = AdamW(model.parameters(), lr=LR, weight_decay=1e-4)
    scheduler = CosineAnnealingLR(optimizer, T_max=EPOCHS, eta_min=1e-6)

    best_val_acc  = 0.0
    patience_cnt  = 0
    history       = []

    for epoch in range(1, EPOCHS + 1):
        t0 = time.time()

        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer)
        val_loss,   val_acc   = val_epoch(model,   val_loader,   criterion)

        scheduler.step()
        elapsed = time.time() - t0

        print(f"Epoch {epoch:02d}/{EPOCHS} | "
              f"train loss {train_loss:.4f} acc {train_acc:.4f} | "
              f"val loss {val_loss:.4f} acc {val_acc:.4f} | "
              f"{elapsed:.1f}s")

        history.append({
            "epoch": epoch,
            "train_loss": round(train_loss, 4),
            "train_acc":  round(train_acc,  4),
            "val_loss":   round(val_loss,   4),
            "val_acc":    round(val_acc,    4),
        })

        # ── Save best checkpoint ───────────────────────────────────────────
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            patience_cnt = 0
            ckpt_path    = CKPT_DIR / "best_model.pth"
            torch.save({
                "epoch":      epoch,
                "model_state": model.state_dict(),
                "val_acc":    val_acc,
                "val_loss":   val_loss,
            }, ckpt_path)
            print(f"  ✓ Saved best model  (val_acc={val_acc:.4f})")
        else:
            patience_cnt += 1
            print(f"  No improvement ({patience_cnt}/{PATIENCE})")
            if patience_cnt >= PATIENCE:
                print(f"\nEarly stopping at epoch {epoch}")
                break

    # ── Final summary ──────────────────────────────────────────────────────
    print("\n" + "=" * 56)
    print(f"Training complete — best val accuracy: {best_val_acc:.4f}")
    print(f"Checkpoint saved to: {CKPT_DIR / 'best_model.pth'}")
    print("=" * 56)

    return history


if __name__ == "__main__":
    train()