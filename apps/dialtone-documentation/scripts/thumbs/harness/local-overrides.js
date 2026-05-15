/**
 * Manual render configs for components that don't have a Combinator variants file,
 * or whose variants file doesn't produce a useful thumbnail rendering.
 *
 * Shape mirrors what getDefaultConfig() returns:
 *   { props, slots: { default: () => …, [name]: () => … }, renderFn? }
 */

import { h } from 'vue';

export const LOCAL_OVERRIDES = {
  DtCodeblock: {
    props: { text: 'const greet = () => "Hello";', language: 'javascript' },
    slots: {},
  },

  DtMotionText: {
    props: { text: 'Animated text' },
    slots: {},
  },

  // Tab leaf components — only meaningful inside a DtTabGroup.
  DtTab: {
    renderFn: (_h, _Component, lib) => h(lib.DtTabGroup, {}, {
      default: () => [
        h(lib.DtTab, { id: 'tab-1', panelId: 'panel-1', selected: true }, { default: () => 'Overview' }),
        h(lib.DtTab, { id: 'tab-2', panelId: 'panel-2' }, { default: () => 'Details' }),
        h(lib.DtTabPanel, { id: 'panel-1', tabId: 'tab-1' }, { default: () => 'Overview content' }),
      ],
    }),
  },

  DtTabPanel: {
    renderFn: (_h, _Component, lib) => h(lib.DtTabGroup, {}, {
      default: () => [
        h(lib.DtTab, { id: 'tab-1', panelId: 'panel-1', selected: true }, { default: () => 'Overview' }),
        h(lib.DtTabPanel, { id: 'panel-1', tabId: 'tab-1' }, { default: () => 'Panel content goes here.' }),
      ],
    }),
  },

  // SegmentedControlItem only meaningful inside DtSegmentedControl.
  DtSegmentedControlItem: {
    renderFn: (_h, _Component, lib) => h(lib.DtSegmentedControl, { modelValue: 'a' }, {
      default: () => [
        h(lib.DtSegmentedControlItem, { value: 'a' }, { default: () => 'Day' }),
        h(lib.DtSegmentedControlItem, { value: 'b' }, { default: () => 'Week' }),
      ],
    }),
  },

  // Resizable group + leaf components — DtResizablePanel and DtResizableHandle
  // only render visibly inside a DtResizable parent. Wrap them in a full
  // 2-panel layout so the thumbnail shows the composition.
  DtResizable: { props: {}, slots: {} },
  DtResizableHandle: {
    renderFn: (_h, _Component, lib) => h(lib.DtResizable, {
      style: { width: '320px', height: '160px' },
    }, {
      default: () => [
        h(lib.DtResizablePanel, { id: 'left', defaultSize: 50 }, {
          default: () => h('div', { style: 'padding: 12px' }, 'Left'),
        }),
        h(lib.DtResizableHandle),
        h(lib.DtResizablePanel, { id: 'right', defaultSize: 50 }, {
          default: () => h('div', { style: 'padding: 12px' }, 'Right'),
        }),
      ],
    }),
  },
  DtResizablePanel: {
    renderFn: (_h, _Component, lib) => h(lib.DtResizable, {
      style: { width: '320px', height: '160px' },
    }, {
      default: () => [
        h(lib.DtResizablePanel, { id: 'left', defaultSize: 50 }, {
          default: () => h('div', { style: 'padding: 12px' }, 'Left panel'),
        }),
        h(lib.DtResizableHandle),
        h(lib.DtResizablePanel, { id: 'right', defaultSize: 50 }, {
          default: () => h('div', { style: 'padding: 12px' }, 'Right panel'),
        }),
      ],
    }),
  },
};
