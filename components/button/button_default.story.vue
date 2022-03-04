<template>
  <dt-button
    :importance="args.importance"
    :type="args.type"
    :size="args.size"
    :kind="args.kind"
    :circle="args.circle"
    :loading="args.loading"
    :label-class="args.labelClass"
    :assertive-on-focus="args.assertiveOnFocus"
    :link="args.link"
    :link-kind="args.linkKind"
    :icon-position="args.iconPosition"
    :disabled="args.disabled"
    :style="{ width: args.width }"
    @click="args.onClick"
    @focusin="args.onFocusIn"
    @focusout="args.onFocusOut"
  >
    <span
      v-if="args.default"
      v-html="args.default"
    />
    <template
      v-if="args.icon"
      #icon
    >
      <component :is="args.icon" />
    </template>
  </dt-button>
</template>

<script>
import DtButton from './button';
import icon from '@/common/mixins/icon';

export default {
  name: 'ButtonDefault',
  components: { DtButton },
  mixins: [icon],
};
</script>
