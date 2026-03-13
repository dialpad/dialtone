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
};
