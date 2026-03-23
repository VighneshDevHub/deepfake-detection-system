# test_gradcam_decode.py

import requests
import base64
from pathlib import Path

# Auto-find first available image in val/real
VAL_REAL = Path(r"C:\Users\vighn\Desktop\STAY-HARD\Projects\deepfake-detection-system\ml\data\split\val\real")

images = list(VAL_REAL.glob("*.jpg")) + list(VAL_REAL.glob("*.png"))

if not images:
    print(f"No images found in {VAL_REAL}")
    exit(1)

IMAGE_PATH = images[0]
print(f"Using image: {IMAGE_PATH.name}")


# ── Output — change this folder to wherever you want ──────────────────────
OUTPUT_DIR = Path(r"C:\Users\vighn\Desktop\STAY-HARD\Projects\deepfake-detection-system\ml\output\gradcam")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)   # creates folder if not exists
# ───────────────


response = requests.post(
    "http://127.0.0.1:8000/api/v1/detect/image",
    files={"file": (IMAGE_PATH.name, open(IMAGE_PATH, "rb"), "image/jpeg")},
)

data = response.json()

print(f"Label       : {data['label']}")
print(f"Confidence  : {data['confidence']}%")
print(f"Top regions : {data['top_regions']}")

stem = IMAGE_PATH.stem   # filename without extension

if data.get("gradcam_image"):
    out = OUTPUT_DIR / f"{stem}_overlay.png"
    out.write_bytes(base64.b64decode(data["gradcam_image"]))
    print(f"Saved → {out}")

if data.get("heatmap_image"):
    out = OUTPUT_DIR / f"{stem}_heatmap.png"
    out.write_bytes(base64.b64decode(data["heatmap_image"]))
    print(f"Saved → {out}")
