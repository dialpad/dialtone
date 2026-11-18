import {
  Mark,
  mergeAttributes,
  getMarkRange,
} from '@tiptap/core';
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state';
import '../../editorEvents';

export const LinkPhoneNumbers = Mark.create({
  name: 'LinkPhoneNumbers',

  renderHTML ({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        class: 'd-link d-c-pointer d-d-inline-block d-wb-break-all',
        rel: 'noopener noreferrer nofollow',
      }),
    ];
  },

  addProseMirrorPlugins () {
    const editor = this.editor;
    const type = this.type;

    return [
      new Plugin({
        key: new PluginKey('phoneClick'),
        props: {
          handleClick (view, pos, event) {
            const { state } = view;
            let $pos = state.doc.resolve(pos);
            // A click on the first character of a number resolves to the position before it, whose marks are the
            // preceding text's: use the clicked anchor, when there is one, to find the number's own marks.
            const anchor = (event.target as Element | null)?.closest?.('a');
            if (anchor && view.dom.contains(anchor)) {
              try {
                const start = view.posAtDOM(anchor, 0);
                if (state.doc.resolve(start).nodeAfter?.marks.some(m => m.type === type)) {
                  $pos = state.doc.resolve(start + 1);
                }
              } catch {
                // The anchor isn't in the document: keep the click's own position.
              }
            }
            if (!$pos.marks().some(m => m.type === type)) return false;
            // An explicit attribute filter: by default the range matches the first mark's attributes, which can
            // be another mark's (e.g. a textStyle colour) and find no range.
            const range = getMarkRange($pos, type, {});
            const phoneNumber = range ? state.doc.textBetween(range.from, range.to) : '';
            event.preventDefault();
            editor.emit('phone-click', { phoneNumber });
            return true;
          },
        },
      }),
    ];
  },
});
