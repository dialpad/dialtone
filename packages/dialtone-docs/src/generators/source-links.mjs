import MarkdownIt from 'markdown-it';
import { posix } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const appRequire = createRequire(new URL('../../../../apps/dialtone-documentation/package.json', import.meta.url));
const { inferRoutePath } = await import(pathToFileURL(appRequire.resolve('vuepress/shared')));

const markdown = new MarkdownIt({ html: true });

function addTarget(map, key, page) {
  const targets = map.get(key) ?? [];
  if (!targets.some(target => target.docId === page.docId)) targets.push(page);
  map.set(key, targets);
}

function resolveLink(href, page, pageMap) {
  const unresolved = { url: null, targetDocId: null };
  let absolute;
  try { absolute = new URL(href, page.url ?? 'https://invalid.local'); } catch { return unresolved; }
  if (!['http:', 'https:'].includes(absolute.protocol) || absolute.username || absolute.password) return unresolved;
  const explicitUrl = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
  if (explicitUrl && (!page.url || absolute.origin !== new URL(page.url).origin)) {
    return { url: absolute.href, targetDocId: null };
  }
  if (!page.url) return unresolved;
  const [, rawPath, suffix = ''] = href.match(/^([^?#]*)(.*)$/);
  if (!rawPath) {
    const url = page.directive ? absolute.href : new URL(href.replace(/^#(\d)/, '#_$1'), page.url).href;
    return { url, targetDocId: page.directive && href.startsWith('?') ? null : page.docId };
  }
  if (page.directive && !explicitUrl && !rawPath.startsWith('/')) return unresolved;
  let path;
  try {
    path = decodeURI(explicitUrl ? absolute.pathname : rawPath);
  } catch { return unresolved; }
  const rooted = path.startsWith('/');
  const sourcePath = posix.normalize(rooted ? path.slice(1) : posix.join(posix.dirname(page.sourcePath), path));
  const candidates = path.endsWith('.md')
    ? pageMap.bySource.get(sourcePath)
    : pageMap.byRoute.get(path.endsWith('.html') ? inferRoutePath(`/${sourcePath}`) : `/${sourcePath}`);
  if (candidates?.length !== 1) return unresolved;
  const target = candidates[0];
  const qualifiedSuffix = /(?:\/|\.md|\.html)$/.test(rawPath) ? suffix.replace(/^#(\d)/, '#_$1') : suffix;
  return { url: new URL(qualifiedSuffix || target.url, target.url).href, targetDocId: target.docId };
}

export function readSectionLinks(sectionRaw, environment, page, pageMap) {
  const links = [];
  const seen = new Set();
  for (const token of markdown.parse(sectionRaw, environment)) {
    const children = token.children ?? [];
    for (let i = 0; i < children.length; i++) {
      if (children[i].type !== 'link_open') continue;
      const href = children[i].attrGet('href');
      let label = '';
      while (++i < children.length && children[i].type !== 'link_close') {
        if (['text', 'code_inline', 'image'].includes(children[i].type)) label += children[i].content;
        if (['softbreak', 'hardbreak'].includes(children[i].type)) label += ' ';
      }
      label = label.trim() || href;
      const key = JSON.stringify([label, href]);
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({ label, href, ...resolveLink(href, page, pageMap) });
    }
  }
  return links;
}

/** Enrich only prose after example assembly, so payload and proof records stay intact. */
export function enrichDocumentationRecords(records, pageContexts) {
  const available = new Set(records.filter(record => !record.example).map(record => record.docId));
  const pageMap = { bySource: new Map(), byRoute: new Map() };
  const contexts = new Map();
  for (const page of pageContexts) {
    if (!available.has(page.docId)) continue;
    const environment = {};
    markdown.parse(page.body, environment);
    const sections = new Map(page.sections.map(section => [section.id, section.raw]));
    contexts.set(page.docId, { page, environment, sections });
    if (page.directive || !page.url) continue;
    addTarget(pageMap.bySource, page.sourcePath, page);
    addTarget(pageMap.byRoute, new URL(page.url).pathname, page);
  }
  const referenced = new Set();
  return records.map(record => {
    const context = contexts.get(record.docId);
    if (record.example || !context) return record;
    const { page, environment, sections } = context;
    const links = readSectionLinks(sections.get(record.id) ?? '', environment, page, pageMap);
    const documentation = !referenced.has(page.docId) && page.url
      ? { url: page.url, versionScope: 'latest', installedCompatibility: 'not_checked' } : undefined;
    referenced.add(page.docId);
    return { ...record, ...(links.length ? { links } : {}), ...(documentation ? { documentation } : {}) };
  });
}
