<template>
  <dt-button
    :importance="$attrs.importance"
    :type="$attrs.type"
    :size="$attrs.size"
    :kind="$attrs.kind"
    :circle="$attrs.circle"
    :loading="$attrs.loading"
    :label-class="$attrs.labelClass"
    :assertive-on-focus="$attrs.assertiveOnFocus"
    :link="$attrs.link"
    :link-kind="$attrs.linkKind"
    :icon-position="$attrs.iconPosition"
    :disabled="$attrs.disabled"
    :width="$attrs.width"
    :active="$attrs.active"
    @click="$attrs.onClick"
    @focusin="$attrs.onFocusIn"
    @focusout="$attrs.onFocusOut"
  >
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
    <template
      v-if="$attrs.icon"
      #icon
    >
      <component :is="$attrs.icon" />
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
