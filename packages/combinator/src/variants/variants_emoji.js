 

export default {
  defaults: {
    props: {
      size: { tokenCategory: 'icon-size' },
    },
  },

  default: {
    props: {
      code: {
        initialValue: ':smile:',
      },
    },
  },

  unicode: {
    props: {
      code: { initialValue: '😄' },
    },
  },

  'custom size': {
    props: {
      code: { initialValue: ':thumbsup:' },
      size: { initialValue: '500' },
    },
  },
};
