#!/usr/bin/env bash
# Builds dist/keyword-filter-chrome.zip (Chrome Web Store) and dist/keyword-filter-firefox.zip
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist && mkdir -p dist/chrome dist/firefox
for t in chrome firefox; do
  cp manifest.json content.js content.css defaults.js options.html options.js LICENSE dist/$t/
  cp -r _locales dist/$t/
  mkdir -p dist/$t/icons && cp icons/icon-{48,96,128}.png dist/$t/icons/
done
# Chrome rejects/warns on Firefox-only keys
python3 - <<'P'
import json
m=json.load(open("manifest.json")); m.pop("browser_specific_settings",None)
json.dump(m,open("dist/chrome/manifest.json","w"),indent=2,ensure_ascii=False)
P
for t in chrome firefox; do (cd dist/$t && zip -qr ../keyword-filter-$t.zip .); done
ls -l dist/*.zip
