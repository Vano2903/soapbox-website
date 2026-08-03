// Regenerate the binary fixtures used by the Playwright suite.
// Run with: `node tests/fixtures/generate.mjs`
//
// Outputs:
//   - valid-portrait.png   200x200 PNG
//   - valid-landscape.jpg  600x200 JPG
//   - valid-square.webp    400x400 WebP
//   - evil.png             a PDF document with a .png extension (signature mismatch)

import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
await mkdir(here, { recursive: true });

async function makePng() {
	const buf = await sharp({
		create: { width: 200, height: 200, channels: 3, background: { r: 220, g: 50, b: 50 } }
	})
		.png()
		.toBuffer();
	await writeFile(join(here, 'valid-portrait.png'), buf);
}

async function makeJpg() {
	const buf = await sharp({
		create: { width: 600, height: 200, channels: 3, background: { r: 30, g: 144, b: 255 } }
	})
		.jpeg({ quality: 90 })
		.toBuffer();
	await writeFile(join(here, 'valid-landscape.jpg'), buf);
}

async function makeWebp() {
	const buf = await sharp({
		create: { width: 400, height: 400, channels: 3, background: { r: 34, g: 139, b: 34 } }
	})
		.webp({ quality: 90 })
		.toBuffer();
	await writeFile(join(here, 'valid-square.webp'), buf);
}

async function makeEvilPng() {
	// Minimal valid PDF. magic-bytes.js identifies the `%PDF-` signature regardless
	// of file extension, so this round-trips the "renamed PDF" attack.
	const pdf =
		'%PDF-1.4\n' +
		'1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n' +
		'2 0 obj\n<< /Type /Pages /Count 0 >>\nendobj\n' +
		'xref\n0 3\n0000000000 65535 f \n0000000009 00000 n \n0000000054 00000 n \n' +
		'trailer\n<< /Size 3 /Root 1 0 R >>\nstartxref\n95\n%%EOF\n';
	await writeFile(join(here, 'evil.png'), pdf, 'utf8');
}

await Promise.all([makePng(), makeJpg(), makeWebp(), makeEvilPng()]);
console.log('fixtures regenerated in', here);
