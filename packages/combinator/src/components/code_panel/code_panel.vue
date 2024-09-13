<template>
  <dtc-overlay
    class="dtc-code-panel"
    :class="[
      `dtc-code-panel-scheme--${settings.code.scheme}`,
      `dtc-code-panel-scheme--${settings.code.scheme}--${settings.root.theme}`,
    ]"
  >
    <template #content>
      <div class="dtc-theme__canvas">
        <dtc-tab-panel
          selected="code"
          :generate-label="generateLabel"
        >
          <template #code>
            <dtc-code-editor
              :info="info"
              :options="options"
              :theme="settings.root.theme"
              :verbose="settings.code.verbose"
              :indent-spaces="settings.code.indent"
              @update:options="e => emit(OPTIONS_UPDATE_EVENT, e)"
            />
          </template>
          <template #events>
            <dtc-event-console ref="eventConsole" />
          </template>
        </dtc-tab-panel>
      </div>
    </template>
    <template #overlay>
      <div class="d-d-flex d-ai-flex-end d-jc-flex-end d-h100p">
        <div class="d-pr32 d-pb16 d-pe-auto">
          <slot name="overlay" />
        </div>
      </div>
    </template>
  </dtc-overlay>
</template>

<script setup>
import DtcTabPanel from '@/src/components/tools/tab_panel';
import DtcEventConsole from '@/src/components/event_console/event_console';
import DtcCodeEditor from '@/src/components/code_editor/code_editor';
import DtcOverlay from '@/src/components/tools/overlay';

import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';
import { ref } from 'vue';

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
});

const emit = defineEmits([
  OPTIONS_UPDATE_EVENT,
]);

const eventConsole = ref();
defineExpose({
  trigger: (event, value) => eventConsole.value.trigger(event, value),
});

function generateLabel (slot, capitalCase) {
  const label = capitalCase(slot);
  switch (slot) {
    case 'events': return `${label} (${eventConsole.value?.entryCount})`;
    default: return label;
  }
}
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

.dtc-code-panel-scheme--highlight {
@import "@/src/assets/themes/scheme/highlight.less";
}

.dtc-code-panel-scheme--highlight--light {
@import "@/src/assets/themes/scheme/highlight_light.less";
}

.dtc-code-panel {
  display: grid;
  grid-template-columns: 1fr;
}

.dtc-code-panel > * {
  overflow: hidden;
  grid-area: 1 / 1;
}
</style>
