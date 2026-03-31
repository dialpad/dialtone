/* eslint-disable max-len */



export default {
  default: {
    props: {
      selected: { initialValue: 'panel-1' },
      tabListClass: {
        initialValue: 'd-w-600',
      },
    },
    slots: {
      tabs: {
        initialValue: `<dt-tab id="tab-1" panel-id="panel-1" selected>First</dt-tab>\n<dt-tab id="tab-2" panel-id="panel-2">Second</dt-tab>\n<dt-tab id="tab-3" panel-id="panel-3">Third</dt-tab>`,
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py-600">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>First</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Second</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Third</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'spread tabs: equal': {
    props: {
      selected: { initialValue: 'panel-1' },
      tabListClass: {
        initialValue: 'd-w-600',
      },
      spread: {
        initialValue: 'equal',
      },
    },
    slots: {
      tabs: {
        initialValue: '<dt-tab id="tab-1" panel-id="panel-1" selected>Tab 1</dt-tab>\n<dt-tab id="tab-2" panel-id="panel-2">Tab 2</dt-tab>\n<dt-tab id="tab-3" panel-id="panel-3">Tab the third</dt-tab>',
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py-600">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>First</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Second</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Third</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'spread tabs: grow': {
    props: {
      selected: { initialValue: 'panel-1' },
      tabListClass: {
        initialValue: 'd-w-600',
      },
      spread: {
        initialValue: 'grow',
      },
    },
    slots: {
      tabs: {
        initialValue: '<dt-tab id="tab-1" panel-id="panel-1" selected>Tab 1</dt-tab>\n<dt-tab id="tab-2" panel-id="panel-2">Tab the second</dt-tab>\n<dt-tab id="tab-3" panel-id="panel-3">Tab the third</dt-tab>',
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py-600">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>First</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Second</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Third</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'muted, small': {
    props: {
      kind: { initialValue: 'muted' },
      selected: { initialValue: 'panel-1' },
      size: { initialValue: '200' },
      tabListClass: {
        initialValue: 'd-w-600',
      },
    },
    slots: {
      tabs: {
        initialValue: `<dt-tab id="tab-1" panel-id="panel-1" selected>First</dt-tab>\n<dt-tab id="tab-2" panel-id="panel-2">Second</dt-tab>\n<dt-tab id="tab-3" panel-id="panel-3">Third</dt-tab>`,
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py-600">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>First</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Second</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Third</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'outlined, extra small, borderless': {
    props: {
      outlined: { initialValue: true },
      selected: { initialValue: 'panel-1' },
      size: { initialValue: '100' },
      borderless: { initialValue: true },
      tabListClass: {
        initialValue: 'd-w-600',
      },
    },
    slots: {
      tabs: {
        initialValue: `<dt-tab id="tab-1" panel-id="panel-1" selected>First</dt-tab>\n<dt-tab id="tab-2" panel-id="panel-2">Second</dt-tab>\n<dt-tab id="tab-3" panel-id="panel-3">Third</dt-tab>`,
      },
      default: {
        initialValue: '<div>\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" class="d-py-100"> <strong>First</strong> content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" class="d-py-100"> <strong>Second</strong> content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" class="d-py-100"> <strong>Third</strong> content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'vertical': {
    props: {
      orientation: { initialValue: 'vertical' },
      selected: { initialValue: 'panel-1' },
      tabListClass: {
        initialValue: 'd-w-200',
      },
    },
    slots: {
      tabs: {
        initialValue: `<dt-tab id="tab-1" panel-id="panel-1" selected>First</dt-tab>\n<dt-tab id="tab-2" panel-id="panel-2">Second</dt-tab>\n<dt-tab id="tab-3" panel-id="panel-3">Third</dt-tab>`,
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py-600">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>First</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Second</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Third</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'with icons': {
    props: {
      selected: { initialValue: 'panel-1' },
      tabListClass: {
        initialValue: 'd-w-600',
      },
    },
    slots: {
      tabs: {
        initialValue: `<dt-tab id="tab-1" panel-id="panel-1" selected>
  <template #startIcon="{ iconSize }"><dt-icon name="box-select" :size="iconSize" /></template>
  First
</dt-tab>
<dt-tab id="tab-2" panel-id="panel-2">
  <template #startIcon="{ iconSize }"><dt-icon name="box-select" :size="iconSize" /></template>
  Second
</dt-tab>
<dt-tab id="tab-3" panel-id="panel-3">Third</dt-tab>`,
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py-600">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p16"> <strong>First</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Second</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p16"> <strong>Third</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'icon only': {
    props: {
      selected: { initialValue: 'panel-1' },
    },
    slots: {
      tabs: {
        initialValue: `
<dt-tab id="tab-1" panel-id="panel-1" label="Inbox" selected>
  <template #startIcon="{ iconSize }"><dt-icon name="inbox" :size="iconSize" /></template>
</dt-tab>
<dt-tab id="tab-2" panel-id="panel-2" label="Send">
  <template #startIcon="{ iconSize }"><dt-icon name="send" :size="iconSize" /></template>
</dt-tab>
<dt-tab id="tab-3" panel-id="panel-3" label="Archive">
  <template #startIcon="{ iconSize }"><dt-icon name="archive" :size="iconSize" /></template>
</dt-tab>`
,
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py48">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p16"> <strong>First</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Second</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Third</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },

  'with trailing slot': {
    props: {
      selected: { initialValue: 'panel-1' },
      tabListClass: {
        initialValue: 'd-w-600',
      },
    },
    slots: {
      tabs: {
        initialValue: `<dt-tab id="tab-1" panel-id="panel-1" selected trailing-class="d-pie-100">
  <template #trailing><dt-badge kind="count" type="bulletin" text="9" /></template>
  Inbox
</dt-tab>
<dt-tab id="tab-2" panel-id="panel-2" trailing-class="d-pie-100">
  <template #trailing><dt-badge kind="count" text="99+" /></template>
  Archive
</dt-tab>
<dt-tab id="tab-3" panel-id="panel-3">Drafts</dt-tab>`,
      },
      default: {
        initialValue: '<div class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-py-600">\n<dt-tab-panel id="panel-1" tab-id="tab-1">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Inbox</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-2" tab-id="tab-2">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Archive</strong> tab content panel </dt-text>\n</dt-tab-panel>\n<dt-tab-panel id="panel-3" tab-id="tab-3">\n<dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p-200"> <strong>Drafts</strong> tab content panel </dt-text>\n</dt-tab-panel>\n</div>',
      },
    },
  },
};
