<template>
  <div
    v-if="modal"
    class="d-modal--transparent"
    :aria-hidden="!shown"
    @click.self="closeModal"
  />
  <div class="d-popover d-fl-center d-fd-column d-p24 d-w100p d-of-auto">
    <button
      id="anchor1"
      class="d-btn d-btn--primary"
      :aria-expanded="!shown"
      aria-controls="dialog1"
      aria-haspopup="dialog"
      @click="togglePopover"
    >
      View Popover
    </button>
    <div
      id="dialog1"
      class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164"
      :class="shown ? 'd-vi-visible' : 'd-vi-hidden'"
      role="dialog"
      :aria-modal="modal"
      :aria-hidden="shown"
      aria-labelledby="anchor1"
    >
      <div
        v-if="header"
        class="d-popover__header d-px16"
      >
        <div class="d-w100p">
          This is the header
        </div>
      </div>
      <div class="d-popover__content d-p16">
        <slot name="content">
          <div class="d-mb8">
            This is content rendered within the popover.
          </div>
        </slot>
        <button class="d-btn d-btn--primary">
          Button
        </button>
      </div>
      <div
        v-if="footer"
        class="d-popover__footer d-px16"
      >
        <div class="d-w100p">
          This is the footer
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamplePopover',
  props: {
    modal: {
      type: Boolean,
      default: false,
    },

    header: {
      type: Boolean,
      default: false,
    },

    footer: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      shown: false,
    };
  },

  mounted () {
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  },

  beforeUnmount () {
    window.removeEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  },

  methods: {
    closeModal () {
      document.body.classList.remove('d-of-hidden');
      this.shown = false;
    },

    openModal () {
      if (this.modal) {
        document.body.classList.add('d-of-hidden');
      }
      this.shown = true;
    },

    togglePopover () {
      if (!this.shown) {
        this.openModal();
      } else {
        this.closeModal();
      }
    },
  },
};
</script>

<style scoped>

</style>
