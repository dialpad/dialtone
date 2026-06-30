/* eslint-disable max-len */
import {
  TEXT_FONT_SIZE_MODIFIERS,
  TEXT_HEADLINE_ONLY_SIZES,
  TEXT_SIZE_MODIFIERS,
} from '@dialpad/dialtone-vue';

// Derive the legacy kind/size exclusions from DtText's own constants so the
// Combinator's enable/disable state can never drift from what DtText accepts.
const ALL_FONT_SIZES = Object.keys(TEXT_FONT_SIZE_MODIFIERS);
const legacyNumericSizes = (kind) => TEXT_SIZE_MODIFIERS[kind].filter((size) => /^\d+$/.test(size));
const disabledSizesForKind = (kind) => ALL_FONT_SIZES.filter((size) => !legacyNumericSizes(kind).includes(size));
const headlineOnlyNumericSizes = TEXT_HEADLINE_ONLY_SIZES.filter((size) => /^\d+$/.test(size));

export default {
  defaults: {
    props: {
      variant: { tokenCategory: 'typography-variant' },
      size: { tokenCategory: 'typography-size' },
      density: { tokenCategory: 'line-height' },
      tone: { tokenCategory: 'color:d-text--tone-:--text-tone' },
    },
  },

  exclusions: [
    {
      when: { variant: v => !!v },
      disable: { props: ['kind'] },
      clear: { props: ['kind'] },
    },
    {
      when: { variant: v => !v, kind: v => !v },
      disable: { props: ['size'] },
      clear: { props: ['size'] },
    },
    {
      when: { variant: v => !v, kind: v => v !== 'headline' },
      disableValues: { props: { size: disabledSizesForKind('body') } },
    },
    {
      when: { variant: v => !v, kind: 'headline' },
      disableValues: { props: { size: disabledSizesForKind('headline') } },
    },
    {
      when: { size: v => headlineOnlyNumericSizes.includes(String(v)) },
      disableValues: { props: { kind: ['body', 'label', 'code'] } },
    },
  ],

  default: {
    slots: {
      default: {
        initialValue: 'The quick brown fox',
      },
    },
    props: {
      variant: {
        initialValue: 'body-md',
      },
    },
  },
  'Extra large headline': {
    slots: {
      default: {
        initialValue: 'Extra large headline',
      },
    },
    props: {
      kind: {
        initialValue: 'headline',
      },
      size: {
        initialValue: '500',
      },
      as: {
        initialValue: 'h2',
      },
    },
  },
  'Medium body': {
    slots: {
      default: {
        initialValue: 'Medium body',
      },
    },
    props: {
      kind: {
        initialValue: 'body',
      },
      size: {
        initialValue: '300',
      },
      as: {
        initialValue: 'p',
      },
    },
  },
  'Small label': {
    slots: {
      default: {
        initialValue: 'Small label',
      },
    },
    props: {
      kind: {
        initialValue: 'label',
      },
      size: {
        initialValue: '200',
      },
    },
  },
  'Small body, critical tone': {
    slots: {
      default: {
        initialValue: 'Critical text',
      },
    },
    props: {
      kind: {
        initialValue: 'body',
      },
      tone: {
        initialValue: 'critical',
      },
      size: {
        initialValue: '200',
      },
    },
  },
  'Extra small code': {
    slots: {
      default: {
        initialValue: 'Extra small code',
      },
    },
    props: {
      kind: {
        initialValue: 'code',
      },
      size: {
        initialValue: '100',
      },
    },
  },
  'Clamped text': {
    slots: {
      default: {
        initialValue: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius voluptas quasi animi corporis deserunt iusto suscipit. Delectus deleniti a animi doloribus assumenda, nobis, iusto neque beatae, quibusdam obcaecati aliquid harum. Placeat distinctio doloremque officia consequuntur fugit at repudiandae pariatur sint amet quidem cumque ipsa suscipit nisi, laudantium temporibus. Distinctio voluptatibus sunt exercitationem id aspernatur ab maiores totam reiciendis velit in? Pariatur, nisi culpa asperiores at, cumque commodi quasi doloremque est id quae voluptatibus voluptate earum eos accusantium, ducimus sit dolorem. Ipsam illum iste, debitis accusantium sint optio ducimus et dicta.',
      },
    },
    props: {
      kind: {
        initialValue: 'body',
      },
      maxLines: {
        initialValue: '3',
      },
      size: {
        initialValue: '300',
      },
    },
  },
  'Centered text': {
    slots: {
      default: {
        initialValue: 'Lorem ipsum dolorbus voluptate earum eos accusantium, ducimus sit dolorem. Ipsam illum iste, debitis accusantium sint optio ducimus et dicta.',
      },
    },
    props: {
      as: {
        initialValue: 'p',
      },
      kind: {
        initialValue: 'body',
      },
      align: {
        initialValue: 'center',
      },
      size: {
        initialValue: '300',
      },
    },
  },
  'Centered headline, balanced': {
    slots: {
      default: {
        initialValue: 'Lorem ipsum dolorbus voluptate earum eos accusantium ducimus sit dolorem.',
      },
    },
    props: {
      as: {
        initialValue: 'h1',
      },
      kind: {
        initialValue: 'headline',
      },
      tone: {
        initialValue: 'tertiary',
      },
      size: {
        initialValue: '400',
      },
      align: {
        initialValue: 'center',
      },
      wrap: {
        initialValue: 'balance',
      },
    },
  },
  'with numeric (tabular-nums)': {
    slots: {
      default: {
        initialValue: '01:17:19',
      },
    },
    props: {
      numeric: {
        initialValue: true,
      },
    },
  },

};
