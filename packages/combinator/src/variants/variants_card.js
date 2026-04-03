/* eslint-disable max-len */

export default {
  default: {
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" :size="300">Lorem ipsum</dt-text> <dt-button :size="100" kind="muted" importance="clear" aria-label="Menu button" > <template #icon="{ iconSize }"> <dt-icon-more-vertical :size="iconSize" /> </template> </dt-button>' },
      content: { initialValue: 'Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.' },
      footer: { initialValue: '<dt-button importance="outlined" :size="200">Button</dt-button>' },
    },
  },

  'with header': {
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" :size="300">Lorem ipsum</dt-text> <dt-button :size="100" kind="muted" importance="clear" aria-label="Menu button" > <template #icon="{ iconSize }"> <dt-icon-more-vertical :size="iconSize" /> </template> </dt-button>' },
      content: { initialValue: 'Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.' },
    },
  },

  'with footer, max height scrollable content': {
    props: {
      maxHeight: { initialValue: '104px' },
      footerClass: { initialValue: 'd-pbs-200' },
    },
    slots: {
      header: { initialValue: '<dt-text as="p" kind="headline" :size="300">Lorem ipsum</dt-text>' },
      content: { initialValue: 'Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.' },
      footer: { initialValue: '<dt-button importance="outlined" :size="200">Button</dt-button>' },
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
      header: { initialValue: '<dt-text as="p" kind="headline" :size="300">Lorem ipsum</dt-text>' },
      content: { initialValue: '<dt-text as="p" kind="body" :size="200"> Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum. </dt-text>' },
      footer: { initialValue: '<dt-text as="p" kind="body" :size="200">Footer</dt-text>' },
    },
  },
};
