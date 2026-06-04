# Setup Guide

This repo generates Nuvio-compatible stream badge configs from
`badges.config.json`.

## Requirements

- Node.js 18 or newer
- npm
- A public GitHub repo if you want Nuvio to import the badge pack from
  `raw.githubusercontent.com`

## First Run

```bash
npm install
npm run generate
npm run render
```

The active version comes from `badges.config.json`.

For the current repo, generated files are written to:

```text
dist/v15/badges.json
dist/v15/svg/
dist/v15/preview.html
dist/v15/nuvio-tv-sim-4x.png
```

The rendered PNG is intentionally ignored by git. It is for visual inspection
only.

## Creating a New Version

Change `version` and `baseUrl` together:

```json
{
  "version": "v16",
  "baseUrl": "https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist/v16"
}
```

Then run:

```bash
npm run generate
npm run render
```

Commit:

```bash
git add badges.config.json dist/badges.json dist/preview.html dist/v16
git commit -m "Add v16 badge pack"
git push
```

Import:

```text
https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist/v16/badges.json
```

Use a new version folder when changing visuals. Nuvio and Coil may cache images,
so changing the version path is the cleanest cache-busting mechanism.

## Editing Badge Rules

Badge rules live under `badges` in `badges.config.json`.

Example:

```json
{
  "groupId": "quality",
  "id": "webdl",
  "name": "WebDL",
  "label": "WEB-DL",
  "pattern": "(?i)\\b(?:web[- .]?dl|webdl|web[- .]?rip|webrip|web)\\b",
  "style": {
    "fill": "#0284C7",
    "stroke": "#7DD3FC",
    "text": "#F0F9FF",
    "icon": "#F0F9FF",
    "asset": "assets/badge-logos/white/white-webdl.svg"
  }
}
```

Notes:

- `pattern` is the regex Nuvio uses to decide whether a stream gets the badge.
- `id` becomes `dist/<version>/svg/<id>.svg`.
- `style.asset` can point to one of the local SVG assets.
- White or near-white fills/strokes in assets are recolored to `style.icon` or
  `style.text` during generation.
- Keep regexes specific enough to avoid duplicate or redundant badges.

## Editing Colors

For filled chips:

```json
"theme": {
  "tagStyle": "filled"
}
```

Use:

- `style.fill` for chip background
- `style.stroke` for chip border
- `style.text` for label text
- `style.icon` for SVG icon/logo color

Try to keep category colors distinct. The final filled pack uses:

- Quality: blue
- Resolution: emerald
- Visual HDR/DV: rose
- SeaDex: green
- IMAX: blue
- Audio: purple
- Channels: slate
- Streaming: service colors

## Previewing Correctly

`dist/<version>/preview.html` is useful for checking that files exist, but it is
not a faithful Nuvio rendering.

Use this instead:

```bash
npm run render
```

That creates:

```text
dist/<version>/nuvio-tv-sim-4x.png
```

The renderer simulates Nuvio's chip background, border, spacing, and badge image
placement more closely.

## Publishing Checklist

Before pushing:

```bash
npm run generate
npm run render
node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('dist/'+JSON.parse(fs.readFileSync('badges.config.json','utf8')).version+'/badges.json','utf8')); console.log({filters:p.filters.length, groups:p.groups.length});"
git status --short
```

Do not commit local screenshots or rendered preview PNGs unless you explicitly
want them in the repo.
