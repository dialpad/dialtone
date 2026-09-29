/**
 * Serves the resolved text-style spec over HTTP so the plugin's `ui.html` —
 * which has fetch, unlike the plugin sandbox — can pull it in. Recomputes on
 * every request, so editing a token and refreshing in Figma is the whole
 * iteration loop.
 */

import { createServer } from 'http';

import { resolveTextStyles } from './resolve_text_styles.ts';

const PORT = 4577;

createServer(async (req, res) => {
  if (req.url !== '/text-styles.json') {
    res.writeHead(404).end();
    return;
  }
  try {
    const specs = await resolveTextStyles();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(specs));
    console.log(`served ${specs.length} text style specs`);
  } catch (e) {
    console.error(e);
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, () => {
  console.log(`serving text-styles.json on http://localhost:${PORT}`);
});
