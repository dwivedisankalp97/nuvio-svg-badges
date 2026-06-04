# Nuvio SVG Badges

SVG stream badge pack for Nuvio.

Import URL:

```text
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v5/badges.json
```

The pack is generated from `badges.config.json` and `generate-badges.mjs` so
badge names, regex patterns, colors, and SVG assets stay consistent. The v5 URL
is intentionally versioned so Nuvio/Coil can fetch fresh badge images instead of
reusing an older cached URL.

The SVGs are transparent text layers. Nuvio draws the filled chip background and
border, which keeps imported badges visually aligned with built-in stream badges.

Commands:

```bash
node generate-badges.mjs
```

The generated preview files are:

```text
dist/v5/preview.html
dist/preview.html
```

If this repo is published under a different owner/name, regenerate with:

```bash
BADGE_BASE_URL="https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist/v5" node generate-badges.mjs
```
