import { act, cleanup, fireEvent, render, type RenderResult } from '@testing-library/react';
import { DtIconSend } from '../../icons';
import { withRouterLink } from '../../tests/helpers/link';
import { TOOLTIP_DELAY_MS } from '../Tooltip/TooltipConstants';
import { DtSplitButton, type DtSplitButtonProps } from './SplitButton';

const MOCK_START_BUTTON_STUB = vi.fn();
const MOCK_END_BUTTON_STUB = vi.fn();
const MOCK_START_TOOLTIP_TEXT = 'Start tooltip text';
const MOCK_END_TOOLTIP_TEXT = 'End tooltip text';
const MOCK_ROOT_CLASS = 'custom-class';

// Vue's emitted(): what the component emitted, whether or not anyone listened.
const MOCK_START_CLICKED = vi.fn();
const MOCK_END_CLICKED = vi.fn();

const baseProps: Partial<DtSplitButtonProps> = {
  endTooltipText: MOCK_END_TOOLTIP_TEXT,
};
const baseSlots: Partial<DtSplitButtonProps> = {
  children: 'Button text',
};
const baseAttrs: Partial<DtSplitButtonProps> = {};

let mockProps: Partial<DtSplitButtonProps> = {};
let mockSlots: Partial<DtSplitButtonProps> = {};
let mockAttrs: Partial<DtSplitButtonProps> = {};

// Vue Test Utils' attachTo: the component mounts in a new element inside the target.
const attachTo = (target: Element) => target.appendChild(document.createElement('div'));

// Vue's trigger(): dispatches the event and waits for the update.
const click = async (element: Element | null) => {
  await act(async () => { if (element) fireEvent.click(element); });
};

// The directive's tooltip waits TOOLTIP_DELAY_MS before it shows; Vue's skips the delay under test.
const hover = async (element: Element | null) => {
  if (element) fireEvent.mouseEnter(element);
  await act(() => new Promise<void>(resolve => { setTimeout(resolve, TOOLTIP_DELAY_MS + 50); }));
};

// Vue Test Utils' flushPromises: lets tippy's popper finish its promise-based first update.
const flushPromises = () => act(() => new Promise<void>(resolve => { setTimeout(resolve, 0); }));

const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

describe('DtSplitButton Tests', function () {
  let result: RenderResult | undefined;
  let wrapper: HTMLElement;
  let startButton: HTMLElement;
  let endButton: HTMLElement | null;
  let startIconSlot: HTMLElement | null;
  let endIconSlot: HTMLElement | null;

  const updateWrapper = () => {
    result?.unmount();
    result = render(
      withRouterLink(
        <DtSplitButton
          {...baseProps}
          {...mockProps}
          {...baseSlots}
          {...mockSlots}
          onStartClicked={MOCK_START_CLICKED}
          onEndClicked={MOCK_END_CLICKED}
          {...baseAttrs}
          {...mockAttrs}
        />,
      ),
      { container: attachTo(document.body) },
    );

    wrapper = result.container.querySelector<HTMLElement>('[data-qa="dt-split-button"]')!;
    startButton = wrapper.querySelector<HTMLElement>('[data-qa="dt-split-button-start"]')!;
    startIconSlot = startButton.querySelector('[data-qa="dt-button-icon"]');
    endButton = wrapper.querySelector('[data-qa="dt-split-button-end"]');
    endIconSlot = endButton?.querySelector('[data-qa="dt-button-icon"]') ?? null;
  };

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    globalThis.requestAnimationFrame = vi.fn();
    globalThis.cancelAnimationFrame = vi.fn();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    result?.unmount();
    result = undefined;
    cleanup();
    vi.restoreAllMocks();
    MOCK_START_BUTTON_STUB.mockClear();
    MOCK_END_BUTTON_STUB.mockClear();
    MOCK_START_CLICKED.mockClear();
    MOCK_END_CLICKED.mockClear();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the component', () => {
        expect(wrapper).toBeInTheDocument();
        expect(startButton).toBeInTheDocument();
        expect(endButton).toBeInTheDocument();
        expect(endIconSlot).toBeInTheDocument();
      });

      it('Should render primary by default', async () => {
        // Default (no props) button should be d-btn--primary
        expect(startButton).toHaveClass('d-btn--primary');
        expect(endButton).toHaveClass('d-btn--primary');
      });
    });

    describe('When kind is set to critical', () => {
      it('Should have critical class', async () => {
        mockProps = { kind: 'critical' };

        updateWrapper();

        expect(startButton).toHaveClass('d-btn--critical');
        expect(endButton).toHaveClass('d-btn--critical');
      });
    });

    describe('When importance is set to outlined', () => {
      it('Should have outlined class', async () => {
        mockProps = { importance: 'outlined' };

        updateWrapper();

        expect(startButton).toHaveClass('d-btn--outlined');
        expect(endButton).toHaveClass('d-btn--outlined');
      });
    });

    describe('When startLoading is set to true', () => {
      it('Should have loading class', async () => {
        mockProps = { startLoading: true };

        updateWrapper();

        expect(startButton).toHaveClass('d-btn--loading');
      });
    });

    describe('When startDisabled is set to true', () => {
      it('Should disable only the start button', async () => {
        mockProps = { startDisabled: true };

        updateWrapper();

        expect(startButton).toHaveAttribute('disabled');
        expect(endButton).not.toHaveAttribute('disabled');
      });
    });

    describe('When endDisabled is set to true', () => {
      it('Should disable only the end button', async () => {
        mockProps = { endDisabled: true };

        updateWrapper();

        expect(startButton).not.toHaveAttribute('disabled');
        expect(endButton).toHaveAttribute('disabled');
      });
    });

    describe('When disabled is set to true', () => {
      it('Should disable both buttons', async () => {
        mockProps = { disabled: true };

        updateWrapper();

        expect(startButton).toHaveAttribute('disabled');
        expect(endButton).toHaveAttribute('disabled');
      });
    });

    describe('When startActive is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { startActive: true };

        updateWrapper();

        expect(startButton).toHaveClass('d-btn--active');
      });
    });

    describe('When endActive is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { endActive: true };

        updateWrapper();

        expect(endButton).toHaveClass('d-btn--active');
      });
    });

    describe('When size is set to xl', () => {
      it('Class is set to the correct size', async () => {
        mockProps = { size: 'xl' };

        updateWrapper();

        expect(startButton).toHaveClass('d-btn--xl');
        expect(endButton).toHaveClass('d-btn--xl');
      });
    });

    describe('When startIcon slot is set', () => {
      beforeEach(() => {
        mockSlots = { startIcon: <DtIconSend /> };

        updateWrapper();
      });

      it('Should render the custom icon', () => {
        expect(startIconSlot?.querySelector('svg')).toHaveClass('d-icon--send');
      });

      it('Should render left by default', () => {
        expect(startIconSlot).toHaveClass('d-btn__icon--left');
      });

      describe('When startIconPosition is set to right', () => {
        it('Should have correct class', () => {
          mockProps = { startIconPosition: 'right' };

          updateWrapper();

          expect(startIconSlot).toHaveClass('d-btn__icon--right');
        });
      });
    });

    describe('When startIcon and startEndIcon slots are both set (dual icons)', () => {
      beforeEach(() => {
        mockSlots = { startIcon: <DtIconSend />, startEndIcon: <DtIconSend /> };

        updateWrapper();
      });

      it('Should render start icon in the start button at start position', () => {
        const startIconSlot = startButton.querySelector('[data-qa="dt-button-start-icon"]');

        expect(startIconSlot).toBeInTheDocument();
        expect(startIconSlot?.querySelector('.d-icon--send')).toBeInTheDocument();
      });

      it('Should render end icon in the start button at end position', () => {
        const endIconSlot = startButton.querySelector('[data-qa="dt-button-end-icon"]');

        expect(endIconSlot).toBeInTheDocument();
        expect(endIconSlot?.querySelector('.d-icon--send')).toBeInTheDocument();
      });
    });

    describe('When endIcon slot is set', () => {
      beforeEach(() => {
        mockSlots = { endIcon: <DtIconSend /> };

        updateWrapper();
      });

      it('should render the custom icon', () => {
        expect(endIconSlot?.querySelector('svg')).toHaveClass('d-icon--send');
      });
    });

    describe('When startTooltipText is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { startTooltipText: MOCK_START_TOOLTIP_TEXT };
        updateWrapper();
        await flushPromises();
        await hover(startButton);

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip?.textContent?.trim()).toBe(MOCK_START_TOOLTIP_TEXT);
      });
    });

    describe('When endTooltipText is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { endTooltipText: MOCK_END_TOOLTIP_TEXT };
        updateWrapper();
        await flushPromises();
        await hover(endButton);

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip?.textContent?.trim()).toBe(MOCK_END_TOOLTIP_TEXT);
      });
    });
  });

  describe('showDivider Tests', () => {
    describe('When showDivider is true (default)', () => {
      it('Should not have no-divider class', () => {
        expect(wrapper).not.toHaveClass('d-split-btn--no-divider');
      });
    });

    describe('When showDivider is false', () => {
      it('Should have no-divider class', () => {
        mockProps = { showDivider: false, importance: 'clear' };

        updateWrapper();

        expect(wrapper).toHaveClass('d-split-btn--no-divider');
      });
    });

    describe('When showDivider is false and importance is not clear', () => {
      it('Should warn about invalid combination', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { showDivider: false, importance: 'outlined' };

        updateWrapper();

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('show-divider prop set to false has no effect'),
        );
        warnSpy.mockRestore();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When start button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onStartClicked: MOCK_START_BUTTON_STUB };

        updateWrapper();

        await click(startButton);
      });

      it('Should call listener', async () => {
        expect(MOCK_START_BUTTON_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit start-clicked event', () => {
        expect(MOCK_START_BUTTON_STUB).toHaveBeenCalledWith();
      });

      it.skip('Should also emit deprecated alpha-clicked event', () => {
        expect(MOCK_START_BUTTON_STUB).toHaveBeenCalled();
      });
    });

    describe('When end button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onEndClicked: MOCK_END_BUTTON_STUB };

        updateWrapper();

        await click(endButton);
      });

      it('Should call listener', async () => {
        expect(MOCK_END_BUTTON_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit end-clicked event', () => {
        expect(MOCK_END_BUTTON_STUB).toHaveBeenCalledWith();
      });

      it.skip('Should also emit deprecated omega-clicked event', () => {
        expect(MOCK_END_BUTTON_STUB).toHaveBeenCalled();
      });
    });
  });

  // Every test here exercises deprecated API (the alpha/omega props, slots and events), which isn't ported.
  describe('Backward Compatibility Tests', () => {
    describe('When deprecated alphaActive prop is used', () => {
      it.skip('Should have active class', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When deprecated omegaActive prop is used', () => {
      it.skip('Should have active class', () => {
        expect(endButton).toBeInTheDocument();
      });
    });

    describe('When deprecated alphaLoading prop is used', () => {
      it.skip('Should have loading class', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When deprecated alphaDisabled prop is used', () => {
      it.skip('Should disable only the start button', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When deprecated omegaDisabled prop is used', () => {
      it.skip('Should disable only the end button', () => {
        expect(endButton).toBeInTheDocument();
      });
    });

    describe('When deprecated alphaIcon slot is used', () => {
      it.skip('Should render the custom icon', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When deprecated omegaIcon slot is used', () => {
      it.skip('Should render the custom icon', () => {
        expect(endButton).toBeInTheDocument();
      });
    });

    describe('When deprecated alphaTooltipText prop is used', () => {
      it.skip('Should pass the tooltip text to the alpha button', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When deprecated omegaTooltipText prop is used', () => {
      it.skip('Should pass the tooltip text to the omega button', () => {
        expect(endButton).toBeInTheDocument();
      });
    });

    describe('When deprecated alphaAriaLabel prop is used', () => {
      it.skip('Should pass the aria-label to the alpha button', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When deprecated omegaAriaLabel prop is used', () => {
      it.skip('Should pass the aria-label to the omega button', () => {
        expect(endButton).toBeInTheDocument();
      });
    });

    describe('When deprecated alphaIconPosition prop is used', () => {
      it.skip('Should position the icon correctly', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When deprecated alphaLabelClass prop is used', () => {
      it.skip('Should apply the label class', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When both startIcon and alphaIcon slots are provided', () => {
      it.skip('Should render startIcon (new name takes precedence)', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When both endIcon and omegaIcon slots are provided', () => {
      it.skip('Should render endIcon (new name takes precedence)', () => {
        expect(endButton).toBeInTheDocument();
      });
    });

    describe('When both end and omega slots are provided', () => {
      it.skip('Should render end slot (new name takes precedence)', () => {
        expect(wrapper).toBeInTheDocument();
      });
    });

    describe('When deprecated omega slot is used', () => {
      it.skip('Should render the omega slot content', () => {
        expect(wrapper).toBeInTheDocument();
      });
    });

    describe('When start button is clicked', () => {
      it.skip('Should emit deprecated alpha-clicked event', () => {
        expect(startButton).toBeInTheDocument();
      });
    });

    describe('When end button is clicked', () => {
      it.skip('Should emit deprecated omega-clicked event', () => {
        expect(endButton).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Tests', () => {
    describe('When startTo is provided', () => {
      it('Should forward to prop to the start DtButton', () => {
        mockProps = { startTo: '/some-route' };

        updateWrapper();

        expect(startButton).toHaveAttribute('data-to', '/some-route');
      });
    });

    describe('When startTo is an object', () => {
      it('Should forward the route object to the start DtButton', () => {
        const route = { name: 'home', params: { id: 1 } };
        mockProps = { startTo: route };

        updateWrapper();

        expect(JSON.parse(startButton.getAttribute('data-to')!)).toEqual(route);
      });
    });

    describe('When startHref is provided', () => {
      it('Should forward href prop to the start DtButton', () => {
        mockProps = { startHref: 'https://example.com' };

        updateWrapper();

        expect(startButton.tagName).toBe('A');
        expect(startButton).toHaveAttribute('href', 'https://example.com');
      });
    });

    describe('When startTarget and startRel are provided', () => {
      it('Should forward target and rel props to the start DtButton', () => {
        mockProps = {
          startHref: 'https://example.com',
          startTarget: '_blank',
          startRel: 'noopener noreferrer',
        };

        updateWrapper();

        expect(startButton).toHaveAttribute('target', '_blank');
        expect(startButton).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    describe('When startReplace is provided', () => {
      it('Should forward replace prop to the start DtButton', () => {
        mockProps = { startTo: '/some-route', startReplace: true };

        updateWrapper();

        expect(startButton).toHaveAttribute('data-replace', 'true');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When a class is provided', () => {
      it('applies the class only to the root', () => {
        mockAttrs = { className: MOCK_ROOT_CLASS };

        updateWrapper();

        expect(wrapper).toHaveClass(MOCK_ROOT_CLASS);
        expect(startButton).not.toHaveClass(MOCK_ROOT_CLASS);
        expect(endButton).not.toHaveClass(MOCK_ROOT_CLASS);
      });
    });

    it('applies each button class only to its button', () => {
      mockProps = {
        startButtonClass: 'custom-start',
        endButtonClass: 'custom-end',
      };

      updateWrapper();

      expect(startButton).toHaveClass('custom-start');
      expect(startButton).not.toHaveClass('custom-end');
      expect(endButton).toHaveClass('custom-end');
      expect(endButton).not.toHaveClass('custom-start');
      expect(wrapper).not.toHaveClass('custom-start');
      expect(wrapper).not.toHaveClass('custom-end');
    });

    describe('When startLeadingClass is provided', () => {
      it('should apply custom class to the leading wrapper', () => {
        mockProps = { startLeadingClass: 'custom-leading' };
        mockSlots = { leading: 'Leading content' };

        updateWrapper();

        const leading = startButton.querySelector('.d-btn__leading');

        expect(leading).toBeInTheDocument();
        expect(leading).toHaveClass('custom-leading');
      });
    });

    describe('When startTrailingClass is provided', () => {
      it('should apply custom class to the trailing wrapper', () => {
        mockProps = { startTrailingClass: 'custom-trailing' };
        mockSlots = { trailing: 'Trailing content' };

        updateWrapper();

        const trailing = startButton.querySelector('.d-btn__trailing');

        expect(trailing).toBeInTheDocument();
        expect(trailing).toHaveClass('custom-trailing');
      });
    });

    describe('When leading slot is provided', () => {
      it('should render leading content through to start button', () => {
        mockSlots = { leading: <span data-qa="test-leading">L</span> };

        updateWrapper();

        expect(startButton.querySelector('[data-qa="test-leading"]')).toBeInTheDocument();
      });
    });

    describe('When trailing slot is provided', () => {
      it('should render trailing content through to start button', () => {
        mockSlots = { trailing: <span data-qa="test-trailing">T</span> };

        updateWrapper();

        expect(startButton.querySelector('[data-qa="test-trailing"]')).toBeInTheDocument();
      });
    });
  });

  // React-only: what the skipped Backward Compatibility tests covered, through the API that is ported.
  describe('End slot and dropdown Tests', () => {
    describe('When end slot is provided', () => {
      it('Should render the end slot instead of the end button', () => {
        mockSlots = { end: <span data-qa="new-end">New end</span> };

        updateWrapper();

        expect(wrapper.querySelector('[data-qa="new-end"]')).toHaveTextContent('New end');
        expect(wrapper.querySelector('[data-qa="dt-split-button-end"]')).not.toBeInTheDocument();
      });
    });

    describe('When the startIcon slot is a render prop', () => {
      it('Should pass the icon size for the button size', () => {
        const startIcon = vi.fn(({ size }: { size: string | undefined }) => <DtIconSend size={size} />);
        mockSlots = { startIcon };
        mockProps = { size: 100, startTooltipText: MOCK_START_TOOLTIP_TEXT };

        updateWrapper();

        expect(startIcon).toHaveBeenCalledWith({ size: '200' });
        expect(startIconSlot?.querySelector('svg')).toHaveClass('d-icon--size-200');
      });
    });

    describe('When the endIcon slot is a render prop', () => {
      it('Should pass the split button icon size for the button size', () => {
        const endIcon = vi.fn(({ size }: { size: string | undefined }) => <DtIconSend size={size} />);
        mockSlots = { endIcon };
        mockProps = { size: 100 };

        updateWrapper();

        expect(endIcon).toHaveBeenCalledWith({ size: '100' });
        expect(endIconSlot?.querySelector('svg')).toHaveClass('d-icon--size-100');
      });
    });

    describe('When dropdownList slot is provided', () => {
      it('Should make the end button the dropdown anchor', () => {
        mockSlots = { dropdownList: <li role="menuitem">Option 1</li> };

        updateWrapper();

        expect(endButton).toHaveAttribute('aria-haspopup', 'menu');
        expect(endButton).toHaveAttribute('aria-expanded', 'false');
      });

      it('Should call end-clicked and open the dropdown on end button click', async () => {
        mockSlots = { dropdownList: <li role="menuitem">Option 1</li> };
        mockAttrs = { onEndClicked: MOCK_END_BUTTON_STUB };

        updateWrapper();
        await click(endButton);

        expect(MOCK_END_BUTTON_STUB).toHaveBeenCalledTimes(1);
        expect(endButton).toHaveClass('d-btn--active');
        expect(endButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    describe('When the end tooltip text is missing', () => {
      it('Should warn that the end button needs one', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { endTooltipText: undefined };

        updateWrapper();

        expect(warnSpy).toHaveBeenCalledWith('end-tooltip-text prop is required as it is an icon-only button');
      });
    });

    describe('When the start button is icon only without a tooltip', () => {
      it('Should warn that the start button needs one', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockSlots = { children: undefined, startIcon: <DtIconSend /> };

        updateWrapper();

        expect(warnSpy).toHaveBeenCalledWith('start-tooltip-text prop must be set if start button has an icon only');
      });
    });
  });
});
