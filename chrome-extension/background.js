// background.js - Service Worker
// Handles API calls to avoid CORS issues from content scripts

const DEFAULT_API_URL = "http://localhost:8000";

// ── Context menu setup ────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "detect-image",
    title: "Detect Deepfake",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "detect-image" && info.srcUrl) {
    chrome.tabs.sendMessage(tab.id, {
      type: "DETECT_FROM_CONTEXT_MENU",
      srcUrl: info.srcUrl,
    });
  }
});

// ── Message handler ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "DETECT_IMAGE") {
    handleImageDetection(msg.imageData, msg.filename, msg.threshold)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true; // keep channel open for async
  }

  if (msg.type === "DETECT_VIDEO_FRAME") {
    handleImageDetection(msg.imageData, msg.filename, msg.threshold)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  if (msg.type === "GET_SETTINGS") {
    chrome.storage.sync.get(["apiUrl", "threshold", "autoScan"], (data) => {
      sendResponse({
        apiUrl: data.apiUrl || DEFAULT_API_URL,
        threshold: data.threshold ?? 0.5,
        autoScan: data.autoScan ?? false,
      });
    });
    return true;
  }

  if (msg.type === "SAVE_SETTINGS") {
    chrome.storage.sync.set(msg.settings, () => sendResponse({ ok: true }));
    return true;
  }
});

// ── API call ──────────────────────────────────────────────────────────────────
async function handleImageDetection(base64Data, filename, threshold = 0.5) {
  const { apiUrl } = await getSettings();

  // Convert base64 → Blob
  const byteString = atob(base64Data.split(",")[1] ?? base64Data);
  const mimeType = base64Data.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType });

  const form = new FormData();
  form.append("file", blob, filename || "image.jpg");

  const url = `${apiUrl}/api/v1/detect/image?threshold=${threshold}`;
  const res = await fetch(url, { method: "POST", body: form });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["apiUrl", "threshold"], (data) => {
      resolve({
        apiUrl: data.apiUrl || DEFAULT_API_URL,
        threshold: data.threshold ?? 0.5,
      });
    });
  });
}
