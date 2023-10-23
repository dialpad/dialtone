<template>
  <dt-button
    :importance="importance"
    :type="type"
    :size="size"
    :kind="kind"
    :circle="circle"
    :loading="loading"
    :label-class="labelClass"
    :assertive-on-focus="assertiveOnFocus"
    :link="link"
    :link-kind="linkKind"
    :icon-position="iconPosition"
    :disabled="disabled"
    :width="width"
    :active="active"
    @click="onClick"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
    <template
      v-if="icon"
      slot="icon"
      slot-scope="{ iconSize }"
    >
      <dt-icon
        :name="icon"
        :size="iconSize"
      />
    </template>
  </dt-button>
</template>

<script>
import DtButton from './button.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'ButtonDefault',
  components: { DtButton, DtIcon },
};
</script>
