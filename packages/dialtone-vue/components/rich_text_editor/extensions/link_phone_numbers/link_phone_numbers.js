import {
  Mark,
  mergeAttributes,
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
