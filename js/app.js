// =============================================
// Digital Notice Board - Enhanced Version
// Modern academic design with premium features
// =============================================

const STORAGE_KEY = "digital_notice_board_v2";
const NOTIF_STORAGE_KEY = "dnb_notifications_v1";

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const nowISO = () => new Date().toISOString();

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// =============================================
// Data Management
// =============================================

function loadNotices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : seed();
  } catch (e) {
    console.error("Error loading notices:", e);
    return seed();
  }
}

function saveNotices(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function seed() {
  const today = new Date();
  const s = [
    {
      id: uid(),
      title: "Semester End Examination Schedule",
      type: "Circular",
      date: formatDate(addDays(today, 7)),
      expiry: formatDate(addDays(today, 21)),
      description: "The final semester examinations will commence from the scheduled date. Please check the detailed timetable on the notice board.",
      added: nowISO(),
      pinned: true,
      read: false
    },
    {
      id: uid(),
      title: "Inter-College Coding Competition 2025",
      type: "Event",
      date: formatDate(addDays(today, 14)),
      expiry: formatDate(addDays(today, 21)),
      description: "Register your team of 2-3 members at the Computer Science Department. Winners get exciting prizes!",
      added: nowISO(),
      pinned: false,
      read: false
    },
    {
      id: uid(),
      title: "⚠️ Urgent: Water Supply Interruption",
      type: "Urgent",
      date: formatDate(today),
      expiry: formatDate(addDays(today, 1)),
      description: "Water supply will be disrupted tomorrow from 9:00 AM to 5:00 PM for maintenance. Please plan accordingly.",
      added: nowISO(),
      pinned: true,
      read: false
    },
    {
      id: uid(),
      title: "Guest Lecture: AI in Healthcare",
      type: "Event",
      date: formatDate(addDays(today, 3)),
      expiry: formatDate(addDays(today, 10)),
      description: "Dr. Sarah Johnson from MIT will deliver a talk on applications of AI in modern healthcare. All students welcome.",
      added: nowISO(),
      pinned: false,
      read: false
    }
  ];
  saveNotices(s);
  return s;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// =============================================
// State
// =============================================

let notices = loadNotices();
let currentTab = "all";
let tickerIndex = 0;
let bulkSelectMode = false;
let selectedNotices = new Set();
let sortType = "date";
let currentRole = "admin";
let notifications = loadNotifications();

// =============================================
// Utility Functions
// =============================================

function isExpired(n) {
  if (!n.expiry) return false;
  const e = new Date(n.expiry + "T23:59:59");
  return e < new Date();
}

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sortNotices(list) {
  let sorted = list.slice().sort((a, b) => {
    if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0)) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    if (sortType === "title") return (a.title || "").localeCompare(b.title || "");
    if (sortType === "type") return (a.type || "").localeCompare(b.type || "");
    return new Date(b.added) - new Date(a.added);
  });
  return sorted;
}

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(date);
}

// =============================================
// Notifications System
// =============================================

function loadNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveNotifications(n) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(n));
  notifications = n;
}

function addNotification(title, type) {
  const notif = {
    id: uid(),
    title: title,
    type: type,
    time: nowISO(),
    read: false
  };
  const newNotifs = [notif, ...notifications].slice(0, 50);
  saveNotifications(newNotifs);
  updateNotificationBadge();
  renderNotifications();
}

function markNotificationRead(id) {
  const idx = notifications.findIndex(n => n.id === id);
  if (idx >= 0) {
    notifications[idx].read = true;
    saveNotifications([...notifications]);
    updateNotificationBadge();
    renderNotifications();
  }
}

function markAllRead() {
  notifications.forEach(n => n.read = true);
  saveNotifications([...notifications]);
  updateNotificationBadge();
  renderNotifications();
}

function updateNotificationBadge() {
  const badge = $("#notification-badge");
  const unread = notifications.filter(n => !n.read).length;
  if (unread > 0) {
    badge.textContent = unread > 9 ? "9+" : unread;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

function renderNotifications() {
  const container = $("#notification-list");
  if (!container) return;

  const recent = notifications.slice(0, 10);

  if (recent.length === 0) {
    container.innerHTML = '<div class="notification-empty">📭 No new notifications</div>';
    return;
  }

  container.innerHTML = recent.map(n => `
    <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}" role="menuitem">
      <div class="notification-item-title">${escapeHtml(n.title)}</div>
      <div class="notification-item-time">${formatTimeAgo(n.time)}</div>
    </div>
  `).join('');
}

// =============================================
// Ticker
// =============================================

function renderTicker() {
  const urgents = notices.filter(n => n.type === "Urgent" && !isExpired(n));
  const ticker = $("#ticker-inner");

  if (urgents.length === 0) {
    ticker.textContent = "✨ No urgent notices at the moment. Have a great day!";
    return;
  }

  const text = `🔔 ${urgents[tickerIndex].title} — ${urgents[tickerIndex].description.slice(0, 80)}...`;
  ticker.textContent = text;

  clearInterval(window._tickerTimer);
  window._tickerTimer = setInterval(() => {
    tickerIndex = (tickerIndex + 1) % urgents.length;
    const t = `🔔 ${urgents[tickerIndex].title} — ${urgents[tickerIndex].description.slice(0, 80)}...`;
    ticker.textContent = t;
  }, 6000);
}

// =============================================
// Render Notices
// =============================================

function renderNotices() {
  const container = $("#notices");
  container.innerHTML = "";

  const q = $("#search").value.toLowerCase().trim();
  let filtered = notices.filter(n => !isExpired(n));

  if (currentTab !== "all") {
    filtered = filtered.filter(n => n.type === currentTab);
  }

  if (q) {
    filtered = filtered.filter(n =>
      (n.title + " " + n.description + " " + (n.type || "")).toLowerCase().includes(q)
    );
  }

  filtered = sortNotices(filtered);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="notice" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <p style="color: var(--text-muted); font-size: 1.1rem;">
          📭 No notices to display.<br>
          <span style="font-size: 0.9rem;">Use the admin panel to add new notices.</span>
        </p>
      </div>`;
    renderTicker();
    renderTabCounts();
    return;
  }

  // Animation delay stagger
  filtered.forEach((n, i) => {
    const el = document.createElement("article");
    el.setAttribute("data-id", n.id);
    el.className = "notice" + (n.pinned ? " pinned" : "") + (n.read ? "" : " unread");
    el.style.animationDelay = `${i * 80}ms`;

    el.innerHTML = `
      ${bulkSelectMode ? `<input type="checkbox" class="notice-checkbox" data-id="${n.id}" aria-label="Select notice">` : ""}
      <div class="meta">
        <span class="badge ${n.type.toLowerCase()}">${n.type}</span>
        <span class="countdown" data-date="${n.date || ''}"></span>
      </div>
      <h3>${escapeHtml(n.title)}</h3>
      <p>${escapeHtml(n.description)}</p>
      ${n.image ? `<img src="${n.image}" class="poster" alt="Poster for ${escapeHtml(n.title)}">` : ""}
      ${n.attachment ? `
        <div class="notice-file" role="button" tabindex="0" aria-label="Download ${escapeHtml(n.attachment.name)}">
          📎 ${escapeHtml(n.attachment.name)}
        </div>` : ""}
      <div class="actions" role="group" aria-label="Notice actions">
        <button class="icon-btn" data-action="pin" data-id="${n.id}" title="${n.pinned ? 'Unpin' : 'Pin'}" aria-pressed="${n.pinned}">${n.pinned ? '📌' : '📍'}</button>
        <button class="icon-btn" data-action="edit" data-id="${n.id}" title="Edit">✏️</button>
        <button class="icon-btn" data-action="delete" data-id="${n.id}" title="Delete">🗑️</button>
      </div>
    `;

    container.appendChild(el);
  });

  renderAllCountdowns();
  renderTicker();
  renderTabCounts();
}

function renderTabCounts() {
  const activeNotices = notices.filter(n => !isExpired(n));
  $("#count-all").textContent = activeNotices.length;
  $("#count-circular").textContent = activeNotices.filter(n => n.type === "Circular").length;
  $("#count-event").textContent = activeNotices.filter(n => n.type === "Event").length;
  $("#count-urgent").textContent = activeNotices.filter(n => n.type === "Urgent").length;
}

// =============================================
// Countdown Timer
// =============================================

function renderAllCountdowns() {
  const nodes = $$(".countdown");
  nodes.forEach(n => {
    const dateStr = n.getAttribute("data-date");
    if (!dateStr) {
      n.textContent = "";
      return;
    }

    const target = new Date(dateStr + "T00:00:00");

    function update() {
      const diff = target - new Date();
      if (diff <= 0) {
        n.textContent = "🎉 Happening now!";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);

      if (days > 7) {
        n.textContent = formatDate(target);
      } else if (days > 0) {
        n.textContent = `${days}d ${hrs}h`;
      } else if (hrs > 0) {
        n.textContent = `${hrs}h ${mins}m`;
      } else {
        n.textContent = `${mins}m`;
      }
    }

    update();
  });
}

// =============================================
// Form Handling
// =============================================

function resetForm() {
  $("#notice-id").value = "";
  $("#title").value = "";
  $("#type").value = "Circular";
  $("#notice-date").value = "";
  $("#expiry-date").value = "";
  $("#description").value = "";
  $("#image-upload").value = "";
  $("#file-attach").value = "";
}

function addOrUpdateNotice(e) {
  e.preventDefault();

  if (document.body.classList.contains("role-student")) {
    alert("Students have view-only access.");
    return;
  }

  const id = $("#notice-id").value;
  const title = $("#title").value.trim();
  const type = $("#type").value;
  const date = $("#notice-date").value || null;
  const expiry = $("#expiry-date").value || null;
  const description = $("#description").value.trim();

  if (!title || !description) {
    alert("Please provide title and description.");
    return;
  }

  const imageFile = $("#image-upload").files[0];
  const attachFile = $("#file-attach").files[0];

  if (attachFile && attachFile.size > 10 * 1024 * 1024) {
    alert("File size must be less than 10MB");
    return;
  }

  let imageData = null;
  let attachmentData = null;

  const processFiles = () => {
    if (imageFile) {
      const fr = new FileReader();
      fr.onload = () => {
        imageData = fr.result;
        processAttachment();
      };
      fr.readAsDataURL(imageFile);
    } else {
      processAttachment();
    }
  };

  const processAttachment = () => {
    if (attachFile) {
      const fr = new FileReader();
      fr.onload = () => {
        attachmentData = { name: attachFile.name, data: fr.result, type: attachFile.type };
        storeNotice(id, title, type, date, expiry, description, imageData, attachmentData);
      };
      fr.readAsDataURL(attachFile);
    } else {
      storeNotice(id, title, type, date, expiry, description, imageData, attachmentData);
    }
  };

  processFiles();
}

function storeNotice(id, title, type, date, expiry, description, imageData, attachmentData) {
  if (id) {
    const idx = notices.findIndex(n => n.id === id);
    if (idx >= 0) {
      const wasPinned = notices[idx].pinned;
      notices[idx] = { ...notices[idx], title, type, date, expiry, description };
      if (imageData !== null) notices[idx].image = imageData;
      if (attachmentData !== null) notices[idx].attachment = attachmentData;
      saveNotices(notices);
      renderNotices();
      renderStats();
      resetForm();
      alert("✅ Notice updated successfully!");
      return;
    }
  }

  const newNotice = {
    id: uid(),
    title,
    type,
    date,
    expiry,
    description,
    added: nowISO(),
    pinned: false,
    read: false
  };

  if (imageData) newNotice.image = imageData;
  if (attachmentData) newNotice.attachment = attachmentData;

  notices.unshift(newNotice);
  saveNotices(notices);

  // Add notification for new notices
  addNotification(`New ${type}: ${title}`, type);

  renderNotices();
  renderStats();
  resetForm();
}

// =============================================
// Notice Actions
// =============================================

function onNoticeAction(e) {
  const btn = e.target.closest("button");
  if (!btn) {
    // Check for file click
    const fileEl = e.target.closest(".notice-file");
    if (fileEl) {
      const article = e.target.closest(".notice");
      const id = article?.getAttribute("data-id");
      if (id) downloadAttachment(id);
      return;
    }

    // Mark as read on click
    const article = e.target.closest(".notice");
    if (article) {
      const id = article.getAttribute("data-id");
      if (id) {
        const idx = notices.findIndex(n => n.id === id);
        if (idx >= 0 && !notices[idx].read) {
          notices[idx].read = true;
          saveNotices(notices);
          renderNotices();
          updateNotificationBadge();
        }
      }
    }
    return;
  }

  if (document.body.classList.contains("role-student")) return;

  const action = btn.getAttribute("data-action");
  const id = btn.getAttribute("data-id");

  if (action === "delete") {
    if (!confirm("🗑️ Delete this notice? This action cannot be undone.")) return;
    notices = notices.filter(n => n.id !== id);
    saveNotices(notices);
    renderNotices();
    renderStats();
  } else if (action === "edit") {
    const n = notices.find(x => x.id === id);
    if (!n) return;
    $("#notice-id").value = n.id;
    $("#title").value = n.title;
    $("#type").value = n.type;
    $("#notice-date").value = n.date || "";
    $("#expiry-date").value = n.expiry || "";
    $("#description").value = n.description;
    if (n.read) notices.find(x => x.id === id).read = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#title").focus();
  } else if (action === "pin") {
    const idx = notices.findIndex(n => n.id === id);
    if (idx >= 0) {
      notices[idx].pinned = !notices[idx].pinned;
      saveNotices(notices);
      renderNotices();
      renderStats();
    }
  }
}

function downloadAttachment(id) {
  const n = notices.find(x => x.id === id);
  if (n?.attachment?.data) {
    const a = document.createElement("a");
    a.href = n.attachment.data;
    a.download = n.attachment.name;
    a.click();
  }
}

// =============================================
// Import/Export
// =============================================

function exportJSON() {
  const dataStr = JSON.stringify(notices, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `notices-${formatDate(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importJSON(file) {
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const imported = JSON.parse(fr.result);
      if (!Array.isArray(imported)) throw new Error("JSON must be an array");

      const map = new Map(notices.map(n => [n.id, n]));
      for (const it of imported) {
        if (!it.id) it.id = uid();
        map.set(it.id, it);
      }
      notices = Array.from(map.values());
      saveNotices(notices);
      renderNotices();
      alert("✅ Imported successfully!");
    } catch (err) {
      alert("❌ Failed to import: " + err.message);
    }
  };
  fr.readAsText(file);
}

function clearAll() {
  if (!confirm("⚠️ Clear ALL notices? This cannot be undone!")) return;
  notices = [];
  saveNotices(notices);
  renderNotices();
  renderStats();
}

// =============================================
// Theme
// =============================================

function loadTheme() {
  const saved = localStorage.getItem("dnb_theme");
  const t = saved || "dark";
  document.body.setAttribute("data-theme", t);
  $("#theme-toggle").checked = t === "light";
}

function toggleTheme(e) {
  const theme = e.target.checked ? "light" : "dark";
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("dnb_theme", theme);
}

// =============================================
// Tab Navigation
// =============================================

function setTab(t) {
  currentTab = t;
  $$(".tab").forEach(el => el.classList.toggle("active", el.getAttribute("data-type") === t));

  const statsSection = $("#stats-section");
  const container = $(".container");

  if (statsSection && container) {
    if (t === "Stats") {
      statsSection.style.display = "grid";
      container.style.display = "none";
    } else {
      statsSection.style.display = "none";
      container.style.display = "grid";
    }
  }

  renderNotices();
}

// =============================================
// Statistics
// =============================================

function renderStats() {
  const stats = {
    total: notices.filter(n => !isExpired(n)).length,
    urgent: notices.filter(n => n.type === "Urgent" && !isExpired(n)).length,
    events: notices.filter(n => n.type === "Event" && !isExpired(n)).length,
    circular: notices.filter(n => n.type === "Circular" && !isExpired(n)).length,
    pinned: notices.filter(n => n.pinned).length,
    expired: notices.filter(n => isExpired(n)).length
  };

  $("#stat-total").textContent = stats.total;
  $("#stat-urgent").textContent = stats.urgent;
  $("#stat-events").textContent = stats.events;
  $("#stat-circular").textContent = stats.circular;
  $("#stat-pinned").textContent = stats.pinned;
  $("#stat-expired").textContent = stats.expired;
}

// =============================================
// Bulk Actions
// =============================================

function updateAdminControls(isStudent) {
  const nodes = document.querySelectorAll(".admin-only");
  nodes.forEach(n => {
    if (n.tagName === "BUTTON" || n.tagName === "INPUT" || n.tagName === "SELECT" || n.tagName === "TEXTAREA") {
      try {
        n.disabled = !!isStudent;
      } catch (e) {}
    }
    n.style.pointerEvents = isStudent ? "none" : "";
    n.setAttribute("aria-hidden", isStudent ? "true" : "false");
  });
}

function toggleBulkSelect() {
  if (document.body.classList.contains("role-student")) return;

  bulkSelectMode = !bulkSelectMode;
  const bulkActions = $("#bulk-actions");
  const bulkBtn = $("#bulk-select-btn");

  if (bulkActions && bulkBtn) {
    if (bulkSelectMode) {
      bulkActions.classList.add("visible");
      bulkBtn.textContent = "✓ Done";
    } else {
      bulkActions.classList.remove("visible");
      bulkBtn.textContent = "📋 Select";
      selectedNotices.clear();
    }
  }

  renderNotices();
}

function updateBulkCount() {
  const checkboxes = $$(".notice-checkbox:checked");
  selectedNotices = new Set(Array.from(checkboxes).map(c => c.getAttribute("data-id")));
  $("#bulk-count").textContent = `${selectedNotices.size} selected`;
}

function bulkDelete() {
  if (document.body.classList.contains("role-student")) return;
  if (selectedNotices.size === 0) return;

  if (!confirm(`🗑️ Delete ${selectedNotices.size} notice(s)?`)) return;

  notices = notices.filter(n => !selectedNotices.has(n.id));
  saveNotices(notices);
  renderNotices();
  renderStats();
  toggleBulkSelect();
}

function bulkPin() {
  if (document.body.classList.contains("role-student")) return;
  if (selectedNotices.size === 0) return;

  notices.forEach(n => {
    if (selectedNotices.has(n.id)) n.pinned = true;
  });
  saveNotices(notices);
  renderNotices();
  renderStats();
  toggleBulkSelect();
}

// =============================================
// Keyboard Shortcuts
// =============================================

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Don't handle shortcuts when typing in inputs
    const inInput = ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);

    if (e.ctrlKey || e.metaKey) {
      if (e.key === "f") {
        e.preventDefault();
        $("#search")?.focus();
      } else if (e.key === "n") {
        if (document.body.classList.contains("role-student") || inInput) return;
        e.preventDefault();
        $("#title")?.focus();
        resetForm();
      } else if (e.key === "b") {
        e.preventDefault();
        toggleBulkSelect();
      } else if (e.key === "s") {
        if (document.body.classList.contains("role-student") || inInput) return;
        e.preventDefault();
        const form = document.getElementById("notice-form");
        if (form && $("#title").value) form.dispatchEvent(new Event("submit"));
      } else if (e.key >= "1" && e.key <= "4") {
        e.preventDefault();
        const tabs = $$(".tab");
        const idx = parseInt(e.key) - 1;
        if (tabs[idx]) tabs[idx].click();
      }
    } else if (e.key === "Escape") {
      if (bulkSelectMode) toggleBulkSelect();
      const modal = $("#shortcuts-modal");
      if (modal && modal.classList.contains("visible")) hideHelpModal();
      const notifDrop = $("#notification-dropdown");
      if (notifDrop?.classList.contains("visible")) toggleNotifications();
    } else if (e.key === "?" && !inInput) {
      e.preventDefault();
      showHelpModal();
    }
  });
}

function showHelpModal() {
  const modal = $("#shortcuts-modal");
  if (modal) {
    modal.style.display = "flex";
    modal.classList.add("visible");
    modal.setAttribute("aria-hidden", "false");
  }
}

function hideHelpModal() {
  const modal = $("#shortcuts-modal");
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("visible");
    modal.setAttribute("aria-hidden", "true");
  }
}

// =============================================
// Notification Toggle
// =============================================

function toggleNotifications() {
  const dropdown = $("#notification-dropdown");
  const bell = $("#notification-bell");

  if (dropdown) {
    const isVisible = dropdown.classList.toggle("visible");
    bell?.setAttribute("aria-expanded", isVisible);
  }
}

// =============================================
// Login System
// =============================================

function setupLogin() {
  const loginForm = $("#loginForm");
  const loginError = $("#loginError");
  const loginSection = $("#loginSection");
  const appSection = $("#appSection");
  const logoutBtn = $("#logoutBtn");

  const USER = "admin";
  const PASS = "1234";
  const STUD_USER = "student";
  const STUD_PASS = "1111";

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const user = $("#username").value.trim();
      const pass = $("#password").value.trim();
      const role = $("#role-select") ? $("#role-select").value : "admin";

      currentRole = role;

      if (role === "admin") {
        if (user === USER && pass === PASS) {
          loginSection.style.display = "none";
          appSection.style.display = "block";
          loginError.textContent = "";
          document.body.classList.remove("role-student");
        } else {
          loginError.textContent = "❌ Invalid admin credentials";
          return;
        }
      } else {
        if (user === STUD_USER && pass === STUD_PASS) {
          loginSection.style.display = "none";
          appSection.style.display = "block";
          loginError.textContent = "";
          document.body.classList.add("role-student");
        } else {
          loginError.textContent = "❌ Invalid student credentials";
          return;
        }
      }

      appSection.setAttribute("aria-hidden", "false");
      updateAdminControls(document.body.classList.contains("role-student"));
      renderNotices();
      renderStats();
      updateNotificationBadge();
      renderNotifications();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      appSection.style.display = "none";
      loginSection.style.display = "flex";
      loginForm.reset();
      document.body.classList.remove("role-student");
      currentRole = "admin";
      updateAdminControls(false);
    });
  }
}

// =============================================
// Event Wiring
// =============================================

function wire() {
  // Form
  document.getElementById("notice-form").addEventListener("submit", addOrUpdateNotice);

  // Notice actions
  $("#notices").addEventListener("click", onNoticeAction);
  $("#notices").addEventListener("change", (e) => {
    if (e.target.classList.contains("notice-checkbox")) updateBulkCount();
  });

  // Controls
  $("#search").addEventListener("input", renderNotices);
  $("#sort-by").addEventListener("change", (e) => {
    sortType = e.target.value;
    renderNotices();
  });
  $("#clear-filters").addEventListener("click", () => {
    $("#search").value = "";
    setTab("all");
    renderNotices();
  });

  // Bulk actions
  $("#bulk-select-btn").addEventListener("click", toggleBulkSelect);
  $("#bulk-delete").addEventListener("click", bulkDelete);
  $("#bulk-pin").addEventListener("click", bulkPin);
  $("#bulk-cancel").addEventListener("click", toggleBulkSelect);

  // Import/Export
  $("#export-json").addEventListener("click", exportJSON);
  $("#import-file").addEventListener("change", (ev) => {
    const f = ev.target.files[0];
    if (f) importJSON(f);
    ev.target.value = "";
  });
  $("#clear-all").addEventListener("click", clearAll);

  // Theme
  $("#theme-toggle").addEventListener("change", toggleTheme);

  // Help modal
  $("#help-btn").addEventListener("click", showHelpModal);
  $("#close-modal").addEventListener("click", hideHelpModal);

  // Click outside to close modal
  $("#shortcuts-modal")?.addEventListener("click", (e) => {
    if (e.target === $("#shortcuts-modal")) hideHelpModal();
  });

  // Tabs
  $$(".tab").forEach(b => b.addEventListener("click", () => setTab(b.getAttribute("data-type"))));

  // Notifications
  $("#notification-bell")?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNotifications();
  });

  $("#notification-list")?.addEventListener("click", (e) => {
    const item = e.target.closest(".notification-item");
    if (item) {
      const id = item.getAttribute("data-id");
      markNotificationRead(id);
    }
  });

  $("#mark-all-read")?.addEventListener("click", (e) => {
    e.stopPropagation();
    markAllRead();
  });

  // Close notifications when clicking outside
  document.addEventListener("click", (e) => {
    const dropdown = $("#notification-dropdown");
    const bell = $("#notification-bell");
    if (dropdown?.classList.contains("visible") &&
      !dropdown.contains(e.target) &&
      !bell?.contains(e.target)) {
      toggleNotifications();
    }
  });

  // Floating add button
  $("#floating-add")?.addEventListener("click", () => {
    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#title").focus();
  });

  // Cancel edit
  $("#cancel-edit").addEventListener("click", (ev) => {
    ev.preventDefault();
    resetForm();
  });

  // Year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Initialize
  loadTheme();
  renderNotices();
  renderTicker();
  renderStats();
  setupLogin();
  setupKeyboardShortcuts();
  updateNotificationBadge();
  renderNotifications();
}

// Start the app
document.addEventListener("DOMContentLoaded", wire);

// Update countdowns every minute
setInterval(() => renderAllCountdowns(), 60 * 1000);