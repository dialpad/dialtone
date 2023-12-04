import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import { emojisIndexed } from '@/components/emoji_picker/emojis';

import SuggestionList from '../suggestion/SuggestionList.vue';
import EmojiSuggestion from './EmojiSuggestion.vue';

import tippy from 'tippy.js';

export default {
  items: ({ query }) => {
    if (query.length < 2) {
      return [];
    }
    const emojiList = Object.values(emojisIndexed);
    const filteredEmoji = emojiList.filter(function (item) {
      if (item.shortname.substring(1, item.shortname.length - 1).startsWith(query.toLowerCase())) {
        return true;
      }
      return false;
    });
    return filteredEmoji.map(item => { return { id: item.unicode_character, code: item.shortname }; });
  },

  command: ({ editor, range, props }) => {
    // increase range.to by one when the next node is of type "text"
    // and starts with a space character
    const nodeAfter = editor.view.state.selection.$to.nodeAfter;
    const overrideSpace = nodeAfter?.text?.startsWith(' ');

    if (overrideSpace) {
      range.to += 1;
    }

    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'emoji',
          attrs: props,
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run();

    window.getSelection()?.collapseToEnd();
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: props => {
        component = new VueRenderer(SuggestionList, {
          props: {
            itemComponent: markRaw(EmojiSuggestion),
            itemType: 'emoji',
            ...props,
          },
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          contentElement: null,
          zIndex: 650,
        });
      },

      onUpdate (props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown (props) {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit () {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
