// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
(() => {
  "use strict";

  const t = (key, ...args) => browser.i18n.getMessage(key, args);

  // Threads uses obfuscated class names; these attributes are more stable.
  const POST_SELECTORS = [
    '[data-pressable-container="true"]',
    '[role="article"]'
  ];
  const POST_SELECTOR = POST_SELECTORS.join(",");

  let cfg = { ...TF_DEFAULTS };
  let regex = null;
  const lastSeen = new WeakMap();   // container -> last checked text
  let pending = new Set();
  let scheduled = false;

  // ---------- keyword regex ----------
  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildRegex(keywords, wholeWord) {
    const parts = keywords
      .map(k => k.trim())
      .filter(Boolean)
      .map(k => {
        let p = escapeRe(k).replace(/\s+/g, "[\\s\\-_]+");
        if (wholeWord) {
          if (/^[\p{L}\p{N}_]/u.test(k)) p = "(?<![\\p{L}\\p{N}_])" + p;
          if (/[\p{L}\p{N}_]$/u.test(k)) p = p + "(?![\\p{L}\\p{N}_])";
        }
        return p;
      });
    if (!parts.length) return null;
    return new RegExp(parts.join("|"), "iu");
  }

  // ---------- post checks ----------
  function outermostPost(el) {
    let top = el;
    let cur = el.parentElement ? el.parentElement.closest(POST_SELECTOR) : null;
    while (cur) {
      top = cur;
      cur = cur.parentElement ? cur.parentElement.closest(POST_SELECTOR) : null;
    }
    return top;
  }

  function textOf(el) {
    let t = el.innerText || el.textContent || "";
    // also check links (e.g. /@asmongold) and image alt text
    el.querySelectorAll("a[href]").forEach(a => { t += " " + decodeURIComponent(a.getAttribute("href") || ""); });
    el.querySelectorAll("img[alt]").forEach(img => { t += " " + img.alt; });
    return t;
  }

  function hidePost(post, match) {
    if (post.dataset.tfAllowed === "1" || post.classList.contains("tf-hidden")) return;
    post.classList.add("tf-hidden");

    if (cfg.mode === "placeholder") {
      const ph = document.createElement("div");
      ph.className = "tf-placeholder";
      const label = document.createElement("span");
      label.textContent = t("hiddenPost", match);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = t("showAnyway");
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        post.dataset.tfAllowed = "1";
        post.classList.remove("tf-hidden");
        ph.remove();
      });
      ph.append(label, btn);
      post.before(ph);
    }
  }

  function checkPost(post) {
    if (!regex || post.dataset.tfAllowed === "1" || post.classList.contains("tf-hidden")) return;
    const text = textOf(post);
    if (lastSeen.get(post) === text) return;
    lastSeen.set(post, text);
    const m = text.match(regex);
    if (m) hidePost(post, m[0]);
  }

  function scan(root) {
    if (!(root instanceof Element)) return;
    const seen = new Set();
    const collect = el => {
      const top = outermostPost(el);
      if (!seen.has(top)) { seen.add(top); checkPost(top); }
    };
    if (root.matches(POST_SELECTOR)) collect(root);
    const inside = root.closest(POST_SELECTOR);
    if (inside) collect(inside);
    root.querySelectorAll(POST_SELECTOR).forEach(collect);
  }

  // ---------- profile pages ----------
  function checkProfile() {
    const old = document.getElementById("tf-profile-block");
    const m = location.pathname.match(/^\/@([^/]+)/);
    const handle = m ? decodeURIComponent(m[1]) : null;
    const hit = cfg.blockProfiles && regex && handle && regex.test(handle);
    if (hit && !old && sessionStorage.getItem("tf-allow-" + handle) !== "1") {
      const ov = document.createElement("div");
      ov.id = "tf-profile-block";
      const box = document.createElement("div");
      const p = document.createElement("p");
      p.textContent = t("profileBlocked", handle);
      const back = document.createElement("button");
      back.textContent = t("goBack");
      back.addEventListener("click", () => history.back());
      const show = document.createElement("button");
      show.textContent = t("showAnyway");
      show.addEventListener("click", () => {
        sessionStorage.setItem("tf-allow-" + handle, "1");
        ov.remove();
      });
      box.append(p, back, show);
      ov.append(box);
      document.documentElement.append(ov);
    } else if (!hit && old) {
      old.remove();
    }
  }

  // ---------- observing ----------
  function flush() {
    scheduled = false;
    const nodes = pending;
    pending = new Set();
    nodes.forEach(n => { if (n.isConnected) scan(n); });
    checkProfile();
  }

  function schedule(node) {
    pending.add(node);
    if (!scheduled) {
      scheduled = true;
      setTimeout(flush, 150);
    }
  }

  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      const t = m.target.nodeType === 1 ? m.target : m.target.parentElement;
      if (t) schedule(t);
    }
  });

  function resetAll() {
    document.querySelectorAll(".tf-placeholder").forEach(p => p.remove());
    document.querySelectorAll(".tf-hidden").forEach(p => p.classList.remove("tf-hidden"));
    document.getElementById("tf-profile-block")?.remove();
    document.querySelectorAll(POST_SELECTOR).forEach(p => lastSeen.delete(p));
  }

  function applyConfig(stored) {
    cfg = { ...TF_DEFAULTS, ...stored };
    regex = buildRegex(cfg.keywords, cfg.wholeWord);
    document.documentElement.classList.toggle("tf-mode-hide", cfg.mode === "hide");
  }

  browser.storage.sync.get(TF_DEFAULTS).then(stored => {
    applyConfig(stored);
    scan(document.body);
    checkProfile();
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });

  browser.storage.onChanged.addListener((_changes, area) => {
    if (area !== "sync") return;
    browser.storage.sync.get(TF_DEFAULTS).then(stored => {
      resetAll();
      applyConfig(stored);
      scan(document.body);
      checkProfile();
    });
  });
})();
