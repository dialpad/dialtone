import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown';

// The pm/markdown renderer passes children as string[] (one entry per child node),
// not as a pre-joined string. Normalize to a string before processing.
const joinChildren = (children) => Array.isArray(children) ? children.join('') : (children || '');

// Move leading/trailing spaces outside mark delimiters so parsers like CommonMark
// don't reject them (e.g. "** bold **" → " **bold** ").
const wrapMark = (text, open, close) => {
  const trimmed = text.trim();
  if (!trimmed) return text;
  const leading = text.slice(0, text.length - text.trimStart().length);
  const trailing = text.slice(text.trimEnd().length);
  return `${leading}${open}${trimmed}${close}${trailing}`;
};

/**
 * Renders a TipTap/ProseMirror JSON document to a markdown string.
 *
 * Uses @tiptap/static-renderer with custom mappings to preserve the output
 * format of the legacy jsonToMarkdownConverter, including Dialtone-specific
 * node types (mention, channel, emoji, variable, slash-commands).
 *
 * @param {import('@tiptap/core').JSONContent} jsonContent - TipTap JSON document
 * @param {import('@tiptap/core').Extensions} extensions - Active editor extensions
 * @returns {string}
 */
export function renderEditorToMarkdown (jsonContent, extensions) {
  const output = renderToMarkdown({
    extensions,
    content: jsonContent,
    options: {
      nodeMapping: {
        // Override blockquote: built-in omits trailing newline (causes lazy continuation).
        // Since we replace the built-in entirely, we must add the '> ' prefix ourselves.
        blockquote ({ children }) {
          const text = joinChildren(children).trim();
          const quoted = text
            .split('\n')
            .map(line => line ? `> ${line}` : '>')
            .join('\n');
          return quoted + '\n';
        },

        // Override codeBlock: built-in passes null language through literally
        codeBlock ({ node, children }) {
          const lang = node.attrs?.language || '';
          return `\`\`\`${lang}\n${joinChildren(children)}\n\`\`\`\n`;
        },

        // Custom Dialtone node types
        mention ({ node }) {
          const id = node.attrs?.id || '';
          const contactKey = node.attrs?.contactKey || '';
          const name = node.attrs?.name || '';
          return `<!-- @mention: {"id": "${id}", "contactKey": "${contactKey}", "name": "${name}"} -->`;
        },

        channel ({ node }) {
          const id = node.attrs?.id || '';
          const channelKey = node.attrs?.channelKey || '';
          const name = node.attrs?.name || '';
          const locked = String(node.attrs?.locked ?? '');
          return `<!-- @channel: {"id": "${id}", "channelKey": "${channelKey}", "name": "${name}", "locked": "${locked}"} -->`;
        },

        'slash-commands' ({ node }) {
          return `/${node.attrs?.command || ''}`;
        },

        emoji ({ node }) {
          return node.attrs?.code || '';
        },

        variable ({ node }) {
          const id = node.attrs?.id || '';
          const altText = node.attrs?.altText || '';
          return `{{${id}=${altText}}}`;
        },
      },

      markMapping: {
        bold ({ children }) {
          return wrapMark(joinChildren(children), '**', '**');
        },

        // Override italic: use * instead of built-in _ and fix boundary spaces
        italic ({ children }) {
          return wrapMark(joinChildren(children), '*', '*');
        },

        strike ({ children }) {
          return wrapMark(joinChildren(children), '~~', '~~');
        },

        code ({ children }) {
          return wrapMark(joinChildren(children), '`', '`');
        },

        link ({ mark, children }) {
          const text = joinChildren(children);
          const href = mark.attrs?.href || '';
          const trimmed = text.trim();
          const leading = text.slice(0, text.length - text.trimStart().length);
          const trailing = text.slice(text.trimEnd().length);
          return `${leading}[${trimmed}](${href})${trailing}`;
        },

        // Override underline: pass-through (no markdown equivalent, matches legacy no-op)
        underline ({ children }) {
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
