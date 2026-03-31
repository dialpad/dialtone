<template>
  <div class="d-w100p" style="height: 300px;">
    <dt-resizable>
      <dt-resizable-panel
        id="exc-sidebar"
        initial-size="25p"
        user-min-size="825"
        collapsible
        :collapsed="isCollapsed"
      >
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">Sidebar</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel id="exc-content">
        <div class="d-d-flex d-fd-column d-w100p d-h100p d-bgc-gold-100">
          <div class="d-d-flex d-ai-center d-px16 d-py8 d-bb d-bc-default">
            <button class="d-btn d-btn--sm" @click="isCollapsed = !isCollapsed">
              {{ isCollapsed ? 'Show sidebar' : 'Hide sidebar' }}
            </button>
          </div>
          <div class="d-d-flex d-ai-center d-jc-center d-fl1">
            <span class="d-fs-200 d-fw-bold d-fc-gold-400">Content</span>
          </div>
        </div>
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
};
</script>
