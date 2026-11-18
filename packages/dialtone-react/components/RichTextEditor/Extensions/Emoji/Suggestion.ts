import type { Editor, Range } from '@tiptap/core';
import { getEmojiData, type EmojiData } from '../../../../common/emoji';

import { createSuggestionRenderer } from '../Utils/SuggestionUtils';
import EmojiSuggestion from './EmojiSuggestion';

const suggestionLimit = 20;

const sortEmojis = (a: EmojiData, b: EmojiData, query: string) => {
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
  items: ({ query }: { query: string }) => {
    if (query.length < 2) {
      return [];
    }
    const emojiList = Object.values(getEmojiData()) as EmojiData[];
    query = query.toLowerCase();

    const filteredEmoji = emojiList
      .filter(
        item => [
          item.name,
          item.shortname?.replaceAll(':', ''),
          ...((item.keywords as string[] | undefined) || []),
        ].some(text => text && text.startsWith(query)),
      ).splice(0, suggestionLimit)
      .sort((a, b) => sortEmojis(a, b, query));
    return filteredEmoji.map(item => ({ code: item.shortname }));
  },

  command: ({ editor, range, props }: { editor: Editor; range: Range; props: Record<string, unknown> }) => {
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

  render: createSuggestionRenderer(EmojiSuggestion, 'emoji'),
};
