#!/usr/bin/env node

import fs from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const KINDS = new Set(['headline', 'body', 'label', 'code']);
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const SAFE_DIRECTIVES = /^(?:v-(?:if|else|else-if|for|show|once|memo|cloak|text|html|slot)(?:[.:]|$)|@|#|v-on(?::|$))/;

// Tokenize markup without reserializing it. Attribute values, comments, interpolation
// strings and raw-text elements must never expose their quoted examples as live tags.
function * openingTags (content, vue) {
  const tokens = new RegExp([
    /<!--[\s\S]*?(?:-->|$)/.source,
    /\{\{(?:[^'"`]|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)*?\}\}/.source,
    /<\/?([A-Za-z][\w:-]*)(?=[\s/>])(?:[^>"']|"[^"]*"|'[^']*')*>/.source,
  ].join('|'), 'g');
  const stack = [];
  let match;
  while ((match = tokens.exec(content))) {
    if (!match[1]) continue;
    const tag = match[1];
    const closing = match[0].startsWith('</');
    if (closing) {
      const index = stack.map(entry => entry.tag).lastIndexOf(tag);
      if (index !== -1) stack.length = index;
      continue;
    }
    const inTemplate = !vue || stack[0]?.tag === 'template';
    const attrs = parseAttributes(match[0], tag.length + 1);
    const pre = stack.some(entry => entry.pre) || attrs?.some(attr => attr.name === 'v-pre');
    if (inTemplate && !pre && (tag === 'dt-text' || tag === 'DtText')) {
      yield { start: match.index, attrs };
    }
    const preprocessed = vue && stack.length === 0 && tag === 'template' && attrs?.some(attr => attr.name === 'lang' && attr.value !== 'html');
    const raw = /^(?:script|style|textarea|title|xmp|iframe|noembed|noscript)$/i.test(tag) || (vue && stack.length === 0 && tag !== 'template') || preprocessed;
    if (raw && !match[0].endsWith('/>')) {
      const end = new RegExp(`</${tag}\\s*>`, 'gi');
      end.lastIndex = tokens.lastIndex;
      const close = end.exec(content);
      tokens.lastIndex = close ? end.lastIndex : content.length;
      continue;
    }
    if (!match[0].endsWith('/>') && !VOID_TAGS.has(tag.toLowerCase())) stack.push({ tag, pre });
  }
}

function parseAttributes (text, start) {
  const attrs = [];
  const pattern = /\s+([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/y;
  let cursor = start;
  while (!/^\s*\/?\s*>$/.test(text.slice(cursor))) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(text);
    if (!match) return null;
    attrs.push({ name: match[1], value: match[2] ?? match[3] ?? match[4], start: cursor, end: pattern.lastIndex,
      prefix: match[0].slice(0, match[0].indexOf(match[1])) });
    cursor = pattern.lastIndex;
  }
  return attrs;
}

function propName (name) {
  return name.replace(/^(?::|v-bind:|v-model:)/, '').split('.')[0];
}

function literal (attr) {
  if (!attr || attr.value === undefined) return null;
  if (!/^(?::|v-bind:)/.test(attr.name)) return attr.value;
  const value = attr.value.trim();
  const numeric = /^(?:(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?|0[xX][\da-fA-F]+|0[bB][01]+|0[oO][0-7]+)$/;
  if (numeric.test(value)) return String(Number(value));
  const string = /^(?:'([^'\\]*)'|"([^"\\]*)")$/.exec(value);
  return string ? string[1] ?? string[2] : null;
}

export function transformContent (content, { vue = false } = {}) {
  const edits = [];
  const diagnostics = [];
  let count = 0;
  let protectedCount = 0;
  for (const tag of openingTags(content, vue)) {
    const attrs = tag.attrs;
    const props = name => attrs?.filter(attr => propName(attr.name) === name) ?? [];
    if (props('variant').length) {
      protectedCount++;
      continue;
    }
    const kinds = props('kind');
    const sizes = props('size');
    if (attrs && (!kinds.length || !sizes.length)) continue;
    let reason;
    const uncertain = attrs?.some(attr => {
      if (attr.name.includes('[') || attr.name === 'v-bind' || attr.name.startsWith('v-bind.')) return true;
      if (/^(?::|v-bind:)/.test(attr.name)) return attr.name.includes('.');
      return attr.name.startsWith('v-') && !SAFE_DIRECTIVES.test(attr.name);
    });
    if (!attrs) reason = 'Cannot parse attributes safely';
    else if (uncertain) reason = 'Spread, dynamic argument or directive may supply composition props';
    else if (kinds.length !== 1 || sizes.length !== 1) reason = 'Duplicate or conflicting composition props';
    const kind = literal(kinds[0]);
    const size = literal(sizes[0]);
    const sizeIndex = /^[1-7]00$/.test(size ?? '') ? Number(size) / 100 - 1 : SIZES.indexOf(size);
    if (!reason && (kind === null || size === null)) reason = 'Nonliteral kind or size';
    if (!reason && (!KINDS.has(kind) || !Number.isInteger(sizeIndex) || sizeIndex < 0 || sizeIndex > (kind === 'headline' ? 6 : 3))) {
      reason = 'Unsupported kind/size composition';
    }
    if (reason) {
      const before = content.slice(0, tag.start);
      diagnostics.push({ line: before.split('\n').length, column: tag.start - before.lastIndexOf('\n'), reason,
        action: 'Review composition props and set the intended variant manually.' });
      continue;
    }
    const kindAttr = kinds[0];
    const sizeAttr = sizes[0];
    edits.push({ start: tag.start + kindAttr.start + kindAttr.prefix.length, end: tag.start + kindAttr.end,
      text: `variant="${kind}-${SIZES[sizeIndex]}"` });
    const attributeStart = tag.start + sizeAttr.start + sizeAttr.prefix.length;
    const attributeEnd = tag.start + sizeAttr.end;
    const lineStart = content.lastIndexOf('\n', attributeStart - 1) + 1;
    const lineEnd = content.indexOf('\n', attributeEnd);
    const ownLine = lineEnd !== -1 &&
      /^[ \t]*$/.test(content.slice(lineStart, attributeStart)) &&
      /^[ \t\r]*$/.test(content.slice(attributeEnd, lineEnd));
    const whitespace = sizeAttr.prefix.match(/[ \t]*$/)[0].length;
    // Remove a newly empty attribute line, but keep inline neighbors and closing tags.
    edits.push({ start: ownLine ? lineStart : attributeStart - whitespace,
      end: ownLine ? lineEnd + 1 : attributeEnd, text: '' });
    count++;
  }
  let transformed = content;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    transformed = transformed.slice(0, edit.start) + edit.text + transformed.slice(edit.end);
  }
  return { transformed, count, protectedCount, diagnostics };
}

async function * filesIn (dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'dist', 'compiled', 'storybook-static'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield * filesIn(file);
    else if (entry.isFile() && /\.(?:vue|html)$/.test(entry.name)) yield file;
  }
}

async function main () {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: dialtone-migrate --only text-variant [--cwd <path>] [--dry-run] [--yes]\nConvert static DtText kind + size pairs. Existing variants are protected.');
    return;
  }
  const cwdIndex = args.indexOf('--cwd');
  if (cwdIndex !== -1 && (!args[cwdIndex + 1] || args[cwdIndex + 1].startsWith('--'))) throw new Error('--cwd requires a path');
  const cwd = path.resolve(cwdIndex === -1 ? process.cwd() : args[cwdIndex + 1]);
  const changes = [];
  let eligible = 0;
  let protectedCount = 0;
  let manual = 0;
  for await (const file of filesIn(cwd)) {
    const content = await fs.readFile(file, 'utf8');
    const result = transformContent(content, { vue: file.endsWith('.vue') });
    eligible += result.count;
    protectedCount += result.protectedCount;
    manual += result.diagnostics.length;
    for (const diagnostic of result.diagnostics) {
      console.log(`${path.relative(cwd, file)}:${diagnostic.line}:${diagnostic.column}: ${diagnostic.reason}. ${diagnostic.action}`);
    }
    if (result.count) changes.push({ file, ...result });
  }
  console.log(`Text variants: ${eligible} eligible, ${protectedCount} existing-variant elements unchanged, ${manual} manual review.`);
  if (args.includes('--dry-run')) {
    console.log('--dry-run: No files were modified.');
    return;
  }
  if (!changes.length) return;
  if (!args.includes('--yes')) {
    const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await prompt.question('Apply Text variant changes? (y/N) ');
    prompt.close();
    if (!/^y(?:es)?$/i.test(answer.trim())) return;
  }
  for (const { file, transformed } of changes) await fs.writeFile(file, transformed, 'utf8');
}

try {
  if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
    await main();
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
