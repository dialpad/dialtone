/* eslint-disable max-len */


export default {
  exclusions: [
    {
      when: { labelVisible: false },
      hide: { props: ['labelClass', 'labelSize', 'labelStrength'] },
    },
  ],

  default: {
    props: {
      label: {
        initialValue: 'Label',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
  },

  'small input': {
    props: {
      label: {
        initialValue: 'Label',
      },
      size: {
        initialValue: '200',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
  },

  'with start icon': {
    props: {
      label: {
        initialValue: 'Start icon',
      },
      type: {
        initialValue: 'text',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
    slots: {
      startIcon: {
        initialValue: '<dt-icon-box-select :size="iconSize" />',
      },
    },
  },

  'with start and end icon': {
    props: {
      label: {
        initialValue: 'Start and end icon',
      },
      type: {
        initialValue: 'text',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
    slots: {
      startIcon: {
        initialValue: '<dt-icon-box-select :size="iconSize" />',
      },
      endIcon: {
        initialValue: '<dt-icon-box-select :size="iconSize" />',
      },
    },
  },

  'with custom label size and strength': {
    props: {
      label: {
        initialValue: 'Label',
      },
      labelStrength: {
        initialValue: 'bold',
      },
      labelSize: {
        initialValue: '100',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
  },

  disabled: {
    props: {
      label: { initialValue: 'Label' },
      disabled: { initialValue: true },
    },
    attributes: {
      placeholder: { initialValue: 'Placeholder' },
    },
  },

  textarea: {
    props: {
      label: { initialValue: 'Label' },
      type: { initialValue: 'textarea' },
    },
  },

  'with description': {
    props: {
      label: { initialValue: 'Label' },
      description: { initialValue: 'Helpful description text' },
    },
    attributes: {
      placeholder: { initialValue: 'Placeholder' },
    },
  },

  'search, with clear button': {
    props: {
      type: {
        initialValue: 'search',
      },
      modelValue: {
        initialValue: 'Tokens',
      },
      label: {
        initialValue: 'Search',
      },
      labelVisible: {
        initialValue: false,
      },
    },
    attributes: {
      'aria-label': {
        initialValue: 'Search items',
      },
      placeholder: {
        initialValue: 'Search Items',
      },
    },
    slots: {
      startIcon: {
        initialValue: '<dt-icon name="search" :size="iconSize" />',
      },
      endIcon: {
        initialValue: `<dt-stack class="d-pie-25">
  <dt-button kind="muted" importance="clear" size="100" aria-label="Clear search" @click="clear">
    <template #startIcon="{ iconSize }"><dt-icon name="close" :size="iconSize" /></template>
  </dt-button>
</dt-stack>`,
      },
    },
  },

  'with error': {
    props: {
      label: { initialValue: 'Label' },
      type: { initialValue: 'email' },
      messages: { initialValue: [{ message: 'Please enter a valid email address.', type: 'error' }] },
    },
  },
};
