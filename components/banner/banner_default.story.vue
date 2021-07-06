<template>
  <div>
    <dt-button @click="displayBanner = true">
      Click to show!
    </dt-button>

    <dt-banner
      v-if="displayBanner"
      :kind="kind"
      :title="title"
      :title-id="titleId"
      :content-id="contentId"
      :important="important"
      :pinned="pinned"
      :hide-close="hideClose"
      :close-button-props="buttonCloseProps"
      @close="displayBanner = false"
    >
      <span>
        Message body with
        <a
          href="#"
          class="d-link"
          :class="linkClass"
        >a link.</a>
      </span>

      <template
        v-if="action"
        #action
      >
        <dt-button
          :kind="buttonKind"
          importance="outlined"
        >
          {{ action }}
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
    </dt-banner>
  </div>
</template>

<script>
import DtBanner from '../banner/banner';
import DtButton from '../button/button';
import icon from '../mixins/icon';

export default {
  name: 'BannerDefault',

  components: { DtBanner, DtButton },

  mixins: [icon],

  data () {
    return {
      displayBanner: false,
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
};
</script>
