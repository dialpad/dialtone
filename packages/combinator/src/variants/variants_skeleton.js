
export default {
  default: {
    props: {
      paragraphOption: { initialValue: { rows: 5, randomWidth: false } },
      animate: { initialValue: true },
    },
  },

  'list item': {
    props: {
      listItemOption: { initialValue: { shapeSize: 'sm', paragraphs: { rows: 1 } } },
      animate: { initialValue: true },
    },
  },

  'shape circle': {
    props: {
      shapeOption: { initialValue: { size: 'md', shape: 'circle' } },
      animate: { initialValue: true },
    },
  },

  text: {
    props: {
      textOption: { initialValue: { width: '120px' } },
      animate: { initialValue: true },
    },
  },
};
