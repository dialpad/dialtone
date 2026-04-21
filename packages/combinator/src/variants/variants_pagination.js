/* eslint-disable max-len */

export default {
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
