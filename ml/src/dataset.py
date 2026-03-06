import os
import cv2
import torch
from torch.utils.data import Dataset

class DeepfakeDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = data_dir
        self.transform = transform
        self.image_paths = []
        self.labels = []

        # real images (label 0)
        real_dir = os.path.join(data_dir, "real")
        for img_name in os.listdir(real_dir):
            self.image_paths.append(os.path.join(real_dir, img_name))
            self.labels.append(0)

        # fake images (label 1)
        fake_dir = os.path.join(data_dir, "fake")
        for img_name in os.listdir(fake_dir):
            self.image_paths.append(os.path.join(fake_dir, img_name))
            self.labels.append(1)

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]
        label = self.labels[idx]

        image = cv2.imread(image_path) 
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        if self.transform:
            augmented = self.transform(image=image)
            image = augmented["image"]

        return image, torch.tensor(label, dtype=torch.float32)
