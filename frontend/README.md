<div align="center">

# DFFS Dashboard
### Forensic Interface — Next.js Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://framer.com/motion)

</div>

---

## Overview

The DFFS Dashboard is a Next.js 16 application built with the App Router. It provides a dark-mode forensic interface for uploading media, running deepfake detection, reviewing results with Grad-CAM heatmaps, and managing detection history — all backed by the FastAPI inference engine.

---

## Tech Stack

| Package | Version | Role |
|---------|---------|------|
| Next.js | 16.2 | React framework, App Router, SSR |
| TypeScript | 5.0 | Type safety across all layers |
| Tailwind CSS | 4.0 | Utility-first styling |
| Framer Motion | 12 | Page transitions and micro-animations |
| Supabase JS | 2.0 | Authentication (email/password + OAuth) |
| Axios | 1.14 | HTTP client with interceptors |
| React Dropzone | 15 | Drag-and-drop file upload |
| Lucide React | latest | Icon library |
| React Hot Toast | 2.6 | Toast notifications |

---

## Project Structure

```
frontend/src/
├── app/
│   ├── (auth)/                     # Auth route group (no dashboard layout)
│   │   ├── sign-in/page.tsx        # Login page
│   │   ├── sign-up/page.tsx        # Registration page
│   │   └── layout.tsx              # Minimal auth layout
│   ├── (dashboard)/                # Protected route group
│   │   ├── dashboard/page.tsx      # System overview + stats + engine status
│   │   ├── detect-image/page.tsx   # Image upload + ONNX inference + Grad-CAM
│   │   ├── detect-video/page.tsx   # Video upload + frame analysis
│   │   ├── detect-audio/page.tsx   # Audio detection (ETA Q3)
│   │   ├── detect-text/page.tsx    # Text/LLM detection (ETA Q4)
│   │   ├── history/page.tsx        # Paginated detection archive
│   │   ├── settings/page.tsx       # Profile, API config, threshold defaults
│   │   └── layout.tsx              # Dashboard shell (Sidebar + Topbar)
│   ├── auth/callback/page.tsx      # Supabase OAuth callback handler
│   ├── page.tsx                    # Public landing page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles + CSS variables
│
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx             # Navigation sidebar with route links
│   │   ├── Topbar.tsx              # Top bar with user info and health status
│   │   ├── StatsCards.tsx          # Detection stats (total, fake %, image/video)
│   │   └── RecentDetections.tsx    # Latest 5 detections table
│   ├── detection/
│   │   ├── FileUploader.tsx        # Drag-and-drop uploader (image or video mode)
│   │   ├── DetectionResult.tsx     # Full image result card with heatmap
│   │   ├── VideoResult.tsx         # Video result with per-frame breakdown table
│   │   ├── ConfidenceGauge.tsx     # Animated circular confidence meter
│   │   └── RegionHeatmap.tsx       # Grad-CAM overlay renderer
│   ├── landing/
│   │   ├── Hero.tsx                # Hero section with CTA
│   │   ├── TrustedBy.tsx           # Logo strip
│   │   ├── Stats.tsx               # Platform statistics
│   │   ├── Features.tsx            # Feature grid
│   │   ├── FeaturesShowcase.tsx    # Interactive feature showcase
│   │   ├── HowItWorks.tsx          # Step-by-step explainer
│   │   ├── Testimonials.tsx        # User testimonials
│   │   ├── Pricing.tsx             # Pricing tiers
│   │   ├── FAQ.tsx                 # Accordion FAQ
│   │   └── CTASection.tsx          # Bottom call-to-action
│   ├── layout/
│   │   ├── Navbar.tsx              # Public landing navbar
│   │   └── Footer.tsx              # Public landing footer
│   ├── shared/
│   │   ├── AnimatedBackground.tsx  # Particle/gradient background
│   │   └── Logo.tsx                # DFFS logo component
│   └── ui/
│       ├── Button.tsx              # Polymorphic button with variants
│       ├── Card.tsx                # Glassmorphism card wrapper
│       ├── Input.tsx               # Input with icon slot
│       ├── Badge.tsx               # Status badge
│       ├── Progress.tsx            # Animated progress bar
│       └── ThresholdSlider.tsx     # Detection sensitivity slider (0.1–0.9)
│
├── hooks/
│   ├── useCurrentUser.ts           # Supabase session + derived profile fields
│   ├── useDetection.ts             # Image detection state machine
│   ├── useVideoDetection.ts        # Video detection state machine
│   └── useHealth.ts                # Backend health polling (every 30s)
│
├── lib/
│   ├── api.ts                      # Axios instance + all API call functions
│   ├── supabase.ts                 # Supabase browser client
│   └── utils.ts                    # cn() and other utilities
│
└── types/
    └── index.ts                    # DetectionResult, VideoDetectionResult, FrameResult
```

---

## Pages

### Landing Page (`/`)
Public marketing page composed of: `Hero` → `TrustedBy` → `Stats` → `Features` → `FeaturesShowcase` → `HowItWorks` → `Testimonials` → `Pricing` → `FAQ` → `CTASection`. Animated background with glassmorphism cards throughout.

### Dashboard (`/dashboard`)
System overview showing:
- `StatsCards` — total detections, fake/real ratio, image vs video counts pulled from `/history/stats`
- Scan module quick-access grid (Image, Video, Audio, Text)
- `RecentDetections` — last 5 scans from `/history`
- Engine status panel showing live state of Visual Engine, Temporal Scanner, Audio Engine, NLP Core

### Image Detection (`/detect-image`)
- `ThresholdSlider` — adjustable sensitivity (0.1–0.9, default 0.5)
- `FileUploader` — drag-and-drop or click to upload JPEG/PNG/WebP
- Animated loading state with EfficientNet-B4 scan indicator
- `DetectionResult` — verdict badge, `ConfidenceGauge`, `RegionHeatmap` (Grad-CAM overlay)

### Video Detection (`/detect-video`)
- Same config panel as image detection
- `FileUploader` in video mode — accepts MP4/AVI/MOV/MKV/WebM
- `VideoResult` — overall verdict, fake frame count, frame-by-frame breakdown table with timestamps

### History (`/history`)
- Paginated table of all past detections fetched from `/history`
- Filter by All / Images / Videos
- Search bar (client-side filter)
- Per-row: filename, verdict badge, confidence %, timestamp, download/delete actions

### Settings (`/settings`)
Four-tab layout:
- Profile — displays Supabase user info (name, email, avatar, created date)
- Engine — API endpoint URI, default threshold, health status indicator
- Alerts — (restricted, ETA)
- Security — (restricted, ETA)

---

## Custom Hooks

### `useCurrentUser`
Subscribes to Supabase `onAuthStateChange`. Derives `displayName`, `roleLabel`, `avatarUrl`, and `initials` from `user_metadata`. Returns `{ user, email, displayName, roleLabel, avatarUrl, initials, isLoading }`.

### `useDetection`
Wraps `detectImage()` from `lib/api.ts`. Manages `isLoading` and `result` state, shows toast notifications, and exposes `analyze(file, threshold)` and `reset()`.

### `useVideoDetection`
Same pattern as `useDetection` but wraps `detectVideo()` and types the result as `VideoDetectionResult`.

### `useHealth`
Polls `GET /health` every 30 seconds. Returns `{ isOnline: boolean | null, isLoading }`. Used by `Topbar` to show a live backend status indicator.

---

## API Client (`lib/api.ts`)

Axios instance with base URL `NEXT_PUBLIC_API_URL/api/v1` and 60s timeout.

Request interceptor automatically attaches the Supabase JWT as `Authorization: Bearer <token>` on every request.

```typescript
// Available functions
detectImage(file: File, threshold: number): Promise<DetectionResult>
detectVideo(file: File, threshold: number): Promise<VideoDetectionResult>
getHistory(page: number, perPage: number): Promise<HistoryResponse>
getStats(): Promise<StatsData>
```

---

## Type Definitions (`types/index.ts`)

```typescript
interface DetectionResult {
  filename, label, confidence, is_fake,
  real_prob, fake_prob, threshold_used,
  model_version, face_detected, face_confidence,
  face_warning, gradcam_image, heatmap_image, top_regions
}

interface VideoDetectionResult {
  filename, label, confidence, is_fake,
  fake_frame_count, real_frame_count,
  total_frames_analyzed, fake_frame_ratio,
  threshold_used, model_version, frame_results, warning
}

interface FrameResult {
  frame_number, timestamp_sec, label,
  confidence, is_fake, fake_prob, real_prob, face_detected
}
```

---

## Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.local.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

---

## Authentication Flow

1. User signs in via Supabase (email/password or OAuth)
2. Supabase issues a JWT stored in a secure cookie via `@supabase/ssr`
3. `useCurrentUser` subscribes to session changes and keeps state in sync
4. `lib/api.ts` interceptor reads the session and attaches the token to every API request
5. Backend verifies the Supabase JWT and optionally creates a local user record (JIT provisioning)

---

<div align="center">

DFFS — DeepFake Forensic System · Frontend Module

<br/>

Developed by [Vighnesh Salunkhe](https://github.com/vighneshsalunkhe)

</div>
