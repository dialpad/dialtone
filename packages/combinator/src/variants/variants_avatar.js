 
export default {
  exclusions: [
    {
      when: { iconOnly: true },
      hide: {
        props: ['family', 'variant', 'color', 'seed', 'fullName', 'imageSrc', 'imageAlt'],
      },
    },
    {
      when: { group: v => v > 1 },
      hide: { props: ['presence', 'presenceProps'] },
    },
  ],

  default: {
    props: {
      fullName: {
        initialValue: 'DP',
      },
      seed: {
        initialValue: 'user-unique-id',
      },
    },
  },

  image: {
    props: {
      imageSrc: { initialValue: '/assets/images/person.png' },
      imageAlt: { initialValue: 'Avatar user' },
    },
  },

  'icon avatar': {
    props: {
      size: { initialValue: '200' },
    },
    slots: {
      icon: { initialValue: '<dt-icon-user />' },
    },
  },

  'group small': {
    props: {
      size: { initialValue: '100' },
      group: { initialValue: 3 },
      imageSrc: { initialValue: '/assets/images/person.png' },
      imageAlt: { initialValue: 'Person Avatar' },
    },
  },

  'group count': {
    props: {
      size: { initialValue: '400' },
      group: { initialValue: 100 },
      imageSrc: { initialValue: '/assets/images/person.png' },
      imageAlt: { initialValue: 'Person Avatar' },
    },
  },

  presence: {
    props: {
      size: { initialValue: 'sm' },
      presence: { initialValue: 'away' },
      imageSrc: { initialValue: '/assets/images/person.png' },
      imageAlt: { initialValue: 'Person Avatar' },
    },
  },

  'overlay icon': {
    props: {
      size: { initialValue: 'lg' },
      imageSrc: { initialValue: '/assets/images/person.png' },
      imageAlt: { initialValue: 'Avatar user' },
    },
    slots: {
      overlayIcon: { initialValue: '<dt-icon-hear />' },
    },
  },

  deactivated: {
    props: {
      deactivated: { initialValue: true },
      imageSrc: { initialValue: '/assets/images/person.png' },
      imageAlt: { initialValue: 'Deactivated user' },
    },
  },
};
