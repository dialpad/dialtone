import {
  combineTransactionSteps,
  findChildrenInRange,
  getChangedRanges,
  getMarksBetween,
} from '@tiptap/core';
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state';
import { tokenize } from 'linkifyjs';

const UNICODE_WHITESPACE_PATTERN = '[\\0- \\xA0\\u1680\\u180E\\u2000-\\u2029\\u205F\\u3000]';
const UNICODE_WHITESPACE_REGEX = new RegExp(UNICODE_WHITESPACE_PATTERN);
const UNICODE_WHITESPACE_REGEX_END = new RegExp(`${UNICODE_WHITESPACE_PATTERN}$`);

// A lone trailing/leading bracket (e.g. the ")" in "(like https://dialpad.design/)")
// makes upstream trailing content fully invalid, so no link is added at all even
// though linkifyjs correctly identifies the URL boundary. Accept that 2-token split
// as long as the leftover token is pure bracket/punctuation, while still rejecting
// genuinely invalid trailing content such as "example.com1".
const TRAILING_PUNCTUATION_REGEX = /^[)\]}>,.;:!?'"]+$/;
const LEADING_PUNCTUATION_REGEX = /^[([{<"']+$/;

/**
 * Dialtone-owned reimplementation of @tiptap/extension-link's internal
 * isValidLinkStructure(), with the DLT-3610 trailing/leading bracket fix
 * applied. Upstream doesn't export this function, and pnpm-patching the
 * dependency doesn't reach consumers of the published package (Vite
 * externalizes @tiptap/* in the dialtone-vue build), so the fix has to be
 * shipped as Dialtone source instead. Drop this file and go back to
 * `autolink: true` on the built-in extension once upstream fixes this and
 * the dependency is bumped.
 */
function isValidTwoTokenLinkStructure (tokens) {
  return (tokens[0].isLink && TRAILING_PUNCTUATION_REGEX.test(tokens[1].value)) ||
    (tokens[1].isLink && LEADING_PUNCTUATION_REGEX.test(tokens[0].value));
}

export function isValidLinkStructure (tokens) {
  switch (tokens.length) {
    case 1:
      return tokens[0].isLink;
    case 2:
      return isValidTwoTokenLinkStructure(tokens);
    case 3:
      return tokens[1].isLink && ['()', '[]'].includes(tokens[0].value + tokens[2].value);
    default:
      return false;
  }
}

function addLinkMarks (linksBeforeSpace, lastWordAndBlockOffset, newState, tr, options) {
  linksBeforeSpace
    .filter(link => link.isLink)
    .map(link => ({
      ...link,
      from: lastWordAndBlockOffset + link.start + 1,
      to: lastWordAndBlockOffset + link.end + 1,
    }))
    .filter(link => {
      const { code } = newState.schema.marks;
      return !code || !newState.doc.rangeHasMark(link.from, link.to, code);
    })
    .filter(link => options.validate(link.value))
    .filter(link => options.shouldAutoLink(link.value))
    .forEach(link => {
      if (getMarksBetween(link.from, link.to, newState.doc).some(item => item.mark.type === options.type)) {
        return;
      }

      tr.addMark(
        link.from,
        link.to,
        options.type.create({ href: link.href }),
      );
    });
}

// Finds the textblock touched by `newRange` and the text preceding the first
// whitespace after it, which is where a just-typed link candidate lives.
function findTextBeforeWhitespace (newState, newRange) {
  const nodesInChangedRanges = findChildrenInRange(newState.doc, newRange, node => node.isTextblock);

  if (nodesInChangedRanges.length > 1) {
    const textBlock = nodesInChangedRanges[0];
    return {
      textBlock,
      textBeforeWhitespace: newState.doc.textBetween(
        textBlock.pos,
        textBlock.pos + textBlock.node.nodeSize,
        undefined,
        ' ',
      ),
    };
  }

  if (!nodesInChangedRanges.length) {
    return {};
  }

  const endText = newState.doc.textBetween(newRange.from, newRange.to, ' ', ' ');

  if (!UNICODE_WHITESPACE_REGEX_END.test(endText)) {
    return {};
  }

  const textBlock = nodesInChangedRanges[0];
  return {
    textBlock,
    textBeforeWhitespace: newState.doc.textBetween(textBlock.pos, newRange.to, undefined, ' '),
  };
}

function autolinkChangedRange (newRange, newState, tr, options) {
  const { textBlock, textBeforeWhitespace } = findTextBeforeWhitespace(newState, newRange);

  if (!textBlock || !textBeforeWhitespace) {
    return;
  }

  const wordsBeforeWhitespace = textBeforeWhitespace.split(UNICODE_WHITESPACE_REGEX).filter(Boolean);

  if (wordsBeforeWhitespace.length <= 0) {
    return;
  }

  const lastWordBeforeSpace = wordsBeforeWhitespace[wordsBeforeWhitespace.length - 1];
  const lastWordAndBlockOffset = textBlock.pos + textBeforeWhitespace.lastIndexOf(lastWordBeforeSpace);

  if (!lastWordBeforeSpace) {
    return;
  }

  const linksBeforeSpace = tokenize(lastWordBeforeSpace).map(t => t.toObject(options.defaultProtocol));

  if (!isValidLinkStructure(linksBeforeSpace)) {
    return;
  }

  addLinkMarks(linksBeforeSpace, lastWordAndBlockOffset, newState, tr, options);
}

/**
 * Dialtone-owned reimplementation of @tiptap/extension-link's internal
 * autolink() ProseMirror plugin. See isValidLinkStructure() above for why
 * this is a copy rather than a patch of the upstream dependency.
 */
export function autolinkFix (options) {
  return new Plugin({
    key: new PluginKey('dtAutolinkFix'),

    appendTransaction: (transactions, oldState, newState) => {
      const docChanges = transactions.some(transaction => transaction.docChanged) &&
        !oldState.doc.eq(newState.doc);
      const preventAutolink = transactions.some(transaction => transaction.getMeta('preventAutolink'));

      if (!docChanges || preventAutolink) {
        return;
      }

      const { tr } = newState;
      const transform = combineTransactionSteps(oldState.doc, [...transactions]);
      const changes = getChangedRanges(transform);

      changes.forEach(({ newRange }) => autolinkChangedRange(newRange, newState, tr, options));

      if (!tr.steps.length) {
        return;
      }

      return tr;
    },
  });
}
