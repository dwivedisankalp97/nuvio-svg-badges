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
    fill: '#0F172A',
    stroke: '#60A5FA',
    text: '#DBEAFE',
    accent: '#60A5FA',
  },
  resolution: {
    fill: '#052E1A',
    stroke: '#22C55E',
    text: '#DCFCE7',
    accent: '#22C55E',
  },
  visual: {
    fill: '#3B2504',
    stroke: '#F59E0B',
    text: '#FEF3C7',
    accent: '#F59E0B',
  },
  audio: {
    fill: '#21143F',
    stroke: '#A78BFA',
    text: '#EDE9FE',
    accent: '#A78BFA',
  },
  channels: {
    fill: '#082F49',
    stroke: '#38BDF8',
    text: '#E0F2FE',
    accent: '#38BDF8',
  },
  streaming: {
    fill: '#3B0A0A',
    stroke: '#F87171',
    text: '#FEE2E2',
    accent: '#F87171',
  },
};

const specialStyles = {
  netflix: { fill: '#240404', stroke: '#E50914', text: '#FFFFFF', accent: '#E50914' },
  'prime-video': { fill: '#061525', stroke: '#00A8E1', text: '#E0F7FF', accent: '#00A8E1' },
  'apple-tv': { fill: '#101010', stroke: '#F5F5F7', text: '#FFFFFF', accent: '#F5F5F7' },
  'disney-plus': { fill: '#07163A', stroke: '#7DD3FC', text: '#E0F2FE', accent: '#7DD3FC' },
  max: { fill: '#120A35', stroke: '#8B5CF6', text: '#F5F3FF', accent: '#8B5CF6' },
  hulu: { fill: '#052E16', stroke: '#1CE783', text: '#DCFCE7', accent: '#1CE783' },
  peacock: { fill: '#25130A', stroke: '#FDBA74', text: '#FFEDD5', accent: '#FDBA74' },
  'paramount-plus': { fill: '#061C3D', stroke: '#60A5FA', text: '#DBEAFE', accent: '#60A5FA' },
  crave: { fill: '#031D2B', stroke: '#22D3EE', text: '#CFFAFE', accent: '#22D3EE' },
  crunchyroll: { fill: '#2A1204', stroke: '#F97316', text: '#FFEDD5', accent: '#F97316' },
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
  return Math.max(58, Math.min(92, Math.round(label.length * 8.2 + 26)));
}

function fontSizeFor(label) {
  if (label.length >= 10) return 8.4;
  if (label.length >= 9) return 8.9;
  if (label.length >= 8) return 9.4;
  return 10.5;
}

function svgFor(badge) {
  const style = specialStyles[badge.id] || groupStyles[badge.groupId];
  const width = widthFor(badge.label);
  const fontSize = fontSizeFor(badge.label);
  const clipId = `clip-${badge.id}`;
  const gradId = `grad-${badge.id}`;
  const label = esc(badge.label);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="24" viewBox="0 0 ${width} 24" role="img" aria-label="${esc(badge.name)}">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${style.fill}"/>
      <stop offset="1" stop-color="#050608"/>
    </linearGradient>
    <clipPath id="${clipId}">
      <rect x="0.75" y="0.75" width="${width - 1.5}" height="22.5" rx="6"/>
    </clipPath>
  </defs>
  <rect x="0.75" y="0.75" width="${width - 1.5}" height="22.5" rx="6" fill="url(#${gradId})" stroke="${style.stroke}" stroke-width="1.5"/>
  <g clip-path="url(#${clipId})">
    <rect x="0" y="0" width="5" height="24" fill="${style.accent}"/>
    <path d="M7 3 L16 3 L11 12 L17 12 L8 21 L11 14 L6 14 Z" fill="${style.accent}" opacity="0.22"/>
  </g>
  <text x="${width / 2 + 2}" y="12.9" fill="${style.text}" text-anchor="middle" dominant-baseline="middle"
    font-family="Inter, Roboto, Arial, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing=".55">${label}</text>
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
  .grid { display: flex; flex-wrap: wrap; gap: 10px; max-width: 920px; }
  img { height: 24px; }
</style>
<h1>Aiosan Nuvio Badges</h1>
<p>Import URL: <code>${BASE_URL}/badges.json</code></p>
<div class="grid">
${badges.map((badge) => `  <img src="svg/${badge.id}.svg" alt="${esc(badge.name)}">`).join('\n')}
</div>
`
  );
}

writeBadges();
