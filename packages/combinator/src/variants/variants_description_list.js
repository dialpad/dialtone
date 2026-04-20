export default {
  defaults: {
    props: {
      gap: { tokenCategory: 'spacing' },
    },
  },

  default: {
    props: {
      items: {
        initialValue: [
          { term: 'Name', description: 'John Doe' },
          { term: 'Email', description: 'john@example.com' },
          { term: 'Phone', description: '+1 (555) 123-4567' },
        ],
      },
      direction: {
        initialValue: 'row',
      },
      gap: {
        initialValue: '100',
      },
    },
  },

  column: {
    props: {
      items: {
        initialValue: [
          { term: 'Name', description: 'John Doe' },
          { term: 'Email', description: 'john@example.com' },
        ],
      },
      direction: { initialValue: 'column' },
      gap: { initialValue: '400' },
    },
  },
};
