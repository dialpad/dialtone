<template>
  <dt-tab-group
    :size="size"
    :kind="kind"
    :outlined="outlined"
    :inverted="inverted"
    :borderless="borderless"
    :disabled="disabled"
    :activation-mode="activationMode"
    @before-change="confirmBeforeLeave"
  >
    <template #tabs>
      <dt-tab
        id="1"
        panel-id="2"
        selected
      >
        <p>
          First tab
        </p>
      </dt-tab>
      <dt-tab
        id="3"
        panel-id="4"
      >
        <p>
          Second tab
        </p>
      </dt-tab>
      <dt-tab
        id="5"
        panel-id="6"
        label="Third Label"
      >
        <p>
          Third tab
        </p>
      </dt-tab>
    </template>
    <div
      class="d-ba d-bas-dashed d-mt16 d-bar4 d-bc-subtle"
      :class="{
        'd-fc-primary-inverted': inverted,
      }"
    >
      <dt-tab-panel
        id="2"
        tab-id="1"
      >
        <dt-text as="p" kind="code" size="xs" tone="muted" align="center" class="d-p16">
          <strong>First</strong> tab content panel
        </dt-text>
      </dt-tab-panel>
      <dt-tab-panel
        id="4"
        tab-id="3"
      >
        <dt-text as="p" kind="code" size="xs" tone="muted" align="center" class="d-p16">
          <strong>Second</strong> tab content panel
        </dt-text>
      </dt-tab-panel>
      <dt-tab-panel
        id="6"
        tab-id="5"
      >
        <dt-text as="p" kind="code" size="xs" tone="muted" align="center" class="d-p16">
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
