// popup.js
const $ = (id) => document.getElementById(id);

// ── Tab switching ─────────────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const panelId = `tab-${tab.dataset.tab}`;
    $(panelId).classList.add("active");
    
    if (tab.dataset.tab === "history") loadHistory();
  });
});

// ── Load settings ─────────────────────────────────────────────────────────────
function initSettings() {
  safeSendMessage({ type: "GET_SETTINGS" }, (settings) => {
    if (settings.error) return;
    $("api-url").value = settings.apiUrl;
    $("threshold").value = settings.threshold;
    $("threshold-val").textContent = Number(settings.threshold).toFixed(2);
    $("auto-scan").checked = settings.autoScan;
    
    // Theme initialization
    chrome.storage.sync.get(["theme"], (data) => {
      const isDark = data.theme !== "light";
      $("theme-toggle").checked = isDark;
      document.body.classList.toggle("light-theme", !isDark);
    });

    checkHealth(settings.apiUrl);
  });
}

initSettings();

// ── Theme toggle ──────────────────────────────────────────────────────────────
$("theme-toggle").addEventListener("change", (e) => {
  const isDark = e.target.checked;
  document.body.classList.toggle("light-theme", !isDark);
  chrome.storage.sync.set({ theme: isDark ? "dark" : "light" });
});

// ── Threshold slider ──────────────────────────────────────────────────────────
$("threshold").addEventListener("input", (e) => {
  $("threshold-val").textContent = Number(e.target.value).toFixed(2);
});

// ── Save settings ─────────────────────────────────────────────────────────────
$("btn-save").addEventListener("click", () => {
  const settings = {
    apiUrl: $("api-url").value.trim().replace(/\/$/, ""),
    threshold: parseFloat($("threshold").value),
    autoScan: $("auto-scan").checked,
  };
  safeSendMessage({ type: "SAVE_SETTINGS", settings }, (res) => {
    if (res.error) {
      showError(res.error);
      return;
    }
    const btn = $("btn-save");
    const originalText = btn.textContent;
    btn.textContent = "✓ Saved Successfully";
    btn.disabled = true;
    checkHealth(settings.apiUrl);
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  });
});

// ── Page scan ─────────────────────────────────────────────────────────────────
$("btn-scan").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;
    
    chrome.tabs.sendMessage(tab.id, { type: "SCAN_PAGE" }, (res) => {
      if (chrome.runtime.lastError) {
        showError("Please refresh the page to enable scanning.");
        $("btn-scan").disabled = false;
        $("scan-status").classList.add("hidden");
      }
    });

    $("btn-scan").disabled = true;
    $("scan-status").classList.remove("hidden");
    setTimeout(() => {
      $("btn-scan").disabled = false;
      $("scan-status").classList.add("hidden");
    }, 3500);
  });
});

// ── Upload zone ───────────────────────────────────────────────────────────────
const zone = $("upload-zone");
zone.addEventListener("click", () => $("file-input").click());
zone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") $("file-input").click(); });

zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
zone.addEventListener("drop", (e) => {
  e.preventDefault();
  zone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

$("file-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (file.type.startsWith("image/")) {
    $("video-preview-container").classList.add("hidden");
    runDetection(file);
  } else if (file.type.startsWith("video/")) {
    showVideoPreview(file);
  } else {
    showError("Unsupported file type. Please upload an image or video.");
  }
}

function showVideoPreview(file) {
  const video = $("video-preview");
  video.src = URL.createObjectURL(file);
  $("video-preview-container").classList.remove("hidden");
  $("result-card").classList.add("hidden");
  $("upload-title").textContent = file.name;
  $("btn-analyze-video").onclick = () => runVideoDetection(file);
}

// ── Detection ─────────────────────────────────────────────────────────────────
async function runDetection(file) {
  $("upload-title").textContent = file.name;
  $("error-card").classList.add("hidden");
  showResultLoading();

  try {
    const base64 = await fileToBase64(file);
    const settings = await getSettings();

    safeSendMessage(
      { type: "DETECT_IMAGE", imageData: base64, filename: file.name, threshold: settings.threshold },
      (result) => {
        if (result.error) {
          hideResultCard();
          showError(result.error);
          return;
        }
        showResultCard(result);
        saveToHistory(result);
      }
    );
  } catch (err) {
    showError(err.message);
  }
}

async function runVideoDetection(file) {
  $("error-card").classList.add("hidden");
  showResultLoading();

  try {
    const base64 = await fileToBase64(file);
    const settings = await getSettings();

    safeSendMessage(
      { type: "DETECT_VIDEO", videoData: base64, filename: file.name, threshold: settings.threshold },
      (result) => {
        if (result.error) {
          hideResultCard();
          showError(result.error);
          return;
        }
        showResultCard(result);
        saveToHistory(result);
      }
    );
  } catch (err) {
    showError(err.message);
  }
}

function showResultLoading() {
  const card = $("result-card");
  card.classList.remove("hidden");
  card.className = "result-card loading";
  $("result-verdict").textContent = "Analyzing patterns...";
  $("result-verdict").style.color = "var(--text-dim)";
  $("conf-bar").style.width = "40%";
  $("conf-pct").textContent = "---";
  $("result-meta").textContent = "Extracting forensic data...";
}

function showResultCard(result) {
  const card = $("result-card");
  card.classList.remove("hidden");
  
  const label = result.label.toLowerCase();
  const isFake = label === "fake";
  
  card.className = `result-card ${isFake ? "fake" : "real"}`;

  $("result-verdict").textContent = isFake ? "🚨 DEEPFAKE DETECTED" : "🛡️ AUTHENTIC MEDIA";
  $("result-verdict").style.color = isFake ? "var(--red)" : "var(--green)";

  const conf = (result.confidence * 1).toFixed(1);
  $("conf-bar").style.width = `${conf}%`;
  $("conf-bar").style.background = isFake ? "var(--red)" : "var(--green)";
  $("conf-pct").textContent = `${conf}%`;

  $("result-meta").innerHTML = `
    <span>${result.filename || "file"}</span>
    <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  `;
}

function hideResultCard() {
  $("result-card").classList.add("hidden");
}

function showError(msg) {
  const el = $("error-card");
  el.textContent = `⚠️ ${msg}`;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 5000);
}

$("btn-close-result").addEventListener("click", () => {
  hideResultCard();
  $("upload-title").textContent = "Drop media or click to browse";
  $("video-preview-container").classList.add("hidden");
});

// ── History Management ────────────────────────────────────────────────────────
function saveToHistory(result) {
  chrome.storage.local.get(["history"], (data) => {
    const history = data.history || [];
    const entry = {
      id: Date.now(),
      filename: result.filename,
      label: result.label,
      confidence: result.confidence,
      timestamp: new Date().toISOString()
    };
    history.unshift(entry);
    chrome.storage.local.set({ history: history.slice(0, 50) }); // Keep last 50
  });
}

function loadHistory() {
  chrome.storage.local.get(["history"], (data) => {
    const list = $("history-list");
    const history = data.history || [];
    
    if (history.length === 0) {
      list.innerHTML = '<div class="empty-state">No recent detections</div>';
      return;
    }
    
    list.innerHTML = history.map(item => `
      <div class="history-item" data-id="${item.id}">
        <div class="history-status ${item.label.toLowerCase()}"></div>
        <div class="history-info">
          <div class="history-file">${item.filename}</div>
          <div class="history-meta">${item.label} • ${item.confidence.toFixed(1)}% • ${formatDate(item.timestamp)}</div>
        </div>
      </div>
    `).join("");
  });
}

$("btn-clear-history").addEventListener("click", () => {
  chrome.storage.local.set({ history: [] }, loadHistory);
});

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Health check ──────────────────────────────────────────────────────────────
async function checkHealth(apiUrl) {
  const pill = $("status-pill");
  const label = $("status-label");
  pill.className = "status-pill";
  label.textContent = "Connecting...";
  try {
    const res = await fetch(`${apiUrl}/api/v1/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      pill.className = "status-pill online";
      label.textContent = "Forensic API Online";
    } else {
      throw new Error();
    }
  } catch {
    pill.className = "status-pill offline";
    label.textContent = "API Offline";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function getSettings() {
  return new Promise((resolve) => {
    safeSendMessage({ type: "GET_SETTINGS" }, (res) => {
      if (res.error) {
        resolve({ apiUrl: "http://localhost:8000", threshold: 0.5, autoScan: false });
      } else {
        resolve(res);
      }
    });
  });
}

function safeSendMessage(message, callback) {
  try {
    chrome.runtime.sendMessage(message, (res) => {
      if (chrome.runtime.lastError) {
        console.warn("Messaging failed:", chrome.runtime.lastError.message);
        if (callback) callback({ error: "Extension service worker inactive. Please try again." });
      } else if (callback) {
        callback(res);
      }
    });
  } catch (err) {
    console.error("Critical messaging error:", err);
    if (callback) callback({ error: "Extension error. Please restart your browser." });
  }
}

