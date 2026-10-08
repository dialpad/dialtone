/* eslint-disable max-len */


export default {
  defaults: {
    props: {
      direction: { searchKeywords: ['horizontal', 'vertical'] },
      gap: {
        tokenCategory: 'spacing',
        searchKeywords: ['spacing'],
      },
    },
  },

  default: {
    props: {
      gap: {
        initialValue: '200',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 1</dt-text></dt-box>
<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 2<br>with second line</dt-text></dt-box>
<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 3</dt-text></dt-box>`,
      },
    },
  },

  'row, no gap': {
    props: {
      direction: {
        initialValue: 'row',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 1</dt-text></dt-box>
<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 2</dt-text></dt-box>
<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 3</dt-text></dt-box>`,
      },
    },
  },

  'row, wrap': {
    props: {
      direction: { initialValue: 'row' },
      gap: { initialValue: '200' },
      wrap: { initialValue: true },
    },
    attributes: {
      class: { initialValue: 'd-w-500 d-wmx100p' },
    },
    slots: {
      default: {
        initialValue: `<dt-box inline-size="200" surface="moderate-opaque" padding="100" border-radius="300">Stack item 1</dt-box>
<dt-box inline-size="200" surface="moderate-opaque" padding="100" border-radius="300">Stack item 2</dt-box>
<dt-box inline-size="200" surface="moderate-opaque" padding="100" border-radius="300">Stack item 3</dt-box>`,
      },
    },
  },

  'row, align start': {
    props: {
      direction: {
        initialValue: 'row',
      },
      gap: {
        initialValue: '200',
      },
      align: {
        initialValue: 'start',
      },
    },
    slots: {
      default: {
        initialValue: `<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 1</dt-text></dt-box>
<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 2<br>with second line</dt-text></dt-box>
<dt-box surface="moderate-opaque" padding="200" border-radius="300"><dt-text as="p" kind="body" size="200">Stack item 3</dt-text></dt-box>`,
      },
    },
  },

  'row, align baseline': {
    props: {
      direction: {
        initialValue: 'row',
      },
      gap: {
        initialValue: '200',
      },
      align: {
        initialValue: 'baseline',
      },
    },
    slots: {
      default: {
        initialValue: `<div class="d-bgc-moderate-opaque d-p-100 d-bar-400"> <dt-text kind="body" :size="100">Small body</dt-text> </div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400"> <dt-text kind="headline" :size="600">2xl headline</dt-text> </div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400"> <dt-text kind="headline" :size="400">Large headline</dt-text> </div>`,
      },
    },
  },
};
