<template>
  <div>
    <dt-button @click="buttonClicked">
      Click to show!
    </dt-button>

    <aside class="d-toast-wrapper">
      <dt-toast
        ref="toast"
        v-model:open="isShown"
        :kind="$attrs.kind"
        :header-text="$attrs.headerText"
        :message="$attrs.message"
        :header-id="$attrs.headerId"
        :content-id="$attrs.contentId"
        :important="$attrs.important"
        :show-close="$attrs.showClose"
        :show-action="$attrs.showAction"
        :show-icon="$attrs.showIcon"
        :duration="$attrs.duration"
        :layout="$attrs.layout"
        @close="$attrs.onClose"
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
            :size="200"
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
      </dt-toast>
    </aside>
  </div>
</template>

<script>
import { DtToast } from '@/components/toast';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'ToastDefault',

  components: { DtToast, DtButton, DtIcon },

  data () {
    return {
      isShown: this.$attrs.open,
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

  watch: {
    open: function (open) {
      this.isShown = open;
    },
  },

  methods: {
    buttonClicked () {
      this.isShown = true;
    },
  },
};
</script>
