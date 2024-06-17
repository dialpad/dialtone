import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import MeetingPill from './MeetingPill.vue';

export default Node.create({

  atom: true,
  group: 'inline',
  inline: true,

  addNodeView () {
    return VueNodeViewRenderer(MeetingPill);
  },

  addAttributes () {
    return {
      text: {
        default: 'Please pass in "text" attribute',
      },
      'close-button-aria-label': {},
    };
  },

  parseHTML () {
    return [
      {
        tag: 'meeting-pill',
      },
    ];
  },

  renderText ({ node }) {
    return '/dpm';
  },

  renderHTML ({ HTMLAttributes }) {
    return ['meeting-pill', mergeAttributes(HTMLAttributes)];
  },
});
