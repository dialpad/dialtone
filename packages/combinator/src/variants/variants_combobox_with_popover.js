/* eslint-disable max-len */
export default {
  default: {
    props: {
      label: { initialValue: 'Label Text' },
      contentWidth: { initialValue: 'anchor' },
      maxHeight: { initialValue: '300px' },
    },
    slots: {
      input: {
        initialValue: '<dt-input placeholder="Select one or start typing" v-bind="inputProps" @update:model-value="onInput" />',
      },
      list: {
        initialValue: '<ul v-bind="listProps" class="d-p-50"><dt-list-item role="option" navigation-type="arrow-keys">+1 (555) 000-0001<template #right><span class="d-fc-secondary">Mobile</span></template></dt-list-item><dt-list-item role="option" navigation-type="arrow-keys">+1 (555) 000-0002<template #right><span class="d-fc-secondary">Work</span></template></dt-list-item><dt-list-item role="option" navigation-type="arrow-keys">+1 (555) 000-0003<template #right><span class="d-fc-secondary">Home</span></template></dt-list-item></ul>',
      },
    },
  },
  'with header and footer': {
    props: {
      label: { initialValue: 'Label Text' },
      contentWidth: { initialValue: 'anchor' },
      maxHeight: { initialValue: '300px' },
      listClass: { initialValue: 'd-w332' },
    },
    slots: {
      header: {
        initialValue: '<div class="d-px-150 d-py-100 d-fw-semibold">Select an option</div>',
      },
      input: {
        initialValue: '<dt-input placeholder="Select one or start typing" v-bind="inputProps" @update:model-value="onInput" />',
      },
      list: {
        initialValue: '<ul v-bind="listProps" class="d-p-50"><dt-list-item role="option" navigation-type="arrow-keys">+1 (555) 000-0001<template #right><span class="d-fc-secondary">Mobile</span></template></dt-list-item><dt-list-item role="option" navigation-type="arrow-keys">+1 (555) 000-0002<template #right><span class="d-fc-secondary">Work</span></template></dt-list-item><dt-list-item role="option" navigation-type="arrow-keys">+1 (555) 000-0003<template #right><span class="d-fc-secondary">Home</span></template></dt-list-item></ul>',
      },
      footer: {
        initialValue: '<div class="d-px-150 d-py-100 d-fc-tertiary">Footer content</div>',
      },
    },
  },
};
