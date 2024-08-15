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
import { autolink } from './autolink';

const defaultAttributes = {
  class: 'd-link d-c-text d-d-inline-block d-wb-break-all',
  rel: 'noopener noreferrer nofollow',
};

// This is the actual extension code, which is mostly showing that all the
// functionality comes from the ProseMirror plugin.
export const CustomLink = Mark.create({
  name: 'CustomLink',

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
    return [
      autolink({ type: this.type }),
    ];
  },
});
