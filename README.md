# Keyword Filter for Threads

A small Firefox (desktop and Android) extension that hides posts on
[Threads](https://www.threads.com) mentioning keywords you choose. It ships with a
preset list, but the list is fully editable.

## Features

- Hides posts by text, username, links and image alt text (case-insensitive)
- Whole-word matching, so short keywords don't hit unrelated words
- Two display modes: collapse with a "Show anyway" notice, or remove completely
- Optionally covers profile pages whose handle matches a keyword
- Localized: English, German, Spanish, French

## Privacy

All processing happens locally in your browser. The extension collects no data,
makes no network requests, and only uses the `storage` permission to save your settings.

## Install / develop

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on…** and select `manifest.json`.

Or package with [`web-ext`](https://github.com/mozilla/web-ext): `web-ext build`.

## Settings

Open the add-on's preferences to edit keywords (one per line), toggle whole-word
matching, choose the display mode, or restore the defaults.

## Disclaimer / trademarks

This is an independent, unofficial project. It is **not affiliated with, endorsed by,
or sponsored by** Meta Platforms, Inc., Threads, or any person, streamer, guild or
brand whose name appears in the default keyword list (e.g. "Asmongold", "Olympus").
All names and trademarks are the property of their respective owners and are used
only to describe the filter's default keywords (nominative use). The keywords are
user-editable data; the extension does not target or collect anything about any person.

The software is provided "as is", without warranty of any kind; use is at your own risk.

## License

[Mozilla Public License 2.0](LICENSE)
