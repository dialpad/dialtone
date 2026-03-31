<template>
  <!-- eslint-disable vue/no-static-inline-styles -->
  <div>
    <div style="margin-bottom: 16px; display: flex; gap: 8px; align-items: center;">
      <button
        class="d-btn d-btn--primary d-btn--sm"
        @click="clearAdapter"
      >
        Clear Adapter State
      </button>
      <span class="d-fs-100 d-fc-tertiary">
        Uses a custom in-memory adapter (logs save/load to console).
      </span>
    </div>
    <div style="margin-bottom: 8px;">
      <code class="d-fs-100 d-fc-secondary">
        Last saved: {{ lastSaved }}
      </code>
    </div>
    <div style="height: 400px; border: 1px solid var(--dt-color-border-default);">
      <dt-resizable
        ref="group"
        direction="row"
        :storage="adapter"
      >
        <dt-resizable-panel
          id="left"
          initial-size="33p"
          user-min-size="20p"
        >
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-green-100">
            <span class="d-fs-200 d-fw-bold d-fc-green-400">Left Panel</span>
          </div>
        </dt-resizable-panel>
        <dt-resizable-handle />
        <dt-resizable-panel id="center">
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-gold-100">
            <span class="d-fs-200 d-fw-bold d-fc-gold-400">Center Panel</span>
          </div>
        </dt-resizable-panel>
        <dt-resizable-handle />
        <dt-resizable-panel
          id="right"
          initial-size="25p"
          user-min-size="15p"
        >
          <div class="d-d-flex d-ai-center d-jc-center d-w100p d-h100p d-bgc-purple-100">
            <span class="d-fs-200 d-fw-bold d-fc-purple-400">Right Panel</span>
          </div>
        </dt-resizable-panel>
      </dt-resizable>
    </div>
  </div>
</template>

<script>
import DtResizable from './resizable.vue';
import DtResizablePanel from './resizable_panel.vue';
import DtResizableHandle from './resizable_handle.vue';

export default {
  name: 'ResizableCustomAdapterStory',
  components: {
    DtResizable,
    DtResizablePanel,
    DtResizableHandle,
  },

  data () {
    return {
      storedData: null,
      lastSaved: 'never',
    };
  },

  computed: {
    adapter () {
      const self = this;
      return {
        save (data) {
          self.storedData = data;
          self.lastSaved = new Date().toLocaleTimeString();
          console.log('[custom-adapter] save:', data);
        },

        load () {
          console.log('[custom-adapter] load:', self.storedData);
          return self.storedData;
        },

        clear () {
          self.storedData = null;
          self.lastSaved = 'cleared';
          console.log('[custom-adapter] clear');
        },
      };
    },
  },

  methods: {
    clearAdapter () {
      this.adapter.clear();
    },
  },
};
</script>
