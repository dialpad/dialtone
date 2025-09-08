import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import MeetingPill from './MeetingPill.vue';

export default Node.create({
  name: 'meetingPill',

  atom: true,
  group: 'inline',
  inline: true,

  addOptions () {
    return {
      onClose: () => {},
    };
  },

  addStorage () {
    return {
      onClose: this.options.onClose,
    };
  },

  addNodeView () {
    return VueNodeViewRenderer(MeetingPill);
  },

  addAttributes () {
    return {
      text: {
        default: 'Please pass in "text" attribute',
      },
    };
  },

  parseHTML () {
    return [
      {
        tag: 'meeting-pill',
      },
    ];
  },

  renderText () {
    return '/dpm';
  },

  renderHTML ({ HTMLAttributes }) {
    return ['meeting-pill', mergeAttributes(HTMLAttributes)];
  },
});
