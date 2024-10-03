<template>
  <dt-modal
    title="Example title"
    :close-button-props="{ ariaLabel: 'Close modal' }"
    :show="isOpen"
    :banner-title="bannerTitle"
    :banner-kind="bannerKind"
    :fixed-header-footer="fixedHeaderFooter"
    :size="size"
    :copy="copy"
    @update:show="isOpen = $event"
  >
    <template
      #footer
    >
      <dt-button
        id="confirm-button"
        importance="primary"
        :kind="kind"
        class="d-ml6"
        @click="isOpen = false"
      >
        Confirm
      </dt-button>
      <dt-button
        id="cancel-button"
        kind="muted"
        importance="clear"
        @click="isOpen = false"
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
</template>

<script>
export default {
  name: 'ExampleModal',

  props: {
    kind: {
      type: String,
      default: 'default',
    },

    bannerKind: {
      type: String,
      default: 'base',
    },

    bannerTitle: {
      type: String,
      default: '',
    },

    fixedHeaderFooter: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'default',
    },

    copy: {
      type: String,
      default: `Sed at orci quis nunc finibus gravida eget vitae est. Praesent
          ac laoreet mi. Cras porttitor mauris ex. Integer convallis tellus a ex egestas, id laoreet elit mollis. Mauris
          ut elementum velit. Nam vel consectetur turpis. Aenean consequat purus non nunc tincidunt rutrum. In semper
          pretium dui vel tempus. Proin et mi id mi egestas iaculis. Sed lacinia libero non molestie consequat. Sed
          efficitur purus eget lacus viverra volutpat. Nam luctus ac eros eu iaculis. Fusce non condimentum lorem.`,
    },
  },

  data () {
    return {
      isOpen: false,
    };
  },
};
</script>
