 

export default {
  defaults: {
    props: {
      activePage: { slider: { min: 1, maxProp: 'totalPages', step: 1, showTicks: true } },
      maxVisible: { slider: { min: 3, max: 11, step: 2, showTicks: true } },
    },
  },

  'without page numbers': {
    props: {
      totalPages: { initialValue: 25 },
      maxVisible: { initialValue: 0, slider: null },
    },
  },
  default: {
    props: {
      totalPages: {
        initialValue: 25,
      },
    },
  },

  'max visible': {
    props: {
      totalPages: { initialValue: 12 },
      maxVisible: { initialValue: 3 },
    },
  },

  'active page': {
    props: {
      totalPages: { initialValue: 13 },
      activePage: { initialValue: 5 },
    },
  },
};
