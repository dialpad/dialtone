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
    >
      <template slot="tabs">
        <dt-tab
          v-for="(tab, i) in tabList"
          :id="`group-inbox-tab-${tab}`"
          :key="i"
          :panel-id="tab"
        >
          {{ tab }}
        </dt-tab>
      </template>

      <div
        :class="{
          'd-fc-neutral-white': $attrs.inverted,
        }"
      >
        <dt-tab-panel
          v-for="(tab, i) in tabList"
          :id="tab"
          :key="i"
          :tab-id="`group-inbox-tab-${tab}`"
        >
          {{ tab }}
        </dt-tab-panel>
      </div>
    </dt-tab-group>
  </div>
</template>

<script>
import DtTabGroup from './tab_group.vue';
import DtTab from './tab.vue';
import DtTabPanel from './tab_panel.vue';

export default {
  name: 'DtTabsDefault',
  components: { DtTabGroup, DtTab, DtTabPanel },

  data () {
    return {
      tabList: [
        'activecalls',
        'operators',
        'new',
        'recent',
      ],
    }
  },

  mounted () {
      setTimeout(() => {
        this.tabList = [
          'voicemails',
          'operators',
          'faxes',
          'spam',
          'unlogged',
        ];
      }, 5000);
    },
};
</script>
