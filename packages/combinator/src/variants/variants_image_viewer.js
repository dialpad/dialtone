
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
      imageButtonClass: { initialValue: 'd-w96' },
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
      imageButtonClass: { initialValue: 'd-wmn64 d-hmn64 d-wmx332 d-hmx332' },
      ariaLabel: {
        initialValue: 'Click to open image',
      },
    },
  },
};
