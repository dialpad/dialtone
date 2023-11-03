<template>
  <div :class="['d-p8', { 'd-bgc-black-900': inverted }]">
    <dt-keyboard-shortcut
      :inverted="$attrs.inverted"
      :shortcut="$attrs.shortcut"
      :screen-reader-text="$attrs.screenReaderText"
    />
  </div>
</template>

<script>
import DtKeyboardShortcut from './keyboard_shortcut.vue';

export default {
  name: 'DtKeyboardShortcutDefault',
  components: { DtKeyboardShortcut },
};
</script>
