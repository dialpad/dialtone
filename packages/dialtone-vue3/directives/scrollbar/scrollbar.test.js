import { mount } from '@vue/test-utils';
import { DtScrollbarDirective } from './scrollbar.js';
import { OverlayScrollbars } from 'overlayscrollbars';

const WrapperComponent = {
  name: 'wrapper-component',
  template: `
    <div v-dt-scrollbar></div>
  `,
};

describe('DtScrollbarDirective Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(WrapperComponent, {
      global: {
        plugins: [DtScrollbarDirective],
      },
      attachTo: document.body,
    });
  };

  afterEach(() => {
    wrapper.unmount();
  });

  beforeEach(() => {
    OverlayScrollbars.mockClear();
  });

  beforeAll(() => {
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
        expect(OverlayScrollbars).toHaveBeenCalledWith(wrapper.element, { scrollbars: { autoHide: 'leave', clickScroll: true } });
        expect(OverlayScrollbars).toHaveBeenCalledTimes(1);
        expect(wrapper.element.getAttribute('data-overlayscrollbars-initialize')).toBe('true');
        expect(wrapper.element.classList.contains('scrollbar')).toBe(true);
      });
    });
  });
});
