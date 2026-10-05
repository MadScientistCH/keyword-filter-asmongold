#!/usr/bin/env bash
# Builds one zip per target browser into ./dist.
# Usage: scripts/build.sh [version]   (defaults to the version in manifest.json)
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="${1:-$(jq -r .version manifest.json)}"
VERSION="${VERSION#v}"
FILES=(manifest.json defaults.js content.js content.css options.html options.js _locales icons)
# Store icon and source SVG are not needed inside the package.
EXCLUDE=(-x "icons/icon-512.png" -x "icons/icon.svg")

rm -rf dist build
mkdir -p dist build

for target in firefox chrome edge opera; do
  dir="build/$target"
  mkdir -p "$dir"
  cp -r "${FILES[@]}" "$dir/"

  if [ "$target" = firefox ]; then
    jq --arg v "$VERSION" '.version = $v' manifest.json > "$dir/manifest.json"
  else
    # Chromium-based stores don't know the Gecko-specific settings.
    jq --arg v "$VERSION" '.version = $v | del(.browser_specific_settings)' \
      manifest.json > "$dir/manifest.json"
  fi

  (cd "$dir" && zip -qr -X "../../dist/keyword-filter-$target-$VERSION.zip" . "${EXCLUDE[@]}")
  echo "built dist/keyword-filter-$target-$VERSION.zip"
done
