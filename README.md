# Nuvio SVG Badges

SVG stream badge pack for Nuvio.

Import URL:

```text
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v14/badges.json
```

The pack is generated from `badges.config.json` and `generate-badges.mjs` so
badge names, regex patterns, colors, and SVG assets stay consistent. The v14 URL
is intentionally versioned so Nuvio/Coil can fetch fresh badge images instead of
reusing an older cached URL.

Final minimalist version:

```text
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v12/badges.json
```

Final light-color version:

```text
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v13/badges.json
```

The SVGs are transparent text/icon layers. Nuvio draws the bordered chip, which
keeps imported badges visually aligned with built-in stream badges. The v10 SVGs
render label text as Roboto Condensed vector paths, so display is not
dependent on the client device's font fallback.

Commands:

```bash
npm install
node generate-badges.mjs
npm run render -- . v14
```

The generated preview files are:

```text
dist/v14/preview.html
dist/v14/nuvio-tv-sim-4x.png
dist/preview.html
```

Use the rendered `nuvio-tv-sim-4x.png` sheet for visual checks. The HTML preview
only shows raw imported images and does not match Nuvio's chip rendering closely.

If this repo is published under a different owner/name, regenerate with:

```bash
BADGE_BASE_URL="https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist/v14" node generate-badges.mjs
```
