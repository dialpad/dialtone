/* eslint-disable max-len */
export default {
  default: {
    props: {
      showList: {
        initialValue: true,
      },
      label: {
        initialValue: 'Label Text',
      },
    },
    slots: {
      input: {
        initialValue: '<dt-input placeholder="Type to show the items" v-bind="inputProps" />',
      },
      list: {
        initialValue: '<ol v-bind="listProps" class="d-p0 d-mt8 d-hmx332 d-of-y-auto"><dt-list-item role="option" navigation-type="arrow-keys"><template #start><dt-avatar full-name="1" seed="0" /></template>Item 1</dt-list-item><dt-list-item role="option" navigation-type="arrow-keys"><template #start><dt-avatar full-name="2" seed="1" /></template>Item 2</dt-list-item><dt-list-item role="option" navigation-type="arrow-keys"><template #start><dt-avatar full-name="3" seed="2" /></template>Item 3</dt-list-item></ol>',
      },
    },
  },
};
