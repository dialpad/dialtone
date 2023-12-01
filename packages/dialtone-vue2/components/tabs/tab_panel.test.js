import { createLocalVue, mount } from '@vue/test-utils';
import DtTabPanel from './tab_panel.vue';

const MOCK_DEFAULT_SLOT = 'Panel Slot';
const MOCK_GROUP_CONTEXT = {
  disabled: false,
  selected: '',
};

const baseProps = {
  id: '1',
  tabId: '2',
};
const baseSlots = { default: MOCK_DEFAULT_SLOT };
const baseProvide = { groupContext: MOCK_GROUP_CONTEXT };

let mockProps = {};
let mockSlots = {};
let mockProvide = {};
const testContext = {};

describe('DtTabPanel Tests', () => {
  let wrapper;
  let tabPanel;

  const updateWrapper = () => {
    wrapper = mount(DtTabPanel, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      provide: { ...baseProvide, ...mockProvide },
      localVue: testContext.localVue,
    });

    tabPanel = wrapper.find('[data-qa="dt-tab-panel"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockProvide = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the default slot', () => {
      expect(tabPanel.text()).toBe(MOCK_DEFAULT_SLOT);
    });

    describe('Attributes', () => {
      it('id attribute should be content the prop id', () => {
        expect(tabPanel.attributes('id')).toBe(`dt-panel-${baseProps.id}`);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Selected state', () => {
      it('default slot should be shown', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: baseProps.id } };

        updateWrapper();

        expect(tabPanel.text()).toBe(MOCK_DEFAULT_SLOT);
      });
    });

    describe('Hidden state', () => {
      describe('Hidden by prop', () => {
        it('aria-hidden should be "true"', () => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: baseProps.id } };
          mockProps = { hidden: true };

          updateWrapper();

          expect(tabPanel.attributes('aria-hidden')).toBe('true');
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('Unselected aria-hidden', () => {
      it('aria-hidden should be "false"', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: baseProps.id } };

        updateWrapper();

        expect(tabPanel.attributes('aria-hidden')).toBe('false');
      });
    });

    describe('Default A11y Attrs', () => {
      beforeEach(() => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '' } };

        updateWrapper();
      });

      it('aria-hidden should be "true"', () => {
        expect(tabPanel.attributes('aria-hidden')).toBe('true');
      });

      it('aria-labelledby should be match the tab id', () => {
        expect(tabPanel.attributes('aria-labelledby')).toBe(`dt-tab-${baseProps.tabId}`);
      });

      it('role should be "tabpanel"', () => {
        expect(tabPanel.attributes('role')).toBe('tabpanel');
      });

      it('tabindex should be "0" if the first element is not focusable', () => {
        expect(tabPanel.attributes('tabindex')).toBe('0');
      });
    });

    describe(`When there is a focusable element but it isn't the first element`, () => {
      it('tabindex should be "0"', () => {
        mockSlots = { default: '<h1>Content</h1><div><button>Focusable Slot</button></div>' };

        updateWrapper();

        tabPanel = wrapper.find('[data-qa="dt-tab-panel"]');

        expect(tabPanel.attributes('tabindex')).toBe('0');
      });
    });
  });
});
