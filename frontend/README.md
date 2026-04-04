# 📊 DFFS Dashboard: Forensic Interface

The **DFFS Dashboard** is a high-performance Next.js application that provides a beautiful, responsive, and intuitive interface for deepfake analysis. It is designed for forensic investigators and cybersecurity professionals.

## ✨ Features

- **🛡️ Forensic Theme**: A modern, dark-mode dashboard built with Glassmorphism and Tailwind CSS 4.
- **🖼️ Real-Time Detection**: Upload images or videos for instant analysis with progress tracking.
- **🧠 Visual Explainability**: View Grad-CAM heatmaps to understand which facial regions are suspicious.
- **🎬 Video Analysis**: Comprehensive breakdown of video frames with temporal consistency reports.
- **📈 History & Stats**: Keep track of previous detections and view overall system performance.
- **⚡ Next-Gen Performance**: Built with Next.js 15 and Framer Motion for smooth, high-speed interactions.

## 🛠️ Tech Stack

- **Framework**: `Next.js 15` (App Router)
- **Language**: `TypeScript`
- **Styling**: `Tailwind CSS 4`, `Framer Motion`
- **Icons**: `Lucide React`
- **State Management**: `React Hooks`

## 🚦 Installation & Usage

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
pnpm dev
```

## 📂 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (Dashboard, Detection, Landing, Layout, Shared, UI).
- `src/hooks`: Custom React hooks for API calls and state.
- `src/lib`: Utility functions and API clients.
- `src/types`: TypeScript definitions.

---
<p align="center">🛡️ <b>DeepFake Forensic System</b> - Frontend Module</p>
