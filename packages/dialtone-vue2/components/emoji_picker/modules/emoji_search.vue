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
        <dt-icon
          name="search"
          size="200"
        />
      </template>
      <template
        v-if="modelValue.length > 0"
        #rightIcon
      >
        <dt-button
          importance="clear"
          size="xs"
          class="d-mrn4"
          circle
          kind="muted"
          @click="clearSearch"
        >
          <template #icon>
            <dt-icon
              name="close"
              size="200"
            />
          </template>
        </dt-button>
      </template>
    </dt-input>
  </div>
</template>

<script>
import { DtInput } from '@/components/input';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';

export default {
  name: 'EmojiSearch',

  components: {
    DtInput,
    DtIcon,
    DtButton,
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
