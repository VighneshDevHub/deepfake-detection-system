// src/types/detection.ts

export interface RegionActivation {
  region   : string
  intensity: number
}

export interface DetectionResult {
  filename       : string
  label          : "REAL" | "FAKE"
  confidence     : number
  is_fake        : boolean
  real_prob      : number
  fake_prob      : number
  threshold_used : number
  model_version  : string
  face_detected  : boolean
  face_confidence: number
  face_warning   : string | null
  gradcam_image  : string | null
  heatmap_image  : string | null
  top_regions    : RegionActivation[] | null
}

export interface HealthResponse {
  status        : string
  model_loaded  : boolean
  gradcam_loaded: boolean
  version       : string
}

export type DetectionState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "success"; result: DetectionResult }
  | { status: "error"; message: string }



// src/types/video.ts

export interface FrameResult {
  frame_number  : number
  timestamp_sec : number
  label         : string
  confidence    : number
  is_fake       : boolean
  fake_prob     : number
  real_prob     : number
  face_detected : boolean
}

export interface VideoDetectionResult {
  filename              : string
  label                 : "REAL" | "FAKE"
  confidence            : number
  is_fake               : boolean
  fake_frame_count      : number
  real_frame_count      : number
  total_frames_analyzed : number
  fake_frame_ratio      : number
  threshold_used        : number
  model_version         : string
  frame_results         : FrameResult[]
  warning               : string | null
}

export type VideoDetectionState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "success"; result: VideoDetectionResult }
  | { status: "error"; message: string }




