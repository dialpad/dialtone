/* eslint-disable max-len */


export default {
  defaults: {
    props: {
      gap: { tokenCategory: 'spacing' },
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
        initialValue: `<dt-box padding="200" surface="default" border-radius="400">Stack item 1</dt-box>
<dt-box padding="200" surface="default" border-radius="400">Stack item 2<br>with second line</dt-box>
<dt-box padding="200" surface="default" border-radius="400">Stack item 3</dt-box>`,
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
        initialValue: `<dt-box padding="200" surface="default" border-radius="400">Stack item 1</dt-box>
<dt-box padding="200" surface="default" border-radius="400">Stack item 2</dt-box>
<dt-box padding="200" surface="default" border-radius="400">Stack item 3</dt-box>`,
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
        initialValue: `<dt-box padding="200" surface="default" border-radius="400">Stack item 1</dt-box>
<dt-box padding="200" surface="default" border-radius="400">Stack item 2<br>with second line</dt-box>
<dt-box padding="200" surface="default" border-radius="400">Stack item 3</dt-box>`,
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
<dt-box padding="200" surface="default" border-radius="400"> <dt-text kind="headline" :size="600">2xl headline</dt-text> </dt-box>
<dt-box padding="200" surface="default" border-radius="400"> <dt-text kind="headline" :size="400">Large headline</dt-text> </dt-box>`,
      },
    },
  },
};
