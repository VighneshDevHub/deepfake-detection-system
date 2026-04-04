# 🧠 DFFS ML Engine: Deep Learning Pipeline

The **DFFS ML Engine** is the core of the forensic system. It houses the training, evaluation, and model export scripts for deepfake detection.

## ✨ Features

- **⚡ EfficientNet-B4 Backbone**: A powerful, yet efficient, convolutional neural network for high-accuracy feature extraction.
- **🖼️ Face Extraction**: Precise face localization and alignment using MTCNN.
- **🎬 Temporal Consistency**: Multi-frame analysis for video-based deepfake detection.
- **🧠 Grad-CAM Explanability**: Visual heatmap generation to interpret model decisions.
- **🚀 ONNX Optimization**: Exported models for high-performance inference in production environments.

## 🛠️ Tech Stack

- **Framework**: `PyTorch`, `PyTorch Lightning`
- **Inference**: `ONNX Runtime`
- **Computer Vision**: `OpenCV`, `MTCNN`
- **Transforms**: `Albumentations`
- **Architecture**: `EfficientNet-B4` (timm)

## 🚦 Installation & Usage

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Training the Model
```bash
python src/train.py --data_path /path/to/dataset --epochs 50 --batch_size 32
```

### 3. Evaluating Performance
```bash
python src/evaluate.py --model_path models/best_model.pth --data_path /path/to/test_set
```

### 4. Exporting to ONNX
```bash
python src/utils.py --export_onnx models/best_model.pth --output models/best_model.onnx
```

## 📂 Project Structure

- `src/dataset.py`: Custom dataset and augmentation pipeline.
- `src/model.py`: EfficientNet-B4 architecture definition.
- `src/train.py`: Main training loop and PyTorch Lightning module.
- `src/evaluate.py`: Performance evaluation and metric calculation.
- `src/gradcam.py`: Implementation of Grad-CAM for model explainability.
- `exports/`: Production-ready ONNX models.

---
<p align="center">🛡️ <b>DeepFake Forensic System</b> - ML Module</p>
