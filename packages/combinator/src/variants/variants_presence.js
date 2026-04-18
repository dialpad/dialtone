 
 
 
export default {
  defaults: {
    props: {
      presence: { tokenCategory: 'color:d-presence--:--presence-color-background-' },
    },
  },

  default: {
    props: {
      presence: {
        initialValue: 'active',
      },
    },
  },
  busy: {
    props: {
      presence: {
        initialValue: 'busy',
      },
    },
  },
  away: {
    props: {
      presence: {
        initialValue: 'away',
      },
    },
  },
  offline: {
    props: {
      presence: {
        initialValue: 'offline',
      },
    },
  },
};
