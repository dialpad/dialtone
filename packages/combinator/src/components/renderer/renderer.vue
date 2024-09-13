<template>
  <dtc-overlay class="dtc-renderer">
    <template #content>
      <div
        class="d-d-flex d-of-auto"
        :class="{
          [backgroundColorMap[background]]: true,
          'd-jc-center': positioning === 'center',
          'd-ai-center': positioning === 'center',
          'd-ai-flex-start': positioning === 'native',
        }"
      >
        <dtc-renderer-target
          :component="component"
          :bindings="options.bindings.get()"
          :events="info.events"
          @event="(event, value) => emit('event', event, value)"
        >
          <template
            v-for="(slot, name) in renderedSlots"
            :key="name"
            #[name]
          >
            <dtc-node
              :template="slot"
              :library="library"
            />
          </template>
        </dtc-renderer-target>
      </div>
    </template>
    <template #overlay>
      <div class="d-d-flex d-jc-flex-end d-pt4 d-pe-auto">
        <dtc-renderer-menu
          :theme="theme"
          :background="background"
          :positioning="positioning"
          @update:settings="updateSettings"
        />
      </div>
    </template>
  </dtc-overlay>
</template>

<script setup>
import { computed } from 'vue';
import { SETTINGS_UPDATE_EVENT } from '@/src/lib/constants';
import DtcRendererMenu from '@/src/components/renderer/renderer_menu';
import DtcOverlay from '@/src/components/tools/overlay';
import DtcRendererTarget from '@/src/components/renderer/renderer_target';
import DtcNode from '@/src/components/tools/node';

const props = defineProps({
  /**
   * Component to render.
   */
  component: {
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
   * Options data object.
   */
  options: {
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
  library: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  SETTINGS_UPDATE_EVENT,
  'event',
]);

/**
 * Filtered slots that contain content.
 *
 * @type {ComputedRef<object>}
 */
const renderedSlots = computed(() => {
  if (!props.options.slots) { return null; }
  return Object.fromEntries(
    Object.entries(props.options.slots).filter(([_, slot]) => slot),
  );
});

const theme = computed(() => {
  switch (background.value) {
    case 'black': return 'dark';
    case 'white': return 'light';
    default: return props.settings.root.theme;
  }
});
const background = computed(() => getSetting('background'));
const positioning = computed(() => getSetting('positioning'));

const backgroundColorMap = {
  black: 'd-bgc-black-900',
  white: 'd-bgc-white',
  theme: `dtc-theme__canvas`,
};

function getSetting (setting) {
  return props.settings.renderer[setting];
}

function updateSettings (setting, e) {
  emit(SETTINGS_UPDATE_EVENT, (model) => {
    model.renderer[setting] = e;
  });
}
</script>

<script>
/**
 * The renderer is responsible for displaying the target component in its current state.
 */
export default {
  name: 'DtcRenderer',
};
</script>

<style>
.dtc-renderer {
  display: grid;
  grid-template-columns: 1fr;
}

.dtc-renderer > * {
  overflow: hidden;
  grid-area: 1 / 1;
}
</style>
