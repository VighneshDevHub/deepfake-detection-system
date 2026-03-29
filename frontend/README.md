# DeepFakeDetect: Forensic Dashboard (Next.js)

The frontend for DeepFakeDetect is a premium, cybersecurity-first dashboard built with Next.js 15+ and Tailwind CSS 4. It provides a highly interactive and intuitive interface for media analysis.

## 🚀 Key Features

- **Cybersecurity Theme**: Dark-mode-first design with electric cyan and glassmorphism.
- **Forensic Analyzer**: Advanced media uploader with real-time progress and visual feedback.
- **Interactive Heatmaps**: Dynamic Grad-CAM region activation viewer for images.
- **Video Breakdown**: Frame-by-frame analysis with temporal consistency scoring.
- **Data Archive**: LocalStorage-based scan history for quick retrieval.
- **Responsive Interface**: Fully optimized for desktop, tablet, and mobile forensics.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios

## 📂 Project Structure

```
frontend/src/
├── app/
│   ├── (auth)/         # Sign-in & Sign-up pages
│   ├── (dashboard)/    # Core analyzer, history, and settings
│   └── page.tsx        # Hero landing page
├── components/
│   ├── ui/             # Core primitives (Button, Input, etc.)
│   ├── landing/        # Landing page sections
│   ├── dashboard/      # Layout and overview components
│   └── detection/      # Specialized forensic components
└── lib/
    ├── api.ts          # Backend API integration
    └── utils.ts        # Helper functions
```

## 🏁 Setup & Execution

1.  **Environment Variables**: Create `frontend/.env.local`:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    ```

2.  **Installation**:

    ```bash
    pnpm install
    ```

3.  **Execution**:

    ```bash
    pnpm dev
    ```

4.  **Production Build**:
    ```bash
    pnpm build
    pnpm start
    ```

## ⚖️ Forensic Disclaimer

This dashboard provides high-confidence forensic data but is not infallible. Results should be cross-verified using other investigative techniques.
