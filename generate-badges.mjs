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
  if (!label && mark === 'dts') return 34;
  if (!label && mark !== 'none') return 26;

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
    if (mark === 'dts') {
      return Math.max(42, Math.min(88, textWidth + 28));
    }
    return Math.max(37, Math.min(84, textWidth + 19));
  }

  const markWidth = mark === 'none' ? 0 : 14;
  return Math.max(34, Math.min(92, Math.round(label.length * 6.9 + 9 + markWidth)));
}

function layoutFor(label, mark) {
  const width = widthFor(label, mark);
  if (!label || !textRenderer || mark === 'none') {
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
    textX: (mark === 'dts' ? 21 : 15.2) + textWidth / 2,
  };
}

function fontSizeFor(label) {
  const pathFont = config.font?.renderer === 'path';
  const boost = pathFont ? 0.2 : 0;
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

function styleFor(badge) {
  if (config.theme?.name !== 'monochrome-outline') return badge.style;
  return {
    ...badge.style,
    fill: config.theme.fill || '#171717',
    stroke: config.theme.stroke || '#F4F4F5',
    text: config.theme.text || '#FFFFFF',
    accent: config.theme.accent || config.theme.text || '#FFFFFF',
    icon: config.theme.icon || config.theme.text || '#FFFFFF',
  };
}

function markSvg(mark, style, options = {}) {
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
      return `<g transform="translate(2.2 1.45) scale(.5)"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 4V20H24V4H0ZM10 12C10 9.79086 8.20914 8 6 8H4V16H6C8.20914 16 10 14.2091 10 12ZM18 16H20V8H18C15.7909 8 14 9.79086 14 12C14 14.2091 15.7909 16 18 16Z" fill="${fill}"/></g>`;
    case 'dts':
      return `<g transform="${options.iconOnly ? 'translate(7.6 .75) scale(.76)' : 'translate(2.2 .65) scale(.7)'}"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.303 6.657v4.046c-.458-.144-.961-.224-1.49-.224C1.708 10.479 0 11.61 0 13.31c0 1.913 1.708 2.832 3.814 2.832.528 0 1.031-.08 1.488-.224v.204h4.299v-4.528h1.278v3.368s.209 1.144 2.89 1.144c0 0 1.141-.044 2.352-.301.081-.017.345-.112.727-.083.396.029.91.183.975.196.392.065.778.143 1.872.188.897.037 1.791-.093 2.019-.131 1.071-.18 2.697-1.038 2.191-2.223-.201-.47-.836-.919-1.153-1.161-.139-.106-1.257-.913-.325-1.24 0 0 .236-.061.496-.061.15 0 .638.01.638.01l.114-.507s-1.12-.392-3.041-.392c-.817 0-3.711.3-3.711 1.651 0 1.028 1.785 2.025 1.872 2.105.114.106.331.331.299.511 0 .213-.341.752-1.402.507-.813-.188-1.101-.2-1.717-.082 0 0-.645.087-.768-.147v-3.351h1.146v-1.111h-1.163V7.442l-4.298 1.831v1.21H9.617V6.657H5.303zM5.44 14.952c-.704-.145-1.239-.842-1.239-1.634 0-.792.535-1.489 1.239-1.634v3.268z" fill="${fill}"/></g>`;
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
  const style = styleFor(badge);
  const mark = style.mark || 'none';
  const { width, textX } = layoutFor(badge.label, mark);
  const fontSize = fontSizeFor(badge.label);
  const hasMark = mark !== 'none';
  const darkText = luminance(style.text) < 0.45;
  const labelSvg = !badge.label
    ? ''
    : textRenderer
    ? labelPaths(badge.label, textX, 11.7, fontSize, style, darkText)
    : labelTexts(badge.label, textX, fontSize, style, darkText);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${BADGE_HEIGHT}" viewBox="0 0 ${width} ${BADGE_HEIGHT}" role="img" aria-label="${esc(badge.name)}">
  ${hasMark ? `<g>${markSvg(mark, style, { iconOnly: !badge.label })}</g>` : ''}
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
    const style = styleFor(badge);
    const filename = `${badge.id}.svg`;
    fs.writeFileSync(path.join(SVG_DIR, filename), svgFor(badge));
    return {
      id: badge.id,
      groupId: badge.groupId,
      name: badge.name,
      pattern: badge.pattern,
      imageURL: `${BASE_URL}/svg/${filename}`,
      isEnabled: true,
      tagColor: style.fill,
      tagStyle: config.theme?.tagStyle || 'filled',
      textColor: style.text,
      borderColor: style.stroke,
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
