import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const repo = process.argv[2] || process.cwd();
const configPath = path.join(repo, 'badges.config.json');
const config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : {};
const version = process.argv[3] || config.version || 'v1';
const out =
  process.argv[4] || path.join(repo, 'dist', version, 'nuvio-tv-sim-4x.png');
const root = path.join(repo, 'dist', version);
const payload = JSON.parse(
  fs.readFileSync(path.join(root, 'badges.json'), 'utf8')
);

const groups = payload.groups;
const filters = payload.filters;
const scale = 4;
const padding = 32;
const chipH = 20;
const imgH = 16;
const gap = 8;
const rowGap = 10;
const sectionGap = 24;
const width = 760;
let y = padding;

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function svgSize(svg) {
  const widthMatch = svg.match(/\bwidth="([^"]+)"/);
  const heightMatch = svg.match(/\bheight="([^"]+)"/);
  return {
    width: Number(widthMatch?.[1] || 64),
    height: Number(heightMatch?.[1] || 16),
  };
}

function inlineSvg(svg) {
  return svg
    .replace(/^<svg\b[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
}

const parts = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="1" viewBox="0 0 ${width} 1">`,
  '<rect width="100%" height="100%" fill="#050505"/>',
];

for (const group of groups) {
  const groupFilters = filters.filter((filter) => filter.groupId === group.id);
  if (!groupFilters.length) continue;

  y += y === padding ? 0 : sectionGap;
  parts.push(
    `<text x="${padding}" y="${y}" fill="#CDD6E0" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700">${esc(group.name)}</text>`
  );
  y += 18;

  let x = padding;
  for (const filter of groupFilters) {
    const svgPath = path.join(root, 'svg', `${filter.id}.svg`);
    const svg = fs.readFileSync(svgPath, 'utf8');
    const size = svgSize(svg);
    const chipW = size.width + 8;
    if (x + chipW > width - padding) {
      x = padding;
      y += chipH + rowGap;
    }

    parts.push(
      `<rect x="${x}" y="${y}" width="${chipW}" height="${chipH}" rx="5" fill="${filter.tagColor}" stroke="${filter.borderColor}" stroke-width="1"/>`
    );
    parts.push(
      `<g transform="translate(${x + 4} ${y + (chipH - imgH) / 2})">${inlineSvg(svg)}</g>`
    );
    x += chipW + gap;
  }

  y += chipH;
}

const height = y + padding;
parts[0] =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
parts.push('</svg>');

await sharp(Buffer.from(parts.join('\n')), { density: 72 * scale })
  .png()
  .toFile(out);
console.log(out);
