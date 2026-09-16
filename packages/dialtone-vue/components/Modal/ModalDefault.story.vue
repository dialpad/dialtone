<template>
  <div>
    <dt-modal
      :header-text="$attrs.headerText"
      :banner-header-text="$attrs.bannerHeaderText"
      :open="isOpen"
      :kind="$attrs.kind"
      :fullscreen="$attrs.fullscreen"
      :copy="$attrs.copy"
      :modal-class="$attrs.modalClass"
      :banner-class="$attrs.bannerClass"
      :banner-kind="$attrs.bannerKind"
      :dialog-class="$attrs.dialogClass"
      :content-class="$attrs.contentClass"
      :header-class="$attrs.headerClass"
      :footer-class="$attrs.footerClass"
      :show-close="$attrs.showClose"
      :labelled-by-id="$attrs.labelledById"
      :fixed-header-footer="$attrs.fixedHeaderFooter"
      :close-on-click="$attrs.closeOnClick"
      :append-to="$attrs.appendTo"
      :content-mode="$attrs.contentMode"
      :transparent-backdrop="$attrs.transparentBackdrop"
      :modal="$attrs.modal"
      @update:open="close"
    >
      <template
        v-if="$attrs.banner"
        #banner
      >
        <span v-html="$attrs.banner" />
      </template>
      <template
        v-if="$attrs.header"
        #header
      >
        <span v-html="$attrs.header" />
      </template>
      <template
        v-if="defaultSlot"
        #default
      >
        <span v-html="defaultSlot" />
      </template>
      <template
        v-if="showFooter"
        #footer
      >
        <span
          v-if="$attrs.footer"
          v-html="$attrs.footer"
        />
        <div v-else>
          <dt-button
            :kind="secondaryButtonKind"
            importance="clear"
          >
            Cancel
          </dt-button>
          <dt-button
            :kind="$attrs.kind"
            importance="primary"
            class="d-mis-75"
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
import DtModal from './Modal.vue';
import { DtButton } from '../Button';

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
      isOpen: this.$attrs.open,
    };
  },

  computed: {
    secondaryButtonKind () {
      return this.$attrs.kind === 'critical' ? 'muted' : 'default';
    },
  },

  watch: {
    open: {
      handler () {
        this.isOpen = this.$attrs.open;
      },
    },
  },

  methods: {
    close (event) {
      this.isOpen = event;
      this.$attrs.onClose(event);
    },
  },

};
</script>
