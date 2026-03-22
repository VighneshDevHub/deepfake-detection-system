# ml/src/test_loader.py

import sys
from pathlib import Path
import torch
from torch.utils.data import DataLoader

sys.path.insert(0, str(Path(__file__).parent))

from dataset import DeepfakeDataset
from transforms import get_train_transform, get_val_transform

BASE      = Path(__file__).resolve().parent.parent
SPLIT_DIR = BASE / "data" / "split"


def verify_split():
    print("=" * 50)
    print("Stage 1 — Dataset verification")
    print("=" * 50)

    for split in ["train", "val"]:
        path = SPLIT_DIR / split
        if not path.exists():
            print(f"  MISSING: {path}")
            print("  Run: python src/split.py first")
            return False

        transform = get_train_transform() if split == "train" else get_val_transform()

        # Pass SPLIT_DIR as root, split as subfolder selector
        dataset = DeepfakeDataset(
            data_dir  = str(SPLIT_DIR),
            split     = split,
            transform = transform,
        )
        counts = dataset.class_counts()

        loader = DataLoader(
            dataset,
            batch_size=16,
            shuffle=(split == "train"),
            num_workers=0,
        )

        images, labels = next(iter(loader))

        print(f"\n  [{split}]")
        print(f"    real        : {counts['real']}")
        print(f"    fake        : {counts['fake']}")
        print(f"    total       : {len(dataset)}")
        print(f"    batch shape : {images.shape}")
        print(f"    label dtype : {labels.dtype}")
        print(f"    pixel range : [{images.min():.2f}, {images.max():.2f}]")

    print("\n" + "=" * 50)
    print("Stage 1 PASSED — ready for Stage 2")
    print("=" * 50)
    return True


if __name__ == "__main__":
    verify_split()