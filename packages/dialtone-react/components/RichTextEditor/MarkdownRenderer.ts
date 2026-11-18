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
          return `\`\`\`${lang}\n${joinChildren(children)}\n\`\`\`\n`;
        },

        // Custom Dialtone node types
        mention ({ node }: NodeArgs) {
          const id = attr(node, 'id');
          const contactKey = attr(node, 'contactKey');
          const name = attr(node, 'name');
          return `<!-- @mention: {"id": "${id}", "contactKey": "${contactKey}", "name": "${name}"} -->`;
        },

        channel ({ node }: NodeArgs) {
          const id = attr(node, 'id');
          const channelKey = attr(node, 'channelKey');
          const name = attr(node, 'name');
          const locked = String(node.attrs?.locked ?? '');
          return `<!-- @channel: {"id": "${id}", "channelKey": "${channelKey}", "name": "${name}", "locked": "${locked}"} -->`;
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
          return wrapMark(joinChildren(children), '`', '`');
        },

        link ({ mark, children }: MarkArgs) {
          const text = joinChildren(children);
          const href = (mark.attrs?.href as string | undefined) || '';
          const trimmed = text.trim();
          const leading = text.slice(0, text.length - text.trimStart().length);
          const trailing = text.slice(text.trimEnd().length);
          return `${leading}[${trimmed}](${href})${trailing}`;
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
  return output.replace(/\n{3,}/g, '\n\n').replace(/^\n+|\n+$/g, '');
}
