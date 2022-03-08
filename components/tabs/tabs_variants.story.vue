<template>
  <div>
    <div
      v-for="(variant, i) in variantsTabs"
      :key="i"
      class="d-mb64"
    >
      <p class="d-fw-bold d-mb8">
        {{ variant.description }}
      </p>
      <dt-tab-group
        v-bind="variant.propsToBind"
        :class="[
          'd-mb8',
          {
            'd-bgc-purple-800 d-p2': variant.propsToBind.inverted,
          },
        ]"
      >
        <template slot="tabs">
          <dt-tab
            id="1"
            panel-id="2"
            selected
          >
            First
          </dt-tab>
          <dt-tab
            id="3"
            panel-id="4"
          >
            Second
          </dt-tab>
          <dt-tab
            id="5"
            panel-id="6"
            label="Third Label"
          >
            Third
          </dt-tab>
        </template>

        <div
          :class="{
            'd-fc-white': variant.propsToBind.inverted,
          }"
        >
          <dt-tab-panel
            id="2"
            tab-id="1"
          >
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel
            id="4"
            tab-id="3"
          >
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel
            id="6"
            tab-id="5"
          >
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </div>
  </div>
</template>

<script>
import DtTabGroup from './tab_group';
import DtTab from './tab';
import DtTabPanel from './tab_panel';

export default {
  name: 'DtTabsVariants',
  components: { DtTabGroup, DtTab, DtTabPanel },
  data () {
    return {
      variantsTabs: [{
        description: 'Default tabs',
        propsToBind: {},
      }, {
        description: 'Inverted tabs',
        propsToBind: {
          inverted: true,
        },
      }, {
        description: 'Small size tabs',
        propsToBind: {
          size: 'sm',
        },
      }, {
        description: 'Borderless tabs',
        propsToBind: {
          borderless: true,
        },
      }, {
        description: 'Importance tabs',
        propsToBind: {
          importance: true,
        },
      }, {
        description: 'Disabled tabs',
        propsToBind: {
          disabled: true,
        },
      }],
    };
  },
};
</script>
