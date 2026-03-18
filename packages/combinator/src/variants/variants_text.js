/* eslint-disable max-len */

export default {
  default: {
    slots: {
      default: {
        initialValue: 'The quick brown fox',
      },
    },
    props: {
      kind: {
        initialValue: 'body',
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
        initialValue: 'xl',
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
        initialValue: 'md',
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
        initialValue: 'sm',
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
        initialValue: 'sm',
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
        initialValue: 'xs',
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
        initialValue: 'md',
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
        initialValue: 'md',
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
        initialValue: 'lg',
      },
      align: {
        initialValue: 'center',
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
      kind: {
        initialValue: 'body',
      },
      numeric: {
        initialValue: true,
      },
    },
  },

};
