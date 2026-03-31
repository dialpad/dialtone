<template>
  <!-- eslint-disable vue/no-static-inline-styles -->
  <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
    <dt-resizable :direction="$attrs.direction">
      <dt-resizable-panel :id="isColumn ? 'top' : 'left'">
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
          <span class="d-fs-200 d-fw-bold d-fc-purple-400">{{ isColumn ? 'Top' : 'Left' }} Panel</span>
        </div>
      </dt-resizable-panel>
      <dt-resizable-handle />
      <dt-resizable-panel :id="isColumn ? 'bottom' : 'right'">
        <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
          <span class="d-fs-200 d-fw-bold d-fc-gold-400">{{ isColumn ? 'Bottom' : 'Right' }} Panel</span>
        </div>
      </dt-resizable-panel>
    </dt-resizable>
  </div>
</template>

<script>
import DtResizable from './dt_resizable.vue';
import DtResizablePanel from './dt_resizable_panel.vue';
import DtResizableHandle from './dt_resizable_handle.vue';

export default {
  name: 'ResizableDefaultStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },

  computed: {
    isColumn () {
      return this.$attrs.direction === 'column';
    },
  },
};
</script>
