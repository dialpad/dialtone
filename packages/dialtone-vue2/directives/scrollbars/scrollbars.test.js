import { createLocalVue, mount } from '@vue/test-utils';
import { DtScrollbarsDirective } from './scrollbars.js';
import { OverlayScrollbars } from 'overlayscrollbars';
import { beforeEach } from 'vitest';
import { expect } from 'chai';

const WrapperComponent = {
  name: 'wrapper-component',
  template: `
    <div v-dt-scrollbars></div>
  `,
};

const testContext = {};

describe('DtScrollbarsDirective Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(WrapperComponent, {
      localVue: testContext.localVue,
      attachTo: document.body,
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  beforeEach(() => {
    OverlayScrollbars.mockClear();
  });

  beforeAll(() => {
    testContext.localVue = createLocalVue();
    testContext.localVue.use(DtScrollbarsDirective);

    vi.mock('overlayscrollbars', () => {
      return {
        OverlayScrollbars: vi.fn(),
      };
    });
  });

  describe('Presentation Tests', () => {
    describe('when scrollbars directive is present', () => {
      beforeEach(async () => {
        await updateWrapper();
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should setup directive', () => {
        expect(OverlayScrollbars).toHaveBeenCalledWith(wrapper.element, { scrollbars: { autoHide: 'scroll' } });
        expect(OverlayScrollbars).toHaveBeenCalledTimes(1);
        expect(wrapper.element.getAttribute('data-overlayscrollbars-initialize')).toBe('true');
        expect(wrapper.element.classList.contains('custom-scrollbars')).toBe(true);
      });
    });
  });
});
