import { mount } from '@vue/test-utils';
import DtTabPanel from './tab_panel.vue';

describe('DtTabPanel Tests', () => {
  // Wrappers
  let wrapper;
  let tabPanel;
  const defaultSlot = 'Panel Slot';

  const groupContext = {
    disabled: false,
    selected: '',
  };
  const propsData = {
    id: '1',
    tabId: '2',
  };
  const _setWrappers = () => {
    tabPanel = wrapper.find('[data-qa="dt-tab-panel"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtTabPanel, {
      slots: {
        default: defaultSlot,
      },
      propsData,
      global: {
        provide: {
          groupContext,
        },
      },
    });

    _setWrappers();
  };

  describe('Presentation Tests', () => {
    // Setup
    beforeEach(() => {
      _mountWrapper();
    });

    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the default slot', () => {
      expect(tabPanel.text()).toBe(defaultSlot);
    });

    describe('Attributes', () => {
      it('id attribute should be content the prop id', () => {
        expect(tabPanel.attributes('id')).toBe(`dt-panel-${propsData.id}`);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Selected state', () => {
      beforeEach(() => {
        groupContext.selected = propsData.id;
        _mountWrapper();
      });

      it('default slot should be shown', () => {
        expect(tabPanel.text()).toBe(defaultSlot);
      });
    });

    describe('Hidden state', () => {
      beforeEach(() => {
        groupContext.selected = propsData.id;
        _mountWrapper();
      });

      describe('Hidden by prop', () => {
        beforeAll(() => {
          propsData.hidden = true;
        });

        afterAll(() => {
          propsData.hidden = false;
        });

        it('aria-hidden should be "true"', () => {
          expect(tabPanel.attributes('aria-hidden')).toBe('true');
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('Unselected aria-hidden', () => {
      beforeEach(() => {
        groupContext.selected = propsData.id;
        _mountWrapper();
      });

      it('aria-hidden should be "false"', () => {
        expect(tabPanel.attributes('aria-hidden')).toBe('false');
      });
    });

    describe('Default A11y Attrs', () => {
      beforeEach(() => {
        groupContext.selected = '';
        _mountWrapper();
      });

      it('aria-hidden should be "true"', () => {
        expect(tabPanel.attributes('aria-hidden')).toBe('true');
      });

      it('aria-labelledby should be match the tab id', () => {
        expect(tabPanel.attributes('aria-labelledby')).toBe(`dt-tab-${propsData.tabId}`);
      });

      it('role should be "tabpanel"', () => {
        expect(tabPanel.attributes('role')).toBe('tabpanel');
      });

      it(
        'tabindex should be "0" if the first element is not focusable',
        () => {
          expect(tabPanel.attributes('tabindex')).toBe('0');
        },
      );
    });

    // todo: fix these
    // describe('When the first element is focusable', () => {
    //   beforeEach(() => {
    //     slots.default = '<div><button>Focusable Slot</button></div>';
    //     _mountWrapper();
    //   });

    //   it('tabindex should be "-1"', () => {
    //     expect(tabPanel.attributes('tabindex')).toBe('-1');
    //   });
    // });

    // describe(`When there is a focusable element but it isn't the first element`, () => {
    //   beforeEach(() => {
    //     slots = { default: '<h1>Content</h1><div><button>Focusable Slot</button></div>' };
    //     _mountWrapper();
    //   });

    //   it('tabindex should be "0"', () => {
    //     expect(tabPanel.attributes('tabindex')).toBe('0');
    //   });
    // });
  });
});
