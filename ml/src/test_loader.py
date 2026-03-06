import torch
from torch.utils.data import DataLoader
from dataset import DeepfakeDataset
from transforms import train_transform

DATA_DIR = "../data"

def main():
    dataset = DeepfakeDataset(DATA_DIR, transform=train_transform)

    dataloader = DataLoader(
        dataset,
        batch_size=16,
        shuffle=True,
        num_workers=2
    )

    for images, labels in dataloader:
        print("Batch image shape:", images.shape)
        print("Batch labels shape:", labels.shape)
        print("Sample labels:", labels[:5])
        break

if __name__ == "__main__":
    main()
