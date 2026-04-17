<template>
  <dt-box block-size="400" inline-size="100p">
    <dt-resizable @panel-collapse="onPanelCollapse">
      <dt-resizable-panel
        id="exc-sidebar"
        initial-size="25p"
        user-min-size="825"
        collapsible
        :collapsed="isCollapsed"
      >
        <dt-box block-size="100p" inline-size="100p" surface="positive" class="d-d-flex d-fd-column">
          <dt-stack direction="row" align="center" justify="end" class="d-px16 d-py8 d-bb d-bc-subtle">
            <dt-button kind="muted" importance="clear" size="100" @click="isCollapsed = true">
              Close sidebar
            </dt-button>
          </dt-stack>
          <dt-stack align="center" justify="center" class="d-fl1">
            <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="muted">
              Sidebar
            </dt-text>
          </dt-stack>
        </dt-box>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="exc-content">
        <dt-box block-size="100p" inline-size="100p" surface="warning-subtle" class="d-d-flex d-fd-column">
          <dt-stack
            v-if="isCollapsed"
            direction="row"
            align="center"
            class="d-px16 d-py8 d-bb d-bc-default"
          >
            <dt-button kind="muted" importance="clear" size="100" @click="isCollapsed = false">
              Open sidebar
            </dt-button>
          </dt-stack>
          <dt-stack align="center" justify="center" class="d-fl1">
            <dt-text as="p" align="center" kind="label" size="200" strength="bold" tone="muted">
              Content
            </dt-text>
          </dt-stack>
        </dt-box>
      </dt-resizable-panel>
    </dt-resizable>
  </dt-box>
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
