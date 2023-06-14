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

      // When the editor is initialized we want to add links to it.
      if (!hasInitialized) {
        addMarks(textContent, 0, 0, textContent.length, tr, options.type);
      }

      hasInitialized = true;

      // The transformed state of the document.
      const transform = combineTransactionSteps(
        oldState.doc,
        [...transactions],
      );

      // All the changes within the document.
      const changes = getChangedRanges(transform);

      changes.forEach(({ oldRange, newRange }) => {
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
          );
        });
      });

      // Return the modified transaction or the changes above wont have effect.
      return tr;
    },
  });
}
