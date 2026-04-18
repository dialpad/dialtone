 
 

export default {
  defaults: {
    props: {
      size: { tokenCategory: 'icon-size' },
    },
  },

  default: {
    slots: {
      default: {
        initialValue: 'Some text with :invalid-emoji: :smile: :cry: and 😄, and custom emojis ',
      },
    },
  },
};
