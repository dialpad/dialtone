<template>
  <div class="d-d-flex d-ai-flex-end d-jc-space-between d-w100p">
    <div class="d-w100p d-mr8">
      <dt-select-menu
        v-if="bannerTitle"
        label="Kind of Banner"
        size="sm"
        @change="changeBannerKind"
      >
        <option
          v-for="option in bannerKinds"
          :key="option"
          :selected="option === selectedBannerKind"
          :value="option"
          v-text="option"
        />
      </dt-select-menu>
    </div>
    <button
      class="d-btn d-btn--primary d-btn--sm d-fl-none"
      type="button"
      @click="openModal"
    >
      Launch modal
    </button>
  </div>
  <aside
    id="modal-base"
    ref="modal"
    class="d-modal d-m0"
    :class="{
      'd-modal--full': isFullScreen,
      'd-modal--danger': isDanger,
      'd-modal--animate-in': animateIn,
      'd-modal--animate-out': animateOut,
    }"
    tabindex="-1"
    role="dialog"
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    :aria-hidden="!showModal"
    @click.self="closeModal"
    @keydown.tab="trapFocus"
    @keydown.esc="closeModal"
  >
    <div
      v-if="shouldShowModalBanner"
      :class="[
        'd-modal__banner',
        bannerKindClass,
      ]"
    >
      {{ bannerTitle || "This example banner sits at the top of the modal." }}
    </div>
    <div
      class="d-modal__dialog"
      :class="{
        'd-modal__dialog--animate-in': animateIn,
        'd-modal__dialog--animate-out': animateOut,
        'd-modal__dialog--scrollable d-hmx764': isFixed,
      }"
      role="document"
    >
      <h2 class="d-modal__header">
        Example title
      </h2>
      <div class="d-modal__content">
        <p id="modal-description">
          {{ modalDescription }}
          <template v-if="isFixed">
            {{ modalDescription.repeat(3) }}
          </template>
        </p>
        <p v-if="!hasBannerTitle" class="d-mt16">
          <a
            href="#"
            class="d-link"
            @click.prevent="openModalBanner"
          >Show me a modal banner</a>
        </p>
      </div>
      <footer class="d-modal__footer">
        <button
          class="d-btn d-btn--primary"
          :class="{ 'd-btn--danger': isDanger }"
          type="button"
        >
          Save changes
        </button>
        <button
          class="d-btn"
          :class="{ 'd-btn--muted': isDanger }"
          type="button"
          @click="closeModal"
        >
          Cancel
        </button>
      </footer>
      <button
        class="d-modal__close d-btn d-btn--circle d-btn--lg"
        aria-label="Close"
        @click="closeModal"
      >
        <span class="d-btn__icon">
          <dt-icon
            name="close"
            size="300"
          />
        </span>
      </button>
    </div>
  </aside>
</template>

<script>
import Modal from '@mixins/modal.js';
const MODAL_KINDS = ['full-screen', 'danger', 'fixed', 'base'];

export default {
  name: 'ExampleModal',

  mixins: [Modal],

  props: {
    kind: {
      type: String,
      default: 'base',
      validator: (_kind) => {
        return MODAL_KINDS.includes(_kind);
      },
    },

    bannerKind: {
      type: String,
      default: 'warning',
      validate (kind) {
        return window.DIALTONE_CONSTANTS.NOTICE_KINDS.includes(kind);
      },
    },

    bannerTitle: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      selectedBannerKind: this.bannerKind,
      showModal: false,
      showModalBanner: false,
      animateIn: false,
      animateOut: false,
      modalDescription: `Sed at orci quis nunc finibus gravida eget vitae est. Praesent
          ac laoreet mi. Cras porttitor mauris ex. Integer convallis tellus a ex egestas, id laoreet elit mollis. Mauris
          ut elementum velit. Nam vel consectetur turpis. Aenean consequat purus non nunc tincidunt rutrum. In semper
          pretium dui vel tempus. Proin et mi id mi egestas iaculis. Sed lacinia libero non molestie consequat. Sed
          efficitur purus eget lacus viverra volutpat. Nam luctus ac eros eu iaculis. Fusce non condimentum lorem.`,
    };
  },

  computed: {
    isFullScreen () {
      return this.kind === 'full-screen';
    },

    isDanger () {
      return this.kind === 'danger';
    },

    isFixed () {
      return this.kind === 'fixed';
    },

    bannerKindClass () {
      return window.DIALTONE_CONSTANTS.MODAL_BANNER_KINDS[this.selectedBannerKind];
    },

    hasBannerTitle () {
      return !!this.bannerTitle;
    },

    shouldShowModalBanner () {
      return this.showModalBanner || this.hasBannerTitle;
    },

    bannerKinds () {
      return Object.keys(window.DIALTONE_CONSTANTS.MODAL_BANNER_KINDS);
    },
  },

  methods: {
    openModal () {
      this.animateOut = false;
      this.animateIn = true;

      this.showModal = true;

      document.body.classList.add('d-of-hidden');
      this.focusFirstElement(this.$refs.modal);
    },

    openModalBanner () {
      this.showModalBanner = true;
    },

    closeModal () {
      this.animateIn = false;
      this.animateOut = true;

      this.showModal = false;
      this.showModalBanner = false;

      document.body.classList.remove('d-of-hidden');
    },

    trapFocus (e) {
      if (this.showModal) {
        this.focusTrappedTabPress(e, this.$refs.modal);
      }
    },

    changeBannerKind (kind) {
      this.selectedBannerKind = kind;
    },
  },
};
</script>

<style scoped>

</style>
