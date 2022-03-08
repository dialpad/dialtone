<template>
  <dt-notice
    :kind="$attrs.kind"
    :title="$attrs.title"
    :title-id="$attrs.titleId"
    :content-id="$attrs.contentId"
    :important="$attrs.important"
    :hide-close="$attrs.hideClose"
    :close-button-props="$attrs.computedCloseButtonProps"
    @close="$attrs.onClose($event)"
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
    <template slot="action">
      <span
        v-if="$attrs.action"
        v-html="$attrs.action"
      />
      <dt-button
        v-else
        size="sm"
        importance="outlined"
        :kind="buttonKind"
        @click="$attrs.onClick"
      >
        Action
      </dt-button>
    </template>
    <template
      v-if="$attrs.icon"
      slot="icon"
    >
      <component :is="$attrs.icon" />
    </template>
    <template
      v-if="$attrs.titleOverride"
      slot="titleOverride"
    >
      <span v-html="$attrs.titleOverride" />
    </template>
  </dt-notice>
</template>

<script>
import { DtButton } from '../button';
import DtNotice from './notice';
import icon from '@/common/mixins/icon';

export default {
  name: 'NoticeDefault',

  components: { DtButton, DtNotice },

  mixins: [icon],

  computed: {
    shouldInvertButton () {
      return this.kind === 'base' || this.kind === 'error' || this.kind === 'info';
    },

    isInverted () {
      return this.important && this.shouldInvertButton;
    },

    buttonKind () {
      return this.isInverted ? 'inverted' : 'muted';
    },

    linkClass () {
      return this.isInverted ? 'd-link--inverted' : 'd-link--muted';
    },

    computedCloseButtonProps () {
      return {
        ...this.closeButtonProps,
        kind: this.buttonKind,
        ariaLabel: 'Close',
      };
    },
  },
};
</script>
