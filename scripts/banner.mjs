// Draws img/banner.png, the header of the GitHub profile README (1600×440).
// Ported from najmushsaaquib.com/scripts/generate-og.mjs (the portfolio's link-preview card):
// same palette, the same real EB Garamond, same faux-bold stroke. No photo: GitHub shows it beside.
//
// Run from this repo, with the portfolio checked out next to it (it has the fonts and packages):
//   node scripts/banner.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const portfolio = path.join(root, '../najmushsaaquib.com');
const require = createRequire(path.join(portfolio, 'package.json'));
const { Resvg } = require('@resvg/resvg-js');

const W = 1600;
const H = 440;
const FONT = path.join(portfolio, 'scripts/fonts/EBGaramond.ttf');
const b64 = (f) => readFileSync(path.join(root, 'img', f)).toString('base64');

// Things shipped, shown as a quiet row of icons on the right.
const icons = ['mihrabummah.png', 'd-tox.png', 'lost-buttons.png'];
const IC = 92;
const GAP = 26;
const rowW = icons.length * IC + (icons.length - 1) * GAP;
const rowX = W - 110 - rowW;
const rowY = 176;

const iconSvg = icons
  .map((f, i) => {
    const x = rowX + i * (IC + GAP);
    return `<clipPath id="c${i}"><rect x="${x}" y="${rowY}" width="${IC}" height="${IC}" rx="22"/></clipPath>
  <rect x="${x - 1}" y="${rowY + 6}" width="${IC + 2}" height="${IC}" rx="22" fill="#1c110a" fill-opacity="0.07"/>
  <image x="${x}" y="${rowY}" width="${IC}" height="${IC}" clip-path="url(#c${i})" href="data:image/png;base64,${b64(f)}" preserveAspectRatio="xMidYMid slice"/>`;
  })
  .join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fdf5f0"/>
      <stop offset="0.55" stop-color="#fcf2ed"/>
      <stop offset="1" stop-color="#f6e9e0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="#d73f00"/>

  <text x="110" y="148" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="600"
        letter-spacing="5" fill="#1c110a" fill-opacity="0.55">BACKEND ENGINEER · BENGALURU</text>

  <text x="107" y="250" font-family="EB Garamond" font-size="96" fill="#1c110a"
        stroke="#1c110a" stroke-width="1.4" paint-order="stroke fill">Najmush Saaquib</text>

  <rect x="110" y="286" width="86" height="5" rx="2.5" fill="#d73f00"/>

  <text x="110" y="340" font-family="Helvetica, Arial, sans-serif" font-size="29"
        fill="#1c110a" fill-opacity="0.66">Systems that hold up at work. Small, useful tools after hours.</text>

  ${iconSvg}
  <text x="${rowX + rowW / 2}" y="${rowY + IC + 52}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="20" font-weight="600" letter-spacing="3" fill="#1c110a" fill-opacity="0.45">SHIPPED AT SAAQUIB LABS</text>
</svg>`;

const png = new Resvg(svg, { font: { fontFiles: [FONT], loadSystemFonts: true } }).render().asPng();
writeFileSync(path.join(root, 'img/banner.png'), png);
console.log('wrote img/banner.png');
