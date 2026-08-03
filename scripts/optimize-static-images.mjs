import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'static', 'images');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

const MAX_WIDTH_BY_FOLDER = {
	carousel: 2200,
	tabs: 1800,
	'who-is': 2000,
	sponsor: 1200
};

async function listFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) return listFiles(fullPath);
			return fullPath;
		})
	);
	return files.flat();
}

function getMaxWidth(filePath) {
	const folder = path.basename(path.dirname(filePath));
	return MAX_WIDTH_BY_FOLDER[folder] ?? 1920;
}

async function optimizeFile(filePath) {
	const ext = path.extname(filePath).toLowerCase();
	if (!IMAGE_EXTENSIONS.has(ext)) return null;

	const before = await fs.stat(filePath);
	const maxWidth = getMaxWidth(filePath);
	const image = sharp(filePath, { failOn: 'none' });
	const metadata = await image.metadata();

	let pipeline = image.rotate();
	if ((metadata.width ?? 0) > maxWidth) {
		pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
	}

	let buffer;
	if (ext === '.png') {
		buffer = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
	} else {
		buffer = await pipeline.jpeg({ quality: 76, mozjpeg: true }).toBuffer();
	}

	if (buffer.length >= before.size) return { filePath, before: before.size, after: before.size, changed: false };

	await fs.writeFile(filePath, buffer);
	const after = await fs.stat(filePath);
	return { filePath, before: before.size, after: after.size, changed: true };
}

async function main() {
	const files = await listFiles(TARGET_DIR);
	const results = [];
	for (const filePath of files) {
		const result = await optimizeFile(filePath);
		if (result) results.push(result);
	}

	const changed = results.filter((r) => r.changed);
	const before = changed.reduce((sum, r) => sum + r.before, 0);
	const after = changed.reduce((sum, r) => sum + r.after, 0);
	const saved = before - after;

	console.log(`optimized: ${changed.length}/${results.length} files`);
	console.log(`saved: ${(saved / 1024 / 1024).toFixed(2)} MB`);
	for (const item of changed) {
		console.log(
			`${path.relative(ROOT, item.filePath)}: ${(item.before / 1024).toFixed(1)}KB -> ${(item.after / 1024).toFixed(1)}KB`
		);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
