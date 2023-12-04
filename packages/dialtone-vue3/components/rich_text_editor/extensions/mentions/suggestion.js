import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';

import SuggestionList from '../suggestion/SuggestionList.vue';
import MentionSuggestion from './MentionSuggestion.vue';

export default {

  // This function comes from the user and passed to the editor directly.
  // This will also activate the mention plugin on the editor
  // items: ({ query }) => { return [] },

  render: () => {
    let component;
    let popup;

    return {
      onStart: props => {
        component = new VueRenderer(SuggestionList, {
          // // using vue 2:
          // parent: this,
          // propsData: props,
          // using vue 3:
          props: {
            itemComponent: markRaw(MentionSuggestion),
            itemType: 'mention',
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
