<template>
  <dt-button
    :importance="importance"
    :type="type"
    :size="size"
    :kind="kind"
    :circle="circle"
    :loading="loading"
    :assertive-on-focus="assertiveOnFocus"
    :link="link"
    :link-kind="linkKind"
    :icon-position="iconPosition"
    :disabled="disabled"
    :style="{ width: width }"
    @click="onClick"
    @focusout="onFocusOut"
    @focusin="onFocusIn"
  >
    <span v-html="defaultSlot" />
    <template
      v-if="icon"
      #icon
    >
      <component :is="icon" />
    </template>
  </dt-button>
</template>

<script>
import DtButton from './button';
import icon from '../mixins/icon';

export default {
  name: 'ButtonDefault',
  components: { DtButton },
  mixins: [icon],
};
</script>
