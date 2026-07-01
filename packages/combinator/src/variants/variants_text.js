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
      variant: {
        tokenCategory: 'typography-variant',
        searchKeywords: ['typography'],
      },
      size: {
        tokenCategory: 'typography-size',
        searchKeywords: ['font size'],
      },
      density: {
        tokenCategory: 'line-height',
        searchKeywords: ['line height'],
      },
      tone: {
        tokenCategory: 'color:d-text--tone-:--text-tone',
        searchKeywords: ['text color'],
      },
      align: { searchKeywords: ['text align'] },
      truncate: { searchKeywords: ['ellipsis', 'single line'] },
      maxLines: { searchKeywords: ['line clamp'] },
      strength: { searchKeywords: ['font weight'] },
      family: { searchKeywords: ['font family'] },
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
      variant: {
        initialValue: 'headline-xl',
      },
      as: {
        initialValue: 'h2',
      },
    },
  },
  'Small body': {
    slots: {
      default: {
        initialValue: 'Small body',
      },
    },
    props: {
      variant: {
        initialValue: 'body-sm',
      },
      as: {
        initialValue: 'p',
      },
    },
  },
  'Small label, compact density': {
    slots: {
      default: {
        initialValue: 'Small label',
      },
    },
    props: {
      variant: {
        initialValue: 'label-sm',
      },
      density: {
        initialValue: '200',
      },
    },
  },
  'Medium body, critical tone, semibold': {
    slots: {
      default: {
        initialValue: 'Critical tone',
      },
    },
    props: {
      variant: {
        initialValue: 'body-md',
      },
      tone: {
        initialValue: 'critical',
      },
      strength: {
        initialValue: 'semibold',
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
      variant: {
        initialValue: 'code-xs',
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
      variant: {
        initialValue: 'body-md',
      },
      maxLines: {
        initialValue: '3',
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
      align: {
        initialValue: 'center',
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
      variant: {
        initialValue: 'headline-lg',
      },
      tone: {
        initialValue: 'secondary',
      },
      align: {
        initialValue: 'center',
      },
      wrap: {
        initialValue: 'balance',
      },
    },
  },
  'Numeric (tabular-nums)': {
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
  'Truncate single line': {
    slots: {
      default: {
        initialValue: `Welcome to Dialpad, the most modern, AI-powered business communications platform.
        We have taken every form of communication that you rely on and unified it into one app.`,
      },
    },
    attributes: {
      class: {
        initialValue: 'd-w-300',
      },
    },
    props: {
      as: {
        initialValue: 'p',
      },
      truncate: {
        initialValue: true,
      },
    },
  },
  'Extra small body, override to super small': {
    slots: {
      default: {
        initialValue: `Welcome to Dialpad`,
      },
    },
    props: {
      variant: {
        initialValue: 'body-xs',
      },
      size: {
        initialValue: '50',
      },
    },
  },

};
