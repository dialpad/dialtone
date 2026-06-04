import {
  Mark,
  mergeAttributes,
  combineTransactionSteps,
  findChildrenInRange,
  getChangedRanges,
} from '@tiptap/core';
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state';
import { getPhoneNumberRegex } from '@/common/utils';
import {
  getRegexMatches,
  hasValidPrefix,
  trimEndPunctiation,
  getWordAtUntil,
  removeMarks,
} from '../custom_link/utils';

const partialPhoneRegex = getPhoneNumberRegex(1, 15);
const phoneRegex = getPhoneNumberRegex();
// getPhoneNumberRegex returns a non-global regex; getRegexMatches needs the g flag.
const phoneRegexGlobal = new RegExp(phoneRegex.source, 'gi');

function addPhoneMarks (text, pos, from, to, tr, type, phoneNumbers) {
  if (!text) return;

  let rangeFrom = from - pos - 1;
  rangeFrom = rangeFrom < 0 ? 0 : rangeFrom;
  const rangeTo = to - pos;

  const firstWord = getWordAtUntil(text, rangeFrom, 'left', partialPhoneRegex);
  const lastWord = getWordAtUntil(text, rangeTo, 'right', partialPhoneRegex);
  const wordsInRange = text.slice(firstWord.from, lastWord.to);

  const matches = getRegexMatches(wordsInRange, phoneRegexGlobal, hasValidPrefix);

  matches.forEach(match => {
    const word = trimEndPunctiation(match[0]);

    // Skip digit sequences embedded in URL paths or domains (e.g. example.com/7658813).
    // linkRegex would have matched the full URL first; phoneRegexGlobal scans independently
    // so we need to check the preceding character for URL path/port/domain delimiters.
    const precChar = match.index > 0 ? wordsInRange.charAt(match.index - 1) : '';
    if (/[:/.]/.test(precChar)) return;

    if (phoneNumbers !== null && !phoneNumbers.includes(word)) return;

    const markFrom = pos + firstWord.from + match.index + 1;
    const markTo = markFrom + word.length;
    tr.addMark(markFrom, markTo, type.create());
  });
}

function phoneAutolink (options) {
  let hasInitialized = false;
  const { type, phoneNumbers = null } = options;

  return new Plugin({
    key: new PluginKey('phoneAutolink'),

    appendTransaction (transactions, oldState, newState) {
      const contentChanged = transactions.some(tr => tr.docChanged) &&
        !oldState.doc.eq(newState.doc);

      if (hasInitialized && !contentChanged) return;

      const { tr } = newState;
      const { textContent } = newState.doc;

      // On initialization OR full content replacement, scan the entire document.
      if (!hasInitialized || !oldState.doc.textContent) {
        addPhoneMarks(textContent, 0, 0, textContent.length, tr, type, phoneNumbers);
        hasInitialized = true;
        return tr;
      }

      hasInitialized = true;

      const transform = combineTransactionSteps(oldState.doc, [...transactions]);
      const changes = getChangedRanges(transform);

      // Fallback to full scan when getChangedRanges returns nothing (e.g. wholesale setContent).
      if (!changes.length) {
        addPhoneMarks(textContent, 0, 0, textContent.length, tr, type, phoneNumbers);
        return tr;
      }

      changes.forEach(({ oldRange, newRange }) => {
        // Zero-width ranges come from mark-only steps (AddMarkStep/RemoveMarkStep).
        // removeMarks expands by ±1 and would delete our mark without re-adding it.
        if (newRange.from === newRange.to) {
          addPhoneMarks(textContent, 0, 0, textContent.length, tr, type, phoneNumbers);
          return;
        }

        removeMarks(newRange, newState.doc, tr, type);

        const paragraphs = findChildrenInRange(
          newState.doc,
          newRange,
          node => node.isTextblock,
        );

        paragraphs.forEach(({ node, pos }) => {
          addPhoneMarks(node.textContent, pos, oldRange.from, newRange.to, tr, type, phoneNumbers);
        });
      });

      return tr;
    },
  });
}

export const LinkPhoneNumbers = Mark.create({
  name: 'LinkPhoneNumbers',

  addOptions () {
    return {
      HTMLAttributes: {},
      /**
       * Backend-confirmed phone numbers to link (from rich_media).
       * When an array, only those numbers are linked (empty array = no links).
       * When null (default), all phone-like text is auto-linked.
       */
      phoneNumbers: null,
    };
  },

  renderHTML ({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'd-link d-c-text d-d-inline-block d-wb-break-all',
        rel: 'noopener noreferrer nofollow',
      }),
    ];
  },

  addProseMirrorPlugins () {
    const editor = this.editor;
    const type = this.type;
    const { phoneNumbers } = this.options;

    return [
      phoneAutolink({ type, phoneNumbers }),
      new Plugin({
        key: new PluginKey('phoneClick'),
        props: {
          handleClick (view, pos, event) {
            const mark = view.state.doc.resolve(pos).marks().find(m => m.type === type);
            if (!mark) return false;
            const link = event.target?.closest('a');
            event.preventDefault();
            editor.emit('phone-click', { phoneNumber: link?.textContent ?? '' });
            return true;
          },
        },
      }),
    ];
  },
});
