import Vue from 'vue';
import { DialtoneLocalizationPlugin } from '@/localization/index.js';

Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.use(DialtoneLocalizationPlugin);

// Mock IntersectionObserver
class MockObserver {
  observe () {
  }

  disconnect () {
  }

  unobserve () {
  }
}

beforeAll(() => {
  global.IntersectionObserver = MockObserver;
  global.ResizeObserver = MockObserver;
});
