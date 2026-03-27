<template>
  <dt-tab-group
    :size="size"
    :kind="kind"
    :outlined="outlined"
    :inverted="inverted"
    :borderless="borderless"
    :disabled="disabled"
    :spread="spread"
    :orientation="orientation"
    :tab-list-class="orientation === 'vertical' ? 'd-w264' : undefined"
    :activation-mode="activationMode"
    @before-change="confirmBeforeLeave"
  >
    <template #tabs>
      <dt-tab
        id="1"
        panel-id="2"
        selected
      >
        First tab
      </dt-tab>
      <dt-tab
        id="3"
        panel-id="4"
      >
        Second tab
      </dt-tab>
      <dt-tab
        id="5"
        panel-id="6"
        label="Third Label"
      >
        Third tab
      </dt-tab>
    </template>
    <div
      class="d-ba d-baw2 d-bas-dashed d-bc-subtle d-w100p d-plc-center d-py48"
      :class="{
        'd-fc-primary-inverted': inverted,
      }"
    >
      <dt-tab-panel
        id="2"
        tab-id="1"
      >
        <dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p16">
          <strong>First</strong> tab content panel
        </dt-text>
      </dt-tab-panel>
      <dt-tab-panel
        id="4"
        tab-id="3"
      >
        <dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p16">
          <strong>Second</strong> tab content panel
        </dt-text>
      </dt-tab-panel>
      <dt-tab-panel
        id="6"
        tab-id="5"
      >
        <dt-text as="p" kind="code" :size="100" tone="muted" align="center" class="d-p16">
          <strong>Third</strong> tab content panel
        </dt-text>
      </dt-tab-panel>
    </div>
  </dt-tab-group>
</template>

<script>
export default {
  name: 'ExampleTabs',

  props: {
    size: {
      type: String,
      default: '',
    },

    kind: {
      type: String,
      default: '',
    },

    outlined: {
      type: Boolean,
      default: false,
    },

    borderless: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    inverted: {
      type: Boolean,
      default: false,
    },

    validate: {
      type: Boolean,
      default: false,
    },

    activationMode: {
      type: String,
      default: 'manual',
    },

    spread: {
      type: String,
      default: 'none',
    },

    orientation: {
      type: String,
      default: 'horizontal',
    },
  },

  methods: {
    confirmBeforeLeave (event) {
      if (!this.validate) return;

      const confirmed = confirm('Are you sure to change tab?');

      if (!confirmed) {
        event.preventDefault();
      }
    },
  },
};
</script>
