import { basename, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

/** Shared raw-Markdown output policy. Permalinks do not change source outputs. */
export function mapOutputPath(relPath) {
  const base = basename(relPath);
  const dir = dirname(relPath);
  if (base === 'index.md') return dir === '.' ? 'index.md' : dir + '.md';
  return relPath;
}

let vuepress;
/** Share the site's actual route policy without changing raw-Markdown outputs. */
export async function resolveSourcePagePath(filePathRelative, frontmatter) {
  const require = createRequire(new URL('../../package.json', import.meta.url));
  vuepress ??= import(pathToFileURL(require.resolve('vuepress/core')));
  const { inferPagePath, resolvePagePath } = await vuepress;
  if (frontmatter.permalinkPattern) throw new Error(`Unsupported page permalinkPattern in ${filePathRelative}`);
  const { pathInferred } = inferPagePath({ app: { siteData: { locales: {} } }, filePathRelative });
  return resolvePagePath({ permalink: frontmatter.permalink ?? null, pathInferred, options: {} });
}
