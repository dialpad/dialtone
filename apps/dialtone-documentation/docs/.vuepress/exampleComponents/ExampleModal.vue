<template>
  <div class="d-d-flex d-ai-flex-end d-jc-space-between">
    <div v-if="bannerTitle" class="d-w100p d-mr8">
      <dt-select-menu
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
    <dt-button
      class="d-fl-none"
      size="sm"
      @click="updateShow(true)"
    >
      Launch Example
    </dt-button>
  </div>
  <dt-modal
    :kind="kind"
    :banner-kind="selectedBannerKind"
    :banner-title="bannerTitle"
    :close-button-props="{ ariaLabel: 'Close modal' }"
    :size="size"
    :fixed-header-footer="fixedHeaderFooter"
    :show="isOpen"
    class="d-m0"
    @update:show="updateShow"
  >
    <template
      v-if="shouldShowModalBanner"
      #banner
    >
      {{ bannerTitle || "This example banner sits at the top of the modal." }}
    </template>
    <template #header>
      Example Modal
    </template>
    <p id="modal-description">
      {{ modalDescription }}
      <template v-if="fixedHeaderFooter">
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
    <template
      #footer
    >
      <dt-button
        :kind="secondaryButtonKind"
        importance="clear"
        @click="isOpen = false"
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
    </template>
  </dt-modal>
</template>

<script>
export default {
  name: 'ExampleModal',

  props: {
    kind: {
      type: String, // default | danger
      default: 'default',
    },

    size: {
      type: String, // default | full
      default: 'default',
    },

    fixedHeaderFooter: {
      type: Boolean,
      default: false,
    },

    bannerKind: {
      type: String,
      default: 'warning',
    },

    bannerTitle: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      isOpen: false,
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
    secondaryButtonKind () {
      return this.kind === 'danger' ? 'muted' : 'default';
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
    openModalBanner () {
      this.showModalBanner = true;
    },

    changeBannerKind (kind) {
      this.selectedBannerKind = kind;
    },

    updateShow (open) {
      this.isOpen = open;
      if (!open) {
        this.showModalBanner = false;
      }
    },
  },
};
</script>

<style scoped>

</style>
