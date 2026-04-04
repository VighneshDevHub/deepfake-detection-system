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
    sendMessageToTab(tab.id, {
      type: "DETECT_FROM_CONTEXT_MENU",
      srcUrl: info.srcUrl,
    });
  }
});

// ── Keyboard commands ─────────────────────────────────────────────────────────
chrome.commands.onCommand.addListener((command) => {
  if (command === "scan_page") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab) {
        sendMessageToTab(tab.id, { type: "SCAN_PAGE" });
      }
    });
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
async function sendMessageToTab(tabId, message) {
  try {
    // Check if we can communicate with the tab
    await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    if (err.message.includes("Could not establish connection")) {
      console.warn("Communication failed: Content script not ready in this tab.");
      // Optional: Inject content script if missing, but usually better to just warn
    } else {
      console.error("Messaging error:", err);
    }
  }
}

// ── Message handler ───────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "DETECT_IMAGE") {
    handleDetection(msg.imageData, msg.filename, "image", msg.threshold)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true; // keep channel open for async
  }

  if (msg.type === "DETECT_IMAGE_FROM_URL") {
    handleDetectionFromUrl(msg.srcUrl, msg.threshold)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  if (msg.type === "DETECT_VIDEO") {
    handleDetection(msg.videoData, msg.filename, "video", msg.threshold)
      .then(sendResponse)
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }

  if (msg.type === "DETECT_VIDEO_FRAME") {
    handleDetection(msg.imageData, msg.filename, "image", msg.threshold)
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

async function handleDetectionFromUrl(srcUrl, threshold = 0.5) {
  try {
    const res = await fetch(srcUrl);
    if (!res.ok) throw new Error(`Could not fetch image: ${res.statusText}`);
    const blob = await res.blob();
    
    // Convert blob to base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const filename = srcUrl.split("/").pop().split("?")[0] || "image.jpg";
    return handleDetection(base64Data, filename, "image", threshold);
  } catch (err) {
    throw new Error(`Failed to analyze from URL: ${err.message}`);
  }
}

// ── API call ──────────────────────────────────────────────────────────────────
async function handleDetection(base64Data, filename, type = "image", threshold = 0.5) {
  const { apiUrl } = await getSettings();

  // Convert base64 → Blob
  const byteString = atob(base64Data.split(",")[1] ?? base64Data);
  const mimeType = base64Data.match(/data:([^;]+)/)?.[1] ?? (type === "video" ? "video/mp4" : "image/jpeg");
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType });

  const form = new FormData();
  form.append("file", blob, filename || (type === "video" ? "video.mp4" : "image.jpg"));

  const endpoint = type === "video" ? "video" : "image";
  const url = `${apiUrl}/api/v1/detect/${endpoint}?threshold=${threshold}`;
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
