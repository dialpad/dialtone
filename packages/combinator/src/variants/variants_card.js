/* eslint-disable max-len */
export default {
  default: {
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text><dt-button size="xs" kind="muted" importance="clear" aria-label="Menu button"><dt-icon-more-vertical size="100" /></dt-button>' },
      content: { initialValue: 'Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.' },
      footer: { initialValue: '<dt-button importance="outlined" size="sm">Button</dt-button>' },
    },
  },

  'with header': {
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text><dt-button size="xs" kind="muted" importance="clear" aria-label="Menu button"><dt-icon-more-vertical size="100" /></dt-button>' },
      content: { initialValue: 'Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.' },
    },
  },

  'with footer': {
    props: {
      maxHeight: { initialValue: '50px' },
    },
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>' },
      content: { initialValue: 'Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.' },
      footer: { initialValue: '<dt-button importance="outlined" size="sm">Button</dt-button>' },
    },
  },
};
