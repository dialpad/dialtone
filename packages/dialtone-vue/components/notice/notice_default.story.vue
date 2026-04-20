<template>
  <dt-notice
    :kind="$attrs.kind"
    :header-text="$attrs.headerText"
    :header-id="$attrs.headerId"
    :content-id="$attrs.contentId"
    :important="$attrs.important"
    :show-close="$attrs.showClose"
    :show-action="$attrs.showAction"
    :truncate-text="$attrs.truncateText"
    :show-icon="$attrs.showIcon"
    @close="$attrs.onClose($event);"
  >
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
    <span v-else>
      Message body with
      <a
        href="#"
        class="d-link"
        :class="linkClass"
      >a link</a>.
    </span>
    <template #action>
      <span
        v-if="$attrs.action"
        v-html="$attrs.action"
      />
      <dt-button
        v-else
        :size="200"
        importance="outlined"
        :kind="buttonKind"
        @click="$attrs.onClick"
      >
        Action
      </dt-button>
    </template>
    <template
      v-if="$attrs.icon"
      #icon
    >
      <dt-icon :name="$attrs.icon" />
    </template>
  </dt-notice>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import DtNotice from './notice.vue';

export default {
  name: 'NoticeDefault',

  components: { DtButton, DtNotice, DtIcon },

  computed: {
    shouldInvertButton () {
      return this.$attrs.kind === 'base' || this.$attrs.kind === 'critical' || this.$attrs.kind === 'info';
    },

    isInverted () {
      return this.$attrs.important && this.shouldInvertButton;
    },

    buttonKind () {
      return this.isInverted ? 'inverted' : 'muted';
    },

    linkClass () {
      return this.isInverted ? 'd-link--inverted' : 'd-link--muted';
    },
  },
};
</script>
