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
        initialValue: `<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 1</div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 2<br>with second line</div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 3</div>`,
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
        initialValue: `<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 1</div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 2</div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 3</div>`,
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
        initialValue: `<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 1</div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 2<br>with second line</div>
<div class="d-bgc-moderate-opaque d-p-200 d-bar-400">Stack item 3</div>`,
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
