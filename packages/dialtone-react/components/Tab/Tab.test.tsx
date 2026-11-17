import { render, screen } from '@testing-library/react';
import { DtTab, type DtTabProps } from './Tab';
import { DEFAULT_TAB_GROUP_STATE, TabGroupContext, type TabGroupState } from './TabGroupContext';

const MOCK_PANEL_ID = '2';
const MOCK_LABEL = 'area-label';
const MOCK_ID = '1';
const MOCK_DEFAULT_SLOT = 'Message Slot';
const MOCK_GROUP_CONTEXT: TabGroupState = {
  ...DEFAULT_TAB_GROUP_STATE,
  disabled: false,
  selected: '',
  focusedTabId: null,
};

const baseProps: DtTabProps = {
  id: MOCK_ID,
  panelId: MOCK_PANEL_ID,
  label: MOCK_LABEL,
  children: MOCK_DEFAULT_SLOT,
};

let mockProps: Partial<DtTabProps> = {};
let mockGroupContext: Partial<TabGroupState> = {};

describe('DtTab Tests', () => {
  let unmount: (() => void) | null = null;
  let tab: HTMLElement;
  let setFocus: ReturnType<typeof vi.fn>;
  let setSelected: ReturnType<typeof vi.fn>;

  // Remounts, as Vue's mount does. Vue's test provides `groupContext` and `setFocus`; here they go through the context.
  const updateWrapper = () => {
    unmount?.();
    setFocus = vi.fn();
    setSelected = vi.fn();
    const groupContext = { ...MOCK_GROUP_CONTEXT, ...mockGroupContext };
    ({ unmount } = render(
      <TabGroupContext.Provider value={{ groupContext, setFocus, setSelected }}>
        <DtTab {...baseProps} {...mockProps} />
      </TabGroupContext.Provider>,
    ));

    tab = screen.getByTestId('dt-tab');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockGroupContext = {};
    unmount = null;
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(tab).toBeInTheDocument();
    });

    it('should render the slot', () => {
      expect(tab).toHaveTextContent(new RegExp(`^${MOCK_DEFAULT_SLOT}$`));
    });

    describe('Selected Tab by default', () => {
      it('Group context should have set selected tab', () => {
        mockProps = { selected: true };

        updateWrapper();

        expect(setSelected).toHaveBeenCalledWith(baseProps.panelId);
      });
    });

    describe('Attributes', () => {
      it('id should match the provided id', () => {
        expect(tab).toHaveAttribute('id', `dt-tab-${MOCK_ID}`);
      });

      it('tabindex should be -1', () => {
        expect(tab).toHaveAttribute('tabindex', '-1');
      });

      it('should not be disabled', () => {
        expect(tab).not.toHaveAttribute('disabled');
      });
    });
  });

  // Vue reads DtButton's props; here the classes DtButton renders for them: `kind` muted is d-btn--muted (default
  // adds none), `importance` outlined is d-btn--outlined (clear adds none), and `active` is d-btn--active.
  describe('Button styling', () => {
    describe('When kind is default', () => {
      describe('When selected', () => {
        beforeEach(() => {
          mockGroupContext = { selected: MOCK_PANEL_ID, kind: 'default' };
          updateWrapper();
        });

        it('should set kind to default', () => {
          expect(tab).toHaveClass('d-btn');
          expect(tab).not.toHaveClass('d-btn--muted');
        });

        it('should set importance to clear', () => {
          expect(tab).not.toHaveClass('d-btn--outlined');
          expect(tab).not.toHaveClass('d-btn--primary');
        });

        it('should not set active', () => {
          expect(tab).not.toHaveClass('d-btn--active');
        });
      });

      describe('When unselected', () => {
        beforeEach(() => {
          mockGroupContext = { selected: '', kind: 'default' };
          updateWrapper();
        });

        it('should set kind to muted', () => {
          expect(tab).toHaveClass('d-btn--muted');
        });

        it('should set importance to clear', () => {
          expect(tab).not.toHaveClass('d-btn--outlined');
          expect(tab).not.toHaveClass('d-btn--primary');
        });
      });
    });

    describe('When kind is muted', () => {
      describe('When selected', () => {
        beforeEach(() => {
          mockGroupContext = { selected: MOCK_PANEL_ID, kind: 'muted' };
          updateWrapper();
        });

        it('should set kind to muted', () => {
          expect(tab).toHaveClass('d-btn--muted');
        });

        it('should set active', () => {
          expect(tab).toHaveClass('d-btn--active');
        });
      });

      describe('When unselected', () => {
        beforeEach(() => {
          mockGroupContext = { selected: '', kind: 'muted' };
          updateWrapper();
        });

        it('should set kind to muted', () => {
          expect(tab).toHaveClass('d-btn--muted');
        });

        it('should not set active', () => {
          expect(tab).not.toHaveClass('d-btn--active');
        });
      });
    });

    describe('When outlined', () => {
      describe('When selected', () => {
        beforeEach(() => {
          mockGroupContext = { selected: MOCK_PANEL_ID, kind: 'default', outlined: true };
          updateWrapper();
        });

        it('should set importance to outlined', () => {
          expect(tab).toHaveClass('d-btn--outlined');
        });

        it('should not set active', () => {
          expect(tab).not.toHaveClass('d-btn--active');
        });
      });

      describe('When unselected', () => {
        beforeEach(() => {
          mockGroupContext = { selected: '', kind: 'default', outlined: true };
          updateWrapper();
        });

        it('should not mute the kind', () => {
          expect(tab).toHaveClass('d-btn');
          expect(tab).not.toHaveClass('d-btn--muted');
        });

        it('should set importance to clear', () => {
          expect(tab).not.toHaveClass('d-btn--outlined');
          expect(tab).not.toHaveClass('d-btn--primary');
        });
      });

      it('should preserve muted kind when group kind is muted', () => {
        mockGroupContext = { selected: '', kind: 'muted', outlined: true };
        updateWrapper();

        expect(tab).toHaveClass('d-btn--muted');
      });
    });

    describe('d-tab--is-selected class', () => {
      it('should be present when default kind, not outlined, and selected', () => {
        mockGroupContext = { selected: MOCK_PANEL_ID, kind: 'default' };
        updateWrapper();

        expect(tab).toHaveClass('d-tab--is-selected');
      });

      it('should not be present when unselected', () => {
        mockGroupContext = { selected: '', kind: 'default' };
        updateWrapper();

        expect(tab).not.toHaveClass('d-tab--is-selected');
      });

      it('should not be present when outlined', () => {
        mockGroupContext = { selected: MOCK_PANEL_ID, kind: 'default', outlined: true };
        updateWrapper();

        expect(tab).not.toHaveClass('d-tab--is-selected');
      });

      it('should not be present when kind is muted', () => {
        mockGroupContext = { selected: MOCK_PANEL_ID, kind: 'muted' };
        updateWrapper();

        expect(tab).not.toHaveClass('d-tab--is-selected');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Disabled state', () => {
      describe('Disabled by inject', () => {
        beforeEach(() => {
          mockGroupContext = { disabled: true };
          updateWrapper();
        });

        it('should have aria-disabled="true"', () => {
          expect(tab).toHaveAttribute('aria-disabled', 'true');
        });

        it('should have d-btn--disabled class', () => {
          expect(tab).toHaveClass('d-btn--disabled');
        });

        it('should not have native disabled attribute', () => {
          expect(tab).not.toHaveAttribute('disabled');
        });
      });

      describe('Disabled by prop', () => {
        beforeEach(() => {
          mockProps = { disabled: true };
          updateWrapper();
        });

        it('should have aria-disabled="true"', () => {
          expect(tab).toHaveAttribute('aria-disabled', 'true');
        });

        it('should have d-btn--disabled class', () => {
          expect(tab).toHaveClass('d-btn--disabled');
        });

        it('should not have native disabled attribute', () => {
          expect(tab).not.toHaveAttribute('disabled');
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When leadingClass is provided', () => {
      it('should apply custom class to the leading wrapper', () => {
        mockProps = { leadingClass: 'custom-leading', leading: 'Leading content' };

        updateWrapper();

        const leading = tab.querySelector('.d-btn__leading');

        expect(leading).toBeInTheDocument();
        expect(leading).toHaveClass('custom-leading');
      });
    });

    describe('When trailingClass is provided', () => {
      it('should apply custom class to the trailing wrapper', () => {
        mockProps = { trailingClass: 'custom-trailing', trailing: 'Trailing content' };

        updateWrapper();

        const trailing = tab.querySelector('.d-btn__trailing');

        expect(trailing).toBeInTheDocument();
        expect(trailing).toHaveClass('custom-trailing');
      });
    });

    it.each([
      ['leading', 'test-leading'],
      ['trailing', 'test-trailing'],
      ['startIcon', 'test-start-icon'],
      ['endIcon', 'test-end-icon'],
    ])('should render #%s slot through to tab button', (slotName, dataQa) => {
      mockProps = { [slotName]: <span data-qa={dataQa}>X</span> } as Partial<DtTabProps>;

      updateWrapper();

      expect(tab.querySelector(`[data-qa="${dataQa}"]`)).toBeInTheDocument();
    });

    // The deprecated `icon` slot isn't ported (conventions › Deprecated API); see skips.json.
    it.skip('should render deprecated #icon through to DtButton start-icon slot', () => {
      expect(tab).toBeInTheDocument();
    });

    it.skip('should prefer #startIcon over deprecated #icon when both provided', () => {
      expect(tab).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    describe('Default A11y Attrs', () => {
      it('aria-selected should be "false"', () => {
        expect(tab).toHaveAttribute('aria-selected', 'false');
      });

      it('aria-controls should content the panel id', () => {
        expect(tab).toHaveAttribute('aria-controls', `dt-panel-${MOCK_PANEL_ID}`);
      });

      it('aria-label should match the provided label', () => {
        expect(tab).toHaveAttribute('aria-label', MOCK_LABEL);
      });

      it('role should be tab', () => {
        expect(tab).toHaveAttribute('role', 'tab');
      });
    });

    describe('When panel is selected', () => {
      beforeEach(() => {
        mockGroupContext = { selected: MOCK_PANEL_ID };

        updateWrapper();
      });

      it('aria-selected should be "true"', () => {
        expect(tab).toHaveAttribute('aria-selected', 'true');
      });

      it('tabindex should be 0', () => {
        expect(tab).toHaveAttribute('tabindex', '0');
      });
    });

    describe('When panel is unselected', () => {
      beforeEach(() => {
        mockGroupContext = { selected: '' };

        updateWrapper();
      });

      it('aria-selected should be "false"', () => {
        expect(tab).toHaveAttribute('aria-selected', 'false');
      });

      it('tabindex should be -1', () => {
        expect(tab).toHaveAttribute('tabindex', '-1');
      });
    });

    describe('Roving tabindex', () => {
      describe('When focusedTabId matches this tab', () => {
        beforeEach(() => {
          mockGroupContext = { selected: '', focusedTabId: MOCK_ID };

          updateWrapper();
        });

        it('tabindex should be 0', () => {
          expect(tab).toHaveAttribute('tabindex', '0');
        });

        it('aria-selected should still be "false"', () => {
          expect(tab).toHaveAttribute('aria-selected', 'false');
        });
      });

      describe('When focusedTabId is a different tab', () => {
        beforeEach(() => {
          mockGroupContext = { selected: MOCK_PANEL_ID, focusedTabId: 'other-tab' };

          updateWrapper();
        });

        it('tabindex should be -1 even when selected', () => {
          expect(tab).toHaveAttribute('tabindex', '-1');
        });

        it('aria-selected should still be "true"', () => {
          expect(tab).toHaveAttribute('aria-selected', 'true');
        });
      });

      describe('When focusedTabId is null', () => {
        beforeEach(() => {
          mockGroupContext = { selected: MOCK_PANEL_ID, focusedTabId: null };

          updateWrapper();
        });

        it('tabindex should fall back to selected tab', () => {
          expect(tab).toHaveAttribute('tabindex', '0');
        });
      });
    });
  });

  // React-only: what Vue's `tabListeners` and beforeUnmount do with the injected `setFocus`.
  describe('Focus tracking', () => {
    it('should report its id to the group on focus, then call onFocus', () => {
      const onFocus = vi.fn();
      mockProps = { onFocus };
      updateWrapper();

      tab.focus();

      expect(setFocus).toHaveBeenCalledWith(MOCK_ID);
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should clear the group\'s focused tab when it unmounts while focused', () => {
      mockGroupContext = { focusedTabId: MOCK_ID };
      updateWrapper();

      unmount?.();
      unmount = null;

      expect(setFocus).toHaveBeenCalledWith(null);
    });
  });
});
