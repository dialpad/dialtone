import type { Extensions, JSONContent } from '@tiptap/core';
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown';
import { codeToEmojiData, stringToUnicode } from '../../common/emoji';

type Children = string | string[] | undefined | null;

// The pm/markdown renderer passes children as string[] (one entry per child node),
// not as a pre-joined string. Normalize to a string before processing.
const joinChildren = (children: Children): string => Array.isArray(children) ? children.join('') : (children || '');

// Move leading/trailing spaces outside mark delimiters so parsers like CommonMark
// don't reject them (e.g. "** bold **" → " **bold** ").
const wrapMark = (text: string, open: string, close: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const leading = text.slice(0, text.length - text.trimStart().length);
  const trailing = text.slice(text.trimEnd().length);
  return `${leading}${open}${trimmed}${close}${trailing}`;
};

interface NodeArgs {
  node: { attrs?: Record<string, unknown> | null };
  children?: Children;
}

interface MarkArgs {
  mark: { attrs?: Record<string, unknown> | null };
  children?: Children;
}

const attr = (node: NodeArgs['node'], name: string): string => {
  const value = node.attrs?.[name];
  return value ? String(value) : '';
};

// A JSON string for the metadata in a markdown comment: quotes and backslashes are escaped, and `>` is encoded so
// a value can't close the comment.
const jsonString = (value: string): string => JSON.stringify(value).replace(/>/g, '\\u003e');

// The shortest run of backticks that doesn't occur in the code, at least `min` long.
const backtickFence = (code: string, min: number): string => {
  const runs = code.match(/`+/g) || [];
  let length = min;
  while (runs.some(run => run.length === length)) length++;
  return '`'.repeat(length);
};

const wrapCode = (code: string): string => {
  const fence = backtickFence(code, 1);
  // CommonMark strips one leading and trailing space, so pad when the code touches a backtick.
  const pad = code.startsWith('`') || code.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${code}${pad}${fence}`;
};

// Collapse runs of blank lines between blocks, but not inside fenced code, where they are literal.
const collapseBlankLines = (markdown: string): string => {
  let fence = '';
  const lines = markdown.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    if (!fence) {
      const opening = /^(`{3,})/.exec(line);
      if (opening) fence = opening[1];
    } else if (new RegExp(`^\`{${fence.length},}\\s*$`).test(line)) {
      fence = '';
    }
    result.push(line);
    if (!fence && line === '' && result.length > 2 && result[result.length - 2] === '' &&
      result[result.length - 3] === '') {
      result.pop();
    }
  }
  return result.join('\n');
};

/**
 * Renders a TipTap/ProseMirror JSON document to a markdown string.
 *
 * Uses @tiptap/static-renderer with custom mappings to preserve the output
 * format of the legacy jsonToMarkdownConverter, including Dialtone-specific
 * node types (mention, channel, emoji, variable, slash-commands).
 */
export function renderEditorToMarkdown (jsonContent: JSONContent, extensions: Extensions): string {
  const output = renderToMarkdown({
    extensions,
    content: jsonContent,
    options: {
      nodeMapping: {
        // Override blockquote: built-in omits trailing newline (causes lazy continuation).
        // Since we replace the built-in entirely, we must add the '> ' prefix ourselves.
        blockquote ({ children }: NodeArgs) {
          const text = joinChildren(children).trim();
          const quoted = text
            .split('\n')
            .map(line => line ? `> ${line}` : '>')
            .join('\n');
          return quoted + '\n';
        },

        // Override codeBlock: built-in passes null language through literally
        codeBlock ({ node, children }: NodeArgs) {
          const lang = attr(node, 'language');
          const code = joinChildren(children);
          const fence = backtickFence(code, 3);
          return `${fence}${lang}\n${code}\n${fence}\n`;
        },

        // Custom Dialtone node types
        mention ({ node }: NodeArgs) {
          const id = attr(node, 'id');
          const contactKey = attr(node, 'contactKey');
          const name = attr(node, 'name');
          return `<!-- @mention: {"id": ${jsonString(id)}, "contactKey": ${jsonString(contactKey)}, ` +
            `"name": ${jsonString(name)}} -->`;
        },

        channel ({ node }: NodeArgs) {
          const id = attr(node, 'id');
          const channelKey = attr(node, 'channelKey');
          const name = attr(node, 'name');
          const locked = String(node.attrs?.locked ?? '');
          return `<!-- @channel: {"id": ${jsonString(id)}, "channelKey": ${jsonString(channelKey)}, ` +
            `"name": ${jsonString(name)}, "locked": ${jsonString(locked)}} -->`;
        },

        'slash-commands' ({ node }: NodeArgs) {
          return `/${attr(node, 'command')}`;
        },

        emoji ({ node }: NodeArgs) {
          const code = node.attrs?.code as string | null | undefined;
          if (!code) return '';
          // Always output emoji as unicode characters rather than shortcodes, matching
          // renderText's backwards-compatibility behavior with our backend (see Emoji.ts).
          const emojiData = codeToEmojiData(code);
          return emojiData ? stringToUnicode(emojiData.unicode_output as string) : code;
        },

        variable ({ node }: NodeArgs) {
          const id = attr(node, 'id');
          const altText = attr(node, 'altText');
          return `{{${id}=${altText}}}`;
        },
      },

      markMapping: {
        bold ({ children }: MarkArgs) {
          return wrapMark(joinChildren(children), '**', '**');
        },

        // Override italic: use * instead of built-in _ and fix boundary spaces
        italic ({ children }: MarkArgs) {
          return wrapMark(joinChildren(children), '*', '*');
        },

        strike ({ children }: MarkArgs) {
          return wrapMark(joinChildren(children), '~~', '~~');
        },

        code ({ children }: MarkArgs) {
          const text = joinChildren(children);
          const trimmed = text.trim();
          if (!trimmed) return text;
          const leading = text.slice(0, text.length - text.trimStart().length);
          const trailing = text.slice(text.trimEnd().length);
          return `${leading}${wrapCode(trimmed)}${trailing}`;
        },

        link ({ mark, children }: MarkArgs) {
          const text = joinChildren(children);
          const href = (mark.attrs?.href as string | undefined) || '';
          const trimmed = text.trim();
          const leading = text.slice(0, text.length - text.trimStart().length);
          const trailing = text.slice(text.trimEnd().length);
          // Parentheses and backslashes in the destination are escaped, so the first `)` doesn't end it.
          const destination = href.replace(/[()\\]/g, '\\$&');
          return `${leading}[${trimmed}](${destination})${trailing}`;
        },

        // Override underline: pass-through (no markdown equivalent, matches legacy no-op)
        underline ({ children }: MarkArgs) {
          return joinChildren(children);
        },
      },
    },
  });
  // Collapse 3+ consecutive newlines to 2 (CommonMark ignores extra blank
  // lines between blocks), and strip the leading newline that the built-in
  // paragraph renderer always prepends to the first node.
  return collapseBlankLines(output).replace(/^\n+|\n+$/g, '');
}
