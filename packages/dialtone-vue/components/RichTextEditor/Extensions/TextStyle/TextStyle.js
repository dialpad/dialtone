import { TextStyle } from '@tiptap/extension-text-style';

export const CustomTextStyle = TextStyle.extend({
  parseHTML () {
    return [
      ...this.parent?.() || [],
      {
        tag: 'div',
        consuming: false,
        getAttrs: element => {
          if (!element.hasAttribute('style')) return false;
          return {};
        },
      },
      {
        tag: 'a',
        consuming: false,
        getAttrs: element => {
          if (!element.hasAttribute('style')) return false;
          return {};
        },
      },
    ];
  },
});
