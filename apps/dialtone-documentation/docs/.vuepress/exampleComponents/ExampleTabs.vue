<template>
  <dt-tab-group
    :size="size"
    :inverted="inverted"
    :borderless="borderless"
    :disabled="disabled"
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
      :class="{
        'd-fc-primary-inverted': inverted,
      }"
    >
      <dt-tab-panel
        id="2"
        tab-id="1"
      >
        <p>
          First tab content panel
        </p>
      </dt-tab-panel>
      <dt-tab-panel
        id="4"
        tab-id="3"
      >
        <p>
          Second tab content panel
        </p>
      </dt-tab-panel>
      <dt-tab-panel
        id="6"
        tab-id="5"
      >
        <p>
          Third tab content panel
        </p>
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
  },
};
</script>
