(function () {
  const SCRIPT_TAG = document.currentScript;
  const BASE_PATH = SCRIPT_TAG ? SCRIPT_TAG.src.substring(0, SCRIPT_TAG.src.lastIndexOf("/") + 1) : "";

  if (window.RetroPlayerLoaded) return;
  window.RetroPlayerLoaded = true;

  // ==========================================
  // 1. CONFIGURATION & CONSTANTS
  // ==========================================
  const CONFIG = {
    google: {
      clientId: window.GOOGLE_CLIENT_ID || "",
      apiKey: window.GOOGLE_API_KEY || "",
      discovery: "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
      scope: "https://www.googleapis.com/auth/drive.file"
    },
    dbName: "RetroPlayerDB",
    storeName: "roms"
  };

  const ICONS = {
    themeLight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>',
    themeDark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>',
    cloudOff: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/></svg>',
    cloudOn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.18 9l1.41 1.41L10 17z"/></svg>',
    save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
    load: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
    soundOn: '<svg class="v-on" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    soundOff: '<svg class="v-off" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
    reload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
    maximize: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
    minimize: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', 
    history: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>',
    list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0-5h2V6H3v2zm0-5h2V1H3v2zm4 10h15v-2H7v2zm0-5h15V6H7v2zM7 1h15v2H7V1z"/></svg>',
    open: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>',
    clear: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    playBig: '<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    float: '<span>🎮</span>'
  };

  const I18N = {
    vi: {
      loading: "Đang tải...", uploading: "Đang tải lên Cloud...", syncing: "Đang đồng bộ...",
      connected_drive: "Đã kết nối Google Drive!", cloud_saved: "Đã lưu User Save (Cloud & Local)!",
      cloud_err_save: "Lỗi lưu Cloud!", cloud_not_found: "Không tìm thấy User Save trên Cloud",
      cloud_err_load: "Lỗi tải từ Cloud!", default_loaded: "Nạp game mặc định", game_selected: "Đang chơi: ",
      no_game: "Chưa nạp game", mute_toggle: "Đã bật/tắt âm thanh", synced: "Đã đồng bộ User Save từ Cloud",
      saved_local: "Đã lưu User Save (Local)", saved_cloud: "Đã lưu User Save (Cloud & Local)",
      error_cloud_fallback: "Lỗi Cloud. Đã lưu User Save Local", state_restored: "Đã khôi phục (Auto Save)",
      history_empty: "Chưa có lịch sử", library_empty: "Danh sách trống", confirm_delete: "Xóa game này khỏi lịch sử?",
      title_default: "Retro Player", continue: "Tiếp tục: ", click_to_play: "Bấm Play để chơi",
      game_loaded: "Đã nạp User Save", no_save_found: "Không tìm thấy User Save", file_error: "File save bị lỗi",
      save_core_error: "Lỗi khi save state", library: "Danh sách game", history: "Lịch sử đã chơi",
      open_file: "Mở File game", reload: "Tải lại", save_state: "Lưu trạng thái", load_state: "Nạp trạng thái",
      mute: "Tắt tiếng", auto_saved: "Đã tự động lưu (Local)", downloading: "Đang tải: ",
      download_aborted: "Đã hủy tải xuống", load_from_cache: "Mở từ bộ nhớ đệm...",
      confirm_clear: "Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu? (Lịch sử, Save Local & Cloud)",
      data_cleared: "Đã xóa toàn bộ dữ liệu!", clear_all: "Xóa hết dữ liệu", info_title: "Retro Player",
      help_load_err: "Không thể tải hướng dẫn (cần file help.html)"
    },
    en: {
      loading: "Loading...", uploading: "Uploading...", syncing: "Syncing...",
      connected_drive: "Google Drive Connected!", cloud_saved: "User Save Saved (Cloud & Local)!",
      cloud_err_save: "Cloud Save Error!", cloud_not_found: "User Save not found on Cloud",
      cloud_err_load: "Cloud Load Error!", default_loaded: "Loaded Default Game", game_selected: "Playing: ",
      no_game: "No game loaded", mute_toggle: "Audio toggled", synced: "User Save Synced from Cloud",
      saved_local: "User Save Saved (Local)", saved_cloud: "User Save Saved (Cloud & Local)",
      error_cloud_fallback: "Cloud Error. User Save Saved Locally", state_restored: "State Restored (Auto Save)",
      history_empty: "History is empty", library_empty: "Library is empty", confirm_delete: "Delete this game?",
      title_default: "Retro Player", continue: "Continue: ", click_to_play: "Click Play to start",
      game_loaded: "User Save loaded", no_save_found: "User Save not found", file_error: "Save file corrupted",
      save_core_error: "Core save error", library: "Game Library", history: "History",
      open_file: "Open Game File", reload: "Reload", save_state: "Save State", load_state: "Load State",
      mute: "Mute", auto_saved: "Auto saved (Local)", downloading: "Downloading: ",
      download_aborted: "Download Aborted", load_from_cache: "Loading from cache...",
      confirm_clear: "Are you sure? This will delete ALL data (History, Local & Cloud Saves)",
      data_cleared: "All data cleared!", clear_all: "Clear All Data", info_title: "Help & Tips",
      help_load_err: "Could not load help.html"
    }
  };

  const CORE_MAP = { nes: "fceumm", gba: "mgba", gb: "gambatte", gbc: "gambatte", sfc: "snes9x", smc: "snes9x" };
  const LAYOUTS = {
    fceumm: { btn: ["A", "B"], start: true, select: true },
    gambatte: { btn: ["A", "B"], start: false, select: true },
    mgba: { btn: ["A", "B", "L", "R"], start: true, select: true },
    snes9x: { btn: ["A", "B", "X", "Y", "L", "R"], start: true, select: true }
  };

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================
  let state = {
    isOpen: false,
    isFullscreen: false,
    muted: true,
    dragged: false,
    theme: localStorage.getItem('retro-theme') || 'dark',
    latestGame: null,
    notifyTimer: null,
    lang: 'vi',
    isPlaying: false,
    library: [],
    activeXHR: null,
    helpCache: null
  };

  let drive = {
    tokenClient: null,
    isLoggedIn: localStorage.getItem('retro_drive_auth') === 'true',
    useCloud: localStorage.getItem('retro_drive_use') === 'true'
  };

  let current = { rom: null, core: null, name: "" };
  let selectedFile = null, drag = { sx: null, sy: null, ox: 0, oy: 0 };
  let histModal, popup;
  let activeObjectUrl = null;
  const keyEventCache = {};
  let tokenResolver = null;

  const t = (key) => I18N[state.lang][key] || key;
  const el = id => document.getElementById(id);

  // ==========================================
  // 3. DATABASE SERVICE (IndexedDB)
  // ==========================================
  const DB = {
    _tx: (mode, cb) => new Promise((resolve, reject) => {
      const req = indexedDB.open(CONFIG.dbName, 2);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(CONFIG.storeName)) db.createObjectStore(CONFIG.storeName, { keyPath: "name" });
      };
      req.onsuccess = e => {
        try {
          const tx = e.target.result.transaction(CONFIG.storeName, mode);
          const res = cb(tx.objectStore(CONFIG.storeName));
          tx.oncomplete = () => resolve(res);
          tx.onerror = () => reject(tx.error);
        } catch (err) { reject(err); }
      };
      req.onerror = () => reject(req.error);
    }),
    saveROM: (f, core) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = e => {
        DB._tx("readwrite", s => {
          const req = s.get(f.name);
          req.onsuccess = ev => {
            const existing = ev.target.result || {};
            s.put({ ...existing, name: f.name, buffer: e.target.result, core: core, lastPlayed: Date.now() });
          };
        }).then(resolve).catch(e => console.warn(e));
      };
      reader.readAsArrayBuffer(f);
    }),
    putState: (name, stateData, type = 'auto') => DB._tx("readwrite", s => {
      s.get(name).onsuccess = e => {
        const r = e.target.result;
        if (r) {
          const update = { ...r, lastPlayed: Date.now() };
          if (type === 'manual') update.manualSave = stateData;
          else update.autoSave = stateData;
          s.put(update);
        }
      };
    }).then(() => true).catch(e => { console.warn(e); return false; }),
    getROMs: () => new Promise(res => DB._tx("readonly", s => s.getAll()).then(r => {
      const list = (r?.result || r || []).map(item => {
        if (item.buffer) item.data = new File([item.buffer], item.name);
        return item;
      }).sort((a, b) => b.lastPlayed - a.lastPlayed);
      res(list);
    }).catch(() => res([]))),
    deleteROM: name => DB._tx("readwrite", s => s.delete(name)).catch(e => console.error(e)),
    getOne: name => new Promise(res => DB._tx("readonly", s => s.get(name)).then(r => {
      let item = r?.result || r;
      if (item && item.buffer) item.data = new File([item.buffer], item.name);
      res(item);
    }).catch(() => res(null))),
    clearAll: () => DB._tx("readwrite", s => s.clear())
  };

  // ==========================================
  // 4. CLOUD SERVICE (Google Drive)
  // ==========================================
  const Cloud = {
    init: async () => {
      await UI.loadScript("https://accounts.google.com/gsi/client");
      await UI.loadScript("https://apis.google.com/js/api.js");
      gapi.load('client', async () => {
        try {
          await gapi.client.init({ apiKey: CONFIG.google.apiKey, discoveryDocs: [CONFIG.google.discovery] });
          drive.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CONFIG.google.clientId, scope: CONFIG.google.scope,
            callback: (r) => {
              if (r.error) {
                drive.isLoggedIn = false;
                drive.useCloud = false;
                localStorage.setItem('retro_drive_auth', 'false');
                localStorage.setItem('retro_drive_use', 'false');
                UI.updateCloudIcon();
                if (tokenResolver) tokenResolver(false);
                return;
              }
              drive.isLoggedIn = true;
              drive.useCloud = true;
              localStorage.setItem('retro_drive_auth', 'true');
              localStorage.setItem('retro_drive_use', 'true');
              UI.updateCloudIcon();
              UI.notify(t('connected_drive'));
              if (tokenResolver) tokenResolver(true);
            }
          });
          if (drive.isLoggedIn) UI.updateCloudIcon();
        } catch (e) { console.error(e); }
      });
    },
    ensureToken: async () => {
      if (gapi.client.getToken()) return true;
      if (!drive.isLoggedIn) return false;
      return new Promise(resolve => {
        tokenResolver = resolve;
        drive.tokenClient.requestAccessToken({ prompt: '' });
      }).finally(() => { tokenResolver = null; });
    },
    findFile: async (name) => {
      await Cloud.ensureToken();
      const safeName = name.replace(/'/g, "\\'");
      try {
        const { result } = await gapi.client.drive.files.list({ q: `name = '${safeName}' and trashed = false`, fields: 'files(id)', orderBy: 'modifiedTime desc' });
        return result.files[0];
      } catch (e) { return null; }
    },
    save: async (name, data) => {
      if (!drive.isLoggedIn) return false;
      UI.loading(true, "uploading");
      if (!(await Cloud.ensureToken())) {
        UI.loading(false);
        UI.notify("Token expired. Login again.", true);
        return false;
      }
      try {
        const file = await Cloud.findFile(name);
        const boundary = 'foo_bar_baz';
        const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name, mimeType: 'text/plain' })}\r\n--${boundary}\r\nContent-Type: text/plain\r\n\r\n${data}\r\n--${boundary}--`;
        await gapi.client.request({
          path: '/upload/drive/v3/files' + (file ? '/' + file.id : ''),
          method: file ? 'PATCH' : 'POST',
          params: { uploadType: 'multipart' },
          headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
          body
        });
        return true;
      } catch (e) { UI.notify(t('cloud_err_save'), true); return false; } finally { UI.loading(false); }
    },
    load: async (name) => {
      if (!drive.isLoggedIn) return null;
      UI.loading(true, "syncing");
      if (!(await Cloud.ensureToken())) {
        UI.loading(false);
        return null;
      }
      try {
        const file = await Cloud.findFile(name);
        if (file) {
          const res = await gapi.client.drive.files.get({ fileId: file.id, alt: 'media' });
          let raw = res.body;
          if (raw.trim().startsWith('{"data":')) try { raw = JSON.parse(raw).data || raw; } catch (e) { }
          return raw;
        }
        UI.notify(t('cloud_not_found'), true);
      } catch (e) { UI.notify(t('cloud_err_load'), true); } finally { UI.loading(false); }
      return null;
    },
    deleteAll: async () => {
      if (!(await Cloud.ensureToken())) return false;
      try {
        const { result } = await gapi.client.drive.files.list({ q: "name contains 'retro-save-' and trashed = false", fields: 'files(id)' });
        if (result.files?.length) {
          for (const f of result.files) await gapi.client.drive.files.delete({ fileId: f.id });
        }
        return true;
      } catch (e) { console.error(e); return false; }
    }
  };

  // ==========================================
  // 5. UI SERVICE
  // ==========================================
  const UI = {
    loadScript: (src) => new Promise(resolve => {
      const s = document.createElement("script"); s.src = src; s.onload = resolve; document.head.appendChild(s);
    }),
    el: (id) => document.getElementById(id),
    notify: (msg, isError = false) => {
      const n = UI.el("retro-notify");
      if (!n) return;
      if (state.notifyTimer) clearTimeout(state.notifyTimer);
      if (isError) console.error(msg);
      n.innerHTML = msg;
      n.className = "retro-notify message" + (isError ? " error" : "");
      n.style.cursor = "default";
      n.onclick = null;
      state.notifyTimer = setTimeout(() => {
        n.classList.remove("message", "error");
        Game.showIdleStatus();
      }, 3000);
    },
    loading: (show, textKey = "loading") => {
      const l = UI.el("loading-overlay");
      if (l) { UI.el("loading-text").textContent = t(textKey); l.style.display = show ? "flex" : "none"; }
    },
    updateCloudIcon: () => {
      const btn = UI.el("cloud-btn");
      if (!btn) return;
      const active = drive.isLoggedIn && drive.useCloud;
      btn.classList.toggle("cloud-active", active);
      btn.innerHTML = active ? ICONS.cloudOn : ICONS.cloudOff;
    },
    updateTheme: () => {
      const isLight = state.theme === 'light';
      if (popup) popup.classList.toggle('light-mode', isLight);
      if (histModal) histModal.classList.toggle('light-mode', isLight);
      const floatBtn = document.querySelector(".retro-float");
      if (floatBtn) floatBtn.style.cssText = `background:${isLight ? 'rgba(255,255,255,0.8)' : 'rgba(34,34,34,0.45)'};color:${isLight ? '#000' : '#fff'}`;
      const themeBtn = UI.el("theme-btn");
      if (themeBtn) themeBtn.innerHTML = isLight ? ICONS.themeDark : ICONS.themeLight;
    },
    updateMute: () => {
      popup.querySelector(".v-on").style.display = state.muted ? "none" : "block";
      popup.querySelector(".v-off").style.display = state.muted ? "block" : "none";
    },
    updatePauseUI: (isPaused) => {
      const overlay = UI.el("start-overlay");
      const gameDiv = popup?.querySelector(".retro-game");
      if (isPaused) {
        Game.send('STATE', 'pause');
        overlay.style.display = "flex";
        if (gameDiv) gameDiv.classList.add("paused");
      } else {
        Game.send('STATE', 'resume');
        overlay.style.display = "none";
        if (gameDiv) gameDiv.classList.remove("paused");
      }
    },
    toggleModal: (show) => histModal.style.display = show ? "flex" : "none",
    renderList: (title, items, isHistory) => {
      UI.el("modal-title").textContent = title;
      const lc = histModal.querySelector(".retro-modal-list");
      lc.innerHTML = "";
      if (!items.length) return lc.innerHTML = `<div class="retro-empty">${t(isHistory ? 'history_empty' : 'library_empty')}</div>`;
      items.forEach(i => {
        const d = document.createElement("div"); d.className = "hist-item";
        d.innerHTML = `<span class="hist-name">${isHistory ? i.name : i.name}</span>${isHistory ? '<span class="hist-del">✖</span>' : ''}`;
        d.querySelector(".hist-name").onclick = async () => {
          Game.cancelLoad();
          if (isHistory) {
            i.data.name = i.name;
            Game.loadROMData(i.data, i.core);
          } else {
            const existing = await DB.getOne(i.name);
            if (existing && existing.data) {
              UI.notify(t('load_from_cache'));
              existing.data.name = existing.name;
              Game.loadROMData(existing.data, existing.core);
            } else {
              const fullPath = i.url.startsWith("http") ? i.url : BASE_PATH + i.url;
              const core = CORE_MAP[i.core] || i.core;
              Game.downloadAndPlay(fullPath, i.name, core);
            }
          }
          UI.toggleModal(false);
        };
        if (isHistory) {
          d.querySelector(".hist-del").onclick = async e => {
            e.stopPropagation();
            if (confirm(t('confirm_delete'))) {
              await DB.deleteROM(i.name);
              const newList = await Game.renderHistory();
              UI.renderList(title, newList, true);
            }
          };
        }
        lc.appendChild(d);
      });
      UI.toggleModal(true);
    },
    loadHelp: async () => {
        UI.el("modal-title").textContent = t('info_title');
        const lc = histModal.querySelector(".retro-modal-list");
        if (state.helpCache) {
            lc.innerHTML = state.helpCache;
            UI.toggleModal(true);
            return;
        }
        UI.loading(true);
        try {
            const res = await fetch(BASE_PATH + 'help.html');
            if (!res.ok) throw new Error();
            let text = await res.text();
            text = text.replace(/\{icon:(\w+)\}/g, (match, key) => {
                const iconSvg = ICONS[key] || '';
                return `<span class="icon-inline">${iconSvg}</span>`;
            });
            state.helpCache = `<div class="retro-help-text">${text}</div>`;
            lc.innerHTML = state.helpCache;
            UI.toggleModal(true);
        } catch (e) {
            UI.notify(t('help_load_err'), true);
        } finally {
            UI.loading(false);
        }
    },
    // HTML Generators
    getStyles: () => `
      :root{--bg-main:#111;--bg-control:#080808;--bg-border:#222;--text-main:#fff;--text-sub:#888;--btn-bg:#333;--btn-shadow:#000;--btn-text:#fff;--btn-hover:#444;--pad-shadow:rgba(0,0,0,0.5); --overlay-bg: rgba(0, 0, 0, 0.3); --play-btn-bg: rgba(0, 0, 0, 0.5); --play-btn-border: rgba(255, 255, 255, 0.3); --play-btn-icon: #fff;}
      .retro-popup.light-mode,.retro-modal.light-mode{--bg-main:#f8f9fa;--bg-control:#e9ecef;--bg-border:#ced4da;--text-main:#333;--text-sub:#6c757d;--btn-bg:#f8f9fa;--btn-shadow:#adb5bd;--btn-text:#495057;--btn-hover:#e2e6ea;--pad-shadow:rgba(0,0,0,0.15); --overlay-bg: rgba(255, 255, 255, 0.2); --play-btn-bg: rgba(255, 255, 255, 0.95); --play-btn-border: rgba(200, 200, 200, 0.5); --play-btn-icon: #333;}
      .retro-float{position:fixed;right:20px;bottom:90px;width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;z-index:20000;touch-action:none;user-select:none;-webkit-user-select:none;background:var(--bg-main);box-shadow:0 4px 15px var(--pad-shadow);border:1px solid var(--bg-border);transition:left .3s cubic-bezier(.18,.89,.32,1.28),transform .2s}@media(hover:hover){.retro-float:hover{transform:scale(1.05)}}.retro-float.dragging{transition:none!important}.retro-float span{pointer-events:none}
      .retro-popup{position:fixed;right:12px;bottom:80px;width:380px;max-width:95vw;background:var(--bg-main);color:var(--text-main);border-radius:14px;padding:10px;display:none;z-index:20001;box-shadow:0 10px 40px var(--pad-shadow),0 0 0 1px var(--bg-border);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;user-select:none;overflow:hidden;box-sizing:border-box}
      .retro-full{top:0!important;left:0!important;width:100vw!important;height:100dvh!important;max-width:none!important;border-radius:0;padding-bottom:env(safe-area-inset-bottom);background:var(--bg-main)!important}
      .retro-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid var(--bg-border);padding-bottom:6px}.retro-header button{background:0 0;border:none;color:var(--text-sub);padding:4px;cursor:pointer;border-radius:4px;transition:all .2s;display:flex;align-items:center;justify-content:center}.retro-header button:hover{color:var(--text-main);background:var(--bg-control)}#retro-title{color:var(--text-main);font-weight:700;cursor:pointer;user-select:none;transition:color 0.2s}#retro-title:hover{color:#28a745}@keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}75%{transform:rotate(-1deg)}}.title-shake{animation:wiggle 0.4s ease-in-out 2}
      .retro-notify{height:24px;margin-bottom:6px;overflow:hidden;background:var(--bg-control);border:1px solid var(--bg-border);color:var(--text-sub);font-size:11px;text-align:center;line-height:24px;border-radius:4px;transition:all .2s}.retro-notify.message{color:#fff;background:#28a745;border-color:#28a745}.retro-notify.error{background:#dc3545;border-color:#dc3545}
      .retro-game{background:#000;border-radius:8px;overflow:hidden;position:relative;flex-grow:1;display:flex;align-items:center;justify-content:center;}.retro-game iframe{width:100%;height:240px;border:none;display:block;min-height:200px;box-shadow:0 0 20px rgba(0,0,0,.5);}.retro-game.paused iframe{box-shadow:none!important}.retro-full .retro-game iframe{height:100%!important;min-height:250px}
      .retro-loading{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.8);z-index:50;display:none;align-items:center;justify-content:center;flex-direction:column;color:#fff;font-size:12px}.retro-spinner{width:30px;height:30px;border:4px solid #555;border-top:4px solid #fff;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:8px}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
      .retro-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--overlay-bg);backdrop-filter:blur(2px);z-index:40;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}.play-btn-circle{width:60px;height:60px;background:var(--play-btn-bg);border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--play-btn-border);backdrop-filter:blur(4px);transition:transform 0.2s, box-shadow 0.2s;box-shadow:0 4px 15px rgba(0,0,0,0.2)}.play-btn-circle svg{width:32px;height:32px;color:var(--play-btn-icon);margin-left:4px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1))}.retro-overlay:hover .play-btn-circle{transform:scale(1.1);box-shadow:0 8px 25px rgba(0,0,0,0.3);border-color:var(--text-sub)}
      .retro-controls{margin-top:8px;height:210px;background:var(--bg-control);border-radius:12px;position:relative;border:1px solid var(--bg-border);flex-shrink:0}.retro-full .retro-controls{border-radius:15px;border:none;border-top:1px solid var(--bg-border);height:220px;margin-top:0;padding-bottom:10px}
      .pad{position:absolute;left:5px;top:20px;width:150px;height:150px}.pad button,.btn-action{position:absolute;border-radius:50%;background:var(--btn-bg);color:var(--btn-text);border:1px solid var(--bg-border);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 var(--btn-shadow);cursor:pointer;transition:transform .1s,box-shadow .1s}.pad button:active,.btn-action:active,.pressed{transform:translateY(4px) scale(.95);box-shadow:0 0 0 var(--btn-shadow)!important;background:var(--btn-hover)!important}.pad button{width:40px;height:40px;font-size:18px;pointer-events:none;z-index:1}.dpad-touch{position:absolute;width:100%;height:100%;z-index:10;top:0;left:0}.touch-zone{position:absolute;width:100%;height:100%;cursor:pointer;-webkit-tap-highlight-color:transparent}.tz-up{clip-path:polygon(0 0,100% 0,50% 50%)}.tz-right{clip-path:polygon(100% 0,100% 100%,50% 50%)}.tz-down{clip-path:polygon(0 100%,100% 100%,50% 50%)}.tz-left{clip-path:polygon(0 0,0 100%,50% 50%)}
      .btn-action{width:48px;height:48px;font-weight:700;font-size:16px}.btnA{right:10px;top:75px;color:#dc3545!important}.btnB{right:62px;top:115px;color:#fd7e14!important}.btnX{right:62px;top:35px;color:#28a745!important}.btnY{right:114px;top:75px;color:#007bff!important}.btnL,.btnR{top:8px;width:60px;height:24px;border-radius:12px;font-size:12px;box-shadow:0 2px 0 var(--btn-shadow);background:var(--btn-hover);color:var(--btn-text)}.btnL{right:90px}.btnR{right:10px}.btnS{position:absolute;bottom:8px;left:0;width:100%;display:flex;justify-content:center;gap:10px}.retro-full .btnS{bottom:15px}.btnS div{background:var(--btn-hover);padding:4px 10px;border-radius:10px;font-size:9px;text-transform:uppercase;border:1px solid var(--bg-border);cursor:pointer;color:var(--text-sub);font-weight:700;box-shadow:0 1px 0 var(--btn-shadow)}.btnS div:active{color:var(--text-main);transform:translateY(1px);box-shadow:none}
      .file-actions{display:flex;gap:6px;align-items:center}.btn-cloud{color:var(--text-sub)!important}.btn-cloud.cloud-active{color:#4285F4!important}.hidden{display:none!important}#hist-btn,#lib-btn,#open-btn,#clear-btn,#info-btn{background:var(--bg-main);border:1px solid var(--bg-border);color:var(--text-sub);border-radius:4px;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}#hist-btn:hover,#lib-btn:hover,#open-btn:hover,#clear-btn:hover,#info-btn:hover{background:var(--bg-control);color:var(--text-main)}#game-tools button{background:var(--bg-main);border:1px solid var(--bg-border);color:var(--text-sub);border-radius:4px;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}#game-tools button:hover{background:var(--bg-control);color:var(--text-main)}
      .retro-modal-list{overflow-y:auto;flex:1;max-height:190px;scrollbar-width:thin}.retro-modal{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.8);z-index:20005;display:none;align-items:center;justify-content:center;backdrop-filter:blur(3px)}.retro-modal.light-mode{background:rgba(255,255,255,.6)}.retro-modal-content{background:var(--bg-main);color:var(--text-main);border:1px solid var(--bg-border);border-radius:12px;padding:15px;width:300px;max-width:90%;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(0,0,0,.3);font-family:sans-serif}.retro-modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--bg-border);font-weight:700;font-size:14px}.retro-modal-close{cursor:pointer;font-size:18px;line-height:1;color:var(--text-sub)}.retro-modal-close:hover{color:var(--text-main)}.retro-modal-list{overflow-y:auto;flex:1}.retro-empty{text-align:center;color:var(--text-sub);font-size:12px;padding:20px 0}.hist-item{display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg-control);margin-bottom:4px;border-radius:6px;cursor:pointer;transition:all .2s;border:1px solid var(--bg-border)}.hist-item:hover{background:var(--btn-hover);border-color:var(--text-sub)}.hist-name{flex:1;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-main)}.hist-del{color:#dc3545;padding:4px;font-size:14px;line-height:1;border-radius:4px;opacity:.7}.hist-del:hover{opacity:1;background:rgba(220,53,69,.1)}#romInput{color:var(--text-main);font-size:11px}input[type=file]::file-selector-button{border:1px solid var(--bg-border);background:var(--bg-control);color:var(--text-main);padding:2px 6px;border-radius:4px;cursor:pointer;margin-right:5px;font-size:10px}input[type=file]::file-selector-button:hover{background:var(--btn-hover)}
      .retro-help-text{font-size:13px;line-height:1.5}.retro-help-text h3{font-size:14px;margin:10px 0 5px;color:var(--text-main);border-bottom:1px solid var(--bg-border);padding-bottom:4px}.retro-help-text ul{padding-left:20px;margin:0}.retro-help-text li{margin-bottom:5px}.icon-inline svg{width:14px;height:14px;vertical-align:middle;position:relative;top:-1px;margin-right:2px}
      @media(orientation:landscape){.retro-popup[style*="block"]{display:flex!important}.retro-popup{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100dvh!important;max-width:none!important;border-radius:0!important;flex-direction:row!important;align-items:center;justify-content:center;background:var(--bg-main)!important;padding-bottom:env(safe-area-inset-bottom)}.retro-popup .retro-header{display:flex!important;position:absolute;top:0;left:0;width:100%;height:40px;z-index:50;background:0 0;border:none;justify-content:center;padding-top:10px;pointer-events:none}.retro-popup .retro-header button{pointer-events:auto;background:var(--btn-bg);color:var(--btn-text);border:1px solid var(--bg-border);border-radius:50%;width:30px;height:30px;margin:0 5px;display:flex;align-items:center;justify-content:center}.retro-popup #retro-title{display:none!important}.retro-popup #fs{display:none!important}.retro-popup #theme-btn{display:flex!important}.retro-popup .retro-game{position:absolute;width:100%!important;height:80%!important;top:10%;z-index:1;background:transparent!important}.retro-popup .retro-game iframe{height:100%!important;width:auto!important;aspect-ratio:4/3;margin:0 auto;max-width:55vw;box-shadow:0 0 20px rgba(0,0,0,.8)}.retro-popup .retro-game.paused iframe{box-shadow:none!important}.retro-popup .retro-controls{position:absolute;width:100%;height:100%;top:0;left:0;margin:0;border:none;background:0 0!important;z-index:10;pointer-events:none}.retro-popup .retro-controls button,.retro-popup .pad,.retro-popup .btnS div,.retro-popup .dpad-touch{pointer-events:auto}.retro-popup .pad{top:auto!important;bottom:40px;left:40px;transform:scale(1.1)}.retro-popup .btn-action{top:auto!important}.retro-popup .btnA{bottom:80px;right:20px}.retro-popup .btnB{bottom:25px;right:85px}.retro-popup .btnX{bottom:135px;right:85px}.retro-popup .btnY{bottom:80px;right:150px}.retro-popup .btnL{top:50px!important;left:30px;right:auto;width:100px;height:40px}.retro-popup .btnR{top:50px!important;right:30px;left:auto;width:100px;height:40px}.retro-popup .btnS{bottom:10px;left:50%;transform:translateX(-50%);width:auto;gap:20px;z-index:30}.retro-popup .btnS div{background:rgba(0,0,0,.5);color:#fff;border:1px solid #444}.retro-popup #retro-notify{display:none!important}.retro-popup #file-row{display:flex!important;position:absolute;top:10px;left:15px;right:15px;width:auto;z-index:60;pointer-events:none;align-items:center}.retro-popup #file-row button{pointer-events:auto;width:34px;height:34px;border-radius:50%;background:var(--bg-control);color:var(--text-main);border:1px solid var(--bg-border);margin-right:8px;backdrop-filter:blur(2px);box-shadow: 0 2px 5px rgba(0,0,0,0.2)}.retro-popup #game-tools{display:flex;margin-left:auto;gap:8px;pointer-events:auto}.retro-popup #game-tools button{margin-right:0}}
    `,
    getPopupHTML: () => `
      <div class="retro-header">
        <strong id="retro-title">${t('title_default')}</strong>
        <div class="file-actions">
          <button id="theme-btn" title="Change Theme">${state.theme === 'light' ? ICONS.themeDark : ICONS.themeLight}</button>
          <button id="cloud-btn" class="btn-cloud" title="Sync Google Drive">${ICONS.cloudOff}</button>
          <button id="fs">${ICONS.maximize}</button>
          <button id="close" title="Close & Pause">${ICONS.close}</button>
        </div>
      </div>
      <div id="retro-notify" class="retro-notify"></div>
      <div id="file-row" style="margin-bottom:8px; display:flex; gap:5px; align-items:center;">
        <button id="open-btn" title="${t('open_file')}">${ICONS.open}</button>
        <button id="hist-btn" title="${t('history')}">${ICONS.history}</button>
        <button id="clear-btn" title="${t('clear_all')}">${ICONS.clear}</button>
        <button id="lib-btn" title="${t('library')}" style="display:none">${ICONS.list}</button>
        <div id="game-tools" style="display:none; gap:5px;">
            <button id="reload" title="${t('reload')}">${ICONS.reload}</button>
            <button id="save-btn" title="${t('save_state')}">${ICONS.save}</button>
            <button id="load-btn" title="${t('load_state')}">${ICONS.load}</button>
            <button id="mute" title="${t('mute')}">${ICONS.soundOn}${ICONS.soundOff}</button>
        </div>
        <input type="file" id="romInput" style="display:none">
      </div>
      <div class="retro-game paused">
        <div id="loading-overlay" class="retro-loading"><div class="retro-spinner"></div><span id="loading-text">Loading...</span></div>
        <div id="start-overlay" class="retro-overlay">
          <div class="play-btn-circle">${ICONS.playBig}</div>
        </div>
        <iframe></iframe>
      </div>
      <div class="retro-controls">
        <div class="pad">
          <div class="dpad-touch">
            <div class="touch-zone tz-up" data-key="ArrowUp"></div>
            <div class="touch-zone tz-down" data-key="ArrowDown"></div>
            <div class="touch-zone tz-left" data-key="ArrowLeft"></div>
            <div class="touch-zone tz-right" data-key="ArrowRight"></div>
          </div>
          <button data-visual="ArrowUp" style="top:15px;left:55px">▲</button>
          <button data-visual="ArrowDown" style="bottom:15px;left:55px">▼</button>
          <button data-visual="ArrowLeft" style="left:15px;top:55px">◀</button>
          <button data-visual="ArrowRight" style="right:15px;top:55px">▶</button>
        </div>
        <button class="btn-action btnL" data-btn="L" data-key="KeyQ">L</button>
        <button class="btn-action btnR" data-btn="R" data-key="KeyW">R</button>
        <button class="btn-action btnA" data-btn="A" data-key="KeyX">A</button>
        <button class="btn-action btnB" data-btn="B" data-key="KeyZ">B</button>
        <button class="btn-action btnX" data-btn="X" data-key="KeyS">X</button>
        <button class="btn-action btnY" data-btn="Y" data-key="KeyA">Y</button>
        <div class="btnS"><div data-btn="select" data-key="ShiftLeft">Select</div><div data-btn="start" data-key="Enter">Start</div></div>
      </div>
    `
  };

  // ==========================================
  // 6. GAME SERVICE
  // ==========================================
  const Game = {
    send: (type, value) => popup?.querySelector("iframe")?.contentWindow?.postMessage({ type, value }, '*'),
    loadROMData: (f, manualCore) => {
      let core = manualCore;
      if (!core) {
        core = CORE_MAP[f.name.split(".").pop().toLowerCase()] || "snes9x";
      }
      if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
      activeObjectUrl = URL.createObjectURL(f);
      Game.launch(activeObjectUrl, core, f.name);
      UI.notify(t('game_selected') + f.name);
      selectedFile = f;
      DB.saveROM(f, core).then(() => Game.renderHistory());
      UI.toggleModal(false);
    },
    launch: (rom, core, fileName) => {
      current = { rom, core, name: fileName || "Unknown" };
      state.isPlaying = true;
      UI.el("start-overlay").style.display = "none";
      UI.el("game-tools").style.display = "flex";
      UI.updatePauseUI(false);

      // Async getting autoSave to resume
      DB.getOne(current.name).then(record => {
          const autoSaveData = record?.autoSave;
          const cfg = LAYOUTS[core] || LAYOUTS.fceumm;
          document.querySelectorAll(".retro-popup [data-btn]").forEach(e => {
            const b = e.dataset.btn;
            const isAction = ["A", "B", "X", "Y", "L", "R"].includes(b);
            e.classList.toggle("hidden", !(isAction ? cfg.btn.includes(b) : (b === "start" ? cfg.start : cfg.select)));
          });

          const f = document.querySelector(".retro-game iframe");
          if (f) {
            const iFrameScript = `
              let game;
              let masterGain = null;
              let autoSaveInterval = null;

              const RealAudioContext = window.AudioContext || window.webkitAudioContext;
              if (RealAudioContext) {
                window.AudioContext = window.webkitAudioContext = function(...args) {
                  const ctx = new RealAudioContext(...args);
                  const gain = ctx.createGain();
                  gain.gain.value = ${state.muted ? 0 : 1}; 
                  gain.connect(ctx.destination);
                  masterGain = gain;
                  try { Object.defineProperty(ctx, 'destination', { value: gain, writable: false, enumerable: true, configurable: true }); } catch(e) {}
                  return ctx;
                };
                window.AudioContext.prototype = RealAudioContext.prototype;
              }

              document.body.addEventListener('click', () => {
                  window.parent.postMessage({type:'TOGGLE_PAUSE_REQ'}, '*');
              });

              window.onload = () => {
                Nostalgist.launch({
                  core: '${core}',
                  rom: '${rom}',
                  target: '#game-container',
                  retroarchConfig: { audio_enable: true, audio_volume: 0 }
                }).then(i => {
                  game = i;
                  window.parent.postMessage({type:'GAME_READY'},'*');
                  if(autoSaveInterval) clearInterval(autoSaveInterval);
                  autoSaveInterval = setInterval(async () => {
                     try {
                        const s = await game.saveState();
                        const r = new FileReader();
                        r.readAsDataURL(s.state);
                        r.onloadend = () => window.parent.postMessage({type:'AUTO_SAVE', data:r.result, name: '${fileName}'}, '*');
                     } catch(e) {}
                  }, 300000); 
                });
              };

              window.addEventListener('message', async e => {
                const {type, value} = e.data;
                if(type === 'MUTE' && masterGain) masterGain.gain.setValueAtTime(value ? 0 : 1, masterGain.context.currentTime);
                if(type === 'STATE' && game) value === 'pause' ? game.pause() : game.resume();
                if(type === 'SAVE_REQ' && game) {
                  try {
                    const s = await game.saveState();
                    const r = new FileReader();
                    r.readAsDataURL(s.state);
                    r.onloadend = () => window.parent.postMessage({type:'SAVE_DONE', data:r.result}, '*');
                  } catch(e) { window.parent.postMessage({type:'NOTIFY', msg:'save_core_error', err:true}, '*'); }
                }
                if(type === 'LOAD_REQ' && game) {
                   value ? fetch(value).then(r=>r.blob()).then(b=>game.loadState(b))
                   .then(() => window.parent.postMessage({type:'NOTIFY', msg:'game_loaded'}, '*'))
                   .catch(() => window.parent.postMessage({type:'NOTIFY', msg:'file_error', err:true}, '*'))
                   : window.parent.postMessage({type:'NOTIFY', msg:'no_save_found', err:true}, '*');
                }
                if(type === 'AUTO_RESUME' && game) {
                   fetch(value).then(r=>r.blob()).then(b=>game.loadState(b))
                   .then(() => window.parent.postMessage({type:'NOTIFY', msg:'state_restored'}, '*'))
                   .catch(() => {});
                }
              });
            `;
            f.srcdoc = `<html><body style="margin:0;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center;"><div id="game-container" style="width:100%;height:100%;"></div><script src="https://unpkg.com/nostalgist"><\/script><script>${iFrameScript}<\/script></body></html>`;
            
            const onReady = (e) => {
              if (e.data.type === 'GAME_READY') {
                if (autoSaveData) Game.send('AUTO_RESUME', autoSaveData);
                window.removeEventListener('message', onReady);
              }
            };
            window.addEventListener('message', onReady);
          }
      });
    },
    cancelLoad: () => {
      if (state.activeXHR) {
        state.activeXHR.abort();
        state.activeXHR = null;
        UI.loading(false);
        UI.notify(t('download_aborted'), true);
      }
    },
    downloadAndPlay: (url, name, core) => {
      Game.cancelLoad();
      UI.loading(true, "downloading");
      const xhr = new XMLHttpRequest();
      state.activeXHR = xhr;
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          UI.notify(`${t('downloading')} ${percent}%`);
        }
      };
      xhr.onload = () => {
        state.activeXHR = null;
        UI.loading(false);
        if (xhr.status === 200) {
          const blob = xhr.response;
          blob.name = name;
          Game.loadROMData(blob, core);
        } else {
          UI.notify(t('cloud_err_load'), true);
        }
      };
      xhr.onerror = () => {
        state.activeXHR = null;
        UI.loading(false);
        UI.notify(t('cloud_err_load'), true);
      };
      xhr.send();
    },
    renderHistory: async () => {
      const list = await DB.getROMs();
      UI.el("hist-btn").style.display = list.length ? "flex" : "none";
      state.latestGame = list.length ? list[0] : null;
      Game.showIdleStatus();
      return list;
    },
    showIdleStatus: () => {
      const n = UI.el("retro-notify");
      if (!n) return;
      if (state.isPlaying && current.name) {
        n.innerHTML = `<b style="color:#28a745">${current.name}</b>`;
        n.style.cursor = "default";
        n.onclick = null;
      } else if (state.latestGame && state.latestGame.data) {
        n.innerHTML = `${t('continue')} <b style="color:#28a745">${state.latestGame.name}</b>`;
        n.style.cursor = "pointer";
        n.onclick = () => {
          state.latestGame.data.name = state.latestGame.name;
          Game.loadROMData(state.latestGame.data, state.latestGame.core);
        };
      } else {
        n.textContent = "";
        n.style.cursor = "default";
        n.onclick = null;
      }
      n.classList.remove("message", "error");
    },
    clearAllData: async () => {
      if (!confirm(t('confirm_clear'))) return;
      UI.loading(true, "loading");
      await DB.clearAll();
      if (drive.isLoggedIn && drive.useCloud) await Cloud.deleteAll();
      current = { rom: null, core: null, name: "" };
      state.isPlaying = false;
      state.latestGame = null;
      const iframe = popup.querySelector(".retro-game iframe");
      if (iframe) iframe.srcdoc = "";
      UI.el("game-tools").style.display = "none";
      UI.el("start-overlay").style.display = "flex";
      const gameDiv = popup.querySelector(".retro-game");
      if(gameDiv) gameDiv.classList.add("paused"); // Reset to paused style (no shadow)
      Game.renderHistory();
      UI.notify(t('data_cleared'));
      UI.loading(false);
    },
    loadLibrary: () => {
        const script = document.createElement("script");
        script.src = BASE_PATH + "listgame.js?t=" + Date.now();
        script.onload = () => {
            if(window.RETRO_GAME_LIBRARY) {
                state.library = window.RETRO_GAME_LIBRARY;
                UI.el("lib-btn").style.display = "flex";
            }
        };
        script.onerror = () => { console.log("List game not found"); };
        document.head.appendChild(script);
    }
  };

  // ==========================================
  // 7. INITIALIZATION & EVENTS
  // ==========================================
  function init() {
    // Inject Styles
    const style = document.createElement("style");
    style.textContent = UI.getStyles();
    document.head.appendChild(style);

    // Create Float Button
    const floatBtn = document.createElement("div");
    floatBtn.className = "retro-float"; 
    floatBtn.innerHTML = ICONS.float; 
    document.body.appendChild(floatBtn);

    // Create Popup
    popup = document.createElement("div");
    popup.className = "retro-popup";
    popup.innerHTML = UI.getPopupHTML();
    document.body.appendChild(popup);

    // Create Modal
    histModal = document.createElement("div");
    histModal.className = "retro-modal";
    histModal.id = "retro-modal";
    histModal.innerHTML = `<div class="retro-modal-content"><div class="retro-modal-header"><span id="modal-title">History</span><span class="retro-modal-close">✖</span></div><div class="retro-modal-list"></div></div>`;
    document.body.appendChild(histModal);

    // Event Listeners: Modal
    histModal.onclick = e => (e.target === histModal || e.target.classList.contains("retro-modal-close")) && UI.toggleModal(false);

    // Event Listeners: Header Actions
    UI.el("theme-btn").onclick = () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('retro-theme', state.theme);
      UI.updateTheme();
    };
    UI.updateTheme(); // Apply initial theme

    UI.el("hist-btn").onclick = async () => UI.renderList(t('history'), await Game.renderHistory(), true);
    UI.el("lib-btn").onclick = () => UI.renderList(t('library'), state.library || [], false);
    UI.el("open-btn").onclick = () => { Game.cancelLoad(); UI.el("romInput").click(); };
    UI.el("clear-btn").onclick = () => Game.clearAllData();
    UI.el("retro-title").onclick = () => UI.loadHelp();

    Game.renderHistory();

    // Event Listeners: Overlay & Game Controls
    UI.el("start-overlay").onclick = () => {
      if (current.rom) {
        UI.updatePauseUI(false);
      } else {
        if (state.latestGame && state.latestGame.data) {
          state.latestGame.data.name = state.latestGame.name;
          Game.loadROMData(state.latestGame.data, state.latestGame.core);
        } else {
          const defaultGame = "Jackal (USA).nes";
          const fullPath = BASE_PATH + defaultGame;
          Game.downloadAndPlay(fullPath, "Jackal (Jeep)", "fceumm");
        }
      }
    };

    UI.el("romInput").onchange = e => {
      if (e.target.files[0]) {
        Game.cancelLoad();
        Game.loadROMData(e.target.files[0]);
        e.target.value = null;
      }
    };

    UI.el("save-btn").onclick = () => !current.rom ? UI.notify(t('no_game'), true) : Game.send('SAVE_REQ');
    
    UI.el("reload").onclick = () => {
      if (current.rom) {
        Game.cancelLoad();
        Game.launch(activeObjectUrl, current.core, current.name);
      }
    };

    UI.el("load-btn").onclick = async () => {
      if (!current.rom) return UI.notify(t('no_game'), true);
      UI.loading(true, "loading");
      let finalData = null;
      let fromCloud = false;
      if (drive.isLoggedIn && drive.useCloud) {
        const cloudData = await Cloud.load('retro-save-' + current.name);
        if (cloudData) {
          await DB.putState(current.name, cloudData, 'manual');
          finalData = cloudData;
          fromCloud = true;
        }
      }
      if (!finalData) {
        const record = await DB.getOne(current.name);
        finalData = record?.manualSave;
      }
      UI.loading(false);
      if (finalData) {
        Game.send('LOAD_REQ', finalData);
        if (fromCloud) UI.notify(t('synced'));
      } else {
        UI.notify(t('no_save_found'), true);
      }
    };

    UI.el("mute").onclick = () => {
      state.muted = !state.muted;
      UI.updateMute();
      if (current.rom) {
        Game.send('MUTE', state.muted);
        UI.notify(t('mute_toggle'));
      }
    };
    UI.updateMute();

    UI.el("fs").onclick = () => {
      state.isFullscreen = !state.isFullscreen;
      popup.classList.toggle("retro-full", state.isFullscreen);
      UI.el("fs").innerHTML = state.isFullscreen ? ICONS.minimize : ICONS.maximize;
    };

    UI.el("close").onclick = () => {
      Game.cancelLoad();
      state.isOpen = false;
      popup.style.display = "none";
      if (current.rom) UI.updatePauseUI(true);
    };

    UI.el("cloud-btn").onclick = () => {
      if (!drive.tokenClient) return UI.notify("API chưa tải", true);
      if (drive.isLoggedIn) {
        drive.useCloud = !drive.useCloud;
        localStorage.setItem('retro_drive_use', drive.useCloud);
        UI.updateCloudIcon();
        UI.notify("Cloud: " + (drive.useCloud ? "ON" : "OFF"));
      } else {
        drive.tokenClient.requestAccessToken({ prompt: 'consent' });
      }
    };

    // Message Listener
    window.addEventListener('message', async e => {
      if (e.data.type === 'TOGGLE_PAUSE_REQ') {
        const overlay = UI.el("start-overlay");
        UI.updatePauseUI(overlay.style.display === "none");
      }
      if (e.data.type === 'SAVE_DONE') {
        const sName = 'retro-save-' + current.name, sData = e.data.data;
        await DB.putState(current.name, sData, 'manual');
        let cloudSuccess = false;
        if (drive.isLoggedIn && drive.useCloud) {
          cloudSuccess = await Cloud.save(sName, sData);
        }
        if (drive.isLoggedIn && drive.useCloud) {
          UI.notify(cloudSuccess ? t('saved_cloud') : t('error_cloud_fallback'), !cloudSuccess);
        } else {
          UI.notify(t('saved_local'));
        }
      }
      if (e.data.type === 'AUTO_SAVE') {
        DB.putState(e.data.name, e.data.data, 'auto');
        UI.notify(t('auto_saved'));
      }
      if (e.data.type === 'NOTIFY') UI.notify(t(e.data.msg), e.data.err);
    });

    // Drag & Drop
    floatBtn.onpointerdown = e => { const r = floatBtn.getBoundingClientRect(); drag = { sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top }; state.dragged = false; floatBtn.setPointerCapture(e.pointerId); };
    floatBtn.onpointermove = e => {
      if (drag.sx === null) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!state.dragged && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) { state.dragged = true; floatBtn.classList.add("dragging"); Object.assign(floatBtn.style, { right: "auto", bottom: "auto" }); }
      if (state.dragged) Object.assign(floatBtn.style, { left: (drag.ox + dx) + "px", top: (drag.oy + dy) + "px" });
    };
    floatBtn.onpointerup = e => {
      if (drag.sx === null) return;
      floatBtn.classList.remove("dragging");
      if (state.dragged) floatBtn.style.left = (e.clientX < window.innerWidth / 2 ? 15 : window.innerWidth - 65) + "px";
      else {
        state.isOpen = !state.isOpen;
        popup.style.display = state.isOpen ? "block" : "none";
        if (state.isOpen) {
          const title = UI.el("retro-title");
          title.classList.remove("title-shake");
          void title.offsetWidth;
          title.classList.add("title-shake");
          if (current.rom && UI.el("start-overlay").style.display !== "none") {
            // Already paused
          } else if (current.rom) {
            UI.updatePauseUI(true);
          }
        } else {
          if (current.rom) UI.updatePauseUI(true);
        }
      }
      drag.sx = null;
    };

    document.addEventListener('pointerdown', e => { if (state.isOpen && !state.isFullscreen && !popup.contains(e.target) && !floatBtn.contains(e.target) && !histModal.contains(e.target)) { state.isOpen = false; popup.style.display = "none"; if (current.rom) UI.updatePauseUI(true); } });

    window.addEventListener("resize", () => {
      if (!floatBtn.style.left) return;
      let currentTop = parseFloat(floatBtn.style.top) || 20;
      currentTop = Math.max(20, Math.min(currentTop, window.innerHeight - 70));
      let currentLeft = parseFloat(floatBtn.style.left) || 0;
      let newLeft = (currentLeft < window.innerWidth / 2) ? 15 : window.innerWidth - 65;
      floatBtn.style.top = currentTop + "px";
      floatBtn.style.left = newLeft + "px";
    });

    // Game Pad
    popup.querySelectorAll("[data-key]").forEach(b => {
      const h = t => e => {
        e.preventDefault();
        (popup.querySelector(`[data-visual="${b.dataset.key}"]`) || b).classList.toggle("pressed", t === "keydown");
        const w = popup.querySelector("iframe")?.contentWindow;
        if (w) {
          const cacheKey = t + ':' + b.dataset.key;
          if (!keyEventCache[cacheKey]) keyEventCache[cacheKey] = new KeyboardEvent(t, { code: b.dataset.key, bubbles: true });
          w.document.dispatchEvent(keyEventCache[cacheKey]);
        }
        if (t === "keydown" && navigator.vibrate) navigator.vibrate(10);
      };
      b.onpointerdown = h("keydown");
      b.onpointerup = b.onpointerleave = h("keyup");
    });

    // Late Init
    Cloud.init();
    Game.loadLibrary(); // Using the method from Game service
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
