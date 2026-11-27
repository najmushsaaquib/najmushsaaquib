// Draws img/banner.png, the header of the GitHub profile README (1600×440), in the portfolio's
// look (#174, variant J): ported from najmushsaaquib.com/scripts/generate-og.mjs, its link-preview
// card. Same palette, Geist + Geist Mono, the ruled frame with + ticks, the tide glow, the faded
// wordmark, and the site's mark (the lit N) drawn from the same grid as the header
// (najmushsaaquib.com/lib/logo.ts). No photo: GitHub shows it beside.
//
// Run from this repo with Bun (it imports the mark's TypeScript), the portfolio checked out
// next to it (it has the fonts and packages), or pointed to with PORTFOLIO=<path>:
//   bun scripts/banner.mjs
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const portfolio = path.resolve(process.env.PORTFOLIO ?? path.join(root, '../najmushsaaquib.com'));
const require = createRequire(path.join(portfolio, 'package.json'));
const { Resvg } = require('@resvg/resvg-js');
const { logoCells, LOGO_CELL, LOGO_CELL_RADIUS } = await import(path.join(portfolio, 'lib/logo.ts'));

const W = 1600;
const H = 440;
const FX = 96; // frame inset, left and right
const TOP = 72; // the nav row's rule
const BOTTOM = 336; // the meta row's rule
const BG = '#0a0a0b';
const INK = '#ededea';
const MUTED = '#a3a39f';
const FAINT = '#8a8a86';
const LINE = 'rgb(237,237,234)';
const TIDE = '#68d0e8'; // --accent
const MARK = '#80d5e8'; // the header mark's fill: --accent mixed 82% with --ink
const fonts = ['Geist-Regular.ttf', 'Geist-SemiBold.ttf', 'GeistMono-Regular.ttf'].map((f) =>
  path.join(portfolio, 'scripts/fonts', f),
);

const tick = (x, y) =>
  `<text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Geist Mono" font-size="15" fill="${FAINT}">+</text>`;

// the mark, at rest (the N), 30px across
const MARK_SCALE = 30 / 18;
const mark = logoCells()
  .map(
    (c) =>
      `<rect x="${c.x}" y="${c.y}" width="${LOGO_CELL}" height="${LOGO_CELL}" rx="${LOGO_CELL_RADIUS}" fill="${MARK}" fill-opacity="${c.opacity}"/>`,
  )
  .join('');

const meta = [
  ['based in', 'Bangalore, India'],
  ['building', 'The gateway every API call passes through'],
  ['after hours', 'Saaquib Labs'],
];
const metaX = [FX + 56, FX + 400, FX + 1000];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="0.5" cy="0" r="0.6">
      <stop offset="0" stop-color="${TIDE}" stop-opacity="0.16"/>
      <stop offset="0.55" stop-color="${INK}" stop-opacity="0.04"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="word" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${INK}" stop-opacity="0.05"/>
      <stop offset="0.85" stop-color="${INK}" stop-opacity="0.008"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <ellipse cx="${W / 2}" cy="0" rx="720" ry="300" fill="url(#glow)"/>

  <!-- the faded wordmark, sitting at the bottom right -->
  <text x="${W - FX - 20}" y="${H + 64}" text-anchor="end" font-family="Geist" font-weight="600"
        font-size="250" letter-spacing="-17" fill="url(#word)">saaquib</text>

  <!-- the ruled frame: two verticals, two rules, + where they meet -->
  <rect x="${FX}" y="0" width="1" height="${H}" fill="${LINE}" fill-opacity="0.09"/>
  <rect x="${W - FX}" y="0" width="1" height="${H}" fill="${LINE}" fill-opacity="0.09"/>
  <rect x="0" y="${TOP}" width="${W}" height="1" fill="${LINE}" fill-opacity="0.09"/>
  <rect x="0" y="${BOTTOM}" width="${W}" height="1" fill="${LINE}" fill-opacity="0.09"/>
  ${tick(FX, TOP)}${tick(W - FX, TOP)}${tick(FX, BOTTOM)}${tick(W - FX, BOTTOM)}

  <!-- nav row: the mark and the name, the domain on the right -->
  <g transform="translate(${FX + 32} ${TOP / 2 - 15}) scale(${MARK_SCALE})">${mark}</g>
  <text x="${FX + 78}" y="${TOP / 2 + 7}" font-family="Geist" font-weight="600" font-size="20" fill="${INK}">Najmush Saaquib</text>
  <text x="${W - FX - 32}" y="${TOP / 2 + 6}" text-anchor="end" font-family="Geist Mono" font-size="17" fill="${FAINT}">najmushsaaquib.com</text>

  <!-- hero -->
  <text x="${FX + 52}" y="196" font-family="Geist" font-weight="600" font-size="92"
        letter-spacing="-4.4" fill="${INK}">Najmush Saaquib</text>
  <text x="${FX + 56}" y="252" font-family="Geist" font-size="31" fill="${INK}">Backend engineer</text>
  <text x="${FX + 56}" y="294" font-family="Geist Mono" font-size="21" fill="${MUTED}">SDE II, API gateway · Capillary Technologies</text>

  <!-- meta row -->
  ${meta
    .map(
      ([k, v], i) => `<text x="${metaX[i]}" y="${BOTTOM + 44}" font-family="Geist Mono" font-size="17" fill="${FAINT}">${k}</text>
  <text x="${metaX[i]}" y="${BOTTOM + 74}" font-family="Geist" font-size="21" fill="${INK}">${v}</text>`,
    )
    .join('\n  ')}
</svg>`;

const png = new Resvg(svg, { font: { fontFiles: fonts, loadSystemFonts: false } }).render().asPng();
writeFileSync(path.join(root, 'img/banner.png'), png);
console.log('wrote img/banner.png');
