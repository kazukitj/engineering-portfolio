import { access, readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";

const root = resolve(process.cwd(), "src");
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }

  return files;
}

function localTarget(value, htmlFile) {
  const clean = decodeURIComponent(value.split("#")[0].split("?")[0]);
  if (!clean || /^(https?:|mailto:|tel:)/.test(clean)) return null;

  let target = clean.startsWith("/") ? join(root, clean) : resolve(dirname(htmlFile), clean);
  if (!extname(target)) target = join(target, "index.html");
  return target;
}

for (const file of (await walk(root)).filter((path) => path.endsWith(".html"))) {
  const html = await readFile(file, "utf8");
  const relative = file.slice(root.length + 1);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (duplicates.length) errors.push(`${relative}: duplicate IDs: ${[...new Set(duplicates)].join(", ")}`);
  if (!/<meta name="description" content="[^"]+">/.test(html)) errors.push(`${relative}: missing meta description`);
  if (!/<link rel="canonical" href="https:\/\/kazukitojo\.com\//.test(html)) errors.push(`${relative}: missing canonical URL`);
  if (/latex\.now\.sh/.test(html)) errors.push(`${relative}: still depends on latex.now.sh`);

  for (const match of html.matchAll(/\s(?:href|src|data-src)="([^"]+)"/g)) {
    const target = localTarget(match[1], file);
    if (!target) continue;
    try {
      await access(target);
    } catch {
      errors.push(`${relative}: missing local target ${match[1]}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Site checks passed.");
}
