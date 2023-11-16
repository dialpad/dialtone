<template>
  <div>
    <div class="d-p8">
      <h1 class="d-fs-200">
        Default shortcut
      </h1>
      <dt-keyboard-shortcut
        shortcut="Option+{cmd}+{win}+Shift+{arrow-up}"
      />
    </div>

    <div class="d-p8 d-bgc-contrast">
      <h1 class="d-fc-primary-inverted d-fs-200">
        Inverted style
      </h1>
      <dt-keyboard-shortcut
        shortcut="{win}+{arrow-right}+{arrow-left}+{arrow-up}+{arrow-down}+E+B"
        inverted
      />
    </div>

    <div class="d-p8">
      <h1 class="d-fs-200">
        Shortcut size variation
      </h1>
      <dt-keyboard-shortcut
        class="d-fs-200"
        shortcut="{cmd}+Y"
      />
    </div>

    <div class="d-p8">
      <h1 class="d-fs-200">
        All available shortcut aliases
      </h1>
      <dt-keyboard-shortcut :shortcut="availableVariants" />
    </div>

    <div class="d-p8">
      <h1 class="d-fs-200">
        Inline with text and screen reader text
      </h1>
      <p>
        Press
        <dt-keyboard-shortcut
          screen-reader-text="Ctrl and F5"
          shortcut="Ctrl + F5"
        />
        to hard refresh the page.
      </p>
    </div>
  </div>
</template>

<script>
import DtKeyboardShortcut from './keyboard_shortcut.vue';
import { SHORTCUTS_ALIASES_LIST } from './keyboard_shortcut_constants';

export default {
  name: 'DtKeyboardShortcutVariants',
  components: { DtKeyboardShortcut },
  data: () => ({
    availableVariants: SHORTCUTS_ALIASES_LIST.join('+').trim(),
  }),
};
</script>
