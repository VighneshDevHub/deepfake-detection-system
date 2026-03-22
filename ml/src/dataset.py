# ml/src/dataset.py

import os
import cv2
import torch
from torch.utils.data import Dataset
from pathlib import Path


class DeepfakeDataset(Dataset):

    def __init__(self, data_dir: str, split: str = None, transform=None):
        self.transform   = transform
        self.image_paths = []
        self.labels      = []

        root     = Path(data_dir) / split if split else Path(data_dir)
        real_dir = root / "real"
        fake_dir = root / "fake"

        if not real_dir.exists():
            raise FileNotFoundError(f"real/ not found at {real_dir}")
        if not fake_dir.exists():
            raise FileNotFoundError(f"fake/ not found at {fake_dir}")

        valid_ext = {".jpg", ".jpeg", ".png", ".webp"}

        for img_name in sorted(os.listdir(real_dir)):
            if Path(img_name).suffix.lower() in valid_ext:
                self.image_paths.append(str(real_dir / img_name))
                self.labels.append(0)

        for img_name in sorted(os.listdir(fake_dir)):
            if Path(img_name).suffix.lower() in valid_ext:
                self.image_paths.append(str(fake_dir / img_name))
                self.labels.append(1)

        print(f"[DeepfakeDataset] split={split or 'flat'} | "
              f"real={self.labels.count(0)} | "
              f"fake={self.labels.count(1)} | "
              f"total={len(self.labels)}")

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        path  = self.image_paths[idx]
        label = self.labels[idx]

        image = cv2.imread(path)
        if image is None:
            raise RuntimeError(f"Could not read image: {path}")
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        if self.transform:
            image = self.transform(image=image)["image"]

        return image, torch.tensor(label, dtype=torch.long)

    def class_counts(self):
        return {
            "real": self.labels.count(0),
            "fake": self.labels.count(1),
        }