import {
  mergeAttributes,
  Mark,
} from '@tiptap/core';
import { autolink } from './autolink';

const defaultAttributes = {
  class: 'd-link d-c-text d-d-inline-block',
  rel: 'noopener noreferrer nofollow',
};

// This is the actual extension code, which is mostly showing that all the
// functionality comes from the ProseMirror plugin.
export const Link = Mark.create({
  name: 'Link',

  renderHTML ({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        defaultAttributes,
      ),
      0,
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
