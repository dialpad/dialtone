<template>
  <div
    :class="{
      'd-bgc-purple-600': $attrs.inverted,
    }"
  >
    <dt-tab-group
      :size="$attrs.size"
      :inverted="$attrs.inverted"
      :borderless="$attrs.borderless"
      :disabled="$attrs.disabled"
      :tab-list-class="$attrs.tabListClass"
      :tab-list-child-props="$attrs.tabListChildProps"
      @change="$attrs.onChange"
    >
      <template #tabs>
        <dt-tab
          id="1"
          panel-id="2"
          selected
        >
          <p
            v-if="$attrs.tabs"
            v-html="$attrs.tabs"
          />
          <p v-else>
            First
          </p>
        </dt-tab>
        <dt-tab
          id="3"
          panel-id="4"
        >
          <p
            v-if="$attrs.tabs"
            v-html="$attrs.tabs"
          />
          <p v-else>
            Second
          </p>
        </dt-tab>
        <dt-tab
          id="5"
          panel-id="6"
          label="Third Label"
        >
          <p
            v-if="$attrs.tabs"
            v-html="$attrs.tabs"
          />
          <p v-else>
            Third
          </p>
        </dt-tab>
      </template>

      <div
        :class="{
          'd-fc-white': $attrs.inverted,
        }"
      >
        <dt-tab-panel
          id="2"
          tab-id="1"
        >
          <p
            v-if="defaultSlot"
            v-html="defaultSlot"
          />
          <p v-else>
            First Panel
          </p>
        </dt-tab-panel>
        <dt-tab-panel
          id="4"
          tab-id="3"
        >
          <p
            v-if="defaultSlot"
            v-html="defaultSlot"
          />
          <p v-else>
            Second Panel
          </p>
        </dt-tab-panel>
        <dt-tab-panel
          id="6"
          tab-id="5"
        >
          <p
            v-if="defaultSlot"
            v-html="defaultSlot"
          />
          <p v-else>
            Third Panel
          </p>
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
