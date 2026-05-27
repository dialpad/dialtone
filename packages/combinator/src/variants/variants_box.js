
const isUnset = v => v == null;

export default {
  defaults: {
    props: {
      surface: { tokenCategory: 'color:d-box--surface-:--box-surface' },
      borderColor: { tokenCategory: 'color:d-box--bc-:--box-bc' },
      padding: { tokenCategory: 'spacing' },
      paddingInline: { tokenCategory: 'spacing' },
      paddingInlineStart: { tokenCategory: 'spacing' },
      paddingInlineEnd: { tokenCategory: 'spacing' },
      paddingBlock: { tokenCategory: 'spacing' },
      paddingBlockStart: { tokenCategory: 'spacing' },
      paddingBlockEnd: { tokenCategory: 'spacing' },
      borderWidth: { tokenCategory: 'border-width' },
      borderWidthInline: { tokenCategory: 'border-width' },
      borderWidthInlineStart: { tokenCategory: 'border-width' },
      borderWidthInlineEnd: { tokenCategory: 'border-width' },
      borderWidthBlock: { tokenCategory: 'border-width' },
      borderWidthBlockStart: { tokenCategory: 'border-width' },
      borderWidthBlockEnd: { tokenCategory: 'border-width' },
      borderRadius: { tokenCategory: 'border-radius' },
      inlineSize: { tokenCategory: 'layout' },
      blockSize: { tokenCategory: 'layout' },
      minInlineSize: { tokenCategory: 'layout' },
      maxInlineSize: { tokenCategory: 'layout' },
      minBlockSize: { tokenCategory: 'layout' },
      maxBlockSize: { tokenCategory: 'layout' },
    },
  },

  exclusions: [
    {
      when: {
        borderWidth: isUnset,
        borderWidthInline: isUnset,
        borderWidthInlineStart: isUnset,
        borderWidthInlineEnd: isUnset,
        borderWidthBlock: isUnset,
        borderWidthBlockStart: isUnset,
        borderWidthBlockEnd: isUnset,
      },
      hide: { props: ['borderColor'] },
    },
  ],

  default: {
    props: {
      surface: { initialValue: 'default' },
      borderWidth: { initialValue: '100' },
      borderColor: { initialValue: 'subtle' },
      padding: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: 'Box content' },
    },
  },

  'custom card': {
    props: {
      as: { initialValue: 'aside' },
      padding: { initialValue: '200' },
      surface: { initialValue: 'raised' },
      borderWidth: { initialValue: '100' },
      borderColor: { initialValue: 'subtle' },
      borderRadius: { initialValue: '400' },
      shadow: { initialValue: 'raised' },
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

  'combined with DtStack and DtText': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'default' },
      borderRadius: { initialValue: '450' },
    },
    slots: {
      default: { initialValue: `<dt-stack direction="row" gap="200">
  <dt-box surface="sunken" border-radius="400" padding="100" padding-inline="150">
    <dt-text kind="body" size="sm">First</dt-text>
  </dt-box>
  <dt-box surface="sunken" border-radius="400" padding="100" padding-inline="150">
    <dt-text kind="body" size="sm">Second</dt-text>
  </dt-box>
  <dt-box surface="sunken" border-radius="400" padding="100" padding-inline="150">
    <dt-text kind="body" size="sm">Third</dt-text>
  </dt-box>
</dt-stack>` },
    },
  },

  'sized': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'default' },
      borderWidth: { initialValue: '100' },
      inlineSize: { initialValue: '500' },
      blockSize: { initialValue: '600' },
    },
    slots: {
      default: { initialValue: 'Fixed size' },
    },
  },

  'raised': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'raised' },
      borderRadius: { initialValue: '200' },
      shadow: { initialValue: 'raised' },
    },
    slots: {
      default: { initialValue: 'Raised shadow' },
    },
  },

  'overlay surface with shadow': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'overlay' },
      borderRadius: { initialValue: '200' },
      shadow: { initialValue: 'overlay' },
    },
    slots: {
      default: { initialValue: 'Overlay shadow' },
    },
  },

  'pill radius': {
    props: {
      padding: { initialValue: '100' },
      paddingInline: { initialValue: '200' },
      surface: { initialValue: 'default' },
      borderRadius: { initialValue: 'pill' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="label" size="sm">
  Pill shape
</dt-text>` },
    },
  },

  'composed layout': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'default' },
      borderRadius: { initialValue: '400' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="200">
  <dt-stack gap="400" direction="row" justify="space-between" align="baseline">
    <dt-text as="h2" kind="headline" size="400">Title</dt-text>
    <dt-button size="200">
      <template #endIcon="{ iconSize }">
        <dt-icon name="chevron-down" :size="iconSize" />
      </template>
      Add Box
    </dt-button>
  </dt-stack>
  <dt-stack direction="row" align="start" gap="200">
    <dt-box class="d-fl1" padding="200" surface="sunken" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 1</dt-text>
    </dt-box>
    <dt-box class="d-fl1" padding="200" surface="sunken" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 2</dt-text>
    </dt-box>
    <dt-box class="d-fl1" padding="200" surface="sunken" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 3</dt-text>
    </dt-box>
    <dt-box class="d-fl1" padding="200" surface="sunken" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 4</dt-text>
    </dt-box>
  </dt-stack>
</dt-stack>` },
    },
  },
};
