import './pin-cwd.mjs';
import 'dotenv/config';
const KEY = process.env.FILE_KEY;
const TOK = process.env.PERSONAL_ACCESS_TOKEN;
const ids = ['169:3', '169:4', '169:5', '169:6'];
const r = await fetch(`https://api.figma.com/v1/images/${KEY}?ids=${ids.join(',')}&format=png&scale=4`, { headers: { 'X-Figma-Token': TOK } });
const j = await r.json();
if (j.err) throw new Error(j.err);
const { writeFileSync } = await import('fs');
const names = { '169:3': 'A-inner-clip', '169:4': 'B-inner-noclip', '169:5': 'C-inner-blur', '169:6': 'D-inside-stroke' };
const rows = [];
for (const id of ids) {
  const url = j.images[id];
  if (!url) { rows.push(`<div>${names[id]}: NO IMAGE</div>`); continue; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  rows.push(`<figure style="margin:0 18px 0 0;text-align:center"><div style="font:11px ui-monospace">${names[id]}</div><img src="data:image/png;base64,${buf.toString('base64')}" style="width:160px;image-rendering:pixelated;background:#fff;border:1px solid #ddd"></figure>`);
}
writeFileSync('sync-scripts/build-data/visual/probe-inner-ring.html',
  `<body style="background:#fff;margin:20px;display:flex;align-items:flex-end">${rows.join('')}</body>`);
console.log('wrote sync-scripts/build-data/visual/probe-inner-ring.html');
