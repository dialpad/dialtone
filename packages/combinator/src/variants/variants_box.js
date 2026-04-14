export default {
  default: {
    slots: {
      default: { initialValue: 'Box content' },
    },
  },


  'custom card': {
    props: {
      as: { initialValue: 'aside' },
      padding: { initialValue: '200' },
      surface: { initialValue: 'primary' },
      borderWidth: { initialValue: '100' },
      borderColor: { initialValue: 'subtle' },
      borderRadius: { initialValue: '400' },
      shadow: { initialValue: 'card' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="200">
  <dt-text as="h2" kind="headline" size="md">Card title</dt-text>
  <dt-text as="p" kind="body" size="sm">Card body content with some descriptive text.</dt-text>
</dt-stack>` },
    },
  },

  'critical surface': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'critical' },
      borderColor: { initialValue: 'critical' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '500' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="body" size="sm">
  Critical container
</dt-text>` },
    },
  },

  'semantic nav element': {
    props: {
      as: { initialValue: 'nav' },
      padding: { initialValue: '200' },
      surface: { initialValue: 'secondary' },

      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: `<dt-stack direction="row" gap="200">
  <dt-text kind="body" size="sm">Home</dt-text>
  <dt-text kind="body" size="sm">About</dt-text>
  <dt-text kind="body" size="sm">Contact</dt-text>
</dt-stack>` },
    },
  },

  'sized': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'moderate' },
      borderWidth: { initialValue: '100' },
      inlineSize: { initialValue: '500' },
      blockSize: { initialValue: '600' },
    },
    slots: {
      default: { initialValue: 'Fixed size' },
    },
  },

  'shadow': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'primary' },
      borderRadius: { initialValue: '200' },
      shadow: { initialValue: 'large' },
    },
    slots: {
      default: { initialValue: 'Large shadow' },
    },
  },

  'pill radius': {
    props: {
      padding: { initialValue: '100' },
      paddingInline: { initialValue: '200' },
      surface: { initialValue: 'moderate' },
      borderRadius: { initialValue: 'pill' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="label" size="sm">
  Pill shape
</dt-text>` },
    },
  },
};
