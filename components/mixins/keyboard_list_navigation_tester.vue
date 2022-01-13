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
      <ol id="list">
        <li
          role="option"
        >
          item 1
        </li>
        <li
          role="option"
        >
          item 2
        </li>
        <li
          role="option"
        >
          item 3
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import KeyboardNavigation from './keyboard_list_navigation';

export default {
  name: 'KeyboardListNavigationTester',

  mixins: [
    KeyboardNavigation({
      listElementKey: 'listRef',
      afterHighlightMethod: 'afterHighlightMethod',
      beginningOfListMethod: 'beginningOfListMethod',
      endOfListMethod: 'endOfListMethod',
    }),
  ],

  data () {
    return {
      highlightIndex: 0,
    };
  },

  computed: {
    listRef () {
      return this.$refs.listWrapper;
    },
  },

  methods: {
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
