<template>
  <div>
    <dt-modal
      :title="$attrs.title"
      :banner-title="$attrs.bannerTitle"
      :close-button-props="buttonCloseProps"
      :show="isOpen"
      :kind="$attrs.kind"
      :size="$attrs.size"
      :copy="$attrs.copy"
      :modal-class="$attrs.modalClass"
      :banner-class="$attrs.bannerClass"
      :banner-kind="$attrs.bannerKind"
      :dialog-class="$attrs.dialogClass"
      :content-class="$attrs.contentClass"
      :hide-close="$attrs.hideClose"
      :labelled-by-id="$attrs.labelledById"
      :fixed-header-footer="$attrs.fixedHeaderFooter"
      :visually-hidden-close="$attrs.visuallyHiddenClose"
      :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
      :close-on-click="$attrs.closeOnClick"
      :initial-focus-element="$attrs.initialFocusElement"
      @update:show="updateShow"
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
            id="cancel-button"
            :kind="secondaryButtonKind"
            importance="clear"
          >
            Cancel
          </dt-button>
          <dt-button
            id="confirm-button"
            :kind="$attrs.kind"
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
      isOpen: this.$attrs.show,
    };
  },

  computed: {
    buttonCloseProps () {
      return {
        ...this.$attrs.closeButtonProps,
        ariaLabel: 'Close',
      };
    },

    secondaryButtonKind () {
      return this.$attrs.kind === 'danger' ? 'muted' : 'default';
    },
  },

  watch: {
    show: {
      handler () {
        this.isOpen = this.$attrs.show;
      },
    },
  },

  methods: {
    updateShow (open) {
      this.isOpen = open;
      this.$attrs.toggleOpen(open);
    },
  },

};
</script>
