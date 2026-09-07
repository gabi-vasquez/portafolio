// Genera los derivados SEO desde public/favicon.svg y public/gabi.jpeg:
// favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png (180),
// android-chrome-192x192.png, android-chrome-512x512.png,
// favicon.ico (ICO real con entradas PNG 16/32/48) y og-image.jpg (1200×630).
// Uso: node scripts/generate-seo-assets.mjs
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const pub = path.join(root, "public");
const faviconSvg = path.join(pub, "favicon.svg");
const portrait = path.join(pub, "gabi.jpeg");

const svgBuffer = await readFile(faviconSvg);

async function png(size, out, { background = { r: 43, g: 26, b: 35, alpha: 1 } } = {}) {
  const buf = await sharp(svgBuffer, { density: 512 })
    .resize(size, size, { fit: "contain", background })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(path.join(pub, out), buf);
  console.log(`✓ ${out} (${size}×${size})`);
  return buf;
}

// Empaqueta varios PNG como ICO multi-tamaño (cabecera ICO + entradas PNG).
async function ico(pngs, out) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);
  const entries = [];
  let offset = 6 + 16 * count;
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  await writeFile(path.join(pub, out), Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]));
  console.log(`✓ ${out} (${pngs.map((p) => p.size).join("/")})`);
}

const p16 = await png(16, "favicon-16x16.png");
const p32 = await png(32, "favicon-32x32.png");
const p48 = await sharp(svgBuffer, { density: 512 })
  .resize(48, 48, { fit: "contain", background: { r: 43, g: 26, b: 35, alpha: 1 } })
  .png()
  .toBuffer();
await png(180, "apple-touch-icon.png");
await png(192, "android-chrome-192x192.png");
await png(512, "android-chrome-512x512.png");
await ico(
  [
    { size: 16, data: p16 },
    { size: 32, data: p32 },
    { size: 48, data: p48 },
  ],
  "favicon.ico",
);

// --- OG image 1200×630: foto a la derecha + marca/texto a la izquierda ---
const W = 1200;
const H = 630;
const PHOTO_W = 560;

const photo = await sharp(portrait).resize(PHOTO_W, H, { fit: "cover", position: "top" }).toBuffer();

const base = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b1a23"/>
      <stop offset="1" stop-color="#881337"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2b1a23" stop-opacity="0"/>
      <stop offset="1" stop-color="#2b1a23" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="${W - PHOTO_W - 120}" y="0" width="120" height="${H}" fill="url(#fade)"/>
  <circle cx="120" cy="110" r="34" fill="#881337"/>
  <text x="120" y="126" text-anchor="middle" font-family="Georgia, serif" font-size="44" font-weight="700" fill="#ffffff">G</text>
  <text x="172" y="112" font-family="Verdana, sans-serif" font-size="27" font-weight="700" fill="#ffffff">Gabriela Orozco Vásquez</text>
  <text x="172" y="142" font-family="Verdana, sans-serif" font-size="20" fill="#f3d9e1">Ciencia de Datos · Software</text>
  <text x="80" y="272" font-family="Georgia, serif" font-size="66" font-weight="700" fill="#ffffff">Transformo</text>
  <text x="80" y="350" font-family="Georgia, serif" font-size="66" font-weight="700" fill="#f9d5e0">datos en</text>
  <text x="80" y="428" font-family="Georgia, serif" font-size="66" font-weight="700" fill="#f9d5e0">decisiones</text>
  <text x="80" y="478" font-family="Verdana, sans-serif" font-size="24" fill="#ffffff">Python · SQL · EDA · Machine Learning</text>
  <rect x="80" y="500" width="220" height="56" rx="28" fill="#ffffff"/>
  <text x="190" y="536" text-anchor="middle" font-family="Verdana, sans-serif" font-size="24" font-weight="700" fill="#881337">Portafolio</text>
</svg>`);

await sharp(base)
  .composite([{ input: photo, left: W - PHOTO_W, top: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(pub, "og-image.jpg"));
console.log(`✓ og-image.jpg (${W}×${H})`);
console.log("Listo. Revisa public/og-image.jpg y los iconos generados.");
