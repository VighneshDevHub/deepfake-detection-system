# upload_models.py — run this locally once

from huggingface_hub import login, HfApi
from pathlib import Path

login()  # paste your HF token when prompted

api = HfApi()

# Create private repo
api.create_repo(
    repo_id  = "VighneshDevHub/deepfake-models",
    private  = True,
    exist_ok = True,
)
print("Repo ready")

models = {
    "deepfake_detector.onnx"     : "backend/models/deepfake_detector.onnx",
    "deepfake_detector.onnx.data": "backend/models/deepfake_detector.onnx.data",
    "best_model.pth"             : "backend/models/best_model.pth",
}

for hf_name, local_path in models.items():
    if not Path(local_path).exists():
        print(f"MISSING: {local_path} — skipping")
        continue
    print(f"Uploading {hf_name}...")
    api.upload_file(
        path_or_fileobj = local_path,
        path_in_repo    = hf_name,
        repo_id         = "VighneshDevHub/deepfake-models",
    )
    print(f"  Done — {hf_name}")

print("\nAll models uploaded to HuggingFace")