<template>
  <div>
    <dt-modal
      :title="title"
      :banner-title="bannerTitle"
      :close-button-props="buttonCloseProps"
      :show="isOpen"
      :kind="kind"
      :size="size"
      :copy="copy"
      :modal-class="modalClass"
      :banner-class="bannerClass"
      :banner-kind="bannerKind"
      :dialog-class="dialogClass"
      :content-class="contentClass"
      :hide-close="hideClose"
      :labelled-by-id="labelledById"
      :fixed-header-footer="fixedHeaderFooter"
      :visually-hidden-close="visuallyHiddenClose"
      :visually-hidden-close-label="visuallyHiddenCloseLabel"
      :close-on-click="closeOnClick"
      @update:show="close"
    >
      <template
        v-if="banner"
        slot="banner"
      >
        <span v-html="banner" />
      </template>
      <template
        v-if="header"
        slot="header"
      >
        <span v-html="header" />
      </template>
      <template
        v-if="defaultSlot"
        slot="default"
      >
        <span v-html="defaultSlot" />
      </template>
      <template
        v-if="showFooter"
        slot="footer"
      >
        <span
          v-if="footer"
          v-html="footer"
        />
        <div v-else>
          <dt-button
            importance="clear"
          >
            Cancel
          </dt-button>
          <dt-button
            :kind="kind"
            importance="primary"
            class="d-ml6"
          >
            Confirm
          </dt-button>
        </div>
      </template>
    </dt-modal>
    <dt-button
      @click="isOpen = !isOpen"
    >
      Click to open
    </dt-button>
  </div>
</template>

<script>
import DtModal from './modal.vue';
import { DtButton } from '../button';

export default {
  name: 'DtModalDefault',

  components: {
    DtModal,
    DtButton,
  },

  props: {
    showFooter: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      isOpen: this.show,
    };
  },

  computed: {
    buttonCloseProps () {
      return {
        ...this.closeButtonProps,
        ariaLabel: 'Close',
      };
    },
  },

  watch: {
    show: {
      handler () {
        this.isOpen = this.show;
      },
    },
  },

  methods: {
    close (event) {
      this.isOpen = !this.isOpen;
      this.onClose(event);
    },
  },

};
</script>
