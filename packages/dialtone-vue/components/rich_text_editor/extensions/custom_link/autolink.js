import {
  combineTransactionSteps,
  findChildrenInRange,
  getChangedRanges,
} from '@tiptap/core';
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state';
import {
  addMarks,
  removeMarks,
} from './utils';

/**
 * Plugin to automatically add links into content.
 */
export function autolink (options) {
  // Flag to see if we've loaded this plugin once already. This is used to run
  // the initial content through the plugin if the editor was mounted with some.
  let hasInitialized = false;

  // Backend-confirmed phone numbers. null = auto-detect all; array = restrict to list.
  const phoneNumbers = options.phoneNumbers ?? null;

  return new Plugin({
    key: new PluginKey('autolink'),

    appendTransaction: (transactions, oldState, newState) => {
      const contentChanged = transactions.some(tr => tr.docChanged) &&
        !oldState.doc.eq(newState.doc);

      // Every interaction with the editor is a transaction, but we only care
      // about the ones with content changes.
      if (hasInitialized && !contentChanged) {
        return;
      }

      // The original transaction that we're manipulating.
      const { tr } = newState;

      // Text content after the original transaction.
      const { textContent } = newState.doc;

      // On initialization OR a full content replacement (e.g. setContent called
      // after server confirmation), scan the entire document text. This is more
      // reliable than getChangedRanges for wholesale document replacements.
      if (!hasInitialized || !oldState.doc.textContent) {
        addMarks(textContent, 0, 0, textContent.length, tr, options.type, phoneNumbers);
        hasInitialized = true;
        return tr;
      }

      hasInitialized = true;

      // The transformed state of the document.
      const transform = combineTransactionSteps(
        oldState.doc,
        [...transactions],
      );

      // All the changes within the document.
      const changes = getChangedRanges(transform);

      // If the changed ranges don't cover the document (e.g. setContent replaced
      // the whole document but getChangedRanges returned nothing), fall back to a
      // full scan so phone-number marks are always applied.
      if (!changes.length) {
        addMarks(textContent, 0, 0, textContent.length, tr, options.type, phoneNumbers);
        return tr;
      }

      changes.forEach(({ oldRange, newRange }) => {
        // When getChangedRanges returns a degenerate zero-width range (from mark
        // steps like AddMarkStep/RemoveMarkStep whose StepMap has no position
        // changes), fall back to a full-document scan. Using [0,0] would cause
        // removeMarks to hit our phone mark via ±1 expansion but findChildrenInRange
        // to find no paragraphs, permanently deleting the mark.
        if (newRange.from === newRange.to) {
          addMarks(textContent, 0, 0, textContent.length, tr, options.type, phoneNumbers);
          return;
        }

        // Remove all link marks in the changed range since we'll add them
        // right back if they're still valid links.
        removeMarks(newRange, newState.doc, tr, options.type);

        // Find all paragraphs (Textblocks) that were affected since we want to
        // handle matches in each paragraph separately.
        const paragraphs = findChildrenInRange(
          newState.doc,
          newRange,
          node => node.isTextblock,
        );

        paragraphs.forEach(({ node, pos }) => {
          addMarks(
            node.textContent,
            pos,
            oldRange.from,
            newRange.to,
            tr,
            options.type,
            phoneNumbers,
          );
        });
      });

      // Return the modified transaction or the changes above wont have effect.
      return tr;
    },
  });
}
