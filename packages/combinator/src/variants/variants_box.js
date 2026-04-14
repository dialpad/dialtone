export default {
  default: {
    slots: {
      default: { initialValue: 'Box content' },
    },
  },

  'card composition': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'primary' },

      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '300' },
      shadow: { initialValue: 'card' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="200">
  <dt-text kind="headline" size="md">Card title</dt-text>
  <dt-text kind="body" size="sm">Card body content with some descriptive text.</dt-text>
</dt-stack>` },
    },
  },

  'brand surface': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'brand-subtle' },
      borderColor: { initialValue: 'brand' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="body" size="sm">
  Brand informational content
</dt-text>` },
    },
  },

  'critical surface': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'critical-subtle' },
      borderColor: { initialValue: 'critical' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="body" size="sm">
  Critical error message
</dt-text>` },
    },
  },

  'padding cascade': {
    props: {
      padding: { initialValue: '400' },
      paddingInline: { initialValue: '100' },
      surface: { initialValue: 'moderate' },

      borderWidth: { initialValue: '100' },
    },
    slots: {
      default: { initialValue: 'Block padding 400, inline padding 100' },
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

  'sized with layout token': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'secondary' },

      borderWidth: { initialValue: '100' },
      inlineSize: { initialValue: '500' },
    },
    slots: {
      default: { initialValue: 'Fixed inline-size 500 (320px via layout token)' },
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
      surface: { initialValue: 'brand-subtle' },
      borderRadius: { initialValue: 'pill' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="label" size="sm">
  Pill shape
</dt-text>` },
    },
  },
};
