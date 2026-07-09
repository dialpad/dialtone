<template>
  <!-- DLT-2960: keyboard shortcut visual refresh — new keycap chip styling.
       Same component API on both branches. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Keyboard shortcut
    </p>
    <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
      <dt-keyboard-shortcut shortcut="{cmd}+Shift+P" />
      <dt-keyboard-shortcut shortcut="Ctrl+Alt+{arrow-right}" />
    </div>
  </div>
</template>
