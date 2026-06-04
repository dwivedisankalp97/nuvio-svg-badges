import fs from 'node:fs';
import path from 'node:path';

const BASE_URL =
  process.env.BADGE_BASE_URL ||
  'https://raw.githubusercontent.com/dwivedisankalp97/nuvio-svg-badges/refs/heads/main/dist';
const OUT_DIR = path.resolve('dist');
const SVG_DIR = path.join(OUT_DIR, 'svg');

const groups = [
  { id: 'quality', name: 'Quality', color: '#60A5FA' },
  { id: 'resolution', name: 'Resolution', color: '#22C55E' },
  { id: 'visual', name: 'Visual', color: '#F59E0B' },
  { id: 'audio', name: 'Audio', color: '#A78BFA' },
  { id: 'channels', name: 'Channels', color: '#38BDF8' },
  { id: 'streaming', name: 'Streaming', color: '#F87171' },
];

const badges = [
  {
    groupId: 'quality',
    id: 'remux',
    name: 'Remux',
    label: 'REMUX',
    pattern: '(?i)\\b(?:remux|blu[- .]?ray remux)\\b',
  },
  {
    groupId: 'quality',
    id: 'bluray',
    name: 'BluRay',
    label: 'BLURAY',
    pattern: '(?i)\\b(?:blu[- .]?ray|b[dr]rip|bdremux|bd25|bd50|bd66|bd100)\\b',
  },
  {
    groupId: 'quality',
    id: 'webdl',
    name: 'WebDL',
    label: 'WEB-DL',
    pattern: '(?i)\\b(?:web[- .]?dl|webdl|web[- .]?rip|webrip|web)\\b',
  },
  {
    groupId: 'resolution',
    id: '4k',
    name: '4K',
    label: '4K',
    pattern: '(?i)\\b(?:2160p?|4k|uhd)\\b',
  },
  {
    groupId: 'resolution',
    id: '1080p',
    name: '1080p',
    label: '1080P',
    pattern: '(?i)\\b1080p?\\b',
  },
  {
    groupId: 'resolution',
    id: '720p',
    name: '720p',
    label: '720P',
    pattern: '(?i)\\b720p?\\b',
  },
  {
    groupId: 'visual',
    id: 'seadex',
    name: 'SeaDex',
    label: 'SEADEX',
    pattern: '(?i)\\bseadex\\b',
  },
  {
    groupId: 'visual',
    id: 'hdr10plus',
    name: 'HDR10+',
    label: 'HDR10+',
    pattern: '(?i)\\b(?:hdr10\\+|hdr10plus|hdr10 plus)\\b',
  },
  {
    groupId: 'visual',
    id: 'hdr10',
    name: 'HDR10',
    label: 'HDR10',
    pattern: '(?i)\\bhdr10\\b',
  },
  {
    groupId: 'visual',
    id: 'hdr',
    name: 'HDR',
    label: 'HDR',
    pattern: '(?i)\\b(?:hdr|high dynamic range)\\b',
  },
  {
    groupId: 'visual',
    id: 'imax-enhanced',
    name: 'IMAX Enhanced',
    label: 'IMAX E',
    pattern: '(?i)\\b(?:imax enhanced|imax.enhanced|imax-enhanced)\\b',
  },
  {
    groupId: 'visual',
    id: 'imax',
    name: 'IMAX',
    label: 'IMAX',
    pattern: '(?i)\\bimax\\b',
  },
  {
    groupId: 'visual',
    id: 'dv',
    name: 'DV',
    label: 'DV',
    pattern: '(?i)\\b(?:dv|dovi|dolby vision)\\b',
  },
  {
    groupId: 'audio',
    id: 'dtsx',
    name: 'DTS:X',
    label: 'DTS:X',
    pattern: '(?i)\\b(?:dts[:. -]?x)\\b',
  },
  {
    groupId: 'audio',
    id: 'dts-hd-ma',
    name: 'DTS-HD MA',
    label: 'DTS-HD MA',
    pattern: '(?i)\\b(?:dts[- .]?hd[- .]?ma|dts[- .]?hd master audio)\\b',
  },
  {
    groupId: 'audio',
    id: 'dts-hd',
    name: 'DTS-HD',
    label: 'DTS-HD',
    pattern: '(?i)\\bdts[- .]?hd\\b',
  },
  {
    groupId: 'audio',
    id: 'dts',
    name: 'DTS',
    label: 'DTS',
    pattern: '(?i)\\bdts\\b',
  },
  {
    groupId: 'audio',
    id: 'atmos-dv',
    name: 'Atmos+DV',
    label: 'ATMOS+DV',
    pattern: '(?i)(?=.*\\b(?:atmos|dolby atmos)\\b)(?=.*\\b(?:dv|dovi|dolby vision)\\b)',
  },
  {
    groupId: 'audio',
    id: 'atmos',
    name: 'Atmos',
    label: 'ATMOS',
    pattern: '(?i)\\b(?:atmos|dolby atmos)\\b',
  },
  {
    groupId: 'audio',
    id: 'truehd-dv',
    name: 'TrueHD+DV',
    label: 'TRUEHD+DV',
    pattern: '(?i)(?=.*\\btrue[- .]?hd\\b)(?=.*\\b(?:dv|dovi|dolby vision)\\b)',
  },
  {
    groupId: 'audio',
    id: 'truehd',
    name: 'TrueHD',
    label: 'TRUEHD',
    pattern: '(?i)\\btrue[- .]?hd\\b',
  },
  {
    groupId: 'audio',
    id: 'ddplus',
    name: 'DD+',
    label: 'DD+',
    pattern: '(?i)\\b(?:dd\\+|ddp|e[- .]?ac[- .]?3|dolby digital plus)\\b',
  },
  {
    groupId: 'audio',
    id: 'ddplus-dv',
    name: 'DD+DV',
    label: 'DD+DV',
    pattern: '(?i)(?=.*\\b(?:dd\\+|ddp|e[- .]?ac[- .]?3|dolby digital plus)\\b)(?=.*\\b(?:dv|dovi|dolby vision)\\b)',
  },
  {
    groupId: 'audio',
    id: 'dd',
    name: 'DD',
    label: 'DD',
    pattern: '(?i)\\b(?:dd|ac[- .]?3|dolby digital)\\b',
  },
  {
    groupId: 'channels',
    id: '7-1',
    name: '7.1',
    label: '7.1',
    pattern: '(?i)\\b7[. ]1\\b',
  },
  {
    groupId: 'channels',
    id: '5-1',
    name: '5.1',
    label: '5.1',
    pattern: '(?i)\\b5[. ]1\\b',
  },
  {
    groupId: 'streaming',
    id: 'netflix',
    name: 'NETFLIX',
    label: 'NETFLIX',
    pattern: '(?i)\\b(?:netflix|nf)\\b',
  },
  {
    groupId: 'streaming',
    id: 'prime-video',
    name: 'PRIME VIDEO',
    label: 'PRIME',
    pattern: '(?i)\\b(?:prime video|amazon|amzn)\\b',
  },
  {
    groupId: 'streaming',
    id: 'apple-tv',
    name: 'APPLE TV+',
    label: 'APPLE TV+',
    pattern: '(?i)\\b(?:apple tv\\+?|atvp)\\b',
  },
  {
    groupId: 'streaming',
    id: 'disney-plus',
    name: 'DISNEY+',
    label: 'DISNEY+',
    pattern: '(?i)\\b(?:disney\\+?|dsnp)\\b',
  },
  {
    groupId: 'streaming',
    id: 'max',
    name: 'MAX',
    label: 'MAX',
    pattern: '(?i)\\b(?:max|hbo max|hbom)\\b',
  },
  {
    groupId: 'streaming',
    id: 'hulu',
    name: 'HULU',
    label: 'HULU',
    pattern: '(?i)\\bhulu\\b',
  },
  {
    groupId: 'streaming',
    id: 'peacock',
    name: 'PEACOCK',
    label: 'PEACOCK',
    pattern: '(?i)\\bpeacock\\b',
  },
  {
    groupId: 'streaming',
    id: 'paramount-plus',
    name: 'PARAMOUNT+',
    label: 'PARAMOUNT+',
    pattern: '(?i)\\b(?:paramount\\+?|pmtp)\\b',
  },
  {
    groupId: 'streaming',
    id: 'crave',
    name: 'CRAVE',
    label: 'CRAVE',
    pattern: '(?i)\\bcrave\\b',
  },
  {
    groupId: 'streaming',
    id: 'crunchyroll',
    name: 'CRUNCHY ROLL',
    label: 'CRUNCHY',
    pattern: '(?i)\\b(?:crunchyroll|crunchy roll|cr)\\b',
  },
];

const groupStyles = {
  quality: {
    fill: '#22C55E',
    stroke: '#16A34A',
    text: '#03140A',
  },
  resolution: {
    fill: '#FDE047',
    stroke: '#EAB308',
    text: '#1F1A00',
  },
  visual: {
    fill: '#FACC15',
    stroke: '#CA8A04',
    text: '#1F1800',
  },
  audio: {
    fill: '#F8FAFC',
    stroke: '#CBD5E1',
    text: '#111827',
  },
  channels: {
    fill: '#F8FAFC',
    stroke: '#CBD5E1',
    text: '#111827',
  },
  streaming: {
    fill: '#111827',
    stroke: '#374151',
    text: '#FFFFFF',
  },
};

const specialStyles = {
  netflix: { fill: '#E50914', stroke: '#B91C1C', text: '#FFFFFF' },
  'prime-video': { fill: '#00A8E1', stroke: '#0284C7', text: '#031926' },
  'apple-tv': { fill: '#F8FAFC', stroke: '#CBD5E1', text: '#050505' },
  'disney-plus': { fill: '#38BDF8', stroke: '#0284C7', text: '#06152A' },
  max: { fill: '#7C3AED', stroke: '#5B21B6', text: '#FFFFFF' },
  hulu: { fill: '#1CE783', stroke: '#16A34A', text: '#042B16' },
  peacock: { fill: '#FDBA74', stroke: '#EA580C', text: '#2B1200' },
  'paramount-plus': { fill: '#60A5FA', stroke: '#2563EB', text: '#07172D' },
  crave: { fill: '#22D3EE', stroke: '#0891B2', text: '#06232A' },
  crunchyroll: { fill: '#F97316', stroke: '#C2410C', text: '#FFFFFF' },
};

function ensureDirs() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(SVG_DIR, { recursive: true });
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function widthFor(label) {
  return Math.max(38, Math.min(86, Math.round(label.length * 7.2 + 12)));
}

function fontSizeFor(label) {
  if (label.length >= 10) return 10.4;
  if (label.length >= 9) return 10.8;
  if (label.length >= 8) return 11.2;
  if (label.length <= 3) return 13.2;
  return 12.2;
}

function svgFor(badge) {
  const style = specialStyles[badge.id] || groupStyles[badge.groupId];
  const width = widthFor(badge.label);
  const fontSize = fontSizeFor(badge.label);
  const label = esc(badge.label);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="24" viewBox="0 0 ${width} 24" role="img" aria-label="${esc(badge.name)}">
  <text x="${width / 2}" y="16" fill="${style.text}" text-anchor="middle"
    font-family="Roboto Condensed, Roboto, Arial, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing=".25">${label}</text>
</svg>
`;
}

function writeBadges() {
  ensureDirs();
  const filters = badges.map((badge) => {
    const filename = `${badge.id}.svg`;
    fs.writeFileSync(path.join(SVG_DIR, filename), svgFor(badge));
    const style = specialStyles[badge.id] || groupStyles[badge.groupId];
    return {
      id: badge.id,
      groupId: badge.groupId,
      name: badge.name,
      pattern: badge.pattern,
      imageURL: `${BASE_URL}/svg/${filename}`,
      isEnabled: true,
      tagColor: style.fill,
      tagStyle: 'filled',
      textColor: style.text,
      borderColor: style.stroke,
      type: 'filter',
    };
  });

  const payload = {
    filters,
    groups: groups.map((group) => ({ ...group, isExpanded: true })),
  };
  fs.writeFileSync(
    path.join(OUT_DIR, 'badges.json'),
    `${JSON.stringify(payload, null, 2)}\n`
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'preview.html'),
    `<!doctype html>
<meta charset="utf-8">
<title>Aiosan Nuvio Badges</title>
<style>
  body { margin: 0; background: #09090b; color: #f4f4f5; font-family: Inter, system-ui, sans-serif; padding: 32px; }
  h1 { font-size: 24px; margin: 0 0 8px; }
  p { color: #a1a1aa; margin: 0 0 24px; }
  h2 { font-size: 16px; margin: 24px 0 10px; color: #e5e7eb; }
  .grid { display: flex; flex-wrap: wrap; gap: 8px; max-width: 920px; }
  .chip { height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); padding: 2px 3px; box-sizing: border-box; }
  .chip img { height: 16px; display: block; }
</style>
<h1>Aiosan Nuvio Badges</h1>
<p>Import URL: <code>${BASE_URL}/badges.json</code></p>
${groups
  .map((group) => {
    const groupFilters = filters.filter((filter) => filter.groupId === group.id);
    return `<h2>${esc(group.name)}</h2>
<div class="grid">
${groupFilters
  .map(
    (filter) =>
      `  <span class="chip" style="--bg:${filter.tagColor};--border:${filter.borderColor}"><img src="svg/${filter.id}.svg" alt="${esc(filter.name)}"></span>`
  )
  .join('\n')}
</div>`;
  })
  .join('\n')}
`
  );
}

writeBadges();
