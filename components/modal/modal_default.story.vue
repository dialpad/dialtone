<template>
  <div>
    <dt-modal
      :title="title"
      :close-button-props="buttonCloseProps"
      :show="isOpen"
      :kind="kind"
      :size="size"
      :copy="copy"
      :hide-close="hideClose"
      :labelled-by-id="labelledById"
      @update:show="close"
    >
      <template
        v-if="header"
        #header
      >
        <span v-html="header" />
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
          v-if="footer"
          v-html="footer"
        />
        <div v-else>
          <dt-button
            :kind="kind"
            importance="primary"
          >
            Confirm
          </dt-button>
          <dt-button
            :kind="kind"
            importance="clear"
          >
            Cancel
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
import DtModal from './modal';
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
      isOpen: false,
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

  methods: {
    close (event) {
      this.isOpen = !this.isOpen;
      this.onClose(event);
    },
  },

};
</script>
