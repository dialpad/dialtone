<template>
  <div>
    <dt-button @click="buttonClicked">
      Click to show!
    </dt-button>

    <aside class="d-toast-wrapper">
      <dt-toast
        ref="toast"
        v-model:show="isShown"
        :kind="$attrs.kind"
        :title="$attrs.title"
        :message="$attrs.message"
        :title-id="$attrs.titleId"
        :content-id="$attrs.contentId"
        :important="$attrs.important"
        :hide-close="$attrs.hideClose"
        :duration="$attrs.duration"
        :close-button-props="buttonCloseProps"
        :visually-hidden-close="$attrs.visuallyHiddenClose"
        :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
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

        <template #action>
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
          #icon
        >
          <dt-icon :name="$attrs.icon" />
        </template>
        <template
          v-if="$attrs.titleOverride"
          #titleOverride
        >
          <span v-html="$attrs.titleOverride" />
        </template>
      </dt-toast>
    </aside>
  </div>
</template>

<script>
import DtToast from './toast';
import DtButton from '../button/button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'ToastDefault',

  components: { DtToast, DtButton, DtIcon },

  data () {
    return {
      isShown: this.$attrs.show,
    };
  },

  computed: {
    shouldInvertButton () {
      return this.$attrs.kind === 'base' || this.$attrs.kind === 'error' || this.$attrs.kind === 'info';
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

    buttonCloseProps () {
      return {
        ...this.$attrs.closeButtonProps,
        kind: this.buttonKind,
        ariaLabel: 'Close',
      };
    },
  },

  watch: {
    show: function (show) {
      this.isShown = show;
    },
  },

  methods: {
    buttonClicked () {
      this.isShown = true;
    },
  },
};
</script>
