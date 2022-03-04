<template>
  <dt-notice
    :kind="args.kind"
    :title="args.title"
    :title-id="args.titleId"
    :content-id="args.contentId"
    :important="args.important"
    :hide-close="args.hideClose"
    :close-button-props="args.computedCloseButtonProps"
    @close="args.onClose($event)"
  >
    <span
      v-if="args.default"
      v-html="args.default"
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
        v-if="args.action"
        v-html="args.action"
      />
      <dt-button
        v-else
        size="sm"
        importance="outlined"
        :kind="buttonKind"
        @click="args.onClick"
      >
        Action
      </dt-button>
    </template>
    <template
      v-if="args.icon"
      #icon
    >
      <component :is="args.icon" />
    </template>
    <template
      v-if="args.titleOverride"
      #titleOverride
    >
      <span v-html="args.titleOverride" />
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
