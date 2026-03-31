# backend/scripts/download_models.py

import os
from pathlib import Path


def download_models():
    from huggingface_hub import hf_hub_download

    HF_REPO    = os.getenv("HF_MODEL_REPO", "VighneshDevHub/deepfake-models")
    HF_TOKEN   = os.getenv("HF_TOKEN", "")
    MODELS_DIR = Path("models")
    MODELS_DIR.mkdir(exist_ok=True)

    files = [
        "deepfake_detector.onnx",
        "deepfake_detector.onnx.data",
        "best_model.pth",
    ]

    for filename in files:
        dest = MODELS_DIR / filename
        if dest.exists():
            print(f"  Found {filename} — skipping")
            continue
        print(f"  Downloading {filename}...")
        hf_hub_download(
            repo_id   = HF_REPO,
            filename  = filename,
            local_dir = str(MODELS_DIR),
            token     = HF_TOKEN or None,
        )
        print(f"  Downloaded {filename}")

    print("All models ready.")


if __name__ == "__main__":
    download_models()