# Nuvio SVG Badges

SVG stream badge pack and generator for Nuvio.

## Import URLs

Current final filled version:

```text
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v15/badges.json
```

Previous finalized versions:

```text
# Minimalist
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v12/badges.json

# Light color
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v13/badges.json

# Filled color, original palette
https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/v14/badges.json
```

## Generate Your Own Pack

Fork this repo, edit `badges.config.json`, then run:

```bash
npm install
npm run generate
npm run render
```

`npm run generate` writes:

```text
dist/<version>/badges.json
dist/<version>/svg/*.svg
dist/preview.html
```

`npm run render` writes a Nuvio-style visual check:

```text
dist/<version>/nuvio-tv-sim-4x.png
```

Use the rendered PNG for visual checks. The HTML preview only shows raw imported
images and does not match Nuvio's chip rendering closely.

## Publish

Set these fields in `badges.config.json` before generating:

```json
{
  "version": "v1",
  "baseUrl": "https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist/v1"
}
```

Commit and push the generated `dist/<version>` folder. Import this URL in Nuvio:

```text
https://raw.githubusercontent.com/<owner>/<repo>/refs/heads/main/dist/<version>/badges.json
```

Use a new version folder whenever you want to bypass Nuvio/Coil image caching.

## Configuration

`badges.config.json` is the source of truth.

Important top-level fields:

- `version`: output folder under `dist/`.
- `baseUrl`: public URL prefix used in generated `imageURL` fields.
- `theme.tagStyle`: Nuvio chip style, usually `filled` or `bordered`.
- `theme.assetHeight`: default SVG logo height inside the chip.
- `font.path`: font used when generated text paths are needed.
- `groups`: sections shown in Nuvio's import preview.
- `badges`: filter rules and SVG styles.

Each badge has:

- `groupId`: must match a group `id`.
- `id`: output filename and stable badge identifier.
- `name`: label shown in the Nuvio import UI.
- `pattern`: regex used by Nuvio to match streams.
- `style.fill`: chip background color.
- `style.stroke`: chip border color.
- `style.text`: text/icon color.
- `style.asset`: SVG asset to render inside the chip.
- `style.assetHeight`: optional per-badge size override.

The generator recolors near-white fills/strokes in SVG assets to `style.icon` or
`style.text`, so white source SVGs can be reused across palettes.

More detailed setup notes are in [SETUP.md](SETUP.md).
