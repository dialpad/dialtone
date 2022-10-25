<template>
  <dt-notice
    :kind="kind"
    :title="title"
    :title-id="titleId"
    :content-id="contentId"
    :important="important"
    :hide-close="hideClose"
    :close-button-props="computedCloseButtonProps"
    :visually-hidden-close="visuallyHiddenClose"
    :visually-hidden-close-label="visuallyHiddenCloseLabel"
    @close="onClose($event)"
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
        v-if="action"
        v-html="action"
      />
      <dt-button
        v-else
        size="sm"
        importance="outlined"
        :kind="buttonKind"
        @click="onClick"
      >
        Action
      </dt-button>
    </template>
    <template
      v-if="icon"
      slot="icon"
    >
      <component :is="icon" />
    </template>
    <template
      v-if="titleOverride"
      slot="titleOverride"
    >
      <span v-html="titleOverride" />
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
