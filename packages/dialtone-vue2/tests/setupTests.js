import Vue from 'vue';
import { DtTooltipDirective } from '@/directives/tooltip_directive';

Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.use(DtTooltipDirective);

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
