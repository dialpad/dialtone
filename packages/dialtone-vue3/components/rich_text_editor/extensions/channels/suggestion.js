import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import tippy from 'tippy.js';

import SuggestionList from '../suggestion/SuggestionList.vue';
import ChannelSuggestion from './ChannelSuggestion.vue';
import hideOnEsc from '../tippy_plugins/hide_on_esc';

export default {

  // This function comes from the user and passed to the editor directly.
  // This will also activate the mention plugin on the editor
  // items: ({ query }) => { return [] },

  allowSpaces: true,

  render: () => {
    let component;
    let popup;
    let popupIsOpen = false;

    return {
      onStart: props => {
        component = new VueRenderer(SuggestionList, {
          props: {
            itemComponent: markRaw(ChannelSuggestion),
            itemType: 'channel',
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

        if (!props.clientRect) {
          return;
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
