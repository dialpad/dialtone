<template>
  <div class="d-emoji-picker__search d-emoji-picker__alignment">
    <dt-input
      id="searchInput"
      ref="searchInputRef"
      :placeholder="searchPlaceholderLabel"
      :value="modelValue"
      @input="updateModelValue"
      @keydown.up="focusTabset"
      @keydown.down.prevent="focusEmojiSelector"
      @keydown.enter="selectFirstEmoji"
    >
      <template #leftIcon>
        <dt-icon name="search" />
      </template>
      <template
        v-if="modelValue.length > 0"
        #rightIcon
      >
        <button
          class="d-emoji-picker__search-button"
          @click="clearSearch"
          @keydown.enter="clearSearch"
        >
          <dt-icon name="close" />
        </button>
      </template>
    </dt-input>
  </div>
</template>

<script>
import DtInput from '@/components/input/input.vue';
import DtIcon from '@/components/icon/icon.vue';

export default {
  name: 'EmojiSearch',

  components: {
    DtInput,
    DtIcon,
  },

  props: {
    searchPlaceholderLabel: {
      type: String,
      required: true,
    },

    modelValue: {
      type: String,
      default: '',
    },
  },

  mounted () {
    this.focusSearchInput();
  },

  methods: {
    updateModelValue (value) {
      this.$emit('update:model-value', value);
    },

    focusEmojiSelector () {
      this.$emit('focus-emoji-selector');
    },

    focusTabset () {
      this.$emit('focus-tabset');
    },

    selectFirstEmoji () {
      this.$emit('select-first-emoji');
    },

    clearSearch () {
      this.$emit('update:model-value', '');
      this.focusSearchInput();
    },

    focusSearchInput () {
      this.$refs.searchInputRef.focus();
    },
  },
};
</script>
