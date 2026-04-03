// popup.js
const $ = (id) => document.getElementById(id);

// ── Tab switching ─────────────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    $(`tab-${tab.dataset.tab}`).classList.add("active");
  });
});

// ── Load settings ─────────────────────────────────────────────────────────────
chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (settings) => {
  $("api-url").value = settings.apiUrl;
  $("threshold").value = settings.threshold;
  $("threshold-val").textContent = Number(settings.threshold).toFixed(2);
  $("auto-scan").checked = settings.autoScan;
  checkHealth(settings.apiUrl);
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
  chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings }, () => {
    const btn = $("btn-save");
    btn.textContent = "✓ Saved";
    checkHealth(settings.apiUrl);
    setTimeout(() => (btn.textContent = "Save Settings"), 1800);
  });
});

// ── Page scan ─────────────────────────────────────────────────────────────────
$("btn-scan").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { type: "SCAN_PAGE" });
    $("btn-scan").disabled = true;
    $("scan-status").classList.remove("hidden");
    setTimeout(() => {
      $("btn-scan").disabled = false;
      $("scan-status").classList.add("hidden");
    }, 3500);
  });
});

// ── Upload zone: drag & drop + click ─────────────────────────────────────────
const zone = $("upload-zone");

zone.addEventListener("click", () => $("file-input").click());

zone.addEventListener("dragover", (e) => {
  e.preventDefault();
  zone.classList.add("drag-over");
});
zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
zone.addEventListener("drop", (e) => {
  e.preventDefault();
  zone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) runDetection(file);
});

$("file-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) runDetection(file);
});

// ── Detection ─────────────────────────────────────────────────────────────────
async function runDetection(file) {
  $("upload-title").textContent = file.name;
  $("error-card").classList.add("hidden");
  showResultLoading();

  const base64 = await fileToBase64(file);
  const settings = await getSettings();

  chrome.runtime.sendMessage(
    { type: "DETECT_IMAGE", imageData: base64, filename: file.name, threshold: settings.threshold },
    (result) => {
      if (chrome.runtime.lastError || result?.error) {
        hideResultCard();
        showError(result?.error || chrome.runtime.lastError?.message);
        return;
      }
      showResultCard(result);
    }
  );
}

function showResultLoading() {
  const card = $("result-card");
  card.className = "result-card loading";
  $("result-verdict").innerHTML = `
    <div class="verdict-icon">⏳</div>
    <span>Analyzing…</span>`;
  $("conf-bar").style.width = "60%";
  $("conf-pct").textContent = "";
  $("result-meta").innerHTML = "";
}

function showResultCard(r) {
  const card = $("result-card");
  const isFake = r.is_fake;
  card.className = `result-card ${isFake ? "fake" : "real"}`;

  $("result-verdict").innerHTML = `
    <div class="verdict-icon">${isFake ? "🚨" : "✅"}</div>
    <span>${isFake ? "DEEPFAKE" : "AUTHENTIC"}</span>`;

  const pct = r.confidence.toFixed(1);
  $("conf-bar").style.width = `${pct}%`;
  $("conf-pct").textContent = `${pct}%`;

  const chips = [
    `Real ${r.real_prob?.toFixed(1)}%`,
    `Fake ${r.fake_prob?.toFixed(1)}%`,
    r.face_detected ? `👤 Face ${r.face_confidence?.toFixed(0)}%` : null,
    r.face_warning ? `⚠ ${r.face_warning}` : null,
  ]
    .filter(Boolean)
    .map((t) => `<span class="meta-chip">${t}</span>`)
    .join("");

  $("result-meta").innerHTML = chips;
}

function hideResultCard() {
  $("result-card").className = "result-card hidden";
}

function showError(msg) {
  const el = $("error-card");
  el.textContent = `⚠ ${msg}`;
  el.classList.remove("hidden");
}

// ── Health check ──────────────────────────────────────────────────────────────
async function checkHealth(apiUrl) {
  const pill = $("status-pill");
  const label = $("status-label");
  pill.className = "status-pill";
  label.textContent = "Connecting…";
  try {
    const res = await fetch(`${apiUrl}/api/v1/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      pill.className = "status-pill online";
      label.textContent = "API Online";
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
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, resolve);
  });
}
