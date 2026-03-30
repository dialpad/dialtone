/* eslint-disable max-len */

export default {
  default: {
    props: {
      imageSrc: {
        initialValue: '/assets/images/test.jpg',
      },
      imageAlt: {
        initialValue: 'Image Alt Text',
      },
      closeAriaLabel: {
        initialValue: 'Close',
      },
      imageButtonClass: { initialValue: 'd-w-150' },
    },
  },

  gif: {
    props: {
      imageSrc: {
        initialValue: '/assets/images/fry.gif',
      },
      imageAlt: {
        initialValue: 'Image Alt Text',
      },
      closeAriaLabel: {
        initialValue: 'Close',
      },
      imageButtonClass: { initialValue: 'd-wmn-100 d-hmn-100 d-wmx-500 d-hmx-500' },
      ariaLabel: {
        initialValue: 'Click to open image',
      },
    },
  },
};
