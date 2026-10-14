import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Acquire SURGERY Full Color Logo SVG (Navy + Emerald Leaf + Cyan SURGERY)
export const acquireLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" width="640" height="230" fill="none">
  <defs>
    <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="45%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#34D399" />
    </linearGradient>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      .acquire-text {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 800;
        font-size: 124px;
        fill: #062B61;
        letter-spacing: -2px;
      }
      .surgery-text {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 700;
        font-size: 38px;
        fill: #0097B2;
        letter-spacing: 14px;
      }
    </style>
  </defs>

  <!-- Background transparent -->
  <g transform="translate(32, 12)">
    <!-- "Acqu" text -->
    <text x="0" y="132" class="acquire-text">Acqu</text>

    <!-- 'i' stem without dot -->
    <rect x="318" y="52" width="22" height="80" rx="3" fill="#062B61" />

    <!-- Leaf replacing dot of 'i' -->
    <g transform="translate(329, 28) scale(1.15)">
      <path 
        d="M -10,13 C -12,6 -5,-4 9,-21 C 10,-22 12,-22 12,-20 C 13,-4 7,8 -5,16 C -7,17.5 -9.5,16 -10,13 Z" 
        fill="url(#leafGrad)" 
      />
    </g>

    <!-- "re" text -->
    <text x="345" y="132" class="acquire-text">re</text>

    <!-- "SURGERY" subtitle centered under Acquire -->
    <text x="50" y="195" class="surgery-text">SURGERY</text>
  </g>
</svg>
`.trim();

// 2. White variant for dark backgrounds (Footer, dark mode, etc.)
export const acquireLogoWhiteSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 230" width="640" height="230" fill="none">
  <defs>
    <linearGradient id="leafGradWhite" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="60%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#6EE7B7" />
    </linearGradient>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      .acquire-text-white {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 800;
        font-size: 124px;
        fill: #FFFFFF;
        letter-spacing: -2px;
      }
      .surgery-text-white {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 700;
        font-size: 38px;
        fill: #38BDF8;
        letter-spacing: 14px;
      }
    </style>
  </defs>

  <g transform="translate(32, 12)">
    <text x="0" y="132" class="acquire-text-white">Acqu</text>
    <rect x="318" y="52" width="22" height="80" rx="3" fill="#FFFFFF" />
    <g transform="translate(329, 28) scale(1.15)">
      <path 
        d="M -10,13 C -12,6 -5,-4 9,-21 C 10,-22 12,-22 12,-20 C 13,-4 7,8 -5,16 C -7,17.5 -9.5,16 -10,13 Z" 
        fill="url(#leafGradWhite)" 
      />
    </g>
    <text x="345" y="132" class="acquire-text-white">re</text>
    <text x="50" y="195" class="surgery-text-white">SURGERY</text>
  </g>
</svg>
`.trim();

// 3. Icon / Emblem only (Square, for favicon and avatar/badge)
export const acquireIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="none">
  <defs>
    <linearGradient id="iconLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#34D399" />
    </linearGradient>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&amp;display=swap');
      .icon-a {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 800;
        font-size: 76px;
        fill: #062B61;
      }
    </style>
  </defs>
  <!-- Background rounded pill -->
  <rect width="120" height="120" rx="28" fill="#F0F7FF" />
  <rect x="1" y="1" width="118" height="118" rx="27" stroke="#BAE6FD" stroke-width="2" />
  
  <!-- "A" letter -->
  <text x="24" y="86" class="icon-a">A</text>
  
  <!-- Leaf accent at top right of A -->
  <g transform="translate(86, 36) scale(1.15)">
    <path 
      d="M -9,11 C -10,5 -4,-3 8,-18 C 9,-19 10,-19 10,-17 C 11,-4 6,6 -5,12 C -7,14 -9,13 -9,11 Z" 
      fill="url(#iconLeafGrad)" 
    />
  </g>
</svg>
`.trim();

async function run() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), acquireLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'logo-white.svg'), acquireLogoWhiteSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), acquireIconSvg);

  // Convert to high-resolution PNGs with sharp
  await sharp(Buffer.from(acquireLogoSvg))
    .png()
    .toFile(path.join(publicDir, 'logo.png'));

  await sharp(Buffer.from(acquireIconSvg))
    .resize(256, 256)
    .png()
    .toFile(path.join(publicDir, 'logo-icon.png'));

  await sharp(Buffer.from(acquireIconSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All logo assets successfully generated!');
}

run().catch(console.error);
