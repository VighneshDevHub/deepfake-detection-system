<div align="center">

# DFFS Web Guard
### Browser Extension — Chrome Manifest V3

[![Chrome Extension](https://img.shields.io/badge/Chrome-Manifest_V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

---

## Overview

DFFS Web Guard is a Chrome extension that brings deepfake detection directly to your browser. It connects to the DFFS FastAPI backend and lets you analyze any image on any webpage — via right-click, page scan, or drag-and-drop upload — without leaving your current tab.

Built with Manifest V3, Service Workers, and vanilla JS. No framework overhead.

---

## Features

| Feature | Description |
|---------|-------------|
| Right-click analysis | Right-click any image on any webpage → **Detect Deepfake** |
| Page scan | Scan all images on the current tab at once |
| Drag-and-drop upload | Drop a local image or video into the popup for instant analysis |
| Auto-scan mode | Automatically flag suspicious images as you browse |
| Custom threshold | Adjust detection sensitivity (0.1–0.9) per session |
| Keyboard shortcut | `Ctrl+Shift+S` / `Cmd+Shift+S` to trigger a page scan |

---

## Project Structure

```
chrome-extension/
├── manifest.json       # Extension config — permissions, icons, service worker
├── background.js       # Service worker — API calls, context menu, message routing
├── content.js          # Injected into every page — overlay rendering, image scanning
├── overlay.css         # Styles for in-page result overlays
├── popup.html          # Extension popup markup
├── popup.js            # Popup logic — file upload, settings, result display
├── popup.css           # Popup styles
└── icons/
    ├── icon16.png      # Toolbar icon
    ├── icon48.png      # Extension management page icon
    ├── icon128.png     # Chrome Web Store icon
    ├── icon.svg        # Source SVG
    └── generate_icons.py  # Script to regenerate PNG icons from SVG
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Chrome Browser                    │
│                                                     │
│  ┌──────────────┐     ┌──────────────────────────┐  │
│  │  popup.html  │     │     Any Webpage           │  │
│  │  popup.js    │     │  ┌────────────────────┐   │  │
│  │  popup.css   │     │  │   content.js       │   │  │
│  └──────┬───────┘     │  │   overlay.css      │   │  │
│         │             │  └────────┬───────────┘   │  │
│         │ messages    │           │ messages       │  │
│         ▼             └───────────┼───────────────┘  │
│  ┌──────────────────────────────────────────────┐    │
│  │              background.js                   │    │
│  │         (Service Worker)                     │    │
│  │  - Context menu registration                 │    │
│  │  - API request routing                       │    │
│  │  - Settings storage (chrome.storage)         │    │
│  └──────────────────┬───────────────────────────┘    │
└─────────────────────┼───────────────────────────────┘
                      │ HTTP POST
                      ▼
             DFFS Backend (:8000)
             POST /api/v1/detect/image
```

### Message Flow

1. User right-clicks an image → Chrome fires `contextMenus.onClicked`
2. `background.js` fetches the image URL, converts it to a `Blob`, sends `POST /detect/image` to the backend
3. Result is sent back to `content.js` via `chrome.tabs.sendMessage`
4. `content.js` renders an overlay badge on the image showing the verdict and confidence

For popup uploads:
1. User drops a file into `popup.html`
2. `popup.js` reads the file and sends it directly to the backend via `fetch`
3. Result is rendered inside the popup

---

## Permissions

| Permission | Why it's needed |
|------------|-----------------|
| `activeTab` | Access the current tab's DOM for page scanning |
| `scripting` | Inject `content.js` dynamically for overlay rendering |
| `contextMenus` | Add the right-click "Detect Deepfake" menu item |
| `storage` | Persist API endpoint URL and threshold setting across sessions |
| `host_permissions: <all_urls>` | Fetch images from any domain for analysis |

---

## Installation

### Load Unpacked (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `chrome-extension/` directory from this repository
5. The DFFS shield icon will appear in your toolbar

### Configure API Endpoint

1. Click the DFFS icon in the toolbar to open the popup
2. Go to the **Settings** tab
3. Set the **API Endpoint** to your running backend URL (default: `http://localhost:8000`)
4. Adjust the **Detection Threshold** if needed (default: 0.5)

---

## Usage

### Analyze an Image on a Webpage
Right-click any image → select **Detect Deepfake** from the context menu. A result overlay will appear on the image showing the verdict (REAL / FAKE) and confidence percentage.

### Scan the Entire Page
Click the DFFS icon → click **Scan Page** (or press `Ctrl+Shift+S`). All images on the page are analyzed and flagged with overlays.

### Upload a Local File
Click the DFFS icon → drag and drop an image or video file into the popup → click **Analyze**. Results appear directly in the popup.

### Adjust Sensitivity
Click the DFFS icon → **Settings** → move the threshold slider. Lower values make the detector more sensitive to fakes; higher values reduce false positives.

---

## Settings (Persisted via `chrome.storage`)

| Setting | Default | Description |
|---------|---------|-------------|
| `apiEndpoint` | `http://localhost:8000` | Backend URL |
| `threshold` | `0.5` | Detection sensitivity (0.1–0.9) |
| `autoScan` | `false` | Automatically scan images on page load |

---

## Regenerating Icons

If you update `icons/icon.svg`, regenerate the PNG icons with:

```bash
cd chrome-extension/icons
python generate_icons.py
```

Requires `Pillow` or `cairosvg` — check the script header for dependencies.

---

## Backend Requirement

The extension requires the DFFS backend to be running and accessible. For local development:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For production, update the API endpoint in the extension settings to your deployed backend URL (e.g., `https://your-api.render.com`).

---

<div align="center">

DFFS — DeepFake Forensic System · Chrome Extension Module

</div>
