# ml/src/model.py

import torch
import torch.nn as nn
import timm


class DeepfakeDetector(nn.Module):
    """
    EfficientNet-B4 pretrained on ImageNet.
    Final classifier replaced for binary deepfake detection.

    Output: logits of shape (batch, 2)
            0 = real, 1 = fake
    """

    def __init__(self, pretrained: bool = True, dropout: float = 0.3):
        super().__init__()

        # Load EfficientNet-B4 backbone — pretrained on ImageNet
        self.backbone = timm.create_model(
            "efficientnet_b4",
            pretrained=pretrained,
            num_classes=0,       # remove default head
            global_pool="avg",   # global average pooling
        )

        # Get feature dimension from backbone
        feat_dim = self.backbone.num_features  # 1792 for B4

        # Custom classification head
        self.head = nn.Sequential(
            nn.Dropout(p=dropout),
            nn.Linear(feat_dim, 256),
            nn.ReLU(),
            nn.Dropout(p=dropout / 2),
            nn.Linear(256, 2),   # 2 classes: real / fake
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.backbone(x)   # (B, 1792)
        return self.head(features)    # (B, 2)


def build_model(pretrained: bool = True, dropout: float = 0.3) -> DeepfakeDetector:
    return DeepfakeDetector(pretrained=pretrained, dropout=dropout)


if __name__ == "__main__":
    # Quick test — verify model builds and forward pass works
    model  = build_model(pretrained=False)   # pretrained=False for quick test
    dummy  = torch.randn(4, 3, 224, 224)     # batch of 4 images
    output = model(dummy)

    print(f"Input  shape : {dummy.shape}")
    print(f"Output shape : {output.shape}")  # expect (4, 2)
    print(f"Params total : {sum(p.numel() for p in model.parameters()):,}")
    print("model.py OK")