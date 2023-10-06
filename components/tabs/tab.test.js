import { createLocalVue, mount } from '@vue/test-utils';
import DtTab from './tab.vue';
import { TAB_IMPORTANCE_MODIFIERS } from './tabs_constants';

const MOCK_PANEL_ID = '2';
const MOCK_LABEL = 'area-label';
const MOCK_ID = '1';
const MOCK_DEFAULT_SLOT = 'Message Slot';
const MOCK_GROUP_CONTEXT = {
  disabled: false,
  selected: '',
};
const MOCK_CHANGE_CONTENT_PANEL = vi.fn();

const baseProps = {
  id: MOCK_ID,
  panelId: MOCK_PANEL_ID,
  label: MOCK_LABEL,
};
const baseSlots = { default: MOCK_DEFAULT_SLOT };
const baseProvide = {
  setFocus: vi.fn(),
  groupContext: MOCK_GROUP_CONTEXT,
  changeContentPanel: MOCK_CHANGE_CONTENT_PANEL,
};

let mockProps = {};
let mockSlots = {};
let mockProvide = {};
const testContext = {};

describe('DtTab Tests', () => {
  let wrapper;
  let tab;

  const updateWrapper = () => {
    wrapper = mount(DtTab, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      provide: { ...baseProvide, ...mockProvide },
      localVue: testContext.localVue,
    });

    tab = wrapper.find('[data-qa="dt-tab"]');
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

    it('should have default class', () => {
      expect(tab.classes('d-tab')).toBe(true);
    });

    it('should render the slot', () => {
      expect(tab.text()).toBe(MOCK_DEFAULT_SLOT);
    });

    describe('Selected by default', () => {
      it('changeContentPanel should be called with valid data', () => {
        mockProps = { selected: true };

        updateWrapper();

        expect(MOCK_CHANGE_CONTENT_PANEL).toHaveBeenCalledWith({
          selected: baseProps.panelId,
          selectOverride: true,
        });
      });
    });

    describe('Attributes', () => {
      it('id should match the provided id', () => {
        expect(tab.attributes('id')).toBe(`dt-tab-${MOCK_ID}`);
      });

      it('tabindex should be -1', () => {
        expect(tab.attributes('tabindex')).toBe('-1');
      });

      it('should not be disabled', () => {
        expect(tab.attributes('disabled')).toBeUndefined();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Selected state', () => {
      it('tab classes should content selected class', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID } };

        updateWrapper();

        expect(tab.classes(TAB_IMPORTANCE_MODIFIERS.selected)).toBe(true);
      });
    });

    describe('Unselected state', () => {
      it('tab classes should not content selected class', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '' } };

        updateWrapper();

        expect(tab.classes(TAB_IMPORTANCE_MODIFIERS.selected)).toBe(false);
      });
    });

    describe('Disabled state', () => {
      describe('Disabled by inject', () => {
        it('should be disabled', () => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, disabled: true } };

          updateWrapper();

          expect(tab.attributes('disabled')).toBeTruthy();
        });
      });

      describe('Disabled by prop', () => {
        it('disabled attribute should be "true"', () => {
          mockProps = { disabled: true };

          updateWrapper();

          expect(tab.attributes('disabled')).toBeTruthy();
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('Default A11y Attrs', () => {
      it('aria-selected should be "false"', () => {
        expect(tab.attributes('aria-selected')).toBe('false');
      });

      it('aria-controls should content the panel id', () => {
        expect(tab.attributes('aria-controls')).toBe(`dt-panel-${MOCK_PANEL_ID}`);
      });

      it('aria-label should match the provided label', () => {
        expect(tab.attributes('aria-label')).toBe(MOCK_LABEL);
      });

      it('role should be tab', () => {
        expect(tab.attributes('role')).toBe('tab');
      });
    });

    describe('When panel is selected', () => {
      beforeEach(() => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID } };

        updateWrapper();
      });

      it('aria-selected should be "true"', () => {
        expect(tab.attributes('aria-selected')).toBe('true');
      });

      it('tabindex should be 0', () => {
        expect(tab.attributes('tabindex')).toBe('0');
      });
    });

    describe('When panel is unselected', () => {
      beforeEach(() => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '' } };

        updateWrapper();
      });

      it('aria-selected should be "false"', () => {
        expect(tab.attributes('aria-selected')).toBe('false');
      });

      it('tabindex should be -1', () => {
        expect(tab.attributes('tabindex')).toBe('-1');
      });
    });
  });
});
