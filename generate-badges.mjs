import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const CONFIG_PATH = path.resolve('badges.config.json');
const OUT_ROOT = path.resolve('dist');
const require = createRequire(import.meta.url);

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const VERSION = process.env.BADGE_VERSION || config.version || 'v2';
const BASE_URL =
  process.env.BADGE_BASE_URL ||
  config.baseUrl ||
  `https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist/${VERSION}`;
const OUT_DIR = path.join(OUT_ROOT, VERSION);
const SVG_DIR = path.join(OUT_DIR, 'svg');
const BADGE_HEIGHT = 16;
const textRenderer = loadTextRenderer();

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
  if (textRenderer) {
    const fontSize = fontSizeFor(label);
    const metrics = textRenderer.getMetrics(label, {
      fontSize,
      kerning: true,
      anchor: 'left baseline',
    });
    const textWidth = Math.ceil(metrics.width + 1);
    if (mark === 'none') {
      return Math.max(28, Math.min(84, textWidth + 8));
    }
    return Math.max(37, Math.min(84, textWidth + 19));
  }

  const markWidth = mark === 'none' ? 0 : 14;
  return Math.max(34, Math.min(92, Math.round(label.length * 6.9 + 9 + markWidth)));
}

function layoutFor(label, mark) {
  const width = widthFor(label, mark);
  if (!textRenderer || mark === 'none') {
    return { width, textX: mark === 'none' ? width / 2 : (width + 14) / 2 };
  }

  const fontSize = fontSizeFor(label);
  const metrics = textRenderer.getMetrics(label, {
    fontSize,
    kerning: true,
    anchor: 'left baseline',
  });
  const textWidth = Math.ceil(metrics.width + 1);
  return {
    width,
    textX: 15.2 + textWidth / 2,
  };
}

function fontSizeFor(label) {
  const pathFont = config.font?.renderer === 'path';
  const boost = pathFont ? 0.75 : 0;
  if (label.length >= 10) return 9.1 + boost;
  if (label.length >= 9) return 9.5 + boost;
  if (label.length >= 8) return 10 + boost;
  if (label.length <= 3) return 11.6 + boost;
  return 10.7 + boost;
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  if (value.length !== 6) return { r: 255, g: 255, b: 255 };
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function markSvg(mark, style) {
  const fill = style.icon || style.text;
  const cutout = style.fill;
  switch (mark) {
    case 'remux':
      return `<path d="M4.5 8l3.8-3.8h4.9L9.4 8l3.8 3.8H8.3z" fill="${fill}"/>`;
    case 'disc':
      return `<circle cx="8.5" cy="8" r="5" fill="none" stroke="${fill}" stroke-width="1.8"/><circle cx="8.5" cy="8" r="1.4" fill="${fill}"/>`;
    case 'globe':
      return `<circle cx="8.5" cy="8" r="5" fill="none" stroke="${fill}" stroke-width="1.6"/><path d="M3.8 8h9.4M8.5 3.2c1.5 1.5 1.5 8.1 0 9.6M8.5 3.2c-1.5 1.5-1.5 8.1 0 9.6" fill="none" stroke="${fill}" stroke-width="1.05" stroke-linecap="round"/>`;
    case 'bolt':
      return `<path d="M9.5 2.8L4.6 8.7h3.3l-.9 4.5 5-6h-3.2z" fill="${fill}"/>`;
    case 'frame':
      return `<path d="M3.8 4.7h9.4v6.6H3.8z" fill="none" stroke="${fill}" stroke-width="1.5"/><path d="M5.8 6.9h5.4v2.2H5.8z" fill="${fill}" opacity=".65"/>`;
    case 'dolby':
      return `<path d="M3.6 4.1h5.1c2.4 0 4.1 1.7 4.1 3.9s-1.7 3.9-4.1 3.9H3.6z" fill="${fill}"/><path d="M6.7 5.4v5.2c1.2-.4 2.1-1.3 2.1-2.6S7.9 5.8 6.7 5.4z" fill="${cutout}"/>`;
    case 'dts':
      return `<path d="M3.9 5.1c2.5-1.3 6.6-1.3 9.1 0M3.9 7.1c2.5-1.2 6.6-1.2 9.1 0M3.9 9.1c2.5-1.2 6.6-1.2 9.1 0M3.9 11.1c2.5-1.2 6.6-1.2 9.1 0" fill="none" stroke="${fill}" stroke-width="1.2" stroke-linecap="round"/>`;
    case 'speaker':
      return `<path d="M3.5 9.8h2.4l3.2 2.8V3.4L5.9 6.2H3.5z" fill="${fill}"/><path d="M10.6 5.3c1.2 1.4 1.2 4 0 5.4M12.4 3.9c2 2.4 2 5.8 0 8.2" fill="none" stroke="${fill}" stroke-width="1.25" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

function loadTextRenderer() {
  if (config.font?.renderer !== 'path') return null;

  let TextToSVG;
  try {
    TextToSVG = require('text-to-svg');
  } catch {
    try {
      TextToSVG = require('/tmp/nuvio-render/node_modules/text-to-svg');
    } catch {
      return null;
    }
  }

  const fontPath = path.resolve(config.font.path || '');
  if (!fs.existsSync(fontPath)) return null;
  return TextToSVG.loadSync(fontPath);
}

function labelPath(label, x, y, fontSize, attributes) {
  if (!textRenderer) return null;
  return textRenderer.getPath(label, {
    x,
    y,
    fontSize,
    anchor: 'center baseline',
    kerning: true,
    attributes,
  });
}

function labelPaths(label, x, y, fontSize, style, darkText) {
  const shadowColor = darkText ? '#FFFFFF' : '#000000';
  const shadowOpacity = darkText ? '.16' : '.22';
  const shadowY = darkText ? y - 0.28 : y + 0.28;
  const strokeWidth = label.length >= 9 ? '.24' : '.3';

  return [
    labelPath(label, x, shadowY, fontSize, {
      fill: shadowColor,
      opacity: shadowOpacity,
    }),
    labelPath(label, x, y, fontSize, {
      fill: style.text,
      stroke: style.text,
      'stroke-width': strokeWidth,
      'stroke-linejoin': 'round',
      'paint-order': 'stroke fill',
    }),
  ].join('\n  ');
}

function labelTexts(label, x, fontSize, style, darkText) {
  const shadowColor = darkText ? '#FFFFFF' : '#000000';
  const shadowOpacity = darkText ? '.24' : '.36';
  const shadowY = darkText ? '11.35' : '12.35';
  const highlightColor = darkText ? '#000000' : '#FFFFFF';
  const highlightOpacity = darkText ? '.12' : '.16';
  const highlightY = darkText ? '12.3' : '11.25';
  const fontWeight = label.length >= 9 ? 760 : 820;
  const textStyle = `font-family="sans-serif-condensed, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="0"`;

  return `<text x="${x}" y="${shadowY}" fill="${shadowColor}" opacity="${shadowOpacity}" text-anchor="middle"
    ${textStyle}>${esc(label)}</text>
  <text x="${x}" y="${highlightY}" fill="${highlightColor}" opacity="${highlightOpacity}" text-anchor="middle"
    ${textStyle}>${esc(label)}</text>
  <text x="${x}" y="11.8" fill="${style.text}" text-anchor="middle"
    ${textStyle}>${esc(label)}</text>`;
}

function svgFor(badge) {
  const style = badge.style;
  const mark = style.mark || 'none';
  const { width, textX } = layoutFor(badge.label, mark);
  const fontSize = fontSizeFor(badge.label);
  const hasMark = mark !== 'none';
  const darkText = luminance(style.text) < 0.45;
  const labelSvg = textRenderer
    ? labelPaths(badge.label, textX, 11.7, fontSize, style, darkText)
    : labelTexts(badge.label, textX, fontSize, style, darkText);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${BADGE_HEIGHT}" viewBox="0 0 ${width} ${BADGE_HEIGHT}" role="img" aria-label="${esc(badge.name)}">
  ${hasMark ? `<g>${markSvg(mark, style)}</g>` : ''}
  ${labelSvg}
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
