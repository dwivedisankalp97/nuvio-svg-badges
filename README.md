# Nuvio SVG Badges

Self-contained SVG stream badge pack for Nuvio.

Import URL:

```text
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v2/badges.json
```

The pack is generated from `badges.config.json` and `generate-badges.mjs` so
badge names, regex patterns, colors, and SVG assets stay consistent. The v2 URL
is intentionally versioned so Nuvio/Coil can fetch fresh badge images instead of
reusing an older cached URL.

Commands:

```bash
node generate-badges.mjs
```

The generated preview files are:

```text
dist/v2/preview.html
dist/preview.html
```

If this repo is published under a different owner/name, regenerate with:

```bash
BADGE_BASE_URL="https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist/v2" node generate-badges.mjs
```
