<template>
  <div
    :class="{
      'd-bgc-purple-800': inverted,
    }"
  >
    <dt-tab-group
      :size="size"
      :inverted="inverted"
      :borderless="borderless"
      :disabled="disabled"
      :tab-list-class="tabListClass"
      :tab-list-child-props="tabListChildProps"
      @change="onChange"
    >
      <template #tabs>
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
          'd-fc-white': inverted,
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
</template>

<script>
import DtTabGroup from './tab_group';
import DtTab from './tab';
import DtTabPanel from './tab_panel';

export default {
  name: 'DtTabsDefault',
  components: { DtTabGroup, DtTab, DtTabPanel },
};
</script>
