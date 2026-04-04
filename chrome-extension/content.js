// content.js - Content Script
// Extracts images from the page and shows result overlays

const SCAN_ATTR = "data-df-scanned";
const overlayMap = new WeakMap(); // img element → overlay element

// ── Bootstrap ─────────────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SCAN_PAGE") scanAllImages();
  if (msg.type === "DETECT_FROM_CONTEXT_MENU") detectFromUrl(msg.srcUrl);
});

// Auto-scan if enabled
getSettings().then((settings) => {
  if (settings?.autoScan) scanAllImages();
});

// ── Scan all images on page ───────────────────────────────────────────────────
function scanAllImages() {
  const images = document.querySelectorAll(`img:not([${SCAN_ATTR}])`);
  images.forEach((img) => {
    if (img.naturalWidth >= 100 && img.naturalHeight >= 100) {
      img.setAttribute(SCAN_ATTR, "pending");
      analyzeImage(img);
    }
  });
}

// ── Analyze a single <img> element ───────────────────────────────────────────
async function analyzeImage(img) {
  showOverlay(img, { status: "loading" });

  try {
    const settings = await getSettings();
    let result;

    try {
      // Try local canvas capture first (fastest, no extra network)
      const base64 = await imageElementToBase64(img);
      result = await safeRuntimeSendMessage({
        type: "DETECT_IMAGE",
        imageData: base64,
        filename: filenameFromSrc(img.src),
        threshold: settings.threshold,
      });
    } catch (err) {
      // Fallback: Ask background script to fetch and analyze via URL (bypasses CORS)
      console.log("Canvas failed, falling back to background fetch for:", img.src);
      result = await safeRuntimeSendMessage({
        type: "DETECT_IMAGE_FROM_URL",
        srcUrl: img.src,
        threshold: settings.threshold,
      });
    }

    if (!result || result.error) throw new Error(result?.error || "No response from background script");

    img.setAttribute(SCAN_ATTR, result.is_fake ? "FAKE" : "REAL");
    showOverlay(img, { status: "done", result });
  } catch (err) {
    console.error("Analysis failed:", err);
    img.setAttribute(SCAN_ATTR, "error");
    showOverlay(img, { status: "error", message: err.message });
  }
}

// ── Detect from right-click context menu (by URL) ────────────────────────────
async function detectFromUrl(srcUrl) {
  const settings = await getSettings();
  try {
    const result = await safeRuntimeSendMessage({
      type: "DETECT_IMAGE_FROM_URL",
      srcUrl: srcUrl,
      threshold: settings.threshold,
    });
    
    if (!result || result.error) throw new Error(result?.error || "No response from background script");
    showFloatingResult(result, srcUrl);
  } catch (err) {
    showFloatingResult({ error: err.message }, srcUrl);
  }
}

// ── Overlay rendering ─────────────────────────────────────────────────────────
function showOverlay(img, state) {
  // Ensure parent is positioned
  const parent = img.parentElement;
  if (!parent) return;
  const parentPos = getComputedStyle(parent).position;
  if (parentPos === "static") parent.style.position = "relative";

  // Remove old overlay
  let overlay = overlayMap.get(img);
  if (overlay) overlay.remove();

  overlay = document.createElement("div");
  overlay.className = "df-overlay";

  if (state.status === "loading") {
    overlay.innerHTML = `<span class="df-badge df-loading"><span class="df-badge-dot"></span>Scanning…</span>`;
  } else if (state.status === "error") {
    overlay.innerHTML = `<span class="df-badge df-error"><span class="df-badge-dot"></span>Error</span>`;
  } else if (state.status === "done") {
    const r = state.result;
    if (r.error) {
      overlay.innerHTML = `<span class="df-badge df-error"><span class="df-badge-dot"></span>Error</span>`;
    } else {
      const cls = r.is_fake ? "df-fake" : "df-real";
      const label = r.is_fake ? "FAKE" : "REAL";
      overlay.innerHTML = `
        <span class="df-badge ${cls}" title="${buildTooltip(r)}">
          <span class="df-badge-dot"></span>${label} ${r.confidence.toFixed(1)}%
        </span>`;
    }
  }

  // Position overlay at top-left of image
  overlay.style.cssText = `
    position:absolute;
    top:4px;
    left:4px;
    z-index:2147483647;
    pointer-events:none;
  `;

  parent.appendChild(overlay);
  overlayMap.set(img, overlay);
}

// Floating result panel for context-menu detections (no img element on page)
function showFloatingResult(result, srcUrl) {
  const existing = document.getElementById("df-float-panel");
  if (existing) existing.remove();

  const panel = document.createElement("div");
  panel.id = "df-float-panel";
  panel.setAttribute("role", "alert");
  panel.setAttribute("aria-live", "polite");

  if (!result || result.error) {
    const errorMsg = result?.error || "Unknown error occurred";
    panel.className = "df-float df-error-theme";
    panel.innerHTML = `
      <div class="df-float-header">
        Deepfake Detector
        <button id="df-close-float" aria-label="Close Notification">✕</button>
      </div>
      <div class="df-float-body">
        <div class="df-float-verdict" style="color:#fca5a5">
          <div class="df-float-icon">⚠️</div>
          <span>Analysis Error</span>
        </div>
        <div class="df-float-meta">${errorMsg}</div>
      </div>`;
  } else {
    const isFake = result.is_fake;
    panel.className = `df-float ${isFake ? "df-fake" : "df-real"}`;
    panel.innerHTML = `
      <div class="df-float-header">
        Deepfake Detector
        <button id="df-close-float" aria-label="Close Notification">✕</button>
      </div>
      <div class="df-float-body">
        <div class="df-float-verdict">
          <div class="df-float-icon">${isFake ? "🚨" : "🛡️"}</div>
          <span>${isFake ? "DEEPFAKE" : "AUTHENTIC"}</span>
        </div>
        <div class="df-float-bar-track">
          <div class="df-float-bar-fill" style="width:${result.confidence.toFixed(1)}%"></div>
        </div>
        <div class="df-float-meta">
          <div>Confidence: ${result.confidence.toFixed(1)}%</div>
          <div>${buildTooltip(result)}</div>
        </div>
      </div>`;
  }

  document.body.appendChild(panel);
  document.getElementById("df-close-float")?.addEventListener("click", () => panel.remove());
  setTimeout(() => panel.remove(), 10000);
}

function buildTooltip(r) {
  let tip = `Real: ${r.real_prob?.toFixed(1)}% | Fake: ${r.fake_prob?.toFixed(1)}%`;
  if (r.face_warning) tip += ` | ⚠ ${r.face_warning}`;
  return tip;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function imageElementToBase64(img) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    try {
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    } catch (err) {
      reject(new Error("Canvas capture failed (CORS)"));
    }
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function filenameFromSrc(src) {
  try {
    const url = new URL(src);
    return url.pathname.split("/").pop() || "image.jpg";
  } catch {
    return "image.jpg";
  }
}

function getSettings() {
  return new Promise((resolve) => {
    safeRuntimeSendMessage({ type: "GET_SETTINGS" }).then((res) => {
      if (res.error) {
        resolve({ apiUrl: "http://localhost:8000", threshold: 0.5, autoScan: false });
      } else {
        resolve(res);
      }
    });
  });
}

function safeRuntimeSendMessage(message) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(message, (res) => {
        if (chrome.runtime.lastError) {
          resolve({ error: "Extension service worker inactive. Please try again." });
        } else {
          resolve(res);
        }
      });
    } catch (e) {
      resolve({ error: "Extension context invalidated. Please refresh the page." });
    }
  });
}
