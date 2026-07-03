<template>
  <dt-popover
    :dialog-class="`dtc-theme--${settings.root.theme}`"
    content-class="dtc-theme__popover"
    transition="fade"
    placement="top-end"
    :fallback-placements="['bottom-end', 'auto']"
    initial-focus-element="dialog"
    padding="none"
    sticky
    @opened="isOpen = $event"
  >
    <template #anchor="{ attrs }">
      <dt-button
        v-dt-tooltip="'Settings'"
        v-bind="attrs"
        kind="muted"
        importance="clear"
        :active="isOpen"
        :size="100"
        data-qa="option-bar-settings-button"
      >
        <template #icon="{ iconSize }">
          <dt-icon-settings :size="iconSize" />
        </template>
      </dt-button>
    </template>
    <template #content>
      <dt-box
        padding-inline="150"
        padding-block="100"
      >
        <dt-stack
          gap="50"
        >
          <DtText
            as="div"
            kind="label"
            :size="100"
            tone="tertiary"
            strength="medium"
            :density="500"
          >
            Playground Settings
          </DtText>
          <dt-toggle
            class="d-jc-space-between d-g-200"
            size="200"
            :model-value="settings.controls.hideDeprecated"
            @update:model-value="e => updateControlSetting('hideDeprecated', e)"
          >
            <dt-text
              variant="label-sm"
              strength="normal"
              tone="secondary"
              class="d-c-pointer h:d-fc-primary"
            >
              Hide Deprecated
            </dt-text>
          </dt-toggle>
          <dt-toggle
            class="d-jc-space-between d-g-200"
            size="200"
            :model-value="settings.controls.hideInactive"
            @update:model-value="e => updateControlSetting('hideInactive', e)"
          >
            <dt-text
              variant="label-sm"
              strength="normal"
              tone="secondary"
              class="d-c-pointer h:d-fc-primary"
            >
              Hide Disabled
            </dt-text>
          </dt-toggle>
        </dt-stack>
      </dt-box>
    </template>
  </dt-popover>
</template>

<script setup>
import { DtIconSettings } from '@dialpad/dialtone-icons/vue';
import { DtButton, DtPopover, DtStack, DtToggle } from '@dialpad/dialtone-vue';
import { SETTINGS_UPDATE_EVENT } from '@/src/lib/constants';
import { ref } from 'vue';

defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([SETTINGS_UPDATE_EVENT]);
const isOpen = ref(false);

function updateControlSetting (setting, value) {
  emit(SETTINGS_UPDATE_EVENT, (model) => {
    model.controls[setting] = value;
  });
}
</script>

<script>
export default {
  name: 'DtcOptionBarSettings',
};
</script>
