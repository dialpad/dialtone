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
            'd-bgc-purple-600 d-p2': variant.propsToBind.inverted,
          },
        ]"
      >
        <template slot="tabs">
          <dt-tab
            :id="`${i}1`"
            :panel-id="`${i}2`"
            selected
          >
            First
          </dt-tab>
          <dt-tab
            :id="`${i}3`"
            :panel-id="`${i}4`"
          >
            Second
          </dt-tab>
          <dt-tab
            :id="`${i}5`"
            :panel-id="`${i}6`"
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
            :id="`${i}2`"
            :tab-id="`${i}1`"
          >
            <p>First Panel</p>
          </dt-tab-panel>
          <dt-tab-panel
            :id="`${i}4`"
            :tab-id="`${i}3`"
          >
            <p>Second Panel</p>
          </dt-tab-panel>
          <dt-tab-panel
            :id="`${i}6`"
            :tab-id="`${i}5`"
          >
            <p>Third Panel</p>
          </dt-tab-panel>
        </div>
      </dt-tab-group>
    </div>
  </div>
</template>

<script>
import DtTabGroup from './tab_group.vue';
import DtTab from './tab.vue';
import DtTabPanel from './tab_panel.vue';

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
