<template>
  <div class="d-w100p" style="height: 300px;">
    <dt-resizable @panel-collapse="onPanelCollapse">
      <dt-resizable-panel
        id="exc-sidebar"
        initial-size="25p"
        user-min-size="825"
        collapsible
        :collapsed="isCollapsed"
      >
        <dt-stack class="d-w100p d-h100p d-bgc-purple-100">
          <dt-stack direction="row" align="center" justify="end" class="d-px16 d-py8 d-bb d-bc-default">
            <button class="d-btn d-btn--sm" @click="isCollapsed = true">
              Close sidebar
            </button>
          </dt-stack>
          <dt-stack align="center" justify="center" class="d-fl1">
            <span class="d-fs-200 d-fw-bold d-fc-purple-600">Sidebar</span>
          </dt-stack>
        </dt-stack>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="exc-content">
        <dt-stack class="d-w100p d-h100p d-bgc-gold-100">
          <dt-stack
            v-if="isCollapsed"
            direction="row"
            align="center"
            class="d-px16 d-py8 d-bb d-bc-default"
          >
            <button class="d-btn d-btn--sm" @click="isCollapsed = false">
              Open sidebar
            </button>
          </dt-stack>
          <dt-stack align="center" justify="center" class="d-fl1">
            <span class="d-fs-200 d-fw-bold d-fc-gold-500">Content</span>
          </dt-stack>
        </dt-stack>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
export default {
  name: 'ExampleResizableCollapsible',
  data () {
    return { isCollapsed: false };
  },

  methods: {
    onPanelCollapse (panelId, collapsed) {
      if (panelId === 'exc-sidebar') {
        this.isCollapsed = collapsed;
      }
    },
  },
};
</script>
