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

// Mock browser APIs not available in test environment
class ClipboardEvent extends Event {
  constructor (type, options = {}) {
    super(type, options);
    this.clipboardData = options.clipboardData || null;
  }
}

class DataTransfer {
  constructor () {
    this.types = [];
    this.data = new Map();
  }

  getData (format) {
    return this.data.get(format) || '';
  }

  setData (format, data) {
    this.data.set(format, data);
    if (!this.types.includes(format)) {
      this.types.push(format);
    }
  }
}

export function simulatePaste (content, type = 'text/plain', dispatchElement) {
  const clipboardData = new DataTransfer();
  clipboardData.setData(type, content);

  const pasteEvent = new ClipboardEvent('paste', {
    clipboardData,
    bubbles: true,
    cancelable: true,
  });

  dispatchElement.dispatchEvent(pasteEvent);
  return pasteEvent;
}

beforeAll(() => {
  global.IntersectionObserver = MockObserver;
  global.ResizeObserver = MockObserver;
  global.ClipboardEvent = ClipboardEvent;
  global.DataTransfer = DataTransfer;

  // Add polyfill for :focus-visible selector in JSDOM
  // see https://github.com/jsdom/jsdom/issues/3426
  const matchesOriginal = HTMLElement.prototype.matches;
  HTMLElement.prototype.matches = function (query) {
    if (query === ':focus-visible') return false;
    return matchesOriginal.call(this, query);
  };
});
