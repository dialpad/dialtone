import { flushPromises, mount } from '@vue/test-utils';
import { DtTooltipDirective } from './tooltip.js';
import { getUniqueString } from '@/common/utils';

const MOCK_TOOLTIP_TEXT = 'Tooltip text content';
const MOCK_ANCHOR_TEXT = 'Button placeholder';
const MOCK_TOOLTIP_PROPS = {
  placement: 'bottom-start',
  delay: false,
  message: MOCK_TOOLTIP_TEXT,
};

const WrapperComponent = {
  name: 'wrapper-component',
  template: `
    <div>
      <button :key="id" data-qa="dt-tooltip-placement" v-dt-tooltip:[placement]="MOCK_TOOLTIP_TEXT">{{MOCK_ANCHOR_TEXT}}</button>
      <button :key="id" data-qa="dt-tooltip-object" v-dt-tooltip="MOCK_TOOLTIP_PROPS">{{MOCK_ANCHOR_TEXT}}</button>
    </div>
  `,

  props: {
    placement: {
      type: String,
      default: 'top',
    },
  },

  data () {
    return {
      id: getUniqueString(),
      MOCK_ANCHOR_TEXT,
      MOCK_TOOLTIP_TEXT,
      MOCK_TOOLTIP_PROPS,
    };
  },
};

const baseProps = {};

let mockProps = {};

describe('DtTooltipDirective Tests', () => {
  let wrapper;
  let anchorButtonPlacement;
  let anchorButtonObject;

  const updateWrapper = () => {
    wrapper = mount(WrapperComponent, {
      props: { ...baseProps, ...mockProps },
      global: {
        stubs: {
          transition: false,
        },
        plugins: [DtTooltipDirective],
      },
      attachTo: document.body,
    });

    anchorButtonPlacement = wrapper.find('[data-qa="dt-tooltip-placement"]');
    anchorButtonObject = wrapper.find('[data-qa="dt-tooltip-object"]');
  };

  afterEach(() => {
    mockProps = {};
    wrapper.unmount();
  });

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    describe('when tooltip with placement modifier is open', () => {
      beforeEach(async () => {
        await updateWrapper();
        await flushPromises();
        await anchorButtonPlacement.trigger('mouseenter');
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the tooltip', () => {
        expect(document.body.querySelectorAll('[data-qa="dt-tooltip"]').length).toBe(1);
      });

      it('should render the anchor', () => {
        expect(anchorButtonPlacement.text()).toBe(MOCK_ANCHOR_TEXT);
      });

      it('should render the message', () => {
        expect(document.body.querySelector('[data-qa="dt-tooltip"]').textContent.trim()).toBe(MOCK_TOOLTIP_TEXT);
      });
    });

    describe('when tooltip with object argument is open', () => {
      beforeEach(async () => {
        await updateWrapper();
        await flushPromises();
        await anchorButtonObject.trigger('mouseenter');
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the tooltip', () => {
        expect(document.body.querySelectorAll('[data-qa="dt-tooltip"]').length).toBe(1);
      });

      it('should render the anchor', () => {
        expect(anchorButtonObject.text()).toBe(MOCK_ANCHOR_TEXT);
      });

      it('should render the message', () => {
        expect(document.body.querySelector('[data-qa="dt-tooltip"]').textContent.trim()).toBe(MOCK_TOOLTIP_TEXT);
      });
    });
  });
});
