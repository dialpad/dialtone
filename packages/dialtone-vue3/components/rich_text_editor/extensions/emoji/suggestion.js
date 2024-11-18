import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import { emojisIndexed } from '@dialpad/dialtone-emojis';

import SuggestionList from '../suggestion/SuggestionList.vue';
import EmojiSuggestion from './EmojiSuggestion.vue';

import tippy from 'tippy.js';
import hideOnEsc from '../tippy_plugins/hide_on_esc';

const suggestionLimit = 20;

export default {
  items: ({ query }) => {
    if (query.length < 2) {
      return [];
    }
    const emojiList = Object.values(emojisIndexed);
    query = query.toLowerCase();

    const filteredEmoji = emojiList
      .filter(
        item => [
          item.name,
          item.shortname.replaceAll(':', ''),
          ...item.keywords,
        ].some(text => text.startsWith(query)),
      ).splice(0, suggestionLimit);
    return filteredEmoji.map(item => ({ code: item.shortname }));
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
      ])
      .run();

    window.getSelection()?.collapseToEnd();
  },

  render: () => {
    let component;
    let popup;
    let popupIsOpen = false;

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
          showOnCreate: false,
          onShow: () => { popupIsOpen = true; },
          onHidden: () => { popupIsOpen = false; },
          interactive: true,
          trigger: 'manual',
          placement: 'top-start',
          zIndex: 650,
          plugins: [hideOnEsc],
        });

        if (props.items.length > 0) {
          popup?.[0].show();
        }
      },

      onUpdate (props) {
        component?.updateProps(props);

        if (props.items.length > 0) {
          popup?.[0].show();
        } else {
          popup?.[0].hide();
        }
        popup?.[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown (props) {
        if (popupIsOpen) {
          return component?.ref?.onKeyDown(props);
        }
      },

      onExit () {
        popup?.[0].destroy();
        popup = null;
        component?.destroy();
        component = null;
      },
    };
  },
};
