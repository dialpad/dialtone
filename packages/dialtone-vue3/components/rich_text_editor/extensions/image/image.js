import Image from '@tiptap/extension-image';

export const ConfigurableImage = Image.extend({
  name: 'ConfigurableImage',

  addAttributes () {
    return {
      src: {
        default: '',
      },
      alt: {
        default: undefined,
      },
      title: {
        default: undefined,
      },
      width: {
        default: undefined,
      },
      height: {
        default: undefined,
      },
      style: {
        default: undefined,
      },
    };
  },
}).configure({ inline: true });
