// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
const $ = id => document.getElementById(id);
const t = key => browser.i18n.getMessage(key);

document.documentElement.lang = browser.i18n.getUILanguage();
document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });

function fill(c) {
  $("keywords").value = c.keywords.join("\n");
  $("wholeWord").checked = c.wholeWord;
  $("blockProfiles").checked = c.blockProfiles;
  document.querySelectorAll('input[name="mode"]').forEach(r => { r.checked = r.value === c.mode; });
}

function flash(msg) {
  $("status").textContent = msg;
  setTimeout(() => { $("status").textContent = ""; }, 1500);
}

browser.storage.sync.get(TF_DEFAULTS).then(fill);

$("save").addEventListener("click", () => {
  const keywords = $("keywords").value.split("\n").map(s => s.trim()).filter(Boolean);
  const mode = document.querySelector('input[name="mode"]:checked')?.value || "placeholder";
  browser.storage.sync.set({
    keywords,
    wholeWord: $("wholeWord").checked,
    blockProfiles: $("blockProfiles").checked,
    mode
  }).then(() => flash(t("optSaved")));
});

$("reset").addEventListener("click", () => {
  browser.storage.sync.set({ ...TF_DEFAULTS }).then(() => {
    fill(TF_DEFAULTS);
    flash(t("optResetDone"));
  });
});
