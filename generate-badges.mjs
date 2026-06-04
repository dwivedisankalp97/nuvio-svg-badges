import fs from 'node:fs';
import path from 'node:path';

const CONFIG_PATH = path.resolve('badges.config.json');
const OUT_ROOT = path.resolve('dist');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const VERSION = process.env.BADGE_VERSION || config.version || 'v2';
const BASE_URL =
  process.env.BADGE_BASE_URL ||
  config.baseUrl ||
  `https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/${VERSION}`;
const OUT_DIR = path.join(OUT_ROOT, VERSION);
const SVG_DIR = path.join(OUT_DIR, 'svg');
const BADGE_HEIGHT = 16;

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function ensureDirs() {
  fs.mkdirSync(SVG_DIR, { recursive: true });
}

function widthFor(label, mark) {
  return Math.max(34, Math.min(92, Math.round(label.length * 7.25 + 10)));
}

function fontSizeFor(label) {
  if (label.length >= 10) return 9.2;
  if (label.length >= 9) return 9.7;
  if (label.length >= 8) return 10.1;
  if (label.length <= 3) return 11.8;
  return 10.8;
}

function markSvg(mark, style) {
  switch (mark) {
    case 'diamond':
      return `<path d="M12 4.5 L17.5 10 L12 15.5 L6.5 10 Z" fill="${style.accent}" opacity=".95"/>`;
    case 'disc':
      return `<circle cx="12" cy="10" r="5.4" fill="none" stroke="${style.accent}" stroke-width="1.7"/><circle cx="12" cy="10" r="1.8" fill="${style.accent}"/>`;
    case 'signal':
      return `<path d="M6.5 13.8 h11 v2.7h-11zM9.3 9.6 h8.2v2.7H9.3zM12.1 5.4h5.4v2.7h-5.4z" fill="${style.accent}" opacity=".95"/>`;
    case 'star':
      return `<path d="M12 3.8l1.9 4 4.3.5-3.2 3 .8 4.3-3.8-2.1-3.8 2.1.8-4.3-3.2-3 4.3-.5z" fill="${style.accent}"/>`;
    case 'spark':
      return `<path d="M12 3.7 L13.8 8.5 L18.5 10 L13.8 11.5 L12 16.3 L10.2 11.5 L5.5 10 L10.2 8.5 Z" fill="${style.accent}" opacity=".92"/>`;
    case 'frame':
      return `<path d="M6 6h12v8H6z" fill="none" stroke="${style.accent}" stroke-width="1.7"/><path d="M8.5 8.5h7v3H8.5z" fill="${style.accent}" opacity=".55"/>`;
    case 'dolby':
      return `<path d="M6 5h5.4c3 0 5.4 2.2 5.4 5s-2.4 5-5.4 5H6z" fill="${style.accent}"/><path d="M9.4 6.3v7.4c1.9-.4 3.4-2 3.4-3.7S11.3 6.7 9.4 6.3z" fill="${style.fill}"/><path d="M18.3 5h2.7v10h-2.7z" fill="${style.accent}"/>`;
    default:
      return '';
  }
}

function svgFor(badge) {
  const style = badge.style;
  const mark = 'none';
  const width = widthFor(badge.label, mark);
  const fontSize = fontSizeFor(badge.label);
  const textX = width / 2;
  const label = esc(badge.label);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${BADGE_HEIGHT}" viewBox="0 0 ${width} ${BADGE_HEIGHT}" role="img" aria-label="${esc(badge.name)}">
  <text x="${textX}" y="11.8" fill="${style.text}" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900">${label}</text>
</svg>
`;
}

function build() {
  ensureDirs();

  const groups = config.groups.map((group) => ({
    id: group.id,
    name: group.name,
    color: group.color,
    isExpanded: true,
  }));

  const filters = config.badges.map((badge) => {
    const filename = `${badge.id}.svg`;
    fs.writeFileSync(path.join(SVG_DIR, filename), svgFor(badge));
    return {
      id: badge.id,
      groupId: badge.groupId,
      name: badge.name,
      pattern: badge.pattern,
      imageURL: `${BASE_URL}/svg/${filename}`,
      isEnabled: true,
      tagColor: badge.style.fill,
      tagStyle: 'filled',
      textColor: badge.style.text,
      borderColor: badge.style.stroke,
      type: 'filter',
    };
  });

  const payload = { filters, groups };
  fs.writeFileSync(path.join(OUT_DIR, 'badges.json'), `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, 'preview.html'), previewHtml(filters, groups));

  // Compatibility copy for the original import URL. New imports should prefer /v2/.
  fs.writeFileSync(path.join(OUT_ROOT, 'badges.json'), `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_ROOT, 'preview.html'), previewHtml(filters, groups));
}

function previewHtml(filters, groups) {
  return `<!doctype html>
<meta charset="utf-8">
<title>Nuvio SVG Badges ${esc(VERSION)}</title>
<style>
  body { margin: 0; background: #050505; color: #f4f4f5; font-family: Inter, system-ui, sans-serif; padding: 32px; }
  h1 { font-size: 24px; margin: 0 0 8px; }
  p { color: #a1a1aa; margin: 0 0 24px; }
  h2 { font-size: 16px; margin: 24px 0 10px; color: #e5e7eb; }
  .grid { display: flex; flex-wrap: wrap; gap: 8px; max-width: 920px; }
  .chip { height: 20px; display: inline-flex; align-items: center; justify-content: center; padding: 2px 3px; box-sizing: border-box; }
  .chip img { height: 16px; display: block; }
</style>
<h1>Nuvio SVG Badges ${esc(VERSION)}</h1>
<p>Import URL: <code>${BASE_URL}/badges.json</code></p>
${groups
  .map((group) => {
    const groupFilters = filters.filter((filter) => filter.groupId === group.id);
    return `<h2>${esc(group.name)}</h2>
<div class="grid">
${groupFilters
  .map(
    (filter) =>
      `  <span class="chip"><img src="svg/${filter.id}.svg" alt="${esc(filter.name)}"></span>`
  )
  .join('\n')}
</div>`;
  })
  .join('\n')}
`;
}

build();
