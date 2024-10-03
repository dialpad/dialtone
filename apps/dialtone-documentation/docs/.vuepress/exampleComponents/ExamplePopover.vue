<template>
  <dt-popover
    :modal="modal"
    max-width="264px"
    :placement="placement"
    :fallback-placements="fallbackPlacements"
  >
    <template #anchor="{ attrs }">
      <dt-button
        v-bind="attrs"
      >
        View Popover
      </dt-button>
    </template>
    <template
      v-if="header"
      #headerContent
    >
      <div class="d-w100p">
        This is the header
      </div>
    </template>
    <template
      v-if="footer"
      #footerContent
    >
      <div class="d-w100p">
        This is the footer
      </div>
    </template>
    <template #content>
      <slot name="content">
        <div class="d-mb8">
          This is content rendered within the popover.
        </div>
      </slot>
      <button class="d-btn d-btn--primary">
        Button
      </button>
    </template>
  </dt-popover>
</template>

<script>
export default {
  name: 'ExamplePopover2',

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

    placement: {
      type: String,
      default: 'bottom',
    },

    fallbackPlacements: {
      type: Array,
      default: () => ['auto'],
    },
  },
};
</script>
