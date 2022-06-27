<!-- eslint-disable vue/no-bare-strings-in-template -->
<!-- eslint-disable vuejs-accessibility/role-has-required-aria-props -->
<template>
  <div
    role="combobox"
    aria-expanded="true"
    aria-controls="list"
  >
    <div data-qa="dt-combobox-input-wrapper">
      <input>
    </div>
    <div
      ref="listWrapper"
      data-qa="dt-combobox-list-wrapper"
    >
      <ol
        v-for="(item, index) in listItems"
        id="list"
        :key="index"
      >
        <li
          role="option"
        >
          {{ item }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import KeyboardNavigation from './keyboard_list_navigation';
export const KEYBOARD_LIST_NAVIGATION_TESTER_KEY = 'i';
export const KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS = [
  'item 1',
  'item 2',
  'item 3',
];

export default {
  name: 'KeyboardListNavigationTester',

  mixins: [
    KeyboardNavigation({
      indexKey: 'highlightIndex',
      idKey: 'highlightId',
      listElementKey: 'getListElement',
      afterHighlightMethod: 'afterHighlightMethod',
      beginningOfListMethod: 'beginningOfListMethod',
      endOfListMethod: 'endOfListMethod',
      activeItemKey: 'activeItemEl',
    }),
  ],

  data () {
    return {
      highlightIndex: 0,
      listItems: KEYBOARD_LIST_NAVIGATION_TESTER_ITEMS,
    };
  },

  methods: {
    getListElement () {
      return this.$refs.listWrapper;
    },

    beginningOfListMethod () {
      return true;
    },

    endOfListMethod () {
      return true;
    },

    afterHighlightMethod () {
      return true;
    },
  },
};
</script>
