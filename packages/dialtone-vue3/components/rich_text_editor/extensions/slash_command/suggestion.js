import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';

import SuggestionList from '../suggestion/SuggestionList.vue';
import SlashCommandSuggestion from './SlashCommandSuggestion.vue';

export default {

  // This function comes from the user and passed to the editor directly.
  // This will also activate the mention plugin on the editor
  // items: ({ query }) => { return [] },

  allowSpaces: true,
  startOfLine: true,

  render: () => {
    let component;
    let popup;

    return {
      onStart: props => {
        component = new VueRenderer(SuggestionList, {
          parent: this,
          props: {
            itemComponent: markRaw(SlashCommandSuggestion),
            itemType: 'slash-command',
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
          placement: 'top-start',
        });
      },

      onUpdate (props) {
        component?.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup?.[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown (props) {
        if (!popup) return true;
        if (props.event.key === 'Escape') {
          popup?.[0].hide();

          return true;
        }

        return component?.ref.onKeyDown(props);
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
