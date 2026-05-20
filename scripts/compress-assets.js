import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src/assets/images");
const OUT = path.join(ROOT, "src/assets/images-compressed");
const MANIFEST_PATH = path.join(OUT, ".manifest.json");
const QUALITY = 80;

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, results);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const manifest = loadManifest();
  const files = walkDir(SRC);
  let processed = 0;
  let skipped = 0;

  for (const srcFile of files) {
    const rel = path.relative(SRC, srcFile);
    const outFile = path.join(OUT, rel.replace(/\.(jpe?g|png)$/i, ".webp"));
    const mtime = fs.statSync(srcFile).mtimeMs;
    const key = rel;

    if (manifest[key]?.mtime === mtime && manifest[key]?.quality === QUALITY) {
      skipped++;
      continue;
    }

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    await sharp(srcFile).webp({ quality: QUALITY }).toFile(outFile);
    manifest[key] = { mtime, quality: QUALITY };
    console.log(`  compressed: ${rel}`);
    processed++;
  }

  saveManifest(manifest);

  if (processed === 0) {
    console.log(`compress-assets: all ${skipped} files up to date`);
  } else {
    console.log(`compress-assets: ${processed} converted, ${skipped} skipped`);
  }
}

main().catch((err) => {
  console.error("compress-assets failed:", err);
  process.exit(1);
});
