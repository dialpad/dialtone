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
    :link-inverted="$attrs.linkInverted"
    :icon-position="$attrs.iconPosition"
    :disabled="$attrs.disabled"
    :width="$attrs.width"
    :active="$attrs.active"
    :to="$attrs.to"
    :href="$attrs.href"
    :target="$attrs.target"
    :rel="$attrs.rel"
    :replace="$attrs.replace"
    @click="$attrs.onClick"
    @focusin="$attrs.onFocusIn"
    @focusout="$attrs.onFocusOut"
  >
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
    <template
      v-if="$attrs.startIcon"
      #startIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.startIcon"
        :size="iconSize"
      />
    </template>
    <template
      v-if="$attrs.icon"
      #icon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.icon"
        :size="iconSize"
      />
    </template>
    <template
      v-if="$attrs.endIcon"
      #endIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.endIcon"
        :size="iconSize"
      />
    </template>
    <template
      v-if="$attrs.blockStartIcon"
      #blockStartIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.blockStartIcon"
        :size="iconSize"
      />
    </template>
    <template
      v-if="$attrs.blockEndIcon"
      #blockEndIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.blockEndIcon"
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
