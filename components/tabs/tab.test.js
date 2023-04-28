import { mount } from '@vue/test-utils';
import DtTab from './tab.vue';
import { TAB_IMPORTANCE_MODIFIERS } from './tabs_constants.js';

describe('DtTab Tests', () => {
  // Wrappers
  let wrapper;
  let tab;
  const panelId = '2';
  const label = 'area-label';
  const id = '1';
  const defaultSlot = 'Message Slot';

  const slots = { default: defaultSlot };
  const groupContext = {
    disabled: false,
    selected: '',
  };
  const props = {
    id,
    panelId,
    label,
  };
  const _setWrappers = () => {
    tab = wrapper.find('[data-qa="dt-tab"]');
  };
  const changeContentPanel = jest.fn();
  const _mountWrapper = () => {
    wrapper = mount(DtTab, {
      slots,
      props,
      global: {
        provide: {
          setFocus: jest.fn(),
          groupContext,
          changeContentPanel,
        },
      },
    });
    _setWrappers();
  };

  describe('Presentation Tests', () => {
    // Setup
    _mountWrapper();

    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should have default class', () => {
      expect(tab.classes('d-tab')).toBe(true);
    });

    it('should render the slot', () => {
      expect(tab.text()).toBe(defaultSlot);
    });

    describe('Selected by default', () => {
      beforeEach(() => {
        props.selected = true;
        _mountWrapper();
      });

      it('changeContentPanel should be called with valid data', () => {
        expect(changeContentPanel).toHaveBeenCalledWith({
          selected: props.panelId,
          selectOverride: true,
        });
      });
    });

    describe('Attributes', () => {
      it('id should match the provided id', () => {
        expect(tab.attributes('id')).toBe(`dt-tab-${id}`);
      });

      it('tabindex should be -1 ', () => {
        expect(tab.attributes('tabindex')).toBe('-1');
      });

      it('should not be disabled', () => {
        expect(tab.attributes('disabled')).toBe(undefined);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Selected state', () => {
      beforeEach(() => {
        groupContext.selected = panelId;
        _mountWrapper();
      });

      it('tab classes should content selected class', () => {
        expect(tab.classes(TAB_IMPORTANCE_MODIFIERS.selected)).toBe(true);
      });
    });

    describe('Unselected state', () => {
      beforeEach(() => {
        groupContext.selected = '';
        _mountWrapper();
      });

      it('tab classes should not content selected class', () => {
        expect(tab.classes(TAB_IMPORTANCE_MODIFIERS.selected)).toBe(false);
      });
    });

    describe('Disabled state', () => {
      beforeEach(() => {
        _mountWrapper();
      });

      describe('Disabled by inject', () => {
        beforeAll(() => {
          groupContext.disabled = true;
        });

        afterAll(() => {
          groupContext.disabled = false;
        });

        it('should be disabled', () => {
          expect(tab.attributes('disabled')).toBe('');
        });
      });

      describe('Disabled by prop', () => {
        beforeAll(() => {
          props.disabled = true;
        });

        it('disabled attribute should be "true"', () => {
          expect(tab.attributes('disabled')).toBe('');
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
        expect(tab.attributes('aria-controls')).toBe(`dt-panel-${panelId}`);
      });

      it('aria-label should match the provided label', () => {
        expect(tab.attributes('aria-label')).toBe(label);
      });

      it('role should be tab', () => {
        expect(tab.attributes('role')).toBe('tab');
      });
    });

    describe('When panel is selected', () => {
      beforeEach(() => {
        groupContext.selected = panelId;
        _mountWrapper();
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
        groupContext.selected = '';
        _mountWrapper();
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
