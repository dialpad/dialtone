<template>
  <div>
    <dt-button @click="buttonClicked">
      Click to show!
    </dt-button>

    <dt-toast
      ref="toast"
      :kind="kind"
      :title="title"
      :message="message"
      :title-id="titleId"
      :content-id="contentId"
      :important="important"
      :hide-close="hideClose"
      :duration="duration"
      :close-button-props="buttonCloseProps"
      @close="closeToast(); onClose($event)"
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
        #icon
      >
        <component :is="icon" />
      </template>
      <template
        v-if="titleOverride"
        #titleOverride
      >
        <span v-html="titleOverride" />
      </template>
    </dt-toast>
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

  methods: {
    buttonClicked () {
      this.$refs.toast.show();
    },

    closeToast () {
      this.$refs.toast.close();
    },
  },
};
</script>
