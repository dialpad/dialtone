<template>
  <div>
    <dt-button @click="displayBanner = true">
      Click to show!
    </dt-button>

    <dt-banner
      v-if="displayBanner"
      :kind="$attrs.kind"
      :title="$attrs.title"
      :title-id="$attrs.titleId"
      :content-id="$attrs.contentId"
      :important="$attrs.important"
      :pinned="$attrs.pinned"
      :hide-close="$attrs.hideClose"
      :close-button-props="buttonCloseProps"
      @close="displayBanner = false; $attrs.onClose($event)"
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

      <template
        v-if="$attrs.action"
        #action
      >
        <dt-button
          :kind="buttonKind"
          importance="outlined"
          @click="$attrs.onClick"
        >
          {{ $attrs.action }}
        </dt-button>
      </template>
      <template
        v-if="$attrs.icon"
        #icon
      >
        <component :is="$attrs.icon" />
      </template>
      <template
        v-if="$attrs.titleOverride"
        #titleOverride
      >
        <span v-html="$attrs.titleOverride" />
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
};
</script>
