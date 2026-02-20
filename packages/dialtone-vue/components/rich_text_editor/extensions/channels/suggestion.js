import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

import SuggestionList from '../suggestion/SuggestionList.vue';
import ChannelSuggestion from './ChannelSuggestion.vue';

export default {

  // This function comes from the user and passed to the editor directly.
  // This will also activate the mention plugin on the editor
  // items: ({ query }) => { return [] },

  allowSpaces: true,

  render: () => {
    let component;
    let floatingEl;
    let popupIsOpen = false;
    let virtualEl = {
      getBoundingClientRect: () => ({ width: 0, height: 0, x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0 }),
    };
    let escHandler;

    async function updatePosition () {
      if (!floatingEl || !virtualEl.getBoundingClientRect) return;
      const { x, y } = await computePosition(virtualEl, floatingEl, {
        placement: 'top-start',
        middleware: [offset(0), flip(), shift({ padding: 8 })],
      });
      Object.assign(floatingEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    }

    function show () {
      if (!floatingEl) return;
      floatingEl.style.display = 'block';
      popupIsOpen = true;
      updatePosition();
    }

    function hide () {
      if (!floatingEl) return;
      floatingEl.style.display = 'none';
      popupIsOpen = false;
    }

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

        floatingEl = component.element;
        floatingEl.style.position = 'absolute';
        floatingEl.style.zIndex = '650';
        floatingEl.style.display = 'none';
        document.body.appendChild(floatingEl);

        virtualEl = { getBoundingClientRect: props.clientRect };

        escHandler = (e) => {
          if (e.key === 'Escape' && popupIsOpen) {
            hide();
          }
        };
        document.addEventListener('keydown', escHandler);

        if (props.items.length > 0) {
          show();
        }
      },

      onUpdate (props) {
        component?.updateProps(props);

        if (props.items.length > 0) {
          show();
        } else {
          hide();
        }

        if (!props.clientRect) {
          return;
        }

        virtualEl = { getBoundingClientRect: props.clientRect };
        updatePosition();
      },

      onKeyDown (props) {
        if (popupIsOpen) {
          return component?.ref?.onKeyDown(props);
        }
      },

      onExit () {
        if (escHandler) {
          document.removeEventListener('keydown', escHandler);
          escHandler = null;
        }
        floatingEl?.remove();
        floatingEl = null;
        component?.destroy();
        component = null;
      },
    };
  },
};
