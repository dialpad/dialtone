/* eslint-disable max-len */

import { disableAndClearProps } from '@/src/lib/exclusion_rules';

const hasNoBorderWidth = v => !v;
const hasNoPositioning = v => !v || v === 'static';
export const INSET_PROPS = [
  'inset',
  'insetBlock',
  'insetInline',
  'insetBlockStart',
  'insetBlockEnd',
  'insetInlineStart',
  'insetInlineEnd',
];

export default {
  defaults: {
    props: {
      as: { searchKeywords: ['tag', 'element'] },
      surface: {
        tokenCategory: 'color:d-box--surface-:--box-surface',
        searchKeywords: ['background color'],
      },
      borderColor: { tokenCategory: 'color:d-box--bc-:--box-bc' },
      padding: { tokenCategory: 'spacing' },
      paddingInline: {
        tokenCategory: 'spacing',
        searchKeywords: ['horizontal padding'],
      },
      paddingInlineStart: {
        tokenCategory: 'spacing',
        searchKeywords: ['padding left'],
      },
      paddingInlineEnd: {
        tokenCategory: 'spacing',
        searchKeywords: ['padding right'],
      },
      paddingBlock: {
        tokenCategory: 'spacing',
        searchKeywords: ['vertical padding'],
      },
      paddingBlockStart: {
        tokenCategory: 'spacing',
        searchKeywords: ['padding top'],
      },
      paddingBlockEnd: {
        tokenCategory: 'spacing',
        searchKeywords: ['padding bottom'],
      },
      borderWidth: { tokenCategory: 'border-width' },
      borderWidthInline: {
        tokenCategory: 'border-width',
        searchKeywords: ['horizontal border'],
      },
      borderWidthInlineStart: {
        tokenCategory: 'border-width',
        searchKeywords: ['border left'],
      },
      borderWidthInlineEnd: {
        tokenCategory: 'border-width',
        searchKeywords: ['border right'],
      },
      borderWidthBlock: {
        tokenCategory: 'border-width',
        searchKeywords: ['vertical border'],
      },
      borderWidthBlockStart: {
        tokenCategory: 'border-width',
        searchKeywords: ['border top'],
      },
      borderWidthBlockEnd: {
        tokenCategory: 'border-width',
        searchKeywords: ['border bottom'],
      },
      borderRadius: {
        tokenCategory: 'border-radius',
        searchKeywords: ['rounded', 'corner'],
      },
      inlineSize: {
        tokenCategory: 'layout',
        searchKeywords: ['width'],
      },
      blockSize: {
        tokenCategory: 'layout',
        searchKeywords: ['height'],
      },
      minInlineSize: {
        tokenCategory: 'layout',
        searchKeywords: ['min width'],
      },
      maxInlineSize: {
        tokenCategory: 'layout',
        searchKeywords: ['max width'],
      },
      minBlockSize: {
        tokenCategory: 'layout',
        searchKeywords: ['min height'],
      },
      maxBlockSize: {
        tokenCategory: 'layout',
        searchKeywords: ['max height'],
      },
      shadow: { searchKeywords: ['elevation', 'box shadow'] },
      position: { searchKeywords: ['css position', 'sticky', 'relative', 'absolute', 'fixed'] },
      inset: {
        tokenCategory: 'coordinate',
        searchKeywords: ['offset', 'inset all', 'all sides', 'position offset'],
      },
      insetBlock: {
        tokenCategory: 'coordinate',
        searchKeywords: ['vertical inset', 'top bottom', 'vertical offset'],
      },
      insetInline: {
        tokenCategory: 'coordinate',
        searchKeywords: ['horizontal inset', 'left right', 'horizontal offset'],
      },
      insetBlockStart: {
        tokenCategory: 'coordinate',
        searchKeywords: ['inset top', 'position top', 'offset top', 'sticky top'],
      },
      insetBlockEnd: {
        tokenCategory: 'coordinate',
        searchKeywords: ['inset bottom', 'position bottom', 'offset bottom'],
      },
      insetInlineStart: {
        tokenCategory: 'coordinate',
        searchKeywords: ['inset left', 'position left', 'offset left'],
      },
      insetInlineEnd: {
        tokenCategory: 'coordinate',
        searchKeywords: ['inset right', 'position right', 'offset right'],
      },
      zIndex: {
        tokenCategory: 'z-index',
        searchKeywords: ['z index', 'z-index', 'stacking', 'stacking order', 'layer'],
      },
    },
  },

  exclusions: [
    {
      when: { position: hasNoPositioning },
      ...disableAndClearProps(INSET_PROPS),
    },
    {
      when: {
        borderWidth: hasNoBorderWidth,
        borderWidthBlock: hasNoBorderWidth,
        borderWidthBlockEnd: hasNoBorderWidth,
        borderWidthBlockStart: hasNoBorderWidth,
        borderWidthInline: hasNoBorderWidth,
        borderWidthInlineEnd: hasNoBorderWidth,
        borderWidthInlineStart: hasNoBorderWidth,
      },
      disable: { props: ['borderColor'] },
      clear: { props: ['borderColor'] },
    },
    {
      when: { scrollbar: v => !v },
      disable: { props: ['scrollbarContentClass'] },
    },
  ],

  default: {
    slots: {
      default: { initialValue: 'Box content' },
    },
  },


  'custom card': {
    props: {
      as: { initialValue: 'aside' },
      padding: { initialValue: '200' },
      surface: { initialValue: 'primary' },
      borderWidth: { initialValue: '100' },
      borderColor: { initialValue: 'subtle' },
      borderRadius: { initialValue: '400' },
      shadow: { initialValue: 'card' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="200">
  <dt-text as="h2" kind="headline" size="md">Card title</dt-text>
  <dt-text as="p" kind="body" size="sm">Card body content with some descriptive text.</dt-text>
</dt-stack>` },
    },
  },

  'critical surface': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'critical' },
      borderColor: { initialValue: 'critical' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '500' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="body" size="sm">
  Critical container
</dt-text>` },
    },
  },

  'combined with DtStack and DtText': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'moderate-opaque' },
      borderRadius: { initialValue: '450' },
      shadow: { initialValue: 'card' },
    },
    slots: {
      default: { initialValue: `<dt-stack direction="row" gap="200">
  <dt-box surface="moderate-opaque" border-radius="400" padding="100" padding-inline="150">
    <dt-text kind="body" size="sm">First</dt-text>
  </dt-box>
  <dt-box surface="moderate-opaque" border-radius="400" padding="100" padding-inline="150">
    <dt-text kind="body" size="sm">Second</dt-text>
  </dt-box>
  <dt-box surface="moderate-opaque" border-radius="400" padding="100" padding-inline="150">
    <dt-text kind="body" size="sm">Third</dt-text>
  </dt-box>
</dt-stack>` },
    },
  },

  'fixed height with scrollbar': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'moderate' },
      borderWidth: { initialValue: '100' },
      inlineSize: { initialValue: '500' },
      blockSize: { initialValue: '600' },
      scrollbar: { initialValue: 'always' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="200">
  <dt-text as="p" kind="body" size="200">Paragraph 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 2: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 3: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 4: Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 5: Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 6: Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 7: Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 8: Ut labore et dolore magnam aliquam quaerat voluptatem.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 9: Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</dt-text>
  <dt-text as="p" kind="body" size="200">Paragraph 10: At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.</dt-text>
</dt-stack>` },
    },
  },

  'shadow': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'primary' },
      borderRadius: { initialValue: '200' },
      shadow: { initialValue: 'large' },
    },
    slots: {
      default: { initialValue: 'Large shadow' },
    },
  },

  'positioned relative with nested positioned element': {
    props: {
      position: { initialValue: 'relative' },
      padding: { initialValue: '150' },
      paddingInline: { initialValue: '200' },
      surface: { initialValue: 'moderate-opaque' },
    },
    slots: {
      default: { initialValue: `<dt-text variant="body-sm">Relative container</dt-text>
<dt-box position="absolute" inset-block-start="n150" inset-inline-end="n100">
  <dt-badge icon-size="100" type="info">
    <template #startIcon="{ iconSize }">
      <dt-icon-lock :size="iconSize" />
    </template>
    Locked
  </dt-badge>
</dt-box>` },
    },
  },

  'position fixed': {
    props: {
      as: { initialValue: 'aside' },
      surface: { initialValue: 'overlay' },
      borderColor: { initialValue: 'subtle' },
      borderRadius: { initialValue: '400' },
      borderWidth: { initialValue: '100' },
      padding: { initialValue: '200' },
      inlineSize: { initialValue: '600' },
      shadow: { initialValue: 'large' },
      position: { initialValue: 'fixed' },
      insetBlockStart: { initialValue: '400' },
      insetInlineEnd: { initialValue: '400' },
      zIndex: { initialValue: 'notification' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="50">
  <dt-text as="h3" variant="headline-md" tone="secondary">Fixed Position DtBox demo</dt-text>
  <dt-text as="p" variant="body-sm">Scroll the page. This box remains <dt-text as="strong" tone="info">fixed</dt-text>.</dt-text>
  <dt-text as="p" variant="body-sm">Doloribus iusto iure quis, quidem vitae sint, libero qui nisi mollitia veniam nulla commodi! Qui odit optio doloremque illo eveniet quod voluptate.</dt-text>
</dt-stack>` },
    },
  },

  'pill radius': {
    props: {
      padding: { initialValue: '100' },
      paddingInline: { initialValue: '200' },
      surface: { initialValue: 'moderate' },
      borderRadius: { initialValue: 'pill' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="label" size="sm">
  Pill shape
</dt-text>` },
    },
  },

  'composed layout': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'primary' },
      borderWidth: { initialValue: '100' },
      borderColor: { initialValue: 'subtle' },
      borderRadius: { initialValue: '400' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="200">
  <dt-stack gap="400" direction="row" justify="space-between" align="baseline">
    <dt-text as="h2" kind="headline" size="400">Title</dt-text>
    <dt-button size="200">
      <template #endIcon="{ iconSize }">
        <dt-icon name="chevron-down" :size="iconSize" />
      </template>
      Add Box
    </dt-button>
  </dt-stack>
  <dt-stack direction="row" align="start" gap="200">
    <dt-box class="d-fl1" padding="200" surface="secondary" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 1</dt-text>
    </dt-box>
    <dt-box class="d-fl1" padding="200" surface="secondary" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 2</dt-text>
    </dt-box>
    <dt-box class="d-fl1" padding="200" surface="secondary" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 3</dt-text>
    </dt-box>
    <dt-box class="d-fl1" padding="200" surface="secondary" border-width="100" border-color="subtle" border-radius="300">
      <dt-text as="p" kind="body" size="200" align="center" tone="muted">Box 4</dt-text>
    </dt-box>
  </dt-stack>
</dt-stack>` },
    },
  },
};
