/* eslint-disable max-len */
export default {
  default: {
    props: {
      gap: {
        initialValue: '500',
      },
    },
    slots: {
      default: {
        initialValue: '<div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 1</div><div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 2<br>with second line</div><div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 3</div>',
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
        initialValue: '<div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 1</div><div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 2</div><div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 3</div>',
      },
    },
  },

  'row, align start': {
    props: {
      direction: {
        initialValue: 'row',
      },
      gap: {
        initialValue: '500',
      },
      align: {
        initialValue: 'start',
      },
    },
    slots: {
      default: {
        initialValue: '<div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 1</div><div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 2<br>with second line</div><div class="d-bgc-moderate-opaque d-p-200 d-bar8">Stack item 3</div>',
      },
    },
  },

  'row, align baseline': {
    props: {
      direction: {
        initialValue: 'row',
      },
      gap: {
        initialValue: '500',
      },
      align: {
        initialValue: 'baseline',
      },
    },
    slots: {
      default: {
        initialValue: '<div class="d-bgc-moderate-opaque d-p-200 d-bar8"> <dt-text kind="body" size="xs">Small body</dt-text> </div> <div class="d-bgc-moderate-opaque d-p-200 d-bar8"> <dt-text kind="headline" size="2xl">Large headline</dt-text> </div>',
      },
    },
  },
};
