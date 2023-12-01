import { createLocalVue, mount } from '@vue/test-utils';
import { DtTooltipDirective } from './tooltip.js';
import { getUniqueString } from '@/common/utils.js';

import {
  TOOLTIP_DIRECTIONS,
} from '@/components/tooltip';

const MOCK_TOOLTIP_TEXT = 'Tooltip text content';
const MOCK_ANCHOR_TEXT = 'Button placeholder';

const WrapperComponent = {
  name: 'wrapper-component',
  template: `
    <button :key="id" v-dt-tooltip:[placement]="MOCK_TOOLTIP_TEXT">{{MOCK_ANCHOR_TEXT}}</button>
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
      propsData: { ...baseProps, ...mockProps },
      localVue: testContext.localVue,
      attachTo: document.body,
    });

    anchor = wrapper.find('button');
  };

  afterEach(() => {
    mockProps = {};
    wrapper.destroy();
  });

  beforeAll(() => {
    testContext.localVue = createLocalVue();
    testContext.localVue.use(DtTooltipDirective);
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
    describe('when tooltip is open', () => {
      beforeEach(async () => {
        await updateWrapper();
        await anchor.trigger('mouseenter');
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
        expect(document.body.querySelector('[data-qa="dt-tooltip"]').textContent.trim()).toBe(MOCK_TOOLTIP_TEXT);
      });
    });
    describe('When a placement is provided', () => {
      TOOLTIP_DIRECTIONS.forEach(placement =>
        describe(`When direction is ${placement}`, () => {
          beforeEach(async () => {
            mockProps = { placement };
            await updateWrapper();
            await anchor.trigger('mouseenter');
          });

          it('should have correct arrow direction class', () => {
            expect(document.body.innerHTML.includes(`d-tooltip__arrow-tippy--${placement}`)).toBe(true);
          });
        }));
    });
  });
});
