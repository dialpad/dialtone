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
    close () {
      this.isOpen = !this.isOpen;
    },
  },

};
</script>
