# Nuvio SVG Badges

Fusion-style stream badge pack for Nuvio.

Import URL:

```text
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/badges.json
```

The pack is generated from `generate-badges.mjs` so badge shape, colors, and
JSON stay consistent.

Commands:

```bash
node generate-badges.mjs
```

The generated preview file is:

```text
dist/preview.html
```

If this repo is published under a different owner/name, regenerate with:

```bash
BADGE_BASE_URL="https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist" node generate-badges.mjs
```
