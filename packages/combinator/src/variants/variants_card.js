/* eslint-disable max-len */
export default {
  default: {
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text> <dt-button size="xs" kind="muted" importance="clear" aria-label="Menu button" > <template #icon="{ iconSize }"> <dt-icon-more-vertical :size="iconSize" /> </template> </dt-button>' },
      content: { initialValue: 'Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.' },
      footer: { initialValue: '<dt-button importance="outlined" size="sm">Button</dt-button>' },
    },
  },

  'with header': {
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text> <dt-button size="xs" kind="muted" importance="clear" aria-label="Menu button" > <template #icon="{ iconSize }"> <dt-icon-more-vertical :size="iconSize" /> </template> </dt-button>' },
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
  'Targeted styling': {
    props: {
      containerClass: { initialValue: 'd-bar0 d-baw0' },
      contentClass: { initialValue: 'd-p-100 d-by d-bgc-critical' },
      headerClass: { initialValue: 'd-p-100 d-bgc-info' },
      footerClass: { initialValue: 'd-p-100 d-bgc-warning' },
    },
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>' },
      content: { initialValue: '<dt-text as="p" kind="body" size="sm"> Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum. </dt-text>' },
      footer: { initialValue: '<dt-text as="p" kind="body" size="sm">Footer</dt-text>' },
    },
  },
};
