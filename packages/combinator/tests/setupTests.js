import { config } from '@vue/test-utils';
import * as DialtoneVue from '@dialpad/dialtone-vue';

class MockObserver {
  observe () {}
  disconnect () {}
  unobserve () {}
}

global.IntersectionObserver = MockObserver;
global.ResizeObserver = MockObserver;

// The combinator and its controls render Dialtone components/directives (dt-text,
// dt-stack, dt-tooltip, …) that the real app registers globally via `app.use` /
// `app.component` (see src/main.js). Register them globally here too so tests
// resolve and render the same components the app does, instead of leaving bare
// dt-* tags unresolved (which otherwise floods the output with "Failed to
// resolve component/directive" warnings).
config.global.components = { ...DialtoneVue };
config.global.directives = { 'dt-tooltip': {} };
