<template>
  <dtc-overlay
    class="dtc-code-panel"
    :class="[
      `dtc-code-panel-scheme--${settings.code.scheme}`,
      `dtc-code-panel-scheme--${settings.code.scheme}--${settings.root.theme}`,
    ]"
  >
    <template #content>
      <div
        v-dt-scrollbar:never
        :class="['dtc-theme__canvas d-p-200', { 'd-hmx-250': !fullScreen }]"
      >
        <dtc-code-editor
          :info="info"
          :options="options"
          :theme="settings.root.theme"
          :verbose="settings.code.verbose"
          :indent-spaces="settings.code.indent"
          :disabled-members="disabledMembers"
          :dev-mode="devMode"
          :has-changes="hasChanges"
          @update:options="e => emit(OPTIONS_UPDATE_EVENT, e)"
        />
      </div>
    </template>
    <template #overlay>
      <dt-stack
        direction="row"
        align="end"
        justify="end"
        class="d-h100p"
      >
        <div class="d-pie-400 d-pbe-200 d-pe-auto">
          <slot name="overlay" />
        </div>
      </dt-stack>
    </template>
  </dtc-overlay>
</template>

<script setup>
import DtcCodeEditor from '@/src/components/code_editor/code_editor.vue';
import DtcOverlay from '@/src/components/tools/overlay.vue';

import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';

defineProps({
  /**
   * Options data object.
   */
  options: {
    type: Object,
    required: true,
  },
  /**
   * Info data object.
   */
  info: {
    type: Object,
    required: true,
  },
  /**
   * Settings data object.
   */
  settings: {
    type: Object,
    required: true,
  },
  /**
   * Set of member names that are currently disabled.
   */
  disabledMembers: {
    type: Set,
    default: () => new Set(),
  },
  devMode: {
    type: Boolean,
    default: false,
  },
  hasChanges: {
    type: Boolean,
    default: false,
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  OPTIONS_UPDATE_EVENT,
]);

</script>

<script>
/**
 * The code panel is responsible for providing technical information
 * about the target component in its current state.
 */
export default {
  name: 'DtcCodePanel',
};
</script>

<style lang="less">
@import "@/src/assets/themes/scheme/base.less";
@import "@/src/assets/themes/scheme/highlight_variables.less";

.dtc-code-panel-scheme--mono {
@import "@/src/assets/themes/scheme/mono.less";
}

.dtc-code-panel-scheme--highlight,
.dtc-code-panel-scheme--highlight--light {
  --dtc-scheme-color-identifier: var(--dt-color-blue-800);
  --dtc-scheme-color-class: var(--dt-color-purple-900);
  --dtc-scheme-color-string: var(--dt-color-green-900);
  --dtc-scheme-color-value: var(--dt-color-red-900);
  --dtc-scheme-color-function: var(--dt-color-gold-900);
}

.dtc-code-panel {
  display: grid;
  grid-template-columns: 1fr;
  color: var(--dt-color-foreground-secondary);
}

.dtc-code-panel > * {
  overflow: hidden;
  grid-area: 1 / 1;
}
</style>
