import { mount } from '@vue/test-utils';
import DtTab from './tab.vue';

const MOCK_PANEL_ID = '2';
const MOCK_LABEL = 'area-label';
const MOCK_ID = '1';
const MOCK_DEFAULT_SLOT = 'Message Slot';
const MOCK_GROUP_CONTEXT = {
  disabled: false,
  selected: '',
};

const baseProps = {
  id: MOCK_ID,
  panelId: MOCK_PANEL_ID,
  label: MOCK_LABEL,
};
const baseSlots = { default: MOCK_DEFAULT_SLOT };
const baseProvide = {
  setFocus: vi.fn(),
};

let mockProps = {};
let mockSlots = {};
let mockProvide = {};

describe('DtTab Tests', () => {
  let wrapper;
  let tab;

  const updateWrapper = () => {
    baseProvide.groupContext = { ...MOCK_GROUP_CONTEXT };

    wrapper = mount(DtTab, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        provide: { ...baseProvide, ...mockProvide },
      },
    });

    tab = wrapper.find('[data-qa="dt-tab"]');
  };

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

    it('should render the slot', () => {
      expect(tab.text()).toBe(MOCK_DEFAULT_SLOT);
    });

    describe('Selected Tab by default', () => {
      it('Group context should have set selected tab', () => {
        mockProps = { selected: true };

        updateWrapper();

        expect(baseProvide.groupContext.selected).toBe(baseProps.panelId);
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

  describe('Button styling', () => {
    let button;

    describe('When kind is default', () => {
      describe('When selected', () => {
        beforeEach(() => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID, kind: 'default' } };
          updateWrapper();
          button = wrapper.findComponent({ name: 'DtButton' });
        });

        it('should set kind to default', () => {
          expect(button.props('kind')).toBe('default');
        });

        it('should set importance to clear', () => {
          expect(button.props('importance')).toBe('clear');
        });

        it('should not set active', () => {
          expect(button.props('active')).toBe(false);
        });
      });

      describe('When unselected', () => {
        beforeEach(() => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '', kind: 'default' } };
          updateWrapper();
          button = wrapper.findComponent({ name: 'DtButton' });
        });

        it('should set kind to muted', () => {
          expect(button.props('kind')).toBe('muted');
        });

        it('should set importance to clear', () => {
          expect(button.props('importance')).toBe('clear');
        });
      });
    });

    describe('When kind is muted', () => {
      describe('When selected', () => {
        beforeEach(() => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID, kind: 'muted' } };
          updateWrapper();
          button = wrapper.findComponent({ name: 'DtButton' });
        });

        it('should set kind to muted', () => {
          expect(button.props('kind')).toBe('muted');
        });

        it('should set active', () => {
          expect(button.props('active')).toBe(true);
        });
      });

      describe('When unselected', () => {
        beforeEach(() => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '', kind: 'muted' } };
          updateWrapper();
          button = wrapper.findComponent({ name: 'DtButton' });
        });

        it('should set kind to muted', () => {
          expect(button.props('kind')).toBe('muted');
        });

        it('should not set active', () => {
          expect(button.props('active')).toBe(false);
        });
      });
    });

    describe('When outlined', () => {
      describe('When selected', () => {
        beforeEach(() => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID, kind: 'default', outlined: true } };
          updateWrapper();
          button = wrapper.findComponent({ name: 'DtButton' });
        });

        it('should set importance to outlined', () => {
          expect(button.props('importance')).toBe('outlined');
        });

        it('should not set active', () => {
          expect(button.props('active')).toBe(false);
        });
      });

      describe('When unselected', () => {
        beforeEach(() => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '', kind: 'default', outlined: true } };
          updateWrapper();
          button = wrapper.findComponent({ name: 'DtButton' });
        });

        it('should not mute the kind', () => {
          expect(button.props('kind')).toBe('default');
        });

        it('should set importance to clear', () => {
          expect(button.props('importance')).toBe('clear');
        });
      });

      it('should preserve muted kind when group kind is muted', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '', kind: 'muted', outlined: true } };
        updateWrapper();

        expect(wrapper.findComponent({ name: 'DtButton' }).props('kind')).toBe('muted');
      });
    });

    describe('d-tab--is-selected class', () => {
      it('should be present when default kind, not outlined, and selected', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID, kind: 'default' } };
        updateWrapper();

        expect(tab.classes()).toContain('d-tab--is-selected');
      });

      it('should not be present when unselected', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: '', kind: 'default' } };
        updateWrapper();

        expect(tab.classes()).not.toContain('d-tab--is-selected');
      });

      it('should not be present when outlined', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID, kind: 'default', outlined: true } };
        updateWrapper();

        expect(tab.classes()).not.toContain('d-tab--is-selected');
      });

      it('should not be present when kind is muted', () => {
        mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, selected: MOCK_PANEL_ID, kind: 'muted' } };
        updateWrapper();

        expect(tab.classes()).not.toContain('d-tab--is-selected');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Disabled state', () => {
      describe('Disabled by inject', () => {
        beforeEach(() => {
          mockProvide = { groupContext: { ...MOCK_GROUP_CONTEXT, disabled: true } };
          updateWrapper();
        });

        it('should have aria-disabled="true"', () => {
          expect(tab.attributes('aria-disabled')).toBe('true');
        });

        it('should have d-btn--disabled class', () => {
          expect(tab.classes()).toContain('d-btn--disabled');
        });

        it('should not have native disabled attribute', () => {
          expect(tab.attributes('disabled')).toBeUndefined();
        });
      });

      describe('Disabled by prop', () => {
        beforeEach(() => {
          mockProps = { disabled: true };
          updateWrapper();
        });

        it('should have aria-disabled="true"', () => {
          expect(tab.attributes('aria-disabled')).toBe('true');
        });

        it('should have d-btn--disabled class', () => {
          expect(tab.classes()).toContain('d-btn--disabled');
        });

        it('should not have native disabled attribute', () => {
          expect(tab.attributes('disabled')).toBeUndefined();
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When leadingClass is provided', () => {
      it('should apply custom class to the leading wrapper', () => {
        mockProps = { leadingClass: 'custom-leading' };
        mockSlots = { leading: 'Leading content' };

        updateWrapper();

        const leading = tab.find('.d-btn__leading');

        expect(leading.exists()).toBe(true);
        expect(leading.classes()).toContain('custom-leading');
      });
    });

    describe('When trailingClass is provided', () => {
      it('should apply custom class to the trailing wrapper', () => {
        mockProps = { trailingClass: 'custom-trailing' };
        mockSlots = { trailing: 'Trailing content' };

        updateWrapper();

        const trailing = tab.find('.d-btn__trailing');

        expect(trailing.exists()).toBe(true);
        expect(trailing.classes()).toContain('custom-trailing');
      });
    });

    describe('When leading slot is provided', () => {
      it('should render leading content through to tab button', () => {
        mockSlots = { leading: '<span data-qa="test-leading">L</span>' };

        updateWrapper();

        expect(tab.find('[data-qa="test-leading"]').exists()).toBe(true);
      });
    });

    describe('When trailing slot is provided', () => {
      it('should render trailing content through to tab button', () => {
        mockSlots = { trailing: '<span data-qa="test-trailing">T</span>' };

        updateWrapper();

        expect(tab.find('[data-qa="test-trailing"]').exists()).toBe(true);
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
