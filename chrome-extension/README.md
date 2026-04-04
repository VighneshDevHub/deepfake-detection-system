# 🌐 DFFS Web Guard: Chrome Extension

The **DFFS Web Guard** is a browser extension that brings deepfake detection directly to your browsing experience. It allows you to analyze images and videos on any webpage with a single click.

## ✨ Features

- **🛡️ Right-Click Analysis**: Detect deepfakes by right-clicking any image on a webpage.
- **🖼️ Auto-Scan Mode**: Automatically scan and flag suspicious images as you browse.
- **🎬 Video Support**: Upload and analyze video files directly through the extension popup.
- **📂 Media Upload**: Drag and drop local images or videos into the extension for instant results.
- **⚙️ Custom Thresholds**: Adjust detection sensitivity to match your forensic requirements.

## 🛠️ Tech Stack

- **Framework**: `Chrome Extension Manifest V3`
- **Frontend**: `Vanilla JS`, `CSS3` (with modern UI techniques)
- **Background**: `Service Workers` for efficient background processing.

## 🚦 Installation & Usage

### 1. Load the Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right corner).
3. Click **Load unpacked** and select the `chrome-extension` directory.

### 2. Configure the API
1. Click the extension icon in your toolbar.
2. Go to the **Settings** tab.
3. Ensure the **API Endpoint** points to your running backend (default: `http://localhost:8000`).

### 3. Usage
- **Popup Analysis**: Open the popup, drag and drop a file, and click **Analyze**.
- **Context Menu**: Right-click any image on a webpage and select **Detect Deepfake**.
- **Page Scan**: Click **Scan Page** in the extension popup to analyze all images on the current tab.

## 📂 Project Structure

- `manifest.json`: Extension configuration and permissions.
- `popup.html/js/css`: The main interface of the extension.
- `background.js`: Handles communication with the backend API.
- `content.js`: Injects scanning and overlay logic into webpages.
- `icons/`: High-resolution extension icons.

---
<p align="center">🛡️ <b>DeepFake Forensic System</b> - Extension Module</p>
