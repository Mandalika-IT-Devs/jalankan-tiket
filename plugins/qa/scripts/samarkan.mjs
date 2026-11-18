#!/usr/bin/env node
// Paints black boxes over parts of a PNG, such as a test account's email or avatar, before the image leaves
// the machine. Made by the qa plugin of the jalankan-tiket kit. It uses the QA workspace's own Playwright,
// so run it from the workspace root:
//
//   node <plugin root>/scripts/samarkan.mjs <in.png> <out.png> <x,y,width,height> [<x,y,width,height> ...]
//
// Coordinates are image pixels from the top-left corner. The input file stays as it is.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const usage = 'usage: node samarkan.mjs <in.png> <out.png> <x,y,width,height> [<x,y,width,height> ...]';
const [input, output, ...boxArgs] = process.argv.slice(2);
if (!input || !output || boxArgs.length === 0) {
  console.error(usage);
  process.exit(2);
}
if (resolve(input) === resolve(output)) {
  console.error('Write the masked image to a new file, so the original stays for comparison.');
  process.exit(2);
}

const png = readFileSync(input);
if (png.toString('latin1', 1, 4) !== 'PNG') {
  console.error(`${input} is not a PNG file.`);
  process.exit(2);
}
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);

const boxes = boxArgs.map((arg) => {
  const numbers = arg.split(',').map(Number);
  if (numbers.length !== 4 || numbers.some((n) => !Number.isFinite(n) || n < 0)) {
    console.error(`"${arg}" is not a box. ${usage}`);
    process.exit(2);
  }
  const [x, y, w, h] = numbers;
  if (x >= width || y >= height || w === 0 || h === 0) {
    console.error(`Box "${arg}" lies outside the ${width}x${height} image.`);
    process.exit(2);
  }
  return numbers;
});

const require = createRequire(join(process.cwd(), 'package.json'));
let chromium;
try {
  ({ chromium } = require('@playwright/test'));
} catch {
  console.error('Run this from the QA workspace root, where @playwright/test is installed.');
  process.exit(2);
}

const covers = boxes
  .map(([x, y, w, h]) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:#000"></div>`)
  .join('');
const html =
  '<html><body style="margin:0">' +
  `<img src="data:image/png;base64,${png.toString('base64')}" style="display:block">${covers}</body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.locator('img').evaluate((img) => img.decode());
  await page.screenshot({ path: resolve(output), clip: { x: 0, y: 0, width, height } });
} finally {
  await browser.close();
}
console.log(`${output}: ${boxes.length} box(es) painted on a ${width}x${height} image.`);
