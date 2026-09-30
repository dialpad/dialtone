/**
 * Serves the resolved style specs over HTTP so the plugin's `ui.html` — which
 * has fetch, unlike the plugin sandbox — can pull them in. Recomputes on every
 * request, so editing a token and refreshing in Figma is the whole iteration
 * loop.
 */

import { createServer } from 'http';

import { resolveTextStyles } from './resolve_text_styles.ts';
import { resolveEffectStyles } from './resolve_effect_styles.ts';

const PORT = 4577;

const ROUTES: Record<string, () => Promise<unknown>> = {
  '/text-styles.json': resolveTextStyles,
  '/effect-styles.json': resolveEffectStyles,
};

createServer(async (req, res) => {
  const resolve = req.url ? ROUTES[req.url] : undefined;
  if (!resolve) {
    res.writeHead(404).end();
    return;
  }
  try {
    const specs = await resolve();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(specs));
    console.log(`served ${req.url} (${(specs as unknown[]).length} specs)`);
  } catch (e) {
    console.error(e);
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, () => {
  console.log(`serving on http://localhost:${PORT}: ${Object.keys(ROUTES).join(', ')}`);
});
