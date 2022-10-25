<template>
  <div>
    <dt-button
      v-show="!displayBanner"
      @click="displayBanner = true"
    >
      Click to show!
    </dt-button>

    <dt-banner
      v-show="displayBanner"
      :kind="kind"
      :title="title"
      :title-id="titleId"
      :content-id="contentId"
      :important="important"
      :pinned="pinned"
      :hide-close="hideClose"
      :close-button-props="buttonCloseProps"
      :class="{ 'd-ps-sticky': show }"
      :hide-icon="hideIcon"
      :background-image="backgroundImage"
      :background-size="backgroundSize"
      :dialog-class="dialogClass"
      :visually-hidden-close="visuallyHiddenClose"
      :visually-hidden-close-label="visuallyHiddenCloseLabel"
      @close="displayBanner = false; onClose($event)"
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
        v-if="action"
        slot="action"
      >
        <dt-button
          :kind="buttonKind"
          importance="outlined"
          @click="onClick"
        >
          {{ action }}
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

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      displayBanner: this.show,
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
