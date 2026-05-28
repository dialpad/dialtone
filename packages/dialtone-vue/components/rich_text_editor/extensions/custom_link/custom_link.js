/**
 *
 * The custom link does some additional things on top of the built in TipTap link
 * extension such as styling phone numbers and IP adresses as links, and allows you
 * to linkify text without having to type a space after the link. Currently it is missing some
 * functionality such as editing links and will likely require more work to be fully usable,
 * so it is recommended to use the built in TipTap link for now.
 */

import {
  mergeAttributes,
  Mark,
} from '@tiptap/core';
import {
  Plugin,
  PluginKey,
} from '@tiptap/pm/state';
import { autolink } from './autolink';

const defaultAttributes = {
  class: 'd-link d-c-text d-d-inline-block d-wb-break-all',
  rel: 'noopener noreferrer nofollow',
};

// This is the actual extension code, which is mostly showing that all the
// functionality comes from the ProseMirror plugin.
export const CustomLink = Mark.create({
  name: 'CustomLink',

  addAttributes () {
    return {
      /**
       * Whether this link marks a phone number (vs a URL or email).
       * Set by the autolink plugin when it detects a phone number match.
       */
      isPhone: {
        default: false,
        parseHTML: (element) => element.dataset.isPhone === 'true',
        renderHTML: (attrs) => attrs.isPhone ? { 'data-is-phone': 'true' } : {},
      },

      /**
       * The raw phone number text (only set when isPhone is true).
       * Emitted as part of the phone-click event payload.
       */
      phoneNumber: {
        default: null,
        parseHTML: (element) => element.dataset.phoneNumber ?? null,
        renderHTML: (attrs) => attrs.phoneNumber ? { 'data-phone-number': attrs.phoneNumber } : {},
      },
    };
  },

  renderHTML ({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        defaultAttributes,
      ),
    ];
  },

  renderText ({ node }) {
    return node.attrs.text;
  },

  addProseMirrorPlugins () {
    const editor = this.editor;
    const type = this.type;

    return [
      autolink({ type }),
      new Plugin({
        key: new PluginKey('customLinkClick'),
        props: {
          handleClick (view, pos, event) {
            const resolvedPos = view.state.doc.resolve(pos);
            const customLinkMark = resolvedPos.marks().find(m => m.type === type);

            if (customLinkMark?.attrs?.isPhone) {
              event.preventDefault();
              editor.emit('phone-click', { phoneNumber: customLinkMark.attrs.phoneNumber });
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});
