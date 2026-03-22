# ml/src/split.py

import os
import shutil
import random
from pathlib import Path


def split_dataset(
    source_dir: str,
    output_dir: str,
    split_ratio: float = 0.8,
    seed: int = 42,
):
    """
    Splits flat fake/ real/ folders into train/val structure.

    Input:
        source_dir/
            fake/
            real/

    Output:
        output_dir/
            train/
                fake/
                real/
            val/
                fake/
                real/
    """
    random.seed(seed)
    classes = ["fake", "real"]
    stats   = {}

    for cls in classes:
        src    = Path(source_dir) / cls
        images = sorted([
            f for f in src.iterdir()
            if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ])

        if not images:
            raise ValueError(f"No images found in {src}")

        random.shuffle(images)
        n_train     = int(len(images) * split_ratio)
        train_files = images[:n_train]
        val_files   = images[n_train:]

        for split, files in [("train", train_files), ("val", val_files)]:
            out = Path(output_dir) / split / cls
            out.mkdir(parents=True, exist_ok=True)
            for f in files:
                shutil.copy2(f, out / f.name)

        stats[cls] = {
            "total": len(images),
            "train": len(train_files),
            "val":   len(val_files),
        }
        print(f"  {cls}: {len(train_files)} train | {len(val_files)} val")

    print(f"\nDone. Split saved to: {output_dir}")
    return stats


if __name__ == "__main__":
    BASE = Path(__file__).resolve().parent.parent  # points to ml/

    split_dataset(
        source_dir=str(BASE / "data" / "raw"),
        output_dir=str(BASE / "data" / "split"),
        split_ratio=0.8,
        seed=42,
    )