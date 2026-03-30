/* eslint-disable max-len */

export default {
  default: {
    props: {
      items: {
        initialValue: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' },
          { id: 3, name: 'User 3' },
          { id: 4, name: 'User 4' },
          { id: 5, name: 'User 5' },
          { id: 6, name: 'User 6' },
          { id: 7, name: 'User 7' },
          { id: 8, name: 'User 8' },
          { id: 9, name: 'User 9' },
          { id: 10, name: 'User 10' },
          { id: 11, name: 'User 11' },
          { id: 12, name: 'User 12' },
          { id: 13, name: 'User 13' },
          { id: 14, name: 'User 14' },
          { id: 15, name: 'User 15' },
        ],
      },
      itemSize: { initialValue: 32 },
      scrollerHeight: { initialValue: 200 },
      listTag: { initialValue: 'div' },
      itemTag: { initialValue: 'div' },
      direction: { initialValue: 'vertical' },
    },
    slots: {
      default: { initialValue: '<dt-text class="d-px-50">{{ item.name }}</dt-text>' },
    },
  },

  'variable height': {
    props: {
      items: {
        initialValue: [
          { id: 'Mary Johnson', message: 'Lorem ipsum dolor sit amet' },
          { id: 'John Smith', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam' },
          { id: 'Jane Doe', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
          { id: 'Bob Wilson', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet' },
          { id: 'Alice Brown', message: 'Lorem ipsum dolor sit amet' },
          { id: 'Charlie Davis', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl' },
          { id: 'Diana Evans', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultrices aliquam, nunc nisl aliquet nunc, eget aliquam nisl ni lorem ipsum dolor sit amet' },
        ],
      },
      minItemSize: { initialValue: 54 },
      scrollerHeight: { initialValue: 300 },
      listTag: { initialValue: 'div' },
      itemTag: { initialValue: 'div' },
      direction: { initialValue: 'vertical' },
      dynamic: { initialValue: true },
    },
    slots: {
      default: { initialValue: '<dt-stack gap="100" direction="row" align="start" class="d-p-50"><dt-avatar :size="300" :full-name="item.id" /><dt-stack><dt-text kind="headline" :size="200" tone="secondary">{{ item.id }}</dt-text><dt-text kind="body" :size="200" tone="primary">{{ item.message }}</dt-text></dt-stack></dt-stack>' },
    },
  },
};
