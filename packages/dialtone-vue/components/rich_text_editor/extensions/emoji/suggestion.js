import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { getEmojiData } from '@/common/emoji';

import SuggestionList from '../suggestion/SuggestionList.vue';
import EmojiSuggestion from './EmojiSuggestion.vue';

const suggestionLimit = 20;

const sortEmojis = (a, b, query) => {
  const aShortname = a.shortname?.replaceAll(':', '');
  const bShortname = b.shortname?.replaceAll(':', '');
  const aStartsWith = aShortname.startsWith(query);
  const bStartsWith = bShortname.startsWith(query);

  // If one starts with query and the other doesn't, prioritize the one that starts
  if (aStartsWith && !bStartsWith) return -1;
  if (!aStartsWith && bStartsWith) return 1;

  // Sort alphabetically
  return aShortname.localeCompare(bShortname);
};

export default {
  items: ({ query }) => {
    if (query.length < 2) {
      return [];
    }
    const emojiList = Object.values(getEmojiData());
    query = query.toLowerCase();

    const filteredEmoji = emojiList
      .filter(
        item => [
          item.name,
          item.shortname?.replaceAll(':', ''),
          ...(item.keywords || []),
        ].some(text => text && text.startsWith(query)),
      ).splice(0, suggestionLimit)
      .sort((a, b) => sortEmojis(a, b, query));
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
            itemComponent: markRaw(EmojiSuggestion),
            itemType: 'emoji',
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

        if (props.clientRect) {
          virtualEl = { getBoundingClientRect: props.clientRect };
          updatePosition();
        }
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
