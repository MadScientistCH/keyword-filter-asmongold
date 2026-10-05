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

## Releasing

Pushing a tag like `v1.0.1` triggers `.github/workflows/release.yml`, which

1. builds one zip each for Firefox, Chrome, Edge and Opera (`scripts/build.sh`; the
   version is taken from the tag, Chromium builds drop the Gecko-only manifest keys),
2. lints the Firefox package with `web-ext lint`,
3. attaches all zips to a GitHub Release,
4. submits to the stores whose secrets are configured (otherwise that job is skipped):

| Store | Repository secrets |
| --- | --- |
| Firefox (AMO) | `AMO_JWT_ISSUER`, `AMO_JWT_SECRET` |
| Chrome Web Store | `CWS_EXTENSION_ID`, `CWS_CLIENT_ID`, `CWS_CLIENT_SECRET`, `CWS_REFRESH_TOKEN` |
| Edge Add-ons | `EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID`, `EDGE_API_KEY` |
| Opera Add-ons | none – Opera has no upload API; upload the `-opera` zip manually |

The first submission to every store has to be done manually (listing, screenshots,
privacy answers); afterwards the pipeline publishes updates.

### Setup checklist (one-time)

**Firefox (AMO)**
- [ ] Log in at addons.mozilla.org and submit the first version manually (creates the listing for the add-on ID in `manifest.json`)
- [ ] Developer Hub → Tools → Manage API Keys → generate credentials
- [ ] Save `AMO_JWT_ISSUER` (JWT issuer) and `AMO_JWT_SECRET` (shown only once)

**Chrome Web Store**
- [ ] Register at the Chrome Web Store Developer Dashboard (one-time 5 USD fee)
- [ ] Upload and submit the first version manually; the 32-letter extension ID from the URL is `CWS_EXTENSION_ID`
- [ ] Google Cloud Console: create a project and enable the *Chrome Web Store API*
- [ ] Configure the OAuth consent screen and set it to *In production* (in *Testing* the refresh token expires after 7 days)
- [ ] Credentials → create an OAuth client ID of type *Desktop app* → `CWS_CLIENT_ID`, `CWS_CLIENT_SECRET`
- [ ] Obtain the refresh token (scope `https://www.googleapis.com/auth/chromewebstore`, see the "Obtaining Google API keys" section of `chrome-webstore-upload-cli`) → `CWS_REFRESH_TOKEN`

**Microsoft Edge Add-ons**
- [ ] Register in the Partner Center for Edge Add-ons (free)
- [ ] Submit the first version manually; the product GUID is `EDGE_PRODUCT_ID`
- [ ] Partner Center → Publish API → enable and create a key → `EDGE_CLIENT_ID`, `EDGE_API_KEY`
- [ ] Renew the API key before it expires (about every 72 days), otherwise the Edge job fails

**Opera Add-ons**
- [ ] Nothing to configure; upload the `-opera` zip from the GitHub Release at addons.opera.com for each release

**GitHub**
- [ ] Repository → Settings → Secrets and variables → Actions → add each secret above under exactly that name
- [ ] Test with a tag, e.g. `git tag v1.0.1 && git push origin v1.0.1`

Local build: `scripts/build.sh` (needs `jq` and `zip`), output in `dist/`.

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
