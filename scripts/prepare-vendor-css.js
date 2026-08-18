/**
 * Bootstrap ships with `@charset` at the top of its min CSS.
 * Inlining that file into styles.scss triggers esbuild's invalid-@charset warning.
 * We copy a charset-stripped vendor file so Bootstrap can stay in a cascade layer
 * (required so it does not override public-site Tailwind styles).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'src', 'styles', 'vendor');
const sources = [
  {
    from: path.join(root, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
    to: path.join(outDir, 'bootstrap.min.css'),
  },
];

fs.mkdirSync(outDir, { recursive: true });

for (const { from, to } of sources) {
  if (!fs.existsSync(from)) {
    console.warn(`[prepare-vendor-css] skip missing ${from}`);
    continue;
  }
  const css = fs
    .readFileSync(from, 'utf8')
    .replace(/^@charset\s+[^;]+;\s*/i, '');
  fs.writeFileSync(to, css);
  console.log(`[prepare-vendor-css] wrote ${path.relative(root, to)}`);
}
