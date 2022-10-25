<template>
  <div>
    <dt-button @click="buttonClicked">
      Click to show!
    </dt-button>

    <aside class="d-toast-wrapper">
      <dt-toast
        ref="toast"
        :show.sync="isShown"
        :kind="kind"
        :title="title"
        :message="message"
        :title-id="titleId"
        :content-id="contentId"
        :important="important"
        :hide-close="hideClose"
        :duration="duration"
        :close-button-props="buttonCloseProps"
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
      </dt-toast>
    </aside>
  </div>
</template>

<script>
import DtToast from './toast';
import DtButton from '../button/button';
import icon from '@/common/mixins/icon';

export default {
  name: 'ToastDefault',

  components: { DtToast, DtButton },

  mixins: [icon],

  data () {
    return {
      isShown: this.show,
    };
  },

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

    buttonCloseProps () {
      return {
        ...this.closeButtonProps,
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
