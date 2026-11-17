import { act, render, screen } from '@testing-library/react';
import { DtTabPanel, type DtTabPanelProps } from './TabPanel';
import { DEFAULT_TAB_GROUP_STATE, TabGroupContext, type TabGroupState } from './TabGroupContext';

const MOCK_DEFAULT_SLOT = 'Panel Slot';
const MOCK_GROUP_CONTEXT: TabGroupState = {
  ...DEFAULT_TAB_GROUP_STATE,
  disabled: false,
  selected: '',
};

const baseProps: DtTabPanelProps = {
  id: '1',
  tabId: '2',
};

let mockProps: Partial<DtTabPanelProps> = {};
let mockChildren: DtTabPanelProps['children'] = MOCK_DEFAULT_SLOT;
let mockGroupContext: Partial<TabGroupState> = {};

describe('DtTabPanel Tests', () => {
  let unmount: (() => void) | null = null;
  let tabPanel: HTMLElement;

  // Remounts, as Vue's mount does. Vue's test provides `groupContext`; here it goes through the context.
  const updateWrapper = async () => {
    unmount?.();
    const groupContext = { ...MOCK_GROUP_CONTEXT, ...mockGroupContext };
    ({ unmount } = render(
      <TabGroupContext.Provider value={{ groupContext, setFocus: () => {}, setSelected: () => {} }}>
        <DtTabPanel {...baseProps} {...mockProps}>{mockChildren}</DtTabPanel>
      </TabGroupContext.Provider>,
    ));
    // The panel looks for its first focusable element after mounting, asynchronously, as Vue's mounted() does.
    await act(async () => {});

    tabPanel = screen.getByTestId('dt-tab-panel');
  };

  beforeEach(async () => {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockChildren = MOCK_DEFAULT_SLOT;
    mockGroupContext = {};
    unmount = null;
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(tabPanel).toBeInTheDocument();
    });

    it('should render the default slot', () => {
      expect(tabPanel).toHaveTextContent(new RegExp(`^${MOCK_DEFAULT_SLOT}$`));
    });

    describe('Attributes', () => {
      it('id attribute should be content the prop id', () => {
        expect(tabPanel).toHaveAttribute('id', `dt-panel-${baseProps.id}`);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Selected state', () => {
      it('default slot should be shown', async () => {
        mockGroupContext = { selected: baseProps.id };

        await updateWrapper();

        expect(tabPanel).toHaveTextContent(new RegExp(`^${MOCK_DEFAULT_SLOT}$`));
        expect(tabPanel).toBeVisible();
      });
    });

    describe('Hidden state', () => {
      describe('Hidden by prop', () => {
        it('aria-hidden should be "true"', async () => {
          mockGroupContext = { selected: baseProps.id };
          mockProps = { hidden: true };

          await updateWrapper();

          expect(tabPanel).toHaveAttribute('aria-hidden', 'true');
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('Unselected aria-hidden', () => {
      it('aria-hidden should be "false"', async () => {
        mockGroupContext = { selected: baseProps.id };

        await updateWrapper();

        expect(tabPanel).toHaveAttribute('aria-hidden', 'false');
      });
    });

    describe('Default A11y Attrs', () => {
      beforeEach(async () => {
        mockGroupContext = { selected: '' };

        await updateWrapper();
      });

      it('aria-hidden should be "true"', () => {
        expect(tabPanel).toHaveAttribute('aria-hidden', 'true');
      });

      it('aria-labelledby should be match the tab id', () => {
        expect(tabPanel).toHaveAttribute('aria-labelledby', `dt-tab-${baseProps.tabId}`);
      });

      it('role should be "tabpanel"', () => {
        expect(tabPanel).toHaveAttribute('role', 'tabpanel');
      });

      it('tabindex should be "0" if the first element is not focusable', () => {
        expect(tabPanel).toHaveAttribute('tabindex', '0');
      });
    });
  });

  // React-only: the panel's tabindex once its content is known (Vue's mounted()).
  describe('First focusable element', () => {
    it('tabindex should be "-1" when the first element is focusable', async () => {
      mockGroupContext = { selected: baseProps.id };
      mockChildren = <button type="button">Action</button>;

      await updateWrapper();

      expect(tabPanel).toHaveAttribute('tabindex', '-1');
    });

    it('tabindex should be "0" when the first focusable element comes after other content', async () => {
      mockGroupContext = { selected: baseProps.id };
      mockChildren = (
        <>
          <p>Intro</p>
          <button type="button">Action</button>
        </>
      );

      await updateWrapper();

      expect(tabPanel).toHaveAttribute('tabindex', '0');
    });

    it('should hide the panel with display: none when it is not selected', () => {
      expect(tabPanel).toHaveStyle({ display: 'none' });
    });
  });
});
