# ml/src/transforms.py

import albumentations as A
from albumentations.pytorch import ToTensorV2

MEAN = (0.485, 0.456, 0.406)
STD  = (0.229, 0.224, 0.225)
IMG_SIZE = 224


def get_train_transform():
    return A.Compose([
        A.Resize(IMG_SIZE, IMG_SIZE),
        A.HorizontalFlip(p=0.5),
        A.Rotate(limit=15, p=0.5),
        A.RandomBrightnessContrast(p=0.4),
        A.GaussNoise(p=0.2),
        A.Normalize(mean=MEAN, std=STD),
        ToTensorV2(),
    ])


def get_val_transform():
    return A.Compose([
        A.Resize(IMG_SIZE, IMG_SIZE),
        A.Normalize(mean=MEAN, std=STD),
        ToTensorV2(),
    ])


# Keep these for backward compatibility with your old code
train_transform = get_train_transform()
val_transform   = get_val_transform()