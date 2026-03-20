
export default {
  default: {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
      class: { initialValue: 'd-ba d-bc-critical' },
    },
  },

  'with icons and label': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="compact">
  <template #startIcon="{ iconSize }"><dt-icon name="list-spacing-compact" :size="iconSize" /></template>
  Compact
</dt-segmented-control-item>
<dt-segmented-control-item value="regular">
  <template #startIcon="{ iconSize }"><dt-icon name="list-spacing-regular" :size="iconSize" /></template>
  Regular
</dt-segmented-control-item>
<dt-segmented-control-item value="expanded">
  <template #startIcon="{ iconSize }"><dt-icon name="list-spacing-expanded" :size="iconSize" /></template>
  Expanded
</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'compact' },
      ariaLabel: { initialValue: 'List spacing' },
    },
  },

  'icon only': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="system" label="System">
  <template #startIcon="{ iconSize }"><dt-icon name="laptop-2" :size="iconSize" /></template>
</dt-segmented-control-item>
<dt-segmented-control-item value="light" label="Light">
  <template #startIcon="{ iconSize }"><dt-icon name="sun" :size="iconSize" /></template>
</dt-segmented-control-item>
<dt-segmented-control-item value="dark" label="Dark">
  <template #startIcon="{ iconSize }"><dt-icon name="moon" :size="iconSize" /></template>
</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'system' },
      ariaLabel: { initialValue: 'Appearance mode' },
    },
  },

  'with trailing slot': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="apples" trailingClass="d-pr8">
  Apples
  <template #trailing><dt-badge kind="count">24</dt-badge></template>
</dt-segmented-control-item>
<dt-segmented-control-item value="oranges" trailingClass="d-pr8">
  Oranges
  <template #trailing><dt-badge kind="count">8</dt-badge></template>
</dt-segmented-control-item>
<dt-segmented-control-item value="bananas" trailingClass="d-pr8">
  Bananas
  <template #trailing><dt-badge kind="count">15</dt-badge></template>
</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'apples' },
      ariaLabel: { initialValue: 'Fruit counts' },
    },
  },

  'borderless': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
      borderless: { initialValue: true },
    },
  },

  'no divider': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
      hideDivider: { initialValue: true },
    },
  },

  'spread evenly': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="1">1</dt-segmented-control-item>
<dt-segmented-control-item value="two">Two</dt-segmented-control-item>
<dt-segmented-control-item value="three">Three</dt-segmented-control-item>
<dt-segmented-control-item value="four">Four long label</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: '1' },
      ariaLabel: { initialValue: 'Spread evenly' },
      spread: { initialValue: 'evenly' },
    },
  },

  'vertical': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
      orientation: { initialValue: 'vertical' },
    },
  },

  'disabled': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
      disabled: { initialValue: true },
    },
  },

  'individual disabled item': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites" disabled>Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
    },
  },

  'size xs': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
      size: { initialValue: 'xs' },
    },
  },

  'size lg': {
    slots: {
      default: {
        initialValue: `<dt-segmented-control-item value="all">All</dt-segmented-control-item>
<dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
<dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>`,
      },
    },
    props: {
      modelValue: { initialValue: 'all' },
      ariaLabel: { initialValue: 'View filter' },
      size: { initialValue: 'lg' },
    },
  },
};
