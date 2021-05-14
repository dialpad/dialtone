<template>
  <hs-button
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
  </hs-button>
</template>

<script>
import HsButton from './button';
import icon from '../mixins/icon';

export default {
  name: 'ButtonDefault',
  components: { HsButton },
  mixins: [icon],
};
</script>
