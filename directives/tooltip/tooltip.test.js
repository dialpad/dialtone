import { createLocalVue, mount } from '@vue/test-utils';
import { DtTooltipDirective } from '@/directives';

import {
  TOOLTIP_DIRECTIONS,
} from '@/components/tooltip/tooltip_constants';

const MOCK_TRANSITION_STUB = () => ({
  render: function (h) {
    return this.$options._renderChildren;
  },
});
const MOCK_TOOLTIP_TEXT = 'Tooltip text content';
const MOCK_ANCHOR_TEXT = 'Button placeholder';

const WrapperComponent = {
  template: `
    <button v-dt-tooltip:[placement]="MOCK_TOOLTIP_TEXT">{{MOCK_ANCHOR_TEXT}}</button>
  `,
  props: {
    placement: {
      type: String,
      default: 'top',
    },
  },

  data () {
    return {
      MOCK_ANCHOR_TEXT,
      MOCK_TOOLTIP_TEXT,
    };
  },
};

const baseProps = {};

let mockProps = {};

const testContext = {};

describe('DtTooltipDirective Tests', () => {
  let wrapper;
  let anchor;

  const updateWrapper = () => {
    wrapper = mount(WrapperComponent, {
      localVue: testContext.localVue,
      propsData: { ...baseProps, ...mockProps },
      stubs: {
        // this gets around transition async problems. See https://v1.test-utils.vuejs.org/guides/common-tips.html
        transition: MOCK_TRANSITION_STUB(),
      },
      attachTo: document.body,
    });

    anchor = wrapper.find('button');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
    testContext.localVue.use(DtTooltipDirective);
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    wrapper.destroy();
    document.body.outerHTML = '';
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    describe('when tooltip is open', () => {
      beforeEach(async () => {
        updateWrapper();
        await anchor.trigger('focusin');
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the tooltip', () => {
        expect(document.body.querySelectorAll('[data-qa="dt-tooltip"]').length).toBe(1);
      });

      it('should render the anchor', () => {
        expect(anchor.text()).toBe(MOCK_ANCHOR_TEXT);
      });

      it('should render the message', () => {
        expect(document.querySelector('[data-qa="dt-tooltip"]').textContent.trim()).toBe(MOCK_TOOLTIP_TEXT);
      });
    });
    describe('When a placement is provided', () => {
      TOOLTIP_DIRECTIONS.forEach(placement =>
        describe(`When direction is ${placement}`, () => {
          beforeEach(async () => {
            mockProps = { placement };
            updateWrapper();
            await anchor.trigger('focusin');
          });

          it('should have correct arrow direction class', () => {
            expect(document.body.innerHTML.includes(`d-tooltip__arrow-tippy--${placement}`)).toBe(true);
          });
        }));
    });
  });
});
