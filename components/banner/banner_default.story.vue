<template>
  <div>
    <dt-button @click="displayBanner = true">
      Click to show!
    </dt-button>

    <dt-banner
      v-if="displayBanner"
      :kind="args.kind"
      :title="args.title"
      :title-id="args.titleId"
      :content-id="args.contentId"
      :important="args.important"
      :pinned="args.pinned"
      :hide-close="args.hideClose"
      :close-button-props="buttonCloseProps"
      @close="displayBanner = false; args.onClose($event)"
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

      <template
        v-if="args.action"
        #action
      >
        <dt-button
          :kind="buttonKind"
          importance="outlined"
          @click="args.onClick"
        >
          {{ args.action }}
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
    </dt-banner>
  </div>
</template>

<script>
import DtBanner from '../banner/banner';
import DtButton from '../button/button';
import icon from '@/common/mixins/icon';

export default {
  name: 'BannerDefault',

  components: { DtBanner, DtButton },

  mixins: [icon],

  inheritAttrs: false,

  data () {
    return {
      displayBanner: false,
    };
  },

  computed: {
    shouldInvertButton () {
      return this.args.kind === 'base' || this.args.kind === 'error' || this.args.kind === 'info';
    },

    isInverted () {
      return this.args.important && this.shouldInvertButton;
    },

    buttonKind () {
      return this.isInverted ? 'inverted' : 'muted';
    },

    linkClass () {
      return this.isInverted ? 'd-link--inverted' : 'd-link--muted';
    },

    buttonCloseProps () {
      return {
        ...this.args.closeButtonProps,
        kind: this.buttonKind,
        ariaLabel: 'Close',
      };
    },
  },
};
</script>
