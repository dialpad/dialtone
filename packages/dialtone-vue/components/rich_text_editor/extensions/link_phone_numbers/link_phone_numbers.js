import {
  Mark,
  mergeAttributes,
  getMarkRange,
} from '@tiptap/core';
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state';

export const LinkPhoneNumbers = Mark.create({
  name: 'LinkPhoneNumbers',

  renderHTML ({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        class: 'd-link d-c-text d-d-inline-block d-wb-break-all',
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
            const $pos = state.doc.resolve(pos);
            if (!$pos.marks().some(m => m.type === type)) return false;
            const range = getMarkRange($pos, type);
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
