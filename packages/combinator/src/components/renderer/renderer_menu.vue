<template>
  <dt-popover
    :open="open"
    :dialog-class="`d-bgc-transparent d-bs-none dtc-theme--${theme}`"
    content-class="d-bgc-transparent d-px0 d-py0"
    transition="fade"
    placement="left-start"
    initial-focus-element="dialog"
    :hide-on-click="false"
    :modal="false"
    sticky
  >
    <template #anchor="{ attrs }">
      <dt-button
        class="d-mx4 d-px0"
        :class="`dtc-renderer-menu__button--${theme}`"
        :active="open"
        importance="clear"
        v-bind="attrs"
        @click="onOpen"
      >
        <template #icon>
          <icon-menu />
        </template>
      </dt-button>
    </template>
    <template #content>
      <div>
        <dtc-button-bar
          class="d-mb4"
          :value="background"
          @click="e => updateSettings('background', e)"
        >
          <template #theme>
            <div class="d-w16 d-h16 d-ba">
              <span class="d-fs12 d-ps-relative d-t6">T</span>
            </div>
          </template>
          <template #black>
            <div class="d-w16 d-h16 d-ba d-bgc-black-800" />
          </template>
          <template #white>
            <div class="d-w16 d-h16 d-ba d-bgc-white" />
          </template>
        </dtc-button-bar>
        <dtc-button-bar
          class="d-mb4"
          :value="positioning"
          @click="e => updateSettings('positioning', e)"
        >
          <template #native>
            <icon-left />
          </template>
          <template #center>
            <icon-center />
          </template>
        </dtc-button-bar>
      </div>
    </template>
  </dt-popover>
</template>

<script setup>
import IconLeft from 'dialtone-icons/IconNotes';
import IconCenter from 'dialtone-icons/IconMenu';
import IconMenu from 'dialtone-icons/IconMenuVertical';
import DtcButtonBar from '../tools/button_bar';
import { DtButton, DtPopover } from '@dialpad/dialtone-vue';
import { SETTINGS_UPDATE_EVENT } from '@/src/lib/constants';
import { ref } from 'vue';

defineProps({
  theme: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    required: true,
  },
  positioning: {
    type: String,
    required: true,
  },
});

const emit = defineEmits([SETTINGS_UPDATE_EVENT]);

function updateSettings (setting, e) {
  emit(SETTINGS_UPDATE_EVENT, setting, e);
}

const open = ref(false);
function onOpen () {
  open.value = !open.value;
}
</script>

<script>
export default {
  name: 'DtcRendererMenu',
};
</script>

<style lang="less">
@import (reference) "@/src/assets/dialtone.less";

  .dtc-renderer-menu__button--dark {
    .d-btn--inverted() !important;
  }
</style>
