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
      :kind="$attrs.kind"
      :header-text="$attrs.headerText"
      :header-id="$attrs.headerId"
      :content-id="$attrs.contentId"
      :important="$attrs.important"
      :pinned="$attrs.pinned"
      :show-close="$attrs.showClose"
      :show-action="$attrs.showAction"
      :class="{ 'd-ps-sticky': $attrs.show }"
      :show-icon="$attrs.showIcon"
      :background-image="$attrs.backgroundImage"
      :background-size="$attrs.backgroundSize"
      :dialog-class="$attrs.dialogClass"
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
          :size="200"
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
        <dt-icon :name="$attrs.icon" />
      </template>
    </dt-banner>
  </div>
</template>

<script>
import { DtBanner } from '@/components/banner';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'BannerDefault',

  components: { DtBanner, DtButton, DtIcon },

  data () {
    return {
      displayBanner: this.$attrs.show,
    };
  },

  computed: {
    shouldInvertButton () {
      return this.$attrs.kind === 'base' || this.$attrs.kind === 'critical' || this.$attrs.kind === 'info';
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
  },
};
</script>
