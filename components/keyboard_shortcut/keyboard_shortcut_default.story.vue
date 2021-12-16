<template>
  <div :class="['d-p8', { 'd-bgc-black-900': inverted }]">
    <dt-keyboard-shortcut
      :inverted="inverted"
      :shortcut="shortcut"
      :screen-reader-text="screenReaderText"
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
