# Chrome Web Store – Listing & Dashboard-Angaben

**Name:** Keyword Filter for Threads
**Kategorie:** Social & Communication (oder Productivity)
**Sprache:** English (+ de, es, fr via _locales)

**Kurzbeschreibung (≤132):** siehe `_locales/en/messages.json` → extDescription

**Detaillierte Beschreibung:**
Hide posts on Threads that mention keywords you choose. The extension ships with a
preset list, but the list is fully editable.

• Matches post text, usernames, links and image alt text (case-insensitive)
• Whole-word matching so short keywords don't hit unrelated words
• Collapse posts with a "Show anyway" notice, or remove them completely
• Optionally covers profile pages whose handle matches a keyword
• English, German, Spanish, French

Privacy: everything runs locally. No data is collected, no network requests are made.

Unofficial; not affiliated with, endorsed by or sponsored by Meta Platforms, Inc., Threads
or any person or brand named in the default keyword list.

## Tab "Privacy practices"
- **Single purpose:** Hide posts on threads.net / threads.com that match user-defined keywords.
- **Permission justification – `storage`:** Saves the user's keyword list and display settings (chrome.storage.sync).
- **Host permission justification (content script on threads.net / threads.com):** Required to read post text on Threads pages and hide matching posts. Page content is processed locally and never transmitted.
- **Remote code:** No.
- **Data usage:** collects none of the listed data types; check all three certifications (no sale, no unrelated use, no creditworthiness use).
- **Privacy policy URL:** required by some reviewers when content scripts run on sites; point to the README "Privacy" section on GitHub.

## Assets, die du selbst erzeugen musst
- Mind. 1 Screenshot, 1280×800 oder 640×400 (PNG/JPG, bis zu 5)
- Small promo tile 440×280 (Pflicht)
- Optional: Marquee 1400×560
- Store-Icon 128×128: `icons/icon-128.png` (vorhanden)

## Upload
`./scripts/build.sh` → `dist/keyword-filter-chrome.zip` im Developer Dashboard hochladen
(einmalige Registrierungsgebühr 5 USD).
