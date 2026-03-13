export default {
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
        lockControl: true,
      },
    },
  },
  away: {
    props: {
      presence: {
        initialValue: 'away',
        lockControl: true,
      },
    },
  },
  offline: {
    props: {
      presence: {
        initialValue: 'offline',
        lockControl: true,
      },
    },
  },
};
