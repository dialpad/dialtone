<template>
  <dt-popover
    :dialog-class="`dtc-theme--${settings.root.theme}`"
    content-class="dtc-theme__popover"
    transition="fade"
    placement="top-end"
    initial-focus-element="dialog"
    sticky
  >
    <template #anchor="{ attrs }">
      <dt-button
        class="dtc-theme__button"
        v-bind="attrs"
      >
        <template #icon>
          <IconSettings />
        </template>
      </dt-button>
    </template>
    <template #content>
      <div class="d-px8">
        <section class="d-p8">
          <dt-radio-group
            name="theme-radio-group"
            legend="Theme"
            :value="settings.root.theme"
            @input="e => updateSettings('root', 'theme', e)"
          >
            <dt-radio value="light">
              Light
            </dt-radio>
            <dt-radio value="dark">
              Dark
            </dt-radio>
          </dt-radio-group>
        </section>
        <section class="d-p8">
          <dt-radio-group
            name="scheme-radio-group"
            legend="Scheme"
            :value="settings.code.scheme"
            @input="e => updateSettings('code', 'scheme', e)"
          >
            <dt-radio value="mono">
              Mono
            </dt-radio>
            <dt-radio value="highlight">
              Highlight
            </dt-radio>
          </dt-radio-group>
        </section>
        <section class="d-p8">
          <dt-radio-group
            name="sidebar-radio-group"
            legend="Sidebar Position"
            :value="settings.root.sidebar"
            @input="e => updateSettings('root', 'sidebar', e)"
          >
            <dt-radio value="left">
              Left
            </dt-radio>
            <dt-radio value="right">
              Right
            </dt-radio>
          </dt-radio-group>
        </section>
        <section class="d-p8">
          <dt-input
            :key="indentKey"
            type="number"
            label="Indent Spaces"
            :value="settings.code.indent"
            @input="updateIndent"
          />
        </section>
        <section class="d-p8">
          <dt-checkbox
            :checked="settings.code.verbose"
            @input="e => updateSettings('code', 'verbose', e)"
          >
            Verbose
          </dt-checkbox>
        </section>
      </div>
    </template>
  </dt-popover>
</template>

<script setup>
import IconSettings from 'dialtone-icons/IconSettings';

import {
  DtButton,
  DtPopover,
  DtRadioGroup,
  DtRadio,
  DtCheckbox,
  DtInput,
} from '@dialpad/dialtone-vue';
import { SETTINGS_UPDATE_EVENT } from '@/src/lib/constants';
import { ref } from 'vue';

defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([SETTINGS_UPDATE_EVENT]);

function updateSettings (group, setting, e) {
  emit(SETTINGS_UPDATE_EVENT, (model) => {
    model[group][setting] = e;
  });
}

const indentKey = ref(0);
function updateIndent (e) {
  const value = parseInt(e);

  if (!Number.isNaN(value) && value >= 0) {
    updateSettings('code', 'indent', value);
  } else {
    indentKey.value += 1;
  }
}
</script>

<script>
export default {
  name: 'DtcSettings',
};
</script>
