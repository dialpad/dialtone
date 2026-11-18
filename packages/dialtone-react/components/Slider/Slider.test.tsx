import { createRef, useState, type ReactNode } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { computePosition } from '@floating-ui/dom';
import type { Mock, MockInstance } from 'vitest';
import { DtText } from '../Text';
import {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MAP,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_TONE_MODIFIERS,
} from '../Text/TextConstants';
import { DtSlider, type DtSliderHandle, type DtSliderProps, type SliderValue } from './Slider';

// Pass-through spy, so tests can see what the tooltip readout asks
// Floating UI for without changing how it positions.
vi.mock('@floating-ui/dom', async (importOriginal) => {
  const floatingUi = await importOriginal<typeof import('@floating-ui/dom')>();
  return { ...floatingUi, computePosition: vi.fn(floatingUi.computePosition) };
});
const computePositionMock = computePosition as unknown as Mock<typeof computePosition>;

// Vue Test Utils' flushPromises: lets pending promises (the tooltip readout's
// positioning pass) settle, inside act since they can update the component.
const flushPromises = () => act(async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
});
// Vue's nextTick: flush React's pending work.
const nextTick = () => act(async () => {});
// Waits a real frame (twice), as the Vue test does between collision passes.
const nextFrame = () => new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});
const settleCollisions = async () => {
  await act(async () => {
    await nextFrame();
    await nextFrame();
  });
};

type Rect = Partial<DOMRect>;
const stubRect = (el: Element, rect: Rect | (() => Rect)) => {
  (el as HTMLElement).getBoundingClientRect = (typeof rect === 'function' ? rect : () => rect) as () => DOMRect;
};

// jsdom's getComputedStyle doesn't resolve inherited properties, so mock it
// for the control element. Toggling documentElement's own dir still triggers
// the direction observer's resync (UseSliderDirection).
let mockControlDirectionSpy: MockInstance | undefined;
async function mockControlDirection (direction: string) {
  const original = window.getComputedStyle.bind(window);
  mockControlDirectionSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, ...rest) => {
    if ((el as HTMLElement)?.dataset?.qa === 'dt-slider-control') return { direction } as CSSStyleDeclaration;
    return original(el, ...rest);
  });
  await act(async () => {
    document.documentElement.setAttribute('dir', direction);
    // The MutationObserver callback runs as its own microtask.
    await Promise.resolve();
  });
}

// Vue Test Utils' trigger: dispatch one event and let the component settle. Pointer events carry the fields the
// slider reads; jsdom has no PointerEvent, so they're MouseEvents with pointerId and pointerType added.
interface TriggerInit {
  pointerId?: number;
  pointerType?: string;
  button?: number;
  buttons?: number;
  clientX?: number;
  clientY?: number;
  key?: string;
  shiftKey?: boolean;
}
async function trigger (el: Element, type: string, init: TriggerInit = {}) {
  await act(async () => {
    if (type === 'focus') fireEvent.focus(el);
    else if (type === 'blur') fireEvent.blur(el);
    else if (type === 'keydown') fireEvent.keyDown(el, init);
    else if (type === 'pointerenter') fireEvent.pointerEnter(el);
    else if (type === 'pointerleave') fireEvent.pointerLeave(el);
    else {
      const { pointerId, pointerType, ...mouse } = init;
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, ...mouse });
      Object.defineProperties(event, { pointerId: { value: pointerId }, pointerType: { value: pointerType } });
      el.dispatchEvent(event);
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

// Sets a native thumb's value and fires its input event, as the browser does for a keyboard step.
async function setInputValue (el: Element, value: string) {
  await act(async () => {
    fireEvent.input(el, { target: { value } });
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

type TestProps = Partial<DtSliderProps> & Record<`data-${string}`, string>;

interface Wrapper {
  container: HTMLElement;
  find: <T extends HTMLElement = HTMLElement>(qa: string) => T | null;
  findAll: <T extends HTMLElement = HTMLElement>(qa: string) => T[];
  setProps: (props: TestProps) => Promise<void>;
  emitted: (name: 'update:modelValue' | 'change' | 'focus' | 'blur') => unknown[][] | undefined;
  unmount: () => void;
  vm: () => DtSliderHandle;
}

// Vue Test Utils' mount: Vue's events are recorded under their Vue names — update:modelValue is onValueChange and
// change is onValueCommit. Without attachTo, the slider renders into a detached element, as mount() does.
function mount (initialProps: TestProps, { attachTo }: { attachTo?: HTMLElement } = {}): Wrapper {
  const events: Record<string, unknown[][]> = { 'update:modelValue': [], change: [], focus: [], blur: [] };
  const handle = createRef<DtSliderHandle>();
  let props = initialProps;
  const container = document.createElement('div');
  if (attachTo) attachTo.appendChild(container);
  const ui = () => (
    <DtSlider
      {...props}
      ref={handle}
      onValueChange={(value) => events['update:modelValue'].push([value])}
      onValueCommit={(value) => events.change.push([value])}
      onFocus={(event) => events.focus.push([event])}
      onBlur={(event) => events.blur.push([event])}
    />
  );
  let result: { rerender: (next: ReactNode) => void; unmount: () => void } | null = render(ui(), { container });
  return {
    container,
    find: (qa) => container.querySelector(`[data-qa="${qa}"]`),
    findAll: (qa) => Array.from(container.querySelectorAll(`[data-qa="${qa}"]`)),
    async setProps (next) {
      props = { ...props, ...next };
      await act(async () => {
        result?.rerender(ui());
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    },
    emitted: (name) => (events[name].length ? events[name] : undefined),
    unmount () {
      result?.unmount();
      result = null;
      container.remove();
    },
    vm: () => handle.current!,
  };
}

const baseProps: TestProps = {
  label: 'Volume',
  value: 50,
};
const baseAttrs: TestProps = {};

let mockProps: TestProps = {};
let mockAttrs: TestProps = {};

const last = <T,>(list: T[] | undefined) => list?.[list.length - 1];
const attr = (el: Element | null | undefined, name: string) => el?.getAttribute(name) ?? undefined;
const classes = (el: Element | null | undefined) => Array.from(el?.classList ?? []);

describe('DtSlider Tests', () => {
  const openPopovers = new WeakSet<Element>();
  let matchesSpy: MockInstance;
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;

  beforeAll(() => {
    const matches = HTMLElement.prototype.matches;
    matchesSpy = vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (this: HTMLElement, selector) {
      return selector === ':popover-open' ? openPopovers.has(this) : matches.call(this, selector);
    });
    proto.showPopover = function (this: HTMLElement) { openPopovers.add(this); };
    proto.hidePopover = function (this: HTMLElement) { openPopovers.delete(this); };
  });

  afterAll(() => {
    matchesSpy.mockRestore();
    delete proto.showPopover;
    delete proto.hidePopover;
  });

  let wrapper: Wrapper | null = null;
  let root: HTMLElement | null;
  let track: HTMLElement | null;
  let indicator: HTMLElement | null;
  let label: HTMLElement | null;
  let thumbVisuals: HTMLElement[];
  let thumbInputs: HTMLInputElement[];

  const w = () => wrapper!;
  const findThumbInputs = () => w().findAll<HTMLInputElement>('dt-slider-thumb');
  const findThumbVisuals = () => w().findAll('dt-slider-thumb-visual');

  const updateWrapper = () => {
    wrapper?.unmount();
    wrapper = mount({ ...baseProps, ...baseAttrs, ...mockProps, ...mockAttrs });

    root = w().find('dt-slider');
    track = w().find('dt-slider-track');
    indicator = w().find('dt-slider-indicator');
    label = w().find('dt-slider-label');
    thumbVisuals = findThumbVisuals();
    thumbInputs = findThumbInputs();
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(async () => {
    mockProps = {};
    mockAttrs = {};
    wrapper?.unmount();
    wrapper = null;
    // An open tooltip readout's last positioning pass can still be in flight
    // after unmount; let it settle so it can't leak into the next test.
    await flushPromises();
    mockControlDirectionSpy?.mockRestore();
    document.documentElement.removeAttribute('dir');
  });

  describe('Presentation Tests', () => {
    it('renders the component', () => {
      expect(wrapper).toBeDefined();
      expect(root).not.toBeNull();
    });

    it('has the d-slider root class', () => {
      expect(classes(root)).toContain('d-slider');
    });

    it('renders a track element', () => {
      expect(track).not.toBeNull();
    });

    it('renders an indicator element', () => {
      expect(indicator).not.toBeNull();
    });

    it('renders the label text', () => {
      expect(label?.textContent?.trim()).toBe(baseProps.label);
    });

    it('renders one thumb in single mode', () => {
      expect(thumbInputs).toHaveLength(1);
    });

    it('renders one visual thumb in single mode', () => {
      expect(thumbVisuals).toHaveLength(1);
    });

    it('sets data-orientation to horizontal by default', () => {
      expect(attr(root, 'data-orientation')).toBe('horizontal');
    });

    it('does not apply the dot-centering position style to the full-size native input', () => {
      expect(attr(thumbInputs[0], 'style')).toBeUndefined();
    });

    describe('Range mode', () => {
      beforeEach(() => {
        mockProps = { value: [20, 70] };
        updateWrapper();
      });

      it('renders two thumb inputs', () => {
        expect(thumbInputs).toHaveLength(2);
      });

      it('renders two visual thumbs', () => {
        expect(thumbVisuals).toHaveLength(2);
      });

      it('sets the first input value to the low bound', () => {
        expect(thumbInputs[0].value).toBe('20');
      });

      it('sets the second input value to the high bound', () => {
        expect(thumbInputs[1].value).toBe('70');
      });

      it('warns via prop validator when modelValue is an array with a length other than 2', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { value: [10, 20, 30] };
        updateWrapper();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
      });
    });

    describe('When min equals max (degenerate range)', () => {
      beforeEach(() => {
        mockProps = { value: 50, min: 50, max: 50 };
        updateWrapper();
      });

      it('does not produce NaN positioning for the thumb', () => {
        thumbInputs = findThumbInputs();
        expect(thumbInputs[0].style.insetInlineStart).not.toContain('NaN');
      });

      it('does not produce NaN positioning for default marks', () => {
        // Vue's version renders no marks (showMarks defaults to false), so its loop asserts nothing; this one does.
        mockProps = { value: 50, min: 50, max: 50, showMarks: [50] };
        updateWrapper();
        const marks = w().findAll('dt-slider-mark');
        expect(marks).toHaveLength(1);
        marks.forEach((mark) => {
          expect(mark.style.insetInlineStart).not.toContain('NaN');
        });
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };
        updateWrapper();
      });

      it('adds d-slider--disabled class', () => {
        expect(classes(root)).toContain('d-slider--disabled');
      });

      it('sets data-disabled attribute', () => {
        expect(attr(root, 'data-disabled')).toBeDefined();
      });

      it('sets disabled on the input', () => {
        expect(attr(thumbInputs[0], 'disabled')).toBeDefined();
      });
    });

    describe('When orientation is vertical', () => {
      beforeEach(() => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
      });

      it('adds d-slider--vertical class', () => {
        expect(classes(root)).toContain('d-slider--vertical');
      });

      it('sets data-orientation to vertical', () => {
        expect(attr(root, 'data-orientation')).toBe('vertical');
      });

      it('sets aria-orientation to vertical on the thumb input, since the native default is horizontal', () => {
        thumbInputs = findThumbInputs();
        expect(attr(thumbInputs[0], 'aria-orientation')).toBe('vertical');
      });
    });

    describe('When fillOrigin is \'end\'', () => {
      beforeEach(() => {
        mockProps = { fillOrigin: 'end' };
        updateWrapper();
      });

      it('adds d-slider--inverted class', () => {
        expect(classes(root)).toContain('d-slider--inverted');
      });
    });

    describe('Readout', () => {
      const readouts = () => w().findAll('dt-slider-thumb-readout');

      it('renders no readout when readout is "never"', async () => {
        mockProps = { readout: 'never' };
        updateWrapper();
        await nextTick();
        expect(readouts()).toHaveLength(0);
        expect(w().find('dt-slider-thumb-readout-tooltip')).toBeNull();
      });

      it('rejects the removed "interaction" readout mode', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
          mockProps = {
            // @ts-expect-error -- 'interaction' was removed from the readout modes
            readout: 'interaction',
          };
          updateWrapper();
          expect(warnSpy.mock.calls.flat().join(' ')).toContain('Invalid prop: custom validator check failed for prop "readout"');
        } finally {
          warnSpy.mockRestore();
        }
      });

      it('renders an always-shown readout when readout is "always"', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        const els = readouts();
        expect(els).toHaveLength(1);
        expect(classes(els[0])).toContain('d-slider__readout--show');
      });

      it('renders the formatted value as the readout content', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].textContent).toBe('50');
      });

      it('hides the readout from the accessibility tree, since it duplicates the thumb input\'s own aria-valuetext', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        expect(attr(readouts()[0], 'aria-hidden')).toBe('true');
      });

      it('renders one readout per thumb in range mode', async () => {
        mockProps = { readout: 'always', value: [20, 70] };
        updateWrapper();
        await nextTick();
        const els = readouts();
        expect(els).toHaveLength(2);
        expect(els[0].textContent).toBe('20');
        expect(els[1].textContent).toBe('70');
      });

      it('applies readoutClass only to always-visible readouts when switching modes', async () => {
        mockProps = { value: [20, 70], bodyClass: 'custom-body', readoutClass: 'custom-readout' };
        updateWrapper();
        expect(classes(w().find('dt-slider-body'))).toContain('custom-body');
        expect(w().findAll('dt-slider-thumb-readout-tooltip')).toHaveLength(2);
        expect(w().container.querySelectorAll('.custom-readout')).toHaveLength(0);

        await w().setProps({ readout: 'always' });
        const els = readouts();
        expect(els).toHaveLength(2);
        els.forEach(el => expect(classes(el)).toContain('custom-readout'));

        await w().setProps({ readout: 'never' });
        expect(readouts()).toHaveLength(0);
        expect(w().container.querySelectorAll('.custom-readout')).toHaveLength(0);
      });

      it('applies suffix to the readout content', async () => {
        mockProps = { readout: 'always', suffix: '%' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].textContent).toBe('50%');
      });

      it('applies prefix to the readout content', async () => {
        mockProps = { readout: 'always', prefix: '$' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].textContent).toBe('$50');
      });

      it('prefers getValueText over suffix for the readout content', async () => {
        mockProps = { readout: 'always', suffix: '%', getValueText: (v) => `${v} units` };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].textContent).toBe('50 units');
      });

      it('anchors onto the thumb\'s own inset band near the edges, not a flush track percentage', async () => {
        mockProps = { readout: 'always', value: 99 };
        updateWrapper();
        await nextTick();
        const style = attr(readouts()[0], 'style');
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.99)');
        expect(style).not.toContain('transform');
      });

      it('flush-aligns its own edge instead of centering when tracking a thumb exactly at max, so its text only ever extends inward', async () => {
        mockProps = { readout: 'always', value: 100 };
        updateWrapper();
        await nextTick();
        const style = attr(readouts()[0], 'style');
        expect(style).toContain('transform: translateX(calc(-100% + -1px))');
        expect(style).not.toContain('inset-inline-start: calc(var(--slider-edge-inset)');
      });

      it('flush-aligns at min too, not just max', async () => {
        mockProps = { readout: 'always', value: 0 };
        updateWrapper();
        await nextTick();
        const style = attr(readouts()[0], 'style');
        expect(style).toContain('transform: translateX(1px)');
        expect(style).not.toContain('inset-inline-start: calc(var(--slider-edge-inset)');
      });
    });

    describe('readout: "tooltip" (the default)', () => {
      // Top-layer rendering preserves DOM parentage and local theme inheritance.
      const tooltipReadouts = () => w().findAll('dt-slider-thumb-readout-tooltip');

      it('opens while its thumb is focused and closes on blur', async () => {
        const tooltip = tooltipReadouts()[0];
        await trigger(thumbInputs[0], 'focus');
        expect(tooltip.matches(':popover-open')).toBe(true);
        await trigger(thumbInputs[0], 'blur');
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('closes on Escape while keeping focus, matching DtTooltip\'s own Escape handling', async () => {
        const tooltip = tooltipReadouts()[0];
        await trigger(thumbInputs[0], 'focus');
        expect(tooltip.matches(':popover-open')).toBe(true);
        await trigger(thumbInputs[0], 'keydown', { key: 'Escape' });
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('does not move real DOM focus off the thumb on Escape', async () => {
        const attachedWrapper = mount(baseProps, { attachTo: document.body });
        try {
          const input = attachedWrapper.find('dt-slider-thumb')!;
          act(() => input.focus());
          await nextTick();
          const tooltip = attachedWrapper.find('dt-slider-thumb-readout-tooltip')!;
          expect(tooltip.matches(':popover-open')).toBe(true);
          await trigger(input, 'keydown', { key: 'Escape' });
          expect(tooltip.matches(':popover-open')).toBe(false);
          expect(document.activeElement).toBe(input);
        } finally {
          attachedWrapper.unmount();
        }
      });

      it('reopens on the next hover after an Escape dismissal, without needing to refocus', async () => {
        const hitTarget = w().find('dt-slider-thumb-hit')!;
        const tooltip = tooltipReadouts()[0];
        await trigger(thumbInputs[0], 'focus');
        await trigger(thumbInputs[0], 'keydown', { key: 'Escape' });
        expect(tooltip.matches(':popover-open')).toBe(false);
        await trigger(hitTarget, 'pointerenter');
        expect(tooltip.matches(':popover-open')).toBe(true);
      });

      it('reopens on the next arrow-key press after an Escape dismissal, without needing to blur/refocus', async () => {
        const tooltip = tooltipReadouts()[0];
        await trigger(thumbInputs[0], 'focus');
        await trigger(thumbInputs[0], 'keydown', { key: 'Escape' });
        expect(tooltip.matches(':popover-open')).toBe(false);
        await trigger(thumbInputs[0], 'keydown', { key: 'ArrowRight' });
        expect(tooltip.matches(':popover-open')).toBe(true);
      });

      it('stays dismissed on a bare modifier keypress after Escape — only actual nav keys reopen it', async () => {
        const tooltip = tooltipReadouts()[0];
        await trigger(thumbInputs[0], 'focus');
        await trigger(thumbInputs[0], 'keydown', { key: 'Escape' });
        expect(tooltip.matches(':popover-open')).toBe(false);
        await trigger(thumbInputs[0], 'keydown', { key: 'Shift' });
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('dismisses only the Escaped thumb\'s own tooltip in range mode, leaving the other thumb open', async () => {
        mockProps = { value: [20, 70] };
        updateWrapper();
        thumbInputs = findThumbInputs();
        const tooltips = tooltipReadouts();
        await trigger(thumbInputs[0], 'focus');
        const hitTargets = w().findAll('dt-slider-thumb-hit');
        await trigger(hitTargets[1], 'pointerenter');
        expect(tooltips[0].matches(':popover-open')).toBe(true);
        expect(tooltips[1].matches(':popover-open')).toBe(true);
        await trigger(thumbInputs[0], 'keydown', { key: 'Escape' });
        expect(tooltips[0].matches(':popover-open')).toBe(false);
        expect(tooltips[1].matches(':popover-open')).toBe(true);
      });

      it('does not open while disabled, even when its thumb is hovered', async () => {
        mockProps = { disabled: true };
        updateWrapper();
        await trigger(w().find('dt-slider-thumb-hit')!, 'pointerenter');
        expect(tooltipReadouts()[0].matches(':popover-open')).toBe(false);
      });

      it('closes its open readout on unmount', async () => {
        await trigger(thumbInputs[0], 'focus');
        const tooltip = tooltipReadouts()[0];
        expect(tooltip.matches(':popover-open')).toBe(true);
        w().unmount();
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('is the default readout mode', async () => {
        await nextTick();
        const els = tooltipReadouts();
        expect(els).toHaveLength(1);
        expect(w().findAll('dt-slider-thumb-readout')).toHaveLength(0);
      });

      it('renders inline inside .d-slider__control, not teleported elsewhere', async () => {
        await nextTick();
        const control = w().find('dt-slider-control')!;
        expect(control.querySelector('[data-qa="dt-slider-thumb-readout-tooltip"]')).not.toBeNull();
      });

      it('renders hidden at rest', async () => {
        await nextTick();
        expect(tooltipReadouts()[0].matches(':popover-open')).toBe(false);
      });

      it('shows on thumb-hit hover', async () => {
        await nextTick();
        const hitTarget = w().findAll('dt-slider-thumb-hit')[0];
        const tooltip = tooltipReadouts()[0];
        await trigger(hitTarget, 'pointerenter');
        expect(tooltip.matches(':popover-open')).toBe(true);
        await trigger(hitTarget, 'pointerleave');
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('keeps the readout open on hover-leave if that thumb is still keyboard-focused', async () => {
        const hitTarget = w().find('dt-slider-thumb-hit')!;
        await trigger(thumbInputs[0], 'focus');
        await trigger(hitTarget, 'pointerenter');
        await trigger(hitTarget, 'pointerleave');
        expect(tooltipReadouts()[0].matches(':popover-open')).toBe(true);
      });

      it('renders the formatted value as its content', async () => {
        await nextTick();
        expect(tooltipReadouts()[0].textContent).toBe('50');
      });

      it('is a decorative manual popover: inert and hidden from the accessibility tree, since it duplicates the thumb input\'s own aria-valuetext', async () => {
        await nextTick();
        const tooltip = tooltipReadouts()[0];
        expect(attr(tooltip, 'popover')).toBe('manual');
        expect(attr(tooltip, 'inert')).toBe('');
        expect(attr(tooltip, 'aria-hidden')).toBe('true');
      });

      it('renders one independent tooltip per thumb in range mode, with no merge-into-one-pill behavior', async () => {
        mockProps = { value: [20, 70] };
        updateWrapper();
        await nextTick();
        const els = tooltipReadouts();
        expect(els).toHaveLength(2);
        expect(els[0].textContent).toBe('20');
        expect(els[1].textContent).toBe('70');
        expect(w().find('dt-slider-thumb-readout-merged')).toBeNull();
      });

      it('does not merge two tooltip bubbles into one even when they genuinely overlap — tooltip mode has no merged-pill UI to fall back to', async () => {
        mockProps = { value: [55, 60], min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
        const tooltipRect = { top: 0, left: 0, right: 20, bottom: 20 };
        stubRect(w().find('dt-slider-control')!, controlRect);
        const tooltips = tooltipReadouts();
        stubRect(tooltips[0], tooltipRect);
        stubRect(tooltips[1], tooltipRect);

        thumbInputs = findThumbInputs();
        await trigger(thumbInputs[0], 'focus');
        const hitTargets = w().findAll('dt-slider-thumb-hit');
        await trigger(hitTargets[1], 'pointerenter');
        await settleCollisions();

        expect(tooltipReadouts()[0].matches(':popover-open')).toBe(true);
        expect(tooltipReadouts()[1].matches(':popover-open')).toBe(true);
        expect(w().find('dt-slider-thumb-readout-merged')).toBeNull();
      });

      it('closes the removed thumb\'s readout when range switches to single', async () => {
        mockProps = { value: [20, 70] };
        updateWrapper();
        await trigger(w().findAll('dt-slider-thumb-hit')[1], 'pointerenter');
        const high = tooltipReadouts()[1];
        expect(high.matches(':popover-open')).toBe(true);
        await w().setProps({ value: 20 });
        expect(high.matches(':popover-open')).toBe(false);
      });

      it('repositions its readout when a stable getValueText callback\'s text changes', async () => {
        // React has no reactive refs: the callback keeps its identity, and the parent re-renders after the text it
        // closes over changes.
        let unit = ' dollars';
        const getValueText = (value: number) => `${value}${unit}`;
        mockProps = { getValueText };
        updateWrapper();
        await trigger(w().find('dt-slider-thumb')!, 'focus');
        computePositionMock.mockClear();
        unit = ' euros';
        await w().setProps({ getValueText });
        expect(computePositionMock).toHaveBeenCalledTimes(1);
      });

      it('opens a vertical thumb\'s readout to its physical left under rtl', async () => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
        await mockControlDirection('rtl');
        await trigger(thumbInputs[0], 'focus');
        expect(computePositionMock.mock.lastCall?.[2]?.placement).toBe('left');
      });

      it('recovers a hovered readout after the browser closes its popover externally', async () => {
        const attached = mount(baseProps, { attachTo: document.body });
        try {
          // jsdom has no rendered boxes; model a visible, connected owner.
          attached.find('dt-slider-thumb-visual')!.checkVisibility = () => true;
          await trigger(attached.find('dt-slider-thumb-hit')!, 'pointerenter');
          const tooltip = attached.find('dt-slider-thumb-readout-tooltip')!;
          tooltip.hidePopover();
          await attached.setProps({ value: 60 });
          expect(tooltip.matches(':popover-open')).toBe(true);
        } finally {
          attached.unmount();
        }
      });

      it('hides the readout when its stationary thumb stops being visible', async () => {
        // Floating UI's hide() needs a non-zero viewport with the thumb inside
        // it. The checkVisibility stub honors only the older option names, so
        // this also covers Chrome/Edge 114–120.
        const visual = thumbVisuals[0];
        const widthSpy = vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
        const heightSpy = vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);
        stubRect(visual, { x: 100, y: 100, left: 100, top: 100, right: 116, bottom: 116, width: 16, height: 16 });
        let ownerVisible = true;
        visual.checkVisibility = (options?: CheckVisibilityOptions) => (
          ownerVisible || !(options?.checkOpacity && options?.checkVisibilityCSS)
        );
        try {
          await trigger(thumbInputs[0], 'focus');
          await flushPromises();
          const tooltip = tooltipReadouts()[0];
          expect(tooltip.style.visibility).toBe('visible');
          ownerVisible = false;
          await nextFrame();
          expect(tooltip.style.visibility).toBe('hidden');
        } finally {
          widthSpy.mockRestore();
          heightSpy.mockRestore();
        }
      });

      it('does not open the readout when the browser lacks the Popover API', async () => {
        const tooltip = tooltipReadouts()[0];
        (tooltip as unknown as { showPopover?: unknown }).showPopover = undefined;
        await trigger(thumbInputs[0], 'focus');
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      describe('Per-frame position check runs every frame, not throttled', () => {
        // Capturing animation-frame callbacks instead of firing them lets this
        // drive the frame check deterministically.
        let rafCallbacks: FrameRequestCallback[];
        let rafSpy: MockInstance;

        beforeEach(() => {
          rafCallbacks = [];
          rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            rafCallbacks.push(cb);
            return rafCallbacks.length;
          });
        });

        afterEach(() => {
          rafSpy.mockRestore();
        });

        function fireNextFrame () {
          const cb = rafCallbacks.shift();
          cb?.(0);
        }

        it('re-reads the anchor rect on every scheduled frame, with no throttle window', async () => {
          await trigger(thumbInputs[0], 'focus');
          const anchor = w().find('dt-slider-thumb-visual')!;
          const rectSpy = vi.spyOn(anchor, 'getBoundingClientRect');
          rectSpy.mockClear();

          fireNextFrame();
          expect(rectSpy).toHaveBeenCalledTimes(1);

          fireNextFrame();
          expect(rectSpy).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe('When showLabel is false', () => {
      beforeEach(() => {
        mockProps = { showLabel: false };
        updateWrapper();
      });

      it('removes the label from the DOM, matching DtInput/DtCheckbox/DtRadio/DtSelectMenu', () => {
        expect(label).toBeNull();
      });

      it('promotes the label prop to aria-label on each thumb input', () => {
        expect(attr(thumbInputs[0], 'aria-label')).toBe(baseProps.label);
        expect(attr(thumbInputs[0], 'aria-labelledby')).toBeUndefined();
      });
    });

    describe('Label size and strength', () => {
      // Vue reads DtText's props; React checks the classes DtText renders for them.
      const labelText = () => label!.querySelector('[data-qa="dt-text"]');
      const sizeClass = (size: keyof typeof TEXT_SIZE_MAP) => `${TEXT_KIND_MODIFIERS.label}--${TEXT_SIZE_MAP[size]}`;

      it('defaults label size to 300', () => {
        expect(classes(labelText())).toContain(sizeClass(300));
      });

      it('leaves label strength unset by default, so the label kind\'s own semibold weight applies (matching DtInput)', () => {
        const strengthClasses: string[] = Object.values(TEXT_STRENGTH_MODIFIERS);
        expect(classes(labelText()).filter(c => strengthClasses.includes(c))).toEqual([]);
      });

      it('overrides the default label size via labelSize', () => {
        mockProps = { labelSize: 400 };
        updateWrapper();
        expect(classes(labelText())).toContain(sizeClass(400));
      });

      it('overrides the default label strength via labelStrength', () => {
        mockProps = { labelStrength: 'bold' };
        updateWrapper();
        expect(classes(labelText())).toContain(TEXT_STRENGTH_MODIFIERS.bold);
      });

      it('sets label tone to disabled when the slider is disabled', () => {
        mockProps = { disabled: true };
        updateWrapper();
        expect(classes(labelText())).toContain(TEXT_TONE_MODIFIERS.disabled);
      });

      it('sets label tone to secondary when not disabled', () => {
        expect(classes(labelText())).toContain(TEXT_TONE_MODIFIERS.secondary);
      });
    });

    describe('When ticks is set to an interval', () => {
      beforeEach(() => {
        mockProps = { showTicks: 10, min: 0, max: 100, step: 10 };
        updateWrapper();
      });

      it('renders tick marks', () => {
        const ticks = w().findAll('dt-slider-tick');
        expect(ticks.length).toBeGreaterThan(0);
      });

      it('renders 11 ticks for showTicks=10 over 0–100', () => {
        const ticks = w().findAll('dt-slider-tick');
        expect(ticks).toHaveLength(11);
      });
    });

    describe('When ticks is left at its default', () => {
      it('renders zero ticks', () => {
        const ticks = w().findAll('dt-slider-tick');
        expect(ticks).toHaveLength(0);
      });
    });

    describe('Dense generated points are capped', () => {
      let warnSpy: MockInstance;

      beforeEach(() => {
        warnSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      });

      afterEach(() => {
        warnSpy.mockRestore();
      });

      it('caps tick generation instead of hanging on a too-small ticks interval', () => {
        mockProps = { showTicks: 0.001, min: 0, max: 100 };
        updateWrapper();
        const ticks = w().findAll('dt-slider-tick');
        expect(ticks.length).toBeLessThanOrEqual(1001); // +1 for the guaranteed end-of-domain point
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('ticks'));
      });

      it('still covers the FULL domain when capped, not just the beginning of it', () => {
        mockProps = { showTicks: 0.001, min: 0, max: 100 };
        updateWrapper();
        const tickPositions = w().findAll('dt-slider-tick').map((t) => attr(t, 'style'));
        const lastTickStyle = tickPositions.at(-1);
        expect(lastTickStyle).toMatch(/\) \* (0\.9\d+|1)\);/);
      });

      it('caps snapPoints generation instead of hanging on a too-small interval', async () => {
        // The snap points are computed lazily — only a pointer drag reads them.
        mockProps = { snapPoints: 0.001, min: 0, max: 100 };
        updateWrapper();
        const control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('snapPoints'));
      });
    });

    describe('Dense generated points, production mode', () => {
      let warnSpy: MockInstance;
      let originalNodeEnv: string | undefined;

      beforeEach(() => {
        warnSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
      });

      afterEach(() => {
        warnSpy.mockRestore();
        process.env.NODE_ENV = originalNodeEnv;
      });

      it('does not log the interval-cap notice in production', () => {
        mockProps = { showTicks: 0.001, min: 0, max: 100 };
        updateWrapper();
        expect(warnSpy).not.toHaveBeenCalled();
      });
    });

    describe('Slots', () => {
      it('renders the start slot', () => {
        mockProps = { start: <span data-testid="start-slot">Low</span> };
        updateWrapper();
        const startWrapper = w().find('dt-slider-start')!;
        expect(startWrapper.querySelector('[data-testid="start-slot"]')).not.toBeNull();
      });

      it('renders the end slot', () => {
        mockProps = { end: <span data-testid="end-slot">High</span> };
        updateWrapper();
        const endWrapper = w().find('dt-slider-end')!;
        expect(endWrapper.querySelector('[data-testid="end-slot"]')).not.toBeNull();
      });

      it('renders the label slot', () => {
        mockProps = { label: <span data-testid="custom-label">Custom</span> };
        updateWrapper();
        expect(label!.querySelector('[data-testid="custom-label"]')).not.toBeNull();
      });

      it('exposes the live value via the label slot scope, updating as the thumb moves', async () => {
        mockProps = {
          label: (scope) => <span data-testid="live-label">{String(scope.value)}</span>,
        };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(label!.querySelector('[data-testid="live-label"]')!.textContent).toBe('50');

        await setInputValue(thumbInputs[0], '75');
        expect(label!.querySelector('[data-testid="live-label"]')!.textContent).toBe('75');
      });

      it('exposes the value as an array via the label slot scope in range mode', () => {
        mockProps = {
          value: [20, 70],
          label: (scope) => <span data-testid="live-label">{(scope.value as number[]).join('-')}</span>,
        };
        updateWrapper();
        expect(label!.querySelector('[data-testid="live-label"]')!.textContent).toBe('20-70');
      });
    });

    describe('Slot class props', () => {
      it('applies labelClass to the label wrapper', () => {
        mockProps = { labelClass: 'custom-label-class' };
        updateWrapper();
        expect(classes(label)).toContain('custom-label-class');
      });

      it('applies startClass to the start slot wrapper', () => {
        mockProps = { startClass: 'custom-start-class', start: <span>Low</span> };
        updateWrapper();
        expect(classes(w().find('dt-slider-start'))).toContain('custom-start-class');
      });

      it('applies endClass to the end slot wrapper', () => {
        mockProps = { endClass: 'custom-end-class', end: <span>High</span> };
        updateWrapper();
        expect(classes(w().find('dt-slider-end'))).toContain('custom-end-class');
      });
    });

    describe('Empty start/end slots', () => {
      it('does not render the start wrapper when the start slot is empty', () => {
        expect(w().find('dt-slider-start')).toBeNull();
      });

      it('does not render the end wrapper when the end slot is empty', () => {
        expect(w().find('dt-slider-end')).toBeNull();
      });

      it('renders the start wrapper once the slot has content', () => {
        mockProps = { start: <span>Low</span> };
        updateWrapper();
        expect(w().find('dt-slider-start')).not.toBeNull();
      });
    });

    describe('name prop', () => {
      it('forwards name to each thumb input, so range mode values can be retrieved together via FormData.getAll', () => {
        mockProps = { name: 'volume', value: [20, 70] };
        updateWrapper();
        expect(attr(thumbInputs[0], 'name')).toBe('volume');
        expect(attr(thumbInputs[1], 'name')).toBe('volume');
      });

      it('omits the name attribute entirely when unset, rather than rendering name=""', () => {
        expect(attr(thumbInputs[0], 'name')).toBeUndefined();
      });
    });

    describe('Attrs passthrough (inheritAttrs: false)', () => {
      it('forwards a consumer class onto the root element, merged with the component\'s own classes', () => {
        mockAttrs = { className: 'consumer-class' };
        updateWrapper();
        expect(classes(root)).toContain('consumer-class');
        expect(classes(root)).toContain('d-slider');
      });

      it('forwards consumer style onto the root element', () => {
        mockAttrs = { style: { marginTop: '8px' } };
        updateWrapper();
        expect(attr(root, 'style')).toContain('margin-top');
      });

      it('forwards non-class/style attrs like data-testid onto the root element', () => {
        mockAttrs = { 'data-testid': 'volume-slider' };
        updateWrapper();
        expect(attr(root, 'data-testid')).toBe('volume-slider');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('thumb input has type range', () => {
      expect(attr(thumbInputs[0], 'type')).toBe('range');
    });

    it('thumb input has aria-labelledby pointing to the label', () => {
      const labelId = attr(label, 'id');
      expect(labelId).toBeTruthy();
      expect(attr(thumbInputs[0], 'aria-labelledby')).toBe(labelId);
    });

    it('falls back to aria-label, not aria-labelledby to an empty node, when the label slot renders nothing', () => {
      mockProps = { label: '' };
      mockAttrs = { 'aria-label': 'Volume' };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-labelledby')).toBeUndefined();
      expect(attr(thumbInputs[0], 'aria-label')).toBe('Volume');
    });

    it('falls back to aria-label, not aria-labelledby to an empty node, when the label PROP is non-empty but a provided #label slot overrides it with no text', () => {
      // Label content other than a string replaces the label text, as Vue's #label slot replaces the prop's markup.
      mockProps = { label: <svg aria-hidden="true"><use href="#icon-volume" /></svg> };
      mockAttrs = { 'aria-label': 'Explicit volume' };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-labelledby')).toBeUndefined();
      expect(attr(thumbInputs[0], 'aria-label')).toBe('Explicit volume');
    });

    it('forwards a consumer-supplied aria-labelledby to each thumb when there is no visible label', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-labelledby')).toBe('external-heading');
      expect(attr(thumbInputs[0], 'aria-label')).toBeUndefined();
    });

    it('prefers the internal label over a consumer-supplied aria-labelledby when both are present', () => {
      mockProps = { label: 'Volume' };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      thumbInputs = findThumbInputs();
      const labelId = attr(w().find('dt-slider-label'), 'id');
      expect(attr(thumbInputs[0], 'aria-labelledby')).toBe(labelId);
    });

    it('does not duplicate aria-label/aria-labelledby onto the root wrapper — only the thumb inputs get them', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume', 'aria-labelledby': 'external-heading' };
      updateWrapper();
      expect(attr(root, 'aria-label')).toBeUndefined();
      expect(attr(root, 'aria-labelledby')).toBeUndefined();
    });

    it('forwards aria-describedby, aria-errormessage, aria-details, and aria-invalid to each thumb input', () => {
      mockAttrs = {
        'aria-describedby': 'hint-id',
        'aria-errormessage': 'error-id',
        'aria-details': 'details-id',
        'aria-invalid': 'true',
      };
      mockProps = { value: [20, 70] };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(thumbInputs).toHaveLength(2);
      for (const input of thumbInputs) {
        expect(attr(input, 'aria-describedby')).toBe('hint-id');
        expect(attr(input, 'aria-errormessage')).toBe('error-id');
        expect(attr(input, 'aria-details')).toBe('details-id');
        expect(attr(input, 'aria-invalid')).toBe('true');
      }
    });

    it('does not leave aria-describedby/aria-errormessage/aria-details/aria-invalid on the root wrapper', () => {
      mockAttrs = {
        'aria-describedby': 'hint-id',
        'aria-errormessage': 'error-id',
        'aria-details': 'details-id',
        'aria-invalid': 'true',
      };
      updateWrapper();
      expect(attr(root, 'aria-describedby')).toBeUndefined();
      expect(attr(root, 'aria-errormessage')).toBeUndefined();
      expect(attr(root, 'aria-details')).toBeUndefined();
      expect(attr(root, 'aria-invalid')).toBeUndefined();
    });

    it('sets aria-valuemin from min prop', () => {
      expect(attr(thumbInputs[0], 'min')).toBe('0');
    });

    it('sets aria-valuemax from max prop', () => {
      expect(attr(thumbInputs[0], 'max')).toBe('100');
    });

    it('sets aria-valuenow from modelValue', () => {
      expect(thumbInputs[0].value).toBe('50');
    });

    it('applies getValueText result to aria-valuetext', () => {
      mockProps = { getValueText: (v) => `Volume: ${v}%` };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-valuetext')).toBe('Volume: 50%');
    });

    it('applies prefix/suffix to aria-valuetext when getValueText is not set', () => {
      mockProps = { prefix: '$', suffix: ' USD' };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-valuetext')).toBe('$50 USD');
    });

    it('prefers getValueText over prefix/suffix when both are set', () => {
      mockProps = { getValueText: (v) => `${v}%`, prefix: '$', suffix: ' USD' };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-valuetext')).toBe('50%');
    });
  });

  describe('Dev-only accessibility warnings (console.info)', () => {
    let infoSpy: MockInstance;

    beforeEach(() => {
      infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    });

    afterEach(() => {
      infoSpy.mockRestore();
    });

    it('warns when neither label nor showLabel is set — the one case actually missing an accessible name', () => {
      mockProps = { label: undefined };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn at all in production — a library cannot assume every consumer strips console calls', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        mockProps = { label: undefined, value: [20, 70] }; // range mode + no label: would normally warn twice
        updateWrapper();
        expect(infoSpy).not.toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });

    it('does not warn about a missing label when label is set', () => {
      mockProps = { label: 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns when only showLabel is set without a label — showLabel alone does not create an accessible name', () => {
      mockProps = { label: undefined, showLabel: false };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn when aria-label is provided, even without label or showLabel', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn when the label slot supplies content, even without the label prop', () => {
      mockProps = { label: <span>Custom label</span> };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns when a hidden label slot no longer supplies an accessible name', async () => {
      mockProps = { label: <span>Volume</span> };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));

      await w().setProps({ showLabel: false });
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
      const input = w().find('dt-slider-thumb');
      expect(attr(input, 'aria-label')).toBeUndefined();
      expect(attr(input, 'aria-labelledby')).toBeUndefined();

      infoSpy.mockClear();
      await w().setProps({ label: 'Volume' });
      expect(attr(input, 'aria-label')).toBe('Volume');
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn when the label slot wraps its text in a child component, not a bare text node', () => {
      mockProps = { label: () => <DtText>Volume</DtText> };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('still warns when the label slot exists but renders nothing — an empty slot provides no accessible name', () => {
      mockProps = { label: () => '' };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not crash mounting with a scoped #label slot that indexes into value, in range mode', () => {
      mockProps = {
        value: [20, 70],
        label: ({ value }) => `${(value as number[])[0]}-${(value as number[])[1]}`,
      };
      expect(() => updateWrapper()).not.toThrow();
      expect(label?.textContent).toBe('20-70');
    });

    it('warns about missing getValueText in range mode, independent of whether a label is set', () => {
      mockProps = { label: 'Price range', value: [20, 70] };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide getValueText'));
    });

    it('does not re-log an unchanged warning on every value tick while dragging', async () => {
      mockProps = { label: undefined, value: 50 };
      updateWrapper();
      const callsAtMount = infoSpy.mock.calls.length;
      expect(callsAtMount).toBeGreaterThan(0); // sanity: the warning did fire once

      thumbInputs = findThumbInputs();
      for (const val of [51, 52, 53, 54, 55]) {
        await setInputValue(thumbInputs[0], String(val));
      }

      expect(infoSpy.mock.calls.length).toBe(callsAtMount);
    });

    it('does not warn about getValueText when it is provided', () => {
      mockProps = { label: 'Price range', value: [20, 70], getValueText: (v) => `${v}` };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide getValueText'));
    });

    it('falls back to the raw formatted value, without crashing, when getValueText throws', () => {
      mockProps = {
        value: 42,
        getValueText: () => { throw new Error('boom'); },
      };
      expect(() => updateWrapper()).not.toThrow();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-valuetext')).toBe('42');
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('getValueText threw'));
    });

    it('does not crash when getValueText returns a non-string value', () => {
      mockProps = {
        value: 42,
        // @ts-expect-error -- getValueText must return a string
        getValueText: () => 42,
      };
      expect(() => updateWrapper()).not.toThrow();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'aria-valuetext')).toBe('42');
    });

    it('does not warn when aria-labelledby is provided, even without label or aria-label', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns for a whitespace-only label — it has no non-whitespace content, same as an empty one', () => {
      mockProps = { label: '   ' };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns as soon as a reactively-cleared label removes the accessible name after mount, not just at mount time', async () => {
      mockProps = { label: 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));

      await w().setProps({ label: '' });
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns as soon as a parent removes aria-label after mount, not just at mount time', async () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));

      await w().setProps({ 'aria-label': undefined });
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('still warns when the label slot renders only a non-text element (e.g. an icon) with no text content', () => {
      mockProps = { label: <svg aria-hidden="true"><use href="#icon-volume" /></svg> };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn about min/max when min is less than max', () => {
      mockProps = { min: 0, max: 100 };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('is greater than max'));
    });

    it('warns when min is greater than max', () => {
      mockProps = { min: 100, max: 0 };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('is greater than max (0)'));
    });

    it('warns as soon as a reactive prop change inverts min/max after mount, not just at mount time', async () => {
      mockProps = { min: 0, max: 100 };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('is greater than max'));

      await w().setProps({ min: 150 });
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('is greater than max (100)'));
    });

    it('warns when minGapSteps is not a whole number', () => {
      mockProps = { minGapSteps: 2.5 };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('minGapSteps (2.5) is not a whole number'));
    });

    it('does not warn when minGapSteps is a whole number', () => {
      mockProps = { minGapSteps: 2 };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('is not a whole number'));
    });
  });

  describe('Interactivity Tests', () => {
    it.each([
      ['min', NaN],
      ['max', Infinity],
      ['step', NaN],
    ])('warns for a non-finite %s', (prop, value) => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      // React reports a NaN attribute on its own, as an error.
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        mockProps = { [prop]: value } as unknown as TestProps;
        updateWrapper();
        expect(warnSpy.mock.calls.flat().join(' ')).toContain(
          `Invalid prop: custom validator check failed for prop "${prop}"`,
        );
      } finally {
        warnSpy.mockRestore();
        errorSpy.mockRestore();
      }
    });

    it('emits update:modelValue when thumb input event fires', async () => {
      await setInputValue(thumbInputs[0], '75');
      const emitted = w().emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      expect(last(emitted)?.[0]).toBe(75);
    });

    it('emits change on blur when value has changed', async () => {
      await setInputValue(thumbInputs[0], '80');
      await trigger(thumbInputs[0], 'blur');
      expect(w().emitted('change')).toBeTruthy();
    });

    it('does not emit change on blur when value is unchanged', async () => {
      await trigger(thumbInputs[0], 'blur');
      expect(w().emitted('change')).toBeFalsy();
    });

    it('does not emit a false change on blur after an external modelValue update with no user interaction', async () => {
      await w().setProps({ value: 60 });
      await trigger(thumbInputs[0], 'blur');
      expect(w().emitted('change')).toBeFalsy();
    });

    it('still emits change on blur when the user interacts after an external modelValue update', async () => {
      await w().setProps({ value: 60 });
      await setInputValue(thumbInputs[0], '65');
      await trigger(thumbInputs[0], 'blur');
      const emitted = w().emitted('change');
      expect(emitted).toBeTruthy();
      expect(last(emitted)?.[0]).toBe(65);
    });

    it('does not interact when disabled', async () => {
      mockProps = { disabled: true };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'disabled')).toBeDefined();
    });

    it('emits change (not just update:modelValue) when reactively narrowing max forces a value correction', async () => {
      mockProps = { value: 50, min: 0, max: 100 };
      updateWrapper();
      await w().setProps({ max: 40 });
      const emitted = w().emitted('change');
      expect(emitted).toBeTruthy();
      expect(last(emitted)?.[0]).toBe(40);
    });

    it('does not emit change when a reactive min/max/step/minGapSteps change does not actually move the value', async () => {
      mockProps = { value: 50, min: 0, max: 100 };
      updateWrapper();
      await w().setProps({ max: 90 });
      expect(w().emitted('change')).toBeFalsy();
    });

    it('emits focus on thumb focus', async () => {
      await trigger(thumbInputs[0], 'focus');
      expect(w().emitted('focus')).toBeTruthy();
    });

    it('emits blur on thumb blur', async () => {
      await trigger(thumbInputs[0], 'blur');
      expect(w().emitted('blur')).toBeTruthy();
    });

    describe('Exposed public API', () => {
      // document.activeElement only tracks elements attached to the document.
      let attachedWrapper: Wrapper | null = null;

      afterEach(() => {
        attachedWrapper?.unmount();
        attachedWrapper = null;
      });

      it('focus() focuses the first thumb input', () => {
        attachedWrapper = mount(baseProps, { attachTo: document.body });
        const input = attachedWrapper.find('dt-slider-thumb');
        act(() => attachedWrapper!.vm().focus());
        expect(document.activeElement).toBe(input);
      });

      it('blur() blurs the first thumb input', () => {
        attachedWrapper = mount(baseProps, { attachTo: document.body });
        const input = attachedWrapper.find('dt-slider-thumb')!;
        act(() => input.focus());
        expect(document.activeElement).toBe(input);
        act(() => attachedWrapper!.vm().blur());
        expect(document.activeElement).not.toBe(input);
      });

      it('blur() blurs whichever thumb is actually focused in range mode, not always the first one', () => {
        attachedWrapper = mount({ ...baseProps, value: [20, 80] }, { attachTo: document.body });
        const inputs = attachedWrapper.findAll('dt-slider-thumb');
        act(() => inputs[1].focus());
        expect(document.activeElement).toBe(inputs[1]);
        act(() => attachedWrapper!.vm().blur());
        expect(document.activeElement).not.toBe(inputs[1]);
      });
    });

    describe('Pointer drag', () => {
      let control: HTMLElement;

      beforeEach(() => {
        control = w().find('dt-slider-control')!;
        // jsdom does not implement the Pointer Capture API.
        control.setPointerCapture = () => {};
      });

      const down = { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 };

      it('adds the active class to the thumb on pointerdown', async () => {
        await trigger(control, 'pointerdown', down);
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).toContain('d-slider__thumb-visual--active');
      });

      it('focuses the nearest thumb input on pointerdown, so a keyboard nudge works immediately after', async () => {
        thumbInputs = findThumbInputs();
        const focusSpy = vi.spyOn(thumbInputs[0], 'focus');
        await trigger(control, 'pointerdown', down);
        expect(focusSpy).toHaveBeenCalled();
      });

      it('does not add the keyboard-focus ring class for a pointer-driven focus', async () => {
        await trigger(control, 'pointerdown', down);
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).not.toContain('d-slider__thumb-visual--focused');
      });

      it('adds the keyboard-focus ring once the user arrow-navigates after a pointer-driven focus', async () => {
        await trigger(control, 'pointerdown', down);
        thumbInputs = findThumbInputs();
        await trigger(thumbInputs[0], 'keydown', { key: 'ArrowRight' });
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).toContain('d-slider__thumb-visual--focused');
      });

      it('adds the keyboard-focus ring class for a real keyboard (Tab) focus', async () => {
        thumbInputs = findThumbInputs();
        await trigger(thumbInputs[0], 'focus');
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).toContain('d-slider__thumb-visual--focused');
      });

      it('does not corrupt the next real focus after a pointerdown on an already-focused thumb', async () => {
        const attached = mount(baseProps, { attachTo: document.body });
        try {
          const attachedControl = attached.find('dt-slider-control')!;
          attachedControl.setPointerCapture = () => {};
          const attachedInput = attached.find('dt-slider-thumb')!;

          act(() => attachedInput.focus());
          await nextTick();
          expect(document.activeElement).toBe(attachedInput);

          await trigger(attachedControl, 'pointerdown', down);
          await trigger(attachedControl, 'pointerup', { pointerId: 1 });

          act(() => attachedInput.blur());
          await nextTick();
          act(() => attachedInput.focus());
          await nextTick();

          expect(classes(attached.find('dt-slider-thumb-visual'))).toContain('d-slider__thumb-visual--focused');
        } finally {
          attached.unmount();
        }
      });

      it('clears the keyboard-focus ring when a pointer drag starts on an already keyboard-focused thumb', async () => {
        const attached = mount(baseProps, { attachTo: document.body });
        try {
          const attachedControl = attached.find('dt-slider-control')!;
          attachedControl.setPointerCapture = () => {};
          const attachedInput = attached.find('dt-slider-thumb')!;

          act(() => attachedInput.focus());
          await nextTick();
          expect(classes(attached.find('dt-slider-thumb-visual'))).toContain('d-slider__thumb-visual--focused');

          await trigger(attachedControl, 'pointerdown', down);
          const thumbVisual = attached.find('dt-slider-thumb-visual');
          expect(classes(thumbVisual)).not.toContain('d-slider__thumb-visual--focused');
          expect(classes(thumbVisual)).toContain('d-slider__thumb-visual--active');
        } finally {
          attached.unmount();
        }
      });

      it('restores focus to the remaining thumb when a controlled modelValue switches from range to single mode while the high thumb is focused', async () => {
        const attached = mount({ ...baseProps, value: [20, 70] }, { attachTo: document.body });
        try {
          const inputs = attached.findAll('dt-slider-thumb');
          act(() => inputs[1].focus());
          await nextTick();
          expect(document.activeElement).toBe(inputs[1]);

          await attached.setProps({ value: 50 });
          await nextTick();
          await nextTick();

          const remaining = attached.find('dt-slider-thumb');
          expect(document.activeElement).toBe(remaining);
        } finally {
          attached.unmount();
        }
      });

      it('does not recreate a second thumb input when a controlled modelValue switches range to single mid-drag', async () => {
        const attached = mount({ ...baseProps, value: [20, 80] }, { attachTo: document.body });
        try {
          const attachedControl = attached.find('dt-slider-control')!;
          attachedControl.setPointerCapture = () => {};
          stubRect(attachedControl, { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 });

          await trigger(attachedControl, 'pointerdown', {
            pointerId: 1, pointerType: 'mouse', button: 0, clientX: 80, buttons: 1,
          });
          await trigger(attachedControl, 'pointermove', { pointerId: 1, clientX: 80, buttons: 1 });
          expect(attached.findAll('dt-slider-thumb')).toHaveLength(2);

          await attached.setProps({ value: 50 });
          await nextTick();
          expect(attached.findAll('dt-slider-thumb')).toHaveLength(1);

          await trigger(attachedControl, 'pointermove', { pointerId: 1, clientX: 70, buttons: 1 });
          await nextTick();

          expect(attached.findAll('dt-slider-thumb')).toHaveLength(1);
        } finally {
          attached.unmount();
        }
      });

      it('ignores pointerup/pointermove from an unrelated second pointer, so it cannot prematurely commit or freeze the real drag', async () => {
        stubRect(control, { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 });
        await trigger(control, 'pointerdown', {
          pointerId: 1, pointerType: 'mouse', button: 0, clientX: 20, buttons: 1,
        });

        await trigger(control, 'pointerup', { pointerId: 2 });

        await trigger(control, 'pointermove', { pointerId: 1, clientX: 60, buttons: 1 });
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(60);

        await trigger(control, 'pointerup', { pointerId: 1 });
        const emitted = w().emitted('change');
        expect(emitted).toBeTruthy();
      });

      it('ignores a second pointer\'s pointerdown mid-drag, so it cannot hijack ownership and strand the real drag', async () => {
        stubRect(control, { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 });
        await trigger(control, 'pointerdown', {
          pointerId: 1, pointerType: 'mouse', button: 0, clientX: 20, buttons: 1,
        });

        await trigger(control, 'pointerdown', {
          pointerId: 2, pointerType: 'mouse', button: 0, clientX: 80, buttons: 1,
        });

        await trigger(control, 'pointerup', { pointerId: 1 });
        expect(w().emitted('change')).toBeTruthy();
      });

      it('prevents the default browser action on pointerdown, which would otherwise steal focus back after our own .focus() call', async () => {
        const event = new Event('pointerdown', { bubbles: true, cancelable: true });
        Object.assign(event, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        act(() => {
          control.dispatchEvent(event);
        });
        await nextTick();
        expect(event.defaultPrevented).toBe(true);
      });

      it('removes the active class on pointerup', async () => {
        await trigger(control, 'pointerdown', down);
        await trigger(control, 'pointerup', { pointerId: 1 });
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).not.toContain('d-slider__thumb-visual--active');
      });

      it('keeps dragging while a pointermove still reports the button held', async () => {
        await trigger(control, 'pointerdown', down);
        await trigger(control, 'pointermove', { pointerId: 1, clientX: 10, buttons: 1 });
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).toContain('d-slider__thumb-visual--active');
      });

      it('stops dragging when a pointermove reports the button released, even without a matching pointerup', async () => {
        await trigger(control, 'pointerdown', down);
        await trigger(control, 'pointermove', { pointerId: 1, clientX: 10, buttons: 0 });
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).not.toContain('d-slider__thumb-visual--active');
      });

      it('ignores a non-primary mouse button, so the native context menu still works', async () => {
        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 2, clientX: 0, buttons: 2 });
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).not.toContain('d-slider__thumb-visual--active');
      });

      it('adds d-slider--dragging while a pointer drag is active, and removes it on release', async () => {
        await trigger(control, 'pointerdown', down);
        expect(classes(w().find('dt-slider'))).toContain('d-slider--dragging');
        await trigger(control, 'pointerup', { pointerId: 1 });
        expect(classes(w().find('dt-slider'))).not.toContain('d-slider--dragging');
      });

      it('does not start or continue a drag on a disabled slider', async () => {
        mockProps = { disabled: true };
        updateWrapper();
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};

        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        await trigger(control, 'pointermove', { pointerId: 1, clientX: 50, buttons: 1 });
        expect(w().emitted('update:modelValue')).toBeFalsy();
      });

      it('stops accepting drag input the moment disabled flips true mid-drag', async () => {
        await trigger(control, 'pointerdown', down);
        await w().setProps({ disabled: true });
        const emittedBefore = (w().emitted('update:modelValue') || []).length;
        await trigger(control, 'pointermove', { pointerId: 1, clientX: 90, buttons: 1 });
        const emittedAfter = (w().emitted('update:modelValue') || []).length;
        expect(emittedAfter).toBe(emittedBefore);
      });

      it('clears the keyboard-focus ring when disabled flips true while a thumb is focused', async () => {
        thumbInputs = findThumbInputs();
        await trigger(thumbInputs[0], 'focus');
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).toContain('d-slider__thumb-visual--focused');

        await w().setProps({ disabled: true });
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).not.toContain('d-slider__thumb-visual--focused');
      });

      it('closes the tooltip readout when disabled flips true while a thumb is hovered', async () => {
        const hitTarget = w().findAll('dt-slider-thumb-hit')[0];
        await trigger(hitTarget, 'pointerenter');
        const readout = w().find('dt-slider-thumb-readout-tooltip')!;
        expect(readout.matches(':popover-open')).toBe(true);

        await w().setProps({ disabled: true });
        expect(readout.matches(':popover-open')).toBe(false);
      });

      it('routes a pointerdown to the thumb opposite the one last dragged, when both thumbs coincide', async () => {
        mockProps = { value: [50, 50] };
        updateWrapper();
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};

        await trigger(control, 'pointerdown', down);
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).toContain('d-slider__thumb-visual--active');
        await trigger(control, 'pointerup', { pointerId: 1 });

        await trigger(control, 'pointerdown', { ...down, pointerId: 2 });
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[1])).toContain('d-slider__thumb-visual--active');
      });

      it('hands a coincident drag off to the sibling thumb once the crossing clamp pins the active one', async () => {
        mockProps = { value: [0, 0], min: 0, max: 100 };
        updateWrapper();
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 });

        await trigger(control, 'pointerdown', down);
        await trigger(control, 'pointermove', { pointerId: 1, clientX: 60, buttons: 1 });

        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(0);
        expect(Number(thumbInputs[1].value)).toBe(60);
      });

      it('does not hand off a drag that started on a clearly distinct thumb, even after it converges with its sibling', async () => {
        mockProps = { value: [40, 60], min: 0, max: 100 };
        updateWrapper();
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 });

        await trigger(control, 'pointerdown', { ...down, clientX: 40 });
        await trigger(control, 'pointermove', { pointerId: 1, clientX: 60, buttons: 1 });
        await trigger(control, 'pointermove', { pointerId: 1, clientX: 90, buttons: 1 });

        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(60);
        expect(Number(thumbInputs[1].value)).toBe(60);
        thumbVisuals = findThumbVisuals();
        expect(classes(thumbVisuals[0])).toContain('d-slider__thumb-visual--active');
        expect(classes(thumbVisuals[1])).not.toContain('d-slider__thumb-visual--active');
      });
    });

    describe('Pointer-to-value mapping matches the thumb\'s own inset anchor', () => {
      // jsdom computes no layout, so the probe that resolves --slider-edge-inset gets a simulated width here.
      const controlRect = { top: 0, left: 0, right: 200, bottom: 20, width: 200, height: 20 };
      const insetPx = 20;
      let control: HTMLElement;
      let rectSpy: MockInstance;

      beforeEach(() => {
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, controlRect);
        const realGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
        rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
          if (this.style.inlineSize === 'var(--slider-edge-inset)') {
            return { width: insetPx, height: 0, top: 0, left: 0, right: insetPx, bottom: 0 } as DOMRect;
          }
          return realGetBoundingClientRect.call(this);
        });
      });

      afterEach(() => {
        rectSpy.mockRestore();
      });

      const remount = (value: number) => {
        mockProps = { value };
        updateWrapper();
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, controlRect);
      };

      it('maps a click exactly on the min thumb\'s rendered position to min, not a few units off it', async () => {
        remount(50);
        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: insetPx, buttons: 1 });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(0);
      });

      it('maps a click exactly on the max thumb\'s rendered position to max', async () => {
        remount(50);
        await trigger(control, 'pointerdown', {
          pointerId: 1, pointerType: 'mouse', button: 0, clientX: controlRect.width - insetPx, buttons: 1,
        });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(100);
      });

      it('clamps a click at the control\'s true edge, past the inset band, to min', async () => {
        remount(50);
        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(0);
      });

      it('maps a click at the control\'s own midpoint to the midpoint value — the inset term cancels out exactly at 50%', async () => {
        remount(0);
        await trigger(control, 'pointerdown', {
          pointerId: 1, pointerType: 'mouse', button: 0, clientX: controlRect.width / 2, buttons: 1,
        });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(50);
      });
    });

    describe('Magnetic snapping (snapPoints)', () => {
      let control: HTMLElement;

      // A 100px-wide control over [0, 100] makes the fixed 10px snap threshold
      // and the value threshold numerically identical.
      const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };

      const dragTo = async (clientX: number) => {
        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX, buttons: 1 });
      };

      const moveTo = async (clientX: number) => {
        await trigger(control, 'pointermove', { pointerId: 1, clientX, buttons: 1 });
      };

      const remount = () => {
        updateWrapper();
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, controlRect);
      };

      const lastValue = () => last(w().emitted('update:modelValue'))?.[0];

      beforeEach(() => {
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, controlRect);
      });

      it('pulls a dragged value within the snap threshold to the nearest interval snap point', async () => {
        mockProps = { snapPoints: 25 };
        remount();
        await dragTo(23);
        expect(lastValue()).toBe(25);
      });

      it('leaves a value outside the snap threshold freely selectable', async () => {
        mockProps = { snapPoints: 25 };
        remount();
        await dragTo(12);
        expect(lastValue()).toBe(12);
      });

      it('pulls a dragged value within the snap threshold to the nearest arbitrary snap point', async () => {
        mockProps = { snapPoints: [10, 42, 90] };
        remount();
        await dragTo(41);
        expect(lastValue()).toBe(42);
      });

      it('ignores malformed snap points while preserving valid numeric targets', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
          mockProps = {
            // @ts-expect-error -- snap points must be numbers
            snapPoints: ['25', NaN, Infinity, 75],
          };
          remount();

          await dragTo(26);
          expect(lastValue()).toBe(26);

          await moveTo(74);
          expect(lastValue()).toBe(75);
          expect(warnSpy.mock.calls.flat().join(' ')).toContain(
            'Invalid prop: custom validator check failed for prop "snapPoints"',
          );
        } finally {
          warnSpy.mockRestore();
        }
      });

      it('uses normal step quantization, unaffected, for values far from any snap point', async () => {
        mockProps = { snapPoints: [10, 42, 90], step: 1 };
        remount();
        await dragTo(65);
        expect(lastValue()).toBe(65);
      });

      it('does not snap keyboard-driven input, even near a snap point', async () => {
        mockProps = { snapPoints: 25 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], '23');
        expect(lastValue()).toBe(23);
      });

      it('leaves default behavior unchanged when snapPoints is not set', async () => {
        await dragTo(37);
        expect(lastValue()).toBe(37);
      });

      it('re-quantizes an off-grid magnetic-snap value onto the step grid once the drag ends, restoring the real step for the next keyboard nudge', async () => {
        mockProps = { value: 50, min: 0, max: 100, step: 25, snapPoints: [42] };
        remount();

        await dragTo(42);
        thumbInputs = findThumbInputs();
        expect(thumbInputs[0].value).toBe('42');
        expect(attr(thumbInputs[0], 'step')).toBe('any');

        await trigger(control, 'pointerup', { pointerId: 1 });
        thumbInputs = findThumbInputs();
        expect(thumbInputs[0].value).toBe('50'); // nearest real step-grid point
        expect(attr(thumbInputs[0], 'step')).toBe('25');
      });

      it('holds a snapped thumb through hysteresis, past the entry radius, until it clears the wider release radius', async () => {
        mockProps = { snapPoints: 25 };
        remount();

        await dragTo(23); // within entry radius 10 — snaps to 25
        expect(lastValue()).toBe(25);

        await moveTo(10); // past entry radius, but within release radius 20
        expect(lastValue()).toBe(25);

        await moveTo(0); // past the release radius, breaks free
        expect(lastValue()).toBe(0);
      });

      it('snaps each thumb independently in range mode while still respecting the no-crossing clamp', async () => {
        mockProps = { value: [40, 60], snapPoints: 25 };
        remount();
        await dragTo(23);
        expect(lastValue()).toEqual([25, 60]);
      });

      it('snaps exactly at the threshold boundary (inclusive)', async () => {
        mockProps = { snapPoints: 25 };
        remount();
        await dragTo(15);
        expect(lastValue()).toBe(25);
      });

      it('never offers a snap point outside [min, max] as a target, so the emitted value can never leave the documented range', async () => {
        mockProps = { min: 0, max: 100, snapPoints: [105] };
        remount();
        await dragTo(98);
        expect(lastValue()).toBe(98);
      });

      it('snaps correctly for a vertical slider, using the control height rather than width', async () => {
        const verticalRect = { top: 0, left: 0, right: 20, bottom: 100, width: 20, height: 100 };
        mockProps = { orientation: 'vertical', snapPoints: 25 };
        updateWrapper();
        control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, verticalRect);

        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 77, buttons: 1 });
        expect(lastValue()).toBe(25);
      });

      it('releases hysteresis when the range-crossing clamp blocks the snap point, instead of freezing the thumb at the other thumb\'s boundary', async () => {
        mockProps = { value: [40, 75], snapPoints: [90] };
        remount();

        await dragTo(41);
        await moveTo(85);
        expect(lastValue()).toEqual([75, 75]);

        await moveTo(72);
        expect(lastValue()).toEqual([72, 75]);
      });

      it('releases a held snap point immediately if snapPoints reactively changes to no longer include it, instead of staying latched', async () => {
        mockProps = { snapPoints: [20, 80] };
        remount();

        await dragTo(22);
        expect(lastValue()).toBe(20);

        await w().setProps({ snapPoints: [80] });
        await moveTo(25);
        expect(lastValue()).toBe(25);
      });

      it('holds a fractional snap point exactly in range mode, same as single-thumb mode, instead of re-rounding it onto the step grid', async () => {
        mockProps = { value: [20, 80], step: 1, snapPoints: [42.5] };
        remount();

        await dragTo(20);
        await moveTo(42);
        expect(lastValue()).toEqual([42.5, 80]);
      });

      it('keeps a held fractional snap point through a reactive minGapSteps change mid-drag', async () => {
        mockProps = { value: [20, 80], step: 1, snapPoints: [42.5] };
        remount();

        await dragTo(20);
        await moveTo(42);
        await w().setProps({ minGapSteps: 5 });
        expect((lastValue() as number[])[0]).toBe(42.5);
      });

      it('enforces the exact required gap around a held value, not a gap computed against its snapped stand-in', async () => {
        mockProps = { value: [20, 44], step: 1, snapPoints: [42.4] };
        remount();

        await dragTo(20);
        await moveTo(42);
        await w().setProps({ minGapSteps: 5 });
        expect(lastValue()).toEqual([42.4, 47.4]);
      });

      it('clears a stale hold left behind by a coincident-drag handoff, so a later gap change still corrects that thumb', async () => {
        mockProps = { value: [50, 50], min: 0, max: 100, step: 1, snapPoints: [50] };
        remount();

        await dragTo(50);
        await moveTo(70);

        await w().setProps({ minGapSteps: 60 });
        expect(lastValue()).toEqual([10, 70]);
      });
    });

    describe('Keyboard: PageUp / PageDown / Shift+Arrow', () => {
      it('increases value by largeStep on PageUp', async () => {
        await trigger(thumbInputs[0], 'keydown', { key: 'PageUp' });
        const emitted = w().emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(last(emitted)?.[0]).toBe(60); // 50 + 10
      });

      it('decreases value by largeStep on PageDown', async () => {
        await trigger(thumbInputs[0], 'keydown', { key: 'PageDown' });
        const emitted = w().emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(last(emitted)?.[0]).toBe(40); // 50 - 10
      });

      it.each(['ArrowRight', 'ArrowUp'])('increases value by largeStep on Shift+%s', async (key) => {
        await trigger(thumbInputs[0], 'keydown', { key, shiftKey: true });
        const emitted = w().emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(last(emitted)?.[0]).toBe(60); // 50 + 10
      });

      it.each(['ArrowLeft', 'ArrowDown'])('decreases value by largeStep on Shift+%s', async (key) => {
        await trigger(thumbInputs[0], 'keydown', { key, shiftKey: true });
        const emitted = w().emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(last(emitted)?.[0]).toBe(40); // 50 - 10
      });

      it('does not apply largeStep on a plain, non-shifted ArrowRight', async () => {
        await trigger(thumbInputs[0], 'keydown', { key: 'ArrowRight' });
        expect(w().emitted('update:modelValue')).toBeFalsy();
      });
    });

    describe('Range: minGapSteps', () => {
      beforeEach(() => {
        mockProps = { value: [40, 60], minGapSteps: 10 };
        updateWrapper();
        thumbInputs = findThumbInputs();
      });

      it('clamps lower thumb when it would violate min gap', async () => {
        await setInputValue(thumbInputs[0], '55');
        const emitted = w().emitted('update:modelValue');
        // Should be clamped to 50 (60 - 10*1)
        expect((last(emitted)?.[0] as number[])[0]).toBe(50);
      });
    });

    describe('Range: thumbs cannot cross (no minGapSteps set)', () => {
      beforeEach(() => {
        mockProps = { value: [40, 60] };
        updateWrapper();
        thumbInputs = findThumbInputs();
      });

      it('stops the lower thumb at the upper thumb\'s value instead of crossing it', async () => {
        await setInputValue(thumbInputs[0], '90');
        expect(last(w().emitted('update:modelValue'))?.[0]).toEqual([60, 60]);
      });

      it('stops the upper thumb at the lower thumb\'s value instead of crossing it', async () => {
        await setInputValue(thumbInputs[1], '10');
        expect(last(w().emitted('update:modelValue'))?.[0]).toEqual([40, 40]);
      });

      it('lets the two thumbs meet exactly (equal values are allowed)', async () => {
        await setInputValue(thumbInputs[0], '60');
        expect(last(w().emitted('update:modelValue'))?.[0]).toEqual([60, 60]);
      });

      it('enforces the same constraint via PageUp/PageDown (largeStep)', async () => {
        await trigger(thumbInputs[0], 'keydown', { key: 'PageUp' });
        await trigger(thumbInputs[0], 'keydown', { key: 'PageUp' });
        await trigger(thumbInputs[0], 'keydown', { key: 'PageUp' });
        expect(last(w().emitted('update:modelValue'))?.[0]).toEqual([60, 60]);
      });
    });

    it('corrects the native input DOM value when the crossing clamp leaves internalValues unchanged', async () => {
      mockProps = { value: [60, 60] };
      updateWrapper();
      thumbInputs = findThumbInputs();
      await settleCollisions();

      await setInputValue(thumbInputs[0], '61');

      expect(w().emitted('update:modelValue')).toBeFalsy();
      expect(thumbInputs[0].value).toBe('60');
    });

    describe('Range: an inverted modelValue is normalized, not left crossed', () => {
      it('swaps an inverted initial modelValue on mount', () => {
        const value = [70, 30];
        mockProps = { value };
        updateWrapper();
        expect(value).toEqual([70, 30]); // prop itself is untouched
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(30);
        expect(Number(thumbInputs[1].value)).toBe(70);
      });

      it('emits the corrected pair on mount so a v-model source stays in sync, not just the render', () => {
        mockProps = { value: [70, 30] };
        updateWrapper();
        const emitted = w().emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(last(emitted)?.[0]).toEqual([30, 70]);
      });

      it('swaps an inverted modelValue pushed in later via prop update', async () => {
        mockProps = { value: [20, 80] };
        updateWrapper();
        await w().setProps({ value: [90, 10] });
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(10);
        expect(Number(thumbInputs[1].value)).toBe(90);
      });

      it('emits the corrected pair when a later prop update arrives inverted', async () => {
        mockProps = { value: [20, 80] };
        updateWrapper();
        await w().setProps({ value: [90, 10] });
        const emitted = w().emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(last(emitted)?.[0]).toEqual([10, 90]);
      });

      it('does not re-emit when a later prop update is already in order', async () => {
        mockProps = { value: [20, 80] };
        updateWrapper();
        await w().setProps({ value: [25, 75] });
        expect(w().emitted('update:modelValue')).toBeFalsy();
      });
    });

    describe('RTL (dir="rtl")', () => {
      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      const rect100 = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };

      it('mirrors pointer-to-value mapping — a physically-left position maps toward max, not min', async () => {
        await mockControlDirection('rtl');
        const control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, rect100);

        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(90);
      });

      it('does not mirror pointer mapping when direction is (explicitly or by default) ltr', async () => {
        await mockControlDirection('ltr');
        const control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, rect100);

        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(10);
      });

      it('resyncs isRtl when direction changes via CSS/style rather than the dir attribute itself', async () => {
        const original = window.getComputedStyle.bind(window);
        let direction = 'ltr';
        mockControlDirectionSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, ...rest) => {
          if ((el as HTMLElement)?.dataset?.qa === 'dt-slider-control') return { direction } as CSSStyleDeclaration;
          return original(el, ...rest);
        });

        const control = w().find('dt-slider-control')!;
        control.setPointerCapture = () => {};
        stubRect(control, rect100);

        direction = 'rtl';
        // Mutates `class`, not `dir` — simulates a CSS-only direction change.
        await act(async () => {
          document.documentElement.classList.add('rtl-test-marker');
          await Promise.resolve();
        });

        await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(90);

        document.documentElement.classList.remove('rtl-test-marker');
      });

      it('does not resync on a class/style mutation to an unrelated element elsewhere in the document', async () => {
        const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
        const callsBefore = getComputedStyleSpy.mock.calls.length;

        await act(async () => {
          document.body.classList.add('unrelated-marker');
          await Promise.resolve();
        });

        expect(getComputedStyleSpy.mock.calls.length).toBe(callsBefore);
        document.body.classList.remove('unrelated-marker');
        getComputedStyleSpy.mockRestore();
      });

      it('swaps Shift+ArrowRight to decrease (matching the native RTL-flipped arrow keys)', async () => {
        await mockControlDirection('rtl');
        await trigger(thumbInputs[0], 'keydown', { key: 'ArrowRight', shiftKey: true });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(40);
      });

      it('swaps Shift+ArrowLeft to increase (matching the native RTL-flipped arrow keys)', async () => {
        await mockControlDirection('rtl');
        await trigger(thumbInputs[0], 'keydown', { key: 'ArrowLeft', shiftKey: true });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(60);
      });

      it('does not swap Shift+ArrowUp/ArrowDown or PageUp/PageDown under rtl — only Left/Right are direction-relative', async () => {
        await mockControlDirection('rtl');
        await trigger(thumbInputs[0], 'keydown', { key: 'ArrowUp', shiftKey: true });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(60);

        await trigger(thumbInputs[0], 'keydown', { key: 'PageDown' });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(50);
      });

      it('swaps Shift+ArrowRight/ArrowLeft for a vertical slider under rtl too — the native input is never actually reoriented', async () => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
        thumbInputs = findThumbInputs();
        await mockControlDirection('rtl');

        await trigger(thumbInputs[0], 'keydown', { key: 'ArrowRight', shiftKey: true });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(40);
      });

      it('centers the thumb on its actual anchor point under rtl, not one thumb-width off', async () => {
        await mockControlDirection('rtl');
        await w().setProps({ value: 51 });
        const thumbVisual = w().find('dt-slider-thumb-visual');
        expect(attr(thumbVisual, 'style')).toContain('translate(50%, -50%)');
      });

      it('keeps the ltr centering transform when direction is ltr', async () => {
        await mockControlDirection('ltr');
        await w().setProps({ value: 51 });
        const thumbVisual = w().find('dt-slider-thumb-visual');
        expect(attr(thumbVisual, 'style')).toContain('translate(-50%, -50%)');
      });

      it('centers ticks on their anchor point under rtl too', async () => {
        mockProps = { showTicks: 25 };
        updateWrapper();
        await mockControlDirection('rtl');
        await w().setProps({ value: 51 });
        const tick = w().findAll('dt-slider-tick')[1];
        expect(attr(tick, 'style')).toContain('translateX(50%)');
      });
    });

    describe('modelValue bounds and shape validation', () => {
      it('resolves an omitted modelValue to the midpoint of [min, max], matching native <input type="range">', () => {
        mockProps = { value: undefined, min: 10, max: 100 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(55);
      });

      it('clamps an initial modelValue above max down to max', () => {
        mockProps = { value: 150, min: 0, max: 100 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(100);
      });

      it('clamps an initial modelValue below min up to min', () => {
        mockProps = { value: -50, min: 0, max: 100 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(0);
      });

      it('emits the clamped correction on mount so v-model does not disagree with what is rendered', () => {
        mockProps = { value: 150, min: 0, max: 100 };
        updateWrapper();
        const emitted = w().emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(last(emitted)?.[0]).toBe(100);
      });

      it('clamps a later out-of-bounds modelValue prop update', async () => {
        mockProps = { value: 50, min: 0, max: 100 };
        updateWrapper();
        await w().setProps({ value: 500 });
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(100);
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(100);
      });

      it('re-clamps the current value when max shrinks below it, without modelValue itself changing', async () => {
        mockProps = { value: 90, min: 0, max: 100 };
        updateWrapper();
        await w().setProps({ max: 50 });
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(50);
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(50);
      });

      it('re-clamps the current value when min rises above it, without modelValue itself changing', async () => {
        mockProps = { value: 10, min: 0, max: 100 };
        updateWrapper();
        await w().setProps({ min: 30 });
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(30);
      });

      it('truncates a modelValue array longer than 2 to the first two entries instead of rendering extra thumbs', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { value: [10, 50, 90] };
        updateWrapper();
        warnSpy.mockRestore();
        thumbInputs = findThumbInputs();
        expect(thumbInputs).toHaveLength(2);
        expect(Number(thumbInputs[0].value)).toBe(10);
        expect(Number(thumbInputs[1].value)).toBe(50);
      });

      it('degrades a single-entry modelValue array to that one clamped value rather than an unmanaged partial thumb', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { value: [150], min: 0, max: 100 };
        updateWrapper();
        warnSpy.mockRestore();
        thumbInputs = findThumbInputs();
        expect(thumbInputs).toHaveLength(1);
        expect(Number(thumbInputs[0].value)).toBe(100);
      });
    });
  });

  describe('step edge cases', () => {
    it('does not produce NaN when step is 0 — falls back to the clamped raw value', async () => {
      mockProps = { value: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      await setInputValue(thumbInputs[0], '73');
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toBe(73);
    });

    it('does not produce NaN when step is negative — falls back to the clamped raw value', async () => {
      mockProps = { value: 50, min: 0, max: 100, step: -5 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      await setInputValue(thumbInputs[0], '40');
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toBe(40);
    });

    it('falls back to the raw largeStep value for Shift+Arrow when step is 0', async () => {
      mockProps = { value: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      await trigger(thumbInputs[0], 'keydown', { key: 'ArrowRight', shiftKey: true });
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toBe(60);
    });
  });

  describe('Controlled values stay on the native step grid', () => {
    it('snaps a controlled modelValue that does not land on the step grid, correcting the parent', () => {
      mockProps = { value: 42, min: 0, max: 100, step: 25 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(thumbInputs[0].value).toBe('50');
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toBe(50);
    });

    it('sets step="any" on a thumb whose value is off-grid from an active magnetic snap point', async () => {
      mockProps = { value: 50, min: 0, max: 100, step: 25, snapPoints: [42] };
      updateWrapper();
      const control = w().find('dt-slider-control')!;
      control.setPointerCapture = () => {};
      stubRect(control, { left: 0, top: 0, right: 100, bottom: 20, width: 100, height: 20 });
      await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 42, buttons: 1 });
      thumbInputs = findThumbInputs();
      expect(thumbInputs[0].value).toBe('42');
      expect(attr(thumbInputs[0], 'step')).toBe('any');
    });

    it('uses the real step attribute for an on-grid value (the common case)', () => {
      mockProps = { value: 50, min: 0, max: 100, step: 25 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'step')).toBe('25');
    });

    it('uses step="any" for any thumb when step itself is non-positive', () => {
      mockProps = { value: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'step')).toBe('any');
    });
  });

  describe('Range: dependent per-thumb native bounds', () => {
    const values = () => {
      thumbInputs = findThumbInputs();
      return [Number(thumbInputs[0].value), Number(thumbInputs[1].value)];
    };

    it('enforces minGapSteps on a controlled modelValue at mount, not just during interaction', () => {
      mockProps = { value: [40, 60], min: 0, max: 100, step: 1, minGapSteps: 30 };
      updateWrapper();
      const [lo, hi] = values();
      expect(hi - lo).toBeGreaterThanOrEqual(30);
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toEqual([lo, hi]);
    });

    it('re-enforces the gap reactively when minGapSteps changes after mount', async () => {
      mockProps = { value: [40, 60], min: 0, max: 100, step: 1 };
      updateWrapper();
      await w().setProps({ minGapSteps: 30 });
      const [lo, hi] = values();
      expect(hi - lo).toBeGreaterThanOrEqual(30);
    });

    it('binds each thumb\'s native min/max to the sibling-dependent range, not the full [min, max]', () => {
      mockProps = { value: [40, 60], min: 0, max: 100, step: 1, minGapSteps: 5 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'min')).toBe('0');
      expect(attr(thumbInputs[0], 'max')).toBe('55'); // 60 - gap(5)
      expect(attr(thumbInputs[1], 'min')).toBe('45'); // 40 + gap(5)
      expect(attr(thumbInputs[1], 'max')).toBe('100');
    });

    it('single-thumb mode is unaffected — each thumb still uses the full [min, max]', () => {
      mockProps = { value: 50, min: 0, max: 100 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'min')).toBe('0');
      expect(attr(thumbInputs[0], 'max')).toBe('100');
    });

    it('does not apply the sibling gap when a malformed single-element array reaches range mode', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockProps = { value: [50], min: 0, max: 100, step: 1, minGapSteps: 5 };
      updateWrapper();
      warnSpy.mockRestore();
      thumbInputs = findThumbInputs();
      expect(attr(thumbInputs[0], 'min')).toBe('0');
      expect(attr(thumbInputs[0], 'max')).toBe('100');
    });

    it('keeps the result within [min, max] and lo <= hi when minGapSteps*step exceeds the domain span', () => {
      mockProps = { value: [8, 12], min: 0, max: 20, step: 1, minGapSteps: 50 };
      updateWrapper();
      const [lo, hi] = values();
      expect(lo).toBeGreaterThanOrEqual(0);
      expect(hi).toBeLessThanOrEqual(20);
      expect(lo).toBeLessThanOrEqual(hi);
    });

    it('never emits a gap-widened value above max, even when rounding at a coarser precision than max\'s own would overshoot it', () => {
      mockProps = { value: [0.8, 0.9], min: 0, max: 0.96, step: 0.1, minGapSteps: 3 };
      updateWrapper();
      const [lo, hi] = values();
      expect(hi).toBeLessThanOrEqual(0.96);
      expect(hi - lo).toBeCloseTo(0.3, 5);
    });

    it('prefers shrinking the low end over pinning the high end at max, so the high thumb is not left frozen', () => {
      mockProps = { value: [80, 90], min: 0, max: 95, step: 10, minGapSteps: 2 };
      updateWrapper();
      const [lo, hi] = values();
      expect([lo, hi]).toEqual([70, 90]);
      expect(attr(thumbInputs[1], 'min')).not.toBe(attr(thumbInputs[1], 'max'));
    });

    it('keeps the result within [min, max] when min/max reactively shrink below a previously-valid gap', async () => {
      mockProps = { value: [8, 12], min: 0, max: 20, step: 1, minGapSteps: 5 };
      updateWrapper();
      await w().setProps({ max: 10, minGapSteps: 50 });
      const [lo, hi] = values();
      expect(lo).toBeGreaterThanOrEqual(0);
      expect(hi).toBeLessThanOrEqual(10);
      expect(lo).toBeLessThanOrEqual(hi);
    });

    it('does not let a negative minGapSteps invert the drag-time crossing clamp', async () => {
      mockProps = { value: [30, 60], min: 0, max: 100, step: 1, minGapSteps: -5 };
      updateWrapper();
      const control = w().find('dt-slider-control')!;
      control.setPointerCapture = () => {};
      stubRect(control, { left: 0, top: 0, right: 100, bottom: 20, width: 100, height: 20 });
      await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 30, buttons: 1 });
      await trigger(control, 'pointermove', { pointerId: 1, clientX: 70, buttons: 1 });
      const [lo, hi] = values();
      expect(lo).toBeLessThanOrEqual(hi);
    });

    it('does not let a single NaN element in a controlled range modelValue contaminate the other thumb via enforceRangeGap', () => {
      mockProps = { value: [NaN, 5], min: 0, max: 100, step: 1, minGapSteps: 2 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      expect(thumbInputs[0].value).not.toBe('NaN');
      expect(thumbInputs[1].value).not.toBe('NaN');
      expect(Number.isNaN(Number(thumbInputs[0].value))).toBe(false);
      expect(Number.isNaN(Number(thumbInputs[1].value))).toBe(false);
    });

    it('grid-aligns the sibling thumb\'s native bound when the other thumb holds an off-grid magnetic snap point, instead of permanently mismatching its native step', async () => {
      mockProps = { value: [25, 75], min: 0, max: 100, step: 25, snapPoints: [42] };
      updateWrapper();
      const control = w().find('dt-slider-control')!;
      control.setPointerCapture = () => {};
      stubRect(control, { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 });

      await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 40, buttons: 1 });
      thumbInputs = findThumbInputs();
      expect(Number(thumbInputs[0].value)).toBe(42);

      // Native min must be a real grid point (50), not the raw off-grid 42.
      expect(attr(thumbInputs[1], 'min')).toBe('50');
    });
  });

  describe('Vertical orientation + range mode combined', () => {
    const verticalRect = { top: 0, left: 0, right: 20, bottom: 100, width: 20, height: 100 };

    it('drags each thumb independently via clientY and updates the vertical range indicator', async () => {
      mockProps = { orientation: 'vertical', value: [20, 70] };
      updateWrapper();
      const control = w().find('dt-slider-control')!;
      control.setPointerCapture = () => {};
      stubRect(control, verticalRect);

      await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 80, buttons: 1 });
      await trigger(control, 'pointermove', { pointerId: 1, clientY: 70, buttons: 1 });
      await trigger(control, 'pointerup', { pointerId: 1 });

      await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 30, buttons: 1 });
      await trigger(control, 'pointermove', { pointerId: 1, clientY: 40, buttons: 1 });
      await trigger(control, 'pointerup', { pointerId: 1 });

      thumbInputs = findThumbInputs();
      expect(thumbInputs[0].value).toBe('30');
      expect(thumbInputs[1].value).toBe('60');

      const style = attr(w().find('dt-slider-indicator'), 'style');
      expect(style).toContain('bottom: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.3)');
      expect(style).toContain('height: calc((100% - var(--slider-edge-inset) * 2) * 0.3)');
    });
  });

  describe('largeStep always moves when step is coarser than largeStep', () => {
    it('moves by a full step instead of no-op-ing when step > 2 * largeStep', async () => {
      mockProps = { value: 100, min: 0, max: 200, step: 25 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      await trigger(thumbInputs[0], 'keydown', { key: 'PageUp' });
      expect(w().emitted('update:modelValue')).toBeTruthy();
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toBe(125);
    });

    it('still moves by exactly one step when even one step would overshoot largeStep by a lot', async () => {
      mockProps = { value: 100, min: 0, max: 105, step: 25, largeStep: 1 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      await trigger(thumbInputs[0], 'keydown', { key: 'PageDown' });
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toBe(75);
    });

    it('keeps exact backward-compatible behavior for the common case (step=1, default largeStep=10)', async () => {
      mockProps = { value: 50 };
      updateWrapper();
      thumbInputs = findThumbInputs();
      await trigger(thumbInputs[0], 'keydown', { key: 'PageUp' });
      expect(w().emitted('update:modelValue')?.at(-1)?.[0]).toBe(60);
    });
  });

  describe('Fractional step precision', () => {
    describe('Decimal modelValue rendering', () => {
      it('renders a fractional modelValue on the native input', () => {
        mockProps = { value: 3.141, min: 0, max: 10, step: 0.001 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(thumbInputs[0].value).toBe('3.141');
      });

      it('renders a fractional min on the native input attribute', () => {
        mockProps = { value: 1.5, min: 0.5, max: 2.5, step: 0.25 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(attr(thumbInputs[0], 'min')).toBe('0.5');
      });

      it('renders a fractional max on the native input attribute', () => {
        mockProps = { value: 1.5, min: 0.5, max: 2.5, step: 0.25 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(attr(thumbInputs[0], 'max')).toBe('2.5');
      });

      it('renders a fractional step on the native input attribute', () => {
        mockProps = { value: 0.5, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(attr(thumbInputs[0], 'step')).toBe('0.1');
      });
    });

    describe('Snap precision (no IEEE 754 drift)', () => {
      const inputThenLast = async (props: TestProps, value: string) => {
        mockProps = props;
        updateWrapper();
        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], value);
        return last(w().emitted('update:modelValue'))?.[0];
      };

      it('emits exact value for step=0.1 — avoids 3×0.1 = 0.30000000000000004', async () => {
        expect(await inputThenLast({ value: 0, min: 0, max: 1, step: 0.1 }, '0.3')).toBe(0.3);
      });

      it('emits exact value for step=0.001 — avoids 3141×0.001 = 3.1410000000000004', async () => {
        expect(await inputThenLast({ value: 0, min: 0, max: 10, step: 0.001 }, '3.141')).toBe(3.141);
      });

      it('emits exact value for step=0.05', async () => {
        expect(await inputThenLast({ value: 0, min: 0, max: 1, step: 0.05 }, '0.15')).toBe(0.15);
      });

      it('preserves a tiny modelValue expressed in scientific notation on mount, instead of truncating it to 0', () => {
        mockProps = { value: 5e-7, min: 0, max: 1e-6, step: 1e-7 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        expect(Number(thumbInputs[0].value)).toBe(5e-7);
      });

      it('emits exact value for step=0.25 with non-zero min', async () => {
        expect(await inputThenLast({ value: 0.25, min: 0.25, max: 2.0, step: 0.25 }, '1.25')).toBe(1.25);
      });

      it('emits exact integer for integer step (no regression)', async () => {
        expect(await inputThenLast({ value: 0, min: 0, max: 100, step: 1 }, '73')).toBe(73);
      });

      it('clamps to max without drift for fractional step', async () => {
        expect(await inputThenLast({ value: 0, min: 0, max: 1, step: 0.1 }, '1.5')).toBe(1);
      });

      it('clamps to min without drift for fractional step', async () => {
        expect(await inputThenLast({ value: 0.5, min: 0, max: 1, step: 0.1 }, '-0.5')).toBe(0);
      });
    });

    describe('Tick generation with fractional interval', () => {
      it('generates 5 ticks for showTicks=0.25 over 0–1', () => {
        mockProps = { showTicks: 0.25, min: 0, max: 1, step: 0.25 };
        updateWrapper();
        expect(w().findAll('dt-slider-tick')).toHaveLength(5);
      });

      it('generates 11 ticks for showTicks=0.1 over 0–1', () => {
        mockProps = { showTicks: 0.1, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        expect(w().findAll('dt-slider-tick')).toHaveLength(11);
      });

      it('generates 5 ticks for showTicks=2.5 over 0–10', () => {
        mockProps = { showTicks: 2.5, min: 0, max: 10, step: 2.5 };
        updateWrapper();
        expect(w().findAll('dt-slider-tick')).toHaveLength(5);
      });

      it('generates exactly 11 ticks for step=0.1 over 0–1 — no extra tick from loop drift', () => {
        mockProps = { showTicks: true, step: 0.1, min: 0, max: 1 };
        updateWrapper();
        expect(w().findAll('dt-slider-tick')).toHaveLength(11);
      });
    });

    describe('Marks default', () => {
      const marks = () => w().findAll('dt-slider-mark');

      it('ignores malformed marks without losing valid annotations', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
          mockProps = {
            // @ts-expect-error -- each mark is a number or an object with a numeric value
            showMarks: [null, {}, NaN, { value: '50' }, 25, { value: 75, text: 'High' }],
          };
          expect(() => updateWrapper()).not.toThrow();
          const found = marks();
          expect(found.map(mark => mark.textContent)).toEqual(['25', 'High']);
          expect(found[0].style.insetInlineStart)
            .toBe('calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.25)');
          expect(found[1].style.insetInlineStart)
            .toBe('calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.75)');
          expect(warnSpy.mock.calls.flat().join(' ')).toContain(
            'Invalid prop: custom validator check failed for prop "showMarks"',
          );
        } finally {
          warnSpy.mockRestore();
        }
      });

      it('renders no marks by default', async () => {
        await nextTick();
        expect(marks()).toHaveLength(0);
      });

      it('renders start and end marks when showMarks is true', async () => {
        mockProps = { showMarks: true };
        updateWrapper();
        await nextTick();
        const found = marks();
        expect(found).toHaveLength(2);
        expect(found[0].textContent).toBe(String(baseProps.min ?? 0));
        expect(found[1].textContent).toBe(String(baseProps.max ?? 100));
      });

      it('renders no marks when showMarks is explicitly false', async () => {
        mockProps = { showMarks: false };
        updateWrapper();
        await nextTick();
        expect(marks()).toHaveLength(0);
      });

      it('applies suffix to default and bare-number marks, but not explicit text', async () => {
        mockProps = { suffix: '%', showMarks: [25, { value: 75, text: 'Cap' }] };
        updateWrapper();
        await nextTick();
        const found = marks();
        expect(found[0].textContent).toBe('25%');
        expect(found[1].textContent).toBe('Cap');
      });

      it('ignores getValueText for a bare-number mark and falls back to suffix — a mark has no thumb index for getValueText to differentiate on', async () => {
        mockProps = { suffix: '%', getValueText: (v, i) => (i === 0 ? `${v} low` : `${v} high`), showMarks: [25] };
        updateWrapper();
        await nextTick();
        expect(w().find('dt-slider-mark')?.textContent).toBe('25%');
      });

      it('ignores getValueText for the min/max marks too', async () => {
        mockProps = {
          suffix: '%', showMarks: true, getValueText: (v, i) => (i === 0 ? `Minimum: ${v}` : `Maximum: ${v}`),
        };
        updateWrapper();
        await nextTick();
        const found = marks();
        expect(found[0].textContent).toBe(`${baseProps.min ?? 0}%`);
        expect(found[1].textContent).toBe(`${baseProps.max ?? 100}%`);
      });

      it('still uses an explicit mark text override even when getValueText is set', async () => {
        mockProps = { getValueText: (v) => `${v} units`, showMarks: [{ value: 25, text: 'Cap' }] };
        updateWrapper();
        await nextTick();
        expect(w().find('dt-slider-mark')?.textContent).toBe('Cap');
      });
    });

    describe('Thumb and tick edge inset — the thumb never visually crosses the first/last tick', () => {
      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      const EDGE_INSET = 'var(--slider-edge-inset)';

      it('insets the thumb at min instead of reaching the control\'s true 0% edge', () => {
        mockProps = { value: 0 };
        updateWrapper();
        expect(attr(thumbVisuals[0], 'style')).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 0)`);
      });

      it('insets the thumb at max instead of reaching the control\'s true 100% edge', () => {
        mockProps = { value: 100 };
        updateWrapper();
        expect(attr(thumbVisuals[0], 'style')).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 1)`);
      });

      it('applies the same inset to the thumb-hit area as the visible thumb, so the draggable/hit target stays under it', () => {
        mockProps = { value: 0 };
        updateWrapper();
        const hit = w().findAll('dt-slider-thumb-hit')[0];
        expect(attr(hit, 'style')).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 0)`);
      });

      it('insets the min tick onto the same anchorPct band as the thumb, instead of centering it on the true 0% edge', () => {
        mockProps = { showTicks: 100 };
        updateWrapper();
        const ticks = w().findAll('dt-slider-tick');
        expect(attr(ticks[0], 'style')).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 0)`);
        expect(attr(ticks[0], 'style')).toContain('translateX(-50%)');
      });

      it('insets the max tick onto the same anchorPct band as the thumb, instead of centering it on the true 100% edge', () => {
        mockProps = { showTicks: 100 };
        updateWrapper();
        const ticks = w().findAll('dt-slider-tick');
        expect(attr(ticks[1], 'style')).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 1)`);
        expect(attr(ticks[1], 'style')).toContain('translateX(-50%)');
      });

      it('mirrors the edge tick\'s centering transform under rtl, same as every other track element', async () => {
        mockProps = { showTicks: 100 };
        updateWrapper();
        await mockControlDirection('rtl');
        await nextTick();
        const ticks = w().findAll('dt-slider-tick');
        expect(attr(ticks[0], 'style')).toContain('translateX(50%)');
        expect(attr(ticks[1], 'style')).toContain('translateX(50%)');
      });
    });

    describe('Edge-aligned min/max marks', () => {
      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      it('nudges the min mark 1px inward from the flush edge instead of centering it', async () => {
        mockProps = { showMarks: true };
        updateWrapper();
        await nextTick();
        expect(attr(w().findAll('dt-slider-mark')[0], 'style')).toContain('translateX(1px)');
      });

      it('nudges the max mark 1px inward from the flush edge, shifted by its own full width', async () => {
        mockProps = { showMarks: true };
        updateWrapper();
        await nextTick();
        expect(attr(w().findAll('dt-slider-mark')[1], 'style')).toContain('translateX(calc(-100% + -1px))');
      });

      it('still centers a custom mark that does not land on min or max — no inline transform override, relying on the CSS default', async () => {
        mockProps = { showMarks: [50] };
        updateWrapper();
        await nextTick();
        const mark = w().find('dt-slider-mark');
        expect(mark).not.toBeNull();
        expect(attr(mark, 'style')).not.toContain('transform');
      });

      it('mirrors the end-edge shift under rtl, same sign flip as the centering transform', async () => {
        mockProps = { showMarks: true };
        updateWrapper();
        await mockControlDirection('rtl');
        await nextTick();
        expect(attr(w().findAll('dt-slider-mark')[1], 'style')).toContain('translateX(calc(100% + 1px))');
      });

      it('does not edge-align marks in vertical orientation, where this distinction does not apply', async () => {
        mockProps = { showMarks: true, orientation: 'vertical' };
        updateWrapper();
        await nextTick();
        const found = w().findAll('dt-slider-mark');
        expect(found).toHaveLength(2);
        expect(attr(found[0], 'style')).not.toContain('transform');
        expect(attr(found[1], 'style')).not.toContain('transform');
      });
    });

    describe('Mark / readout collision avoidance', () => {
      // jsdom has no layout: getBoundingClientRect() is all zeros. The always
      // readout's position is computed analytically from pct + the control's
      // own rect, so the control needs a stub too.
      const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
      const readoutSize = { top: 0, left: 0, right: 20, bottom: 20 }; // 20px wide
      const nearReadoutRect = { top: 0, left: 150, right: 170, bottom: 20 }; // overlaps a readout at pct 51
      const farRect = { top: 0, left: 250, right: 270, bottom: 20 };

      const marks = () => w().findAll('dt-slider-mark');
      const hidden = 'd-slider__mark--collision-hidden';

      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      it('observes the control on mount and disconnects on unmount', () => {
        const observeSpy = vi.spyOn(globalThis.ResizeObserver.prototype, 'observe');
        const disconnectSpy = vi.spyOn(globalThis.ResizeObserver.prototype, 'disconnect');
        updateWrapper();
        expect(observeSpy).toHaveBeenCalledWith(w().find('dt-slider-control'));
        w().unmount();
        expect(disconnectSpy).toHaveBeenCalled();
        observeSpy.mockRestore();
        disconnectSpy.mockRestore();
      });

      it('actually recomputes collisions when the observed control resizes, not just a no-op subscription', async () => {
        let observerCallback: (() => void) | undefined;
        const OriginalResizeObserver = globalThis.ResizeObserver;
        globalThis.ResizeObserver = class {
          constructor (callback: () => void) {
            observerCallback = callback;
          }

          observe () {}
          disconnect () {}
          unobserve () {}
        } as unknown as typeof ResizeObserver;

        try {
          mockProps = { readout: 'always', showMarks: [0, 100], value: 50 };
          updateWrapper();
          await nextTick();

          stubRect(w().find('dt-slider-control')!, controlRect);
          const found = marks();
          const readouts = w().findAll('dt-slider-thumb-readout');
          stubRect(found[0], farRect);
          stubRect(found[1], farRect);
          stubRect(readouts[0], readoutSize);
          thumbInputs = findThumbInputs();
          await setInputValue(thumbInputs[0], '51');
          await settleCollisions();
          expect(classes(marks()[0])).not.toContain(hidden);

          stubRect(found[0], nearReadoutRect);
          act(() => observerCallback?.());
          await settleCollisions();

          expect(classes(marks()[0])).toContain(hidden);
        } finally {
          globalThis.ResizeObserver = OriginalResizeObserver;
        }
      });

      it('hides a mark once it overlaps the visible readout', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], value: 50 };
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        const found = marks();
        const readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(found[0], nearReadoutRect);
        stubRect(found[1], farRect);
        stubRect(readouts[0], readoutSize);

        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], '51');
        await settleCollisions();

        expect(classes(marks()[0])).toContain(hidden);
        expect(classes(marks()[1])).not.toContain(hidden);
      });

      it('positions the analytical readout rect on the thumb\'s own inset band, not the flush track percentage, when --slider-edge-inset resolves non-zero', async () => {
        const insetPx = 30;
        const realGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
        const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
          if (this.style.inlineSize === 'var(--slider-edge-inset)') {
            return { width: insetPx, height: 0, top: 0, left: 0, right: insetPx, bottom: 0 } as DOMRect;
          }
          return realGetBoundingClientRect.call(this);
        });

        try {
          mockProps = { readout: 'always', showMarks: [0, 100], value: 99 };
          updateWrapper();
          await nextTick();

          stubRect(w().find('dt-slider-control')!, controlRect);
          const found = marks();
          const readouts = w().findAll('dt-slider-thumb-readout');
          const anchoredMarkRect = { top: 0, left: 260, right: 280, bottom: 20 };
          stubRect(found[0], anchoredMarkRect);
          stubRect(found[1], farRect);
          stubRect(readouts[0], readoutSize);

          thumbInputs = findThumbInputs();
          await setInputValue(thumbInputs[0], '100');
          await settleCollisions();

          expect(classes(marks()[0])).toContain(hidden);
        } finally {
          rectSpy.mockRestore();
        }
      });

      it('hides a mark once it overlaps the tooltip readout (the default mode) — tooltip elements are looked up by their own ref array, not data-readout-index', async () => {
        mockProps = { showMarks: [0, 100], value: 50 }; // readout defaults to 'tooltip'
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        const hitTarget = w().findAll('dt-slider-thumb-hit')[0];
        await trigger(hitTarget, 'pointerenter');
        const found = marks();
        const tooltip = w().find('dt-slider-thumb-readout-tooltip')!;
        stubRect(tooltip, nearReadoutRect);
        stubRect(found[0], nearReadoutRect);
        stubRect(found[1], farRect);

        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], '10');
        await settleCollisions();

        expect(classes(marks()[0])).toContain(hidden);
        expect(classes(marks()[1])).not.toContain(hidden);
      });

      it('keeps a mark visible when it does not overlap the readout', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], value: 50 };
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        const found = marks();
        const readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(found[0], farRect);
        stubRect(found[1], farRect);
        stubRect(readouts[0], readoutSize);

        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], '51');
        await settleCollisions();

        expect(classes(marks()[0])).not.toContain(hidden);
        expect(classes(marks()[1])).not.toContain(hidden);
      });

      it('restores a mark when the overlapping tooltip readout closes', async () => {
        mockProps = { showMarks: [0, 100], value: 50 };
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        const found = marks();
        stubRect(found[0], nearReadoutRect);
        stubRect(w().find('dt-slider-thumb-readout-tooltip')!, nearReadoutRect);

        const hitTarget = w().find('dt-slider-thumb-hit')!;
        await trigger(hitTarget, 'pointerenter');
        await settleCollisions();
        expect(classes(marks()[0])).toContain(hidden);

        await trigger(hitTarget, 'pointerleave');
        await settleCollisions();

        expect(classes(marks()[0])).not.toContain(hidden);
      });

      it('re-checks collisions when getValueText changes the readout text, even though the value itself did not change', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], value: 50, getValueText: (v) => `${v}` };
        updateWrapper();

        stubRect(w().find('dt-slider-control')!, controlRect);
        const found = marks();
        const readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(found[0], farRect);
        stubRect(found[1], farRect);
        stubRect(readouts[0], readoutSize);
        await settleCollisions();
        expect(classes(marks()[0])).not.toContain(hidden);

        stubRect(found[0], nearReadoutRect);
        await w().setProps({ getValueText: (v) => `Volume: ${v}` });
        await settleCollisions();

        expect(classes(marks()[0])).toContain(hidden);
        expect(classes(marks()[1])).not.toContain(hidden);
      });

      it('detects a readout/mark collision correctly under rtl, where pct mirrors to the physical right', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], value: 50 };
        updateWrapper();
        await nextTick();

        await mockControlDirection('rtl');
        stubRect(w().find('dt-slider-control')!, controlRect);
        const found = marks();
        const readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(readouts[0], readoutSize);

        const nearMirroredReadoutRect = { top: 0, left: 20, right: 40, bottom: 20 };
        stubRect(found[0], nearMirroredReadoutRect);
        stubRect(found[1], farRect);

        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], '90');
        await settleCollisions();

        expect(classes(marks()[0])).toContain(hidden);
        expect(classes(marks()[1])).not.toContain(hidden);
      });

      it('re-measures collisions on a pure runtime dir flip, with no value/marks/prefix/suffix change', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], value: 90 };
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        const found = marks();
        const readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(readouts[0], readoutSize);
        const neutralRect = { top: 0, left: 120, right: 140, bottom: 20 };
        stubRect(found[0], neutralRect);
        stubRect(found[1], neutralRect);
        await settleCollisions();

        expect(classes(marks()[0])).not.toContain(hidden);

        const nearMirroredReadoutRect = { top: 0, left: 20, right: 40, bottom: 20 };
        stubRect(found[0], nearMirroredReadoutRect);
        await mockControlDirection('rtl');
        await settleCollisions();

        expect(classes(marks()[0])).toContain(hidden);
      });
    });

    describe('Edge-aware mark label clamping', () => {
      // 300px-wide control, matching the collision-avoidance describe above.
      const controlRect = { top: 0, left: 100, right: 400, bottom: 20 };

      // jsdom has no layout engine — read the mark's own applied inline
      // offset back out of its style to simulate a real browser's rect.
      function rectWithCurrentOffset (el: HTMLElement, naturalLeft: number, naturalRight: number) {
        return () => {
          const match = (el.style.transform || '').match(/calc\([^+]+\+\s*(-?[\d.]+)px\)/);
          const offset = match ? parseFloat(match[1]) : 0;
          return { top: 0, left: naturalLeft + offset, right: naturalRight + offset, bottom: 20 };
        };
      }

      const markStyleAfterInput = async (value: string, index = 0) => {
        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], value);
        await settleCollisions();
        return attr(w().findAll('dt-slider-mark')[index], 'style');
      };

      const setup = async (props: TestProps = {}) => {
        mockProps = { showMarks: [5, 95], value: 50, ...props };
        updateWrapper();
        await nextTick();
        stubRect(w().find('dt-slider-control')!, controlRect);
        return w().findAll('dt-slider-mark');
      };

      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      it('does not shift a mark whose overflow already fits within the existing overflow-clip-margin tolerance (32px)', async () => {
        const marks = await setup();
        stubRect(marks[0], { top: 0, left: 80, right: 150, bottom: 20 });
        stubRect(marks[1], { top: 0, left: 350, right: 420, bottom: 20 });
        expect(await markStyleAfterInput('51')).not.toContain('translateX(calc(');
      });

      it('does not shift a mark whose overflow lands exactly at the 32px tolerance boundary (the condition is a strict >)', async () => {
        const marks = await setup();
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 68, 150));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 420));
        expect(await markStyleAfterInput('51')).not.toContain('translateX(calc(');
      });

      it('shifts a mark by exactly 1px once its overflow is just 1px past the 32px tolerance boundary', async () => {
        const marks = await setup();
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 67, 150));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 420));
        expect(await markStyleAfterInput('51')).toContain('translateX(calc(-50% + 1px))');
      });

      it('shifts a start-edge mark inward by only the excess past the 32px tolerance, not the full overflow', async () => {
        const marks = await setup();
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 50, 150));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 420));
        expect(await markStyleAfterInput('51')).toContain('translateX(calc(-50% + 18px))');
      });

      it('shifts an end-edge mark inward (the opposite direction) by only the excess past the tolerance', async () => {
        const marks = await setup();
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 500, 520));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 450));
        expect(await markStyleAfterInput('51', 1)).toContain('translateX(calc(-50% + -18px))');
      });

      it('re-measures from the natural (unshifted) position, so a later smaller overflow reduces the offset instead of compounding on top of it', async () => {
        const marks = await setup();
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 50, 150));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 420));
        expect(await markStyleAfterInput('51')).toContain('+ 18px');

        stubRect(marks[0], rectWithCurrentOffset(marks[0], 60, 150));
        expect(await markStyleAfterInput('52')).toContain('translateX(calc(-50% + 8px))');
      });

      it('does not apply any offset in vertical orientation, where marks sit beside the track rather than below it', async () => {
        const marks = await setup({ orientation: 'vertical' });
        stubRect(marks[0], { top: 0, left: 50, right: 150, bottom: 20 });
        stubRect(marks[1], { top: 0, left: 350, right: 420, bottom: 20 });
        expect(await markStyleAfterInput('51')).not.toContain('translateX(calc(');
      });

      it('drops an already-applied offset immediately when orientation switches from horizontal to vertical', async () => {
        const marks = await setup();
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 50, 150));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 420));
        expect(await markStyleAfterInput('51')).toContain('translateX(calc(');

        await w().setProps({ orientation: 'vertical' });

        expect(attr(w().findAll('dt-slider-mark')[0], 'style')).not.toContain('translateX(calc(');
      });

      it('mirrors the shift direction under RTL, same as the existing centering transform', async () => {
        mockProps = { showMarks: [5, 95], value: 50 };
        updateWrapper();
        await nextTick();

        await mockControlDirection('rtl');
        stubRect(w().find('dt-slider-control')!, controlRect);
        const marks = w().findAll('dt-slider-mark');
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 50, 150));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 420));

        expect(await markStyleAfterInput('51')).toContain('translateX(calc(50% + 18px))');
      });

      it('composes correctly with mark/readout collision-hiding — an edge-clamped mark can still be hidden by an overlapping readout', async () => {
        const marks = await setup({ readout: 'always', value: 20 });
        const readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(marks[0], rectWithCurrentOffset(marks[0], 50, 150));
        stubRect(marks[1], rectWithCurrentOffset(marks[1], 350, 420));
        stubRect(readouts[0], { top: 0, left: 0, right: 10, bottom: 20 });

        expect(await markStyleAfterInput('21')).toContain('translateX(calc(-50% + 18px))');
        expect(classes(w().findAll('dt-slider-mark')[0])).toContain('d-slider__mark--collision-hidden');
      });
    });

    describe('Edge-aware readout label clamping (readout="always")', () => {
      const controlRect = { top: 0, left: 100, right: 400, bottom: 20 };

      function rectWithCurrentOffset (el: HTMLElement, naturalLeft: number, naturalRight: number) {
        return () => {
          const match = (el.style.transform || '').match(/calc\([^+]+\+\s*(-?[\d.]+)px\)/);
          const offset = match ? parseFloat(match[1]) : 0;
          return { top: 0, left: naturalLeft + offset, right: naturalRight + offset, bottom: 20 };
        };
      }

      const setupAlways = async (props: TestProps = {}) => {
        mockProps = { readout: 'always', value: 50, ...props };
        updateWrapper();
        await nextTick();
        stubRect(w().find('dt-slider-control')!, controlRect);
      };

      const readoutStyleAfterInput = async (value: string, qa = 'dt-slider-thumb-readout') => {
        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], value);
        await settleCollisions();
        return attr(w().find(qa), 'style');
      };

      it('shifts an individual readout inward by its full overflow, with no tolerance allowance', async () => {
        await setupAlways();
        const readout = w().find('dt-slider-thumb-readout')!;
        stubRect(readout, rectWithCurrentOffset(readout, 50, 150));
        expect(await readoutStyleAfterInput('51')).toContain('translateX(calc(-50% + 50px))');
      });

      it('does not shift a readout that does not overflow the control edge at all', async () => {
        await setupAlways();
        stubRect(w().find('dt-slider-thumb-readout')!, { top: 0, left: 150, right: 250, bottom: 20 });
        expect(await readoutStyleAfterInput('51')).not.toContain('translateX(calc(');
      });

      it('shifts the merged readout pill too, independently of the individual (hidden) readouts', async () => {
        await setupAlways({ value: [55, 60], min: 0, max: 100 });
        const readoutSize = { top: 0, left: 0, right: 20, bottom: 20 };
        w().findAll('dt-slider-thumb-readout').forEach((r) => stubRect(r, readoutSize));
        await settleCollisions();
        expect(w().find('dt-slider-thumb-readout-merged')).not.toBeNull();

        const merged = w().find('dt-slider-thumb-readout-merged')!;
        stubRect(merged, rectWithCurrentOffset(merged, 50, 150));
        expect(await readoutStyleAfterInput('56', 'dt-slider-thumb-readout-merged')).toContain('translateX(calc(-50% + 50px))');
      });

      it('drops an already-applied offset immediately when orientation switches from horizontal to vertical', async () => {
        await setupAlways();
        const readout = w().find('dt-slider-thumb-readout')!;
        stubRect(readout, rectWithCurrentOffset(readout, 50, 150));
        expect(await readoutStyleAfterInput('51')).toContain('translateX(calc(');

        await w().setProps({ orientation: 'vertical' });

        expect(attr(w().find('dt-slider-thumb-readout'), 'style')).not.toContain('translateX(calc(');
      });
    });

    describe('Range readout collision merge', () => {
      const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
      const readoutSize = { top: 0, left: 0, right: 20, bottom: 20 }; // 20px wide

      it('merges both readouts into a single centered pill once they overlap', async () => {
        mockProps = { readout: 'always', value: [40, 60], min: 0, max: 100, readoutClass: 'custom-readout' };
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        let readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(readouts[0], readoutSize);
        stubRect(readouts[1], readoutSize);

        thumbInputs = findThumbInputs();
        // 55 vs 60: 15px apart on a 300px control, inside the combined 20px of half-widths.
        await setInputValue(thumbInputs[0], '55');
        await settleCollisions();

        readouts = w().findAll('dt-slider-thumb-readout');
        expect(classes(readouts[0])).toContain('d-slider__readout--hide');
        expect(classes(readouts[1])).toContain('d-slider__readout--hide');

        const merged = w().find('dt-slider-thumb-readout-merged');
        expect(merged).not.toBeNull();
        expect(merged?.textContent).toBe('55–60');
        expect(classes(merged)).toContain('custom-readout');

        readouts.forEach(readout => stubRect(readout, { ...readoutSize, right: 4 }));
        await w().setProps({ readoutClass: 'compact-readout' });
        await settleCollisions();
        expect(w().find('dt-slider-thumb-readout-merged')).toBeNull();
        readouts.forEach(readout => expect(classes(readout)).toContain('d-slider__readout--show'));
      });

      it('keeps both readouts separate when they do not overlap', async () => {
        mockProps = { readout: 'always', value: [20, 80], min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        const readouts = w().findAll('dt-slider-thumb-readout');
        stubRect(readouts[0], readoutSize);
        stubRect(readouts[1], readoutSize);

        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], '21');
        await settleCollisions();

        const readoutsAfter = w().findAll('dt-slider-thumb-readout');
        expect(classes(readoutsAfter[0])).toContain('d-slider__readout--show');
        expect(classes(readoutsAfter[1])).toContain('d-slider__readout--show');
        expect(w().find('dt-slider-thumb-readout-merged')).toBeNull();
      });

      it('does not merge outside range mode', async () => {
        mockProps = { readout: 'always', value: 50, min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        stubRect(w().find('dt-slider-control')!, controlRect);
        stubRect(w().find('dt-slider-thumb-readout')!, readoutSize);

        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[0], '51');
        await settleCollisions();

        expect(w().find('dt-slider-thumb-readout-merged')).toBeNull();
      });
    });

    describe('Marks with fractional positions', () => {
      it('renders the correct number of marks for a fractional marks array', () => {
        mockProps = { showMarks: [0.25, 0.5, 0.75], min: 0, max: 1, step: 0.25 };
        updateWrapper();
        expect(w().findAll('dt-slider-mark')).toHaveLength(3);
      });

      it('renders mark text for a fractional number entry', () => {
        mockProps = { showMarks: [0.5], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        expect(w().find('dt-slider-mark')?.textContent).toBe('0.5');
      });

      it('renders mark text from an object entry at a fractional position', () => {
        mockProps = { showMarks: [{ value: 0.5, text: 'Halfway' }], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        expect(w().find('dt-slider-mark')?.textContent).toBe('Halfway');
      });

      it('renders exactly the two min/max marks when showMarks is true, even with a fractional step', () => {
        mockProps = { showMarks: true, step: 0.25, min: 0, max: 1 };
        updateWrapper();
        const marks = w().findAll('dt-slider-mark');
        expect(marks).toHaveLength(2);
        expect(marks[0].textContent).toBe('0');
        expect(marks[1].textContent).toBe('1');
      });
    });

    describe('Range mode with fractional step', () => {
      beforeEach(() => {
        mockProps = { value: [0.2, 0.8], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = findThumbInputs();
      });

      it('renders the lower bound on the first input', () => {
        expect(thumbInputs[0].value).toBe('0.2');
      });

      it('renders the upper bound on the second input', () => {
        expect(thumbInputs[1].value).toBe('0.8');
      });

      it('emits exact fractional values for range mode update', async () => {
        await setInputValue(thumbInputs[0], '0.3');
        expect((last(w().emitted('update:modelValue'))?.[0] as number[])[0]).toBe(0.3);
      });

      it('enforces minGapSteps gap with fractional step', async () => {
        mockProps = { value: [1.0, 3.0], min: 0, max: 10, step: 0.5, minGapSteps: 2 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        // gap = 2 × 0.5 = 1.0; lower thumb max = 3.0 − 1.0 = 2.0
        await setInputValue(thumbInputs[0], '2.5');
        expect((last(w().emitted('update:modelValue'))?.[0] as number[])[0]).toBe(2);
      });

      it('rounds out IEEE-754 drift in the minGapSteps gap (3 * 0.1 !== 0.3 in raw JS)', async () => {
        mockProps = { value: [0.3, 0.9], min: 0, max: 1, step: 0.1, minGapSteps: 3 };
        updateWrapper();
        thumbInputs = findThumbInputs();
        await setInputValue(thumbInputs[1], '0.31');
        expect((last(w().emitted('update:modelValue'))?.[0] as number[])[1]).toBe(0.6);
      });
    });

    describe('PageUp / PageDown with fractional largeStep', () => {
      beforeEach(() => {
        mockProps = { value: 0.5, min: 0, max: 10, step: 0.1, largeStep: 0.5 };
        updateWrapper();
        thumbInputs = findThumbInputs();
      });

      it('increases value by fractional largeStep on PageUp', async () => {
        await trigger(thumbInputs[0], 'keydown', { key: 'PageUp' });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(1);
      });

      it('decreases value by fractional largeStep on PageDown', async () => {
        await trigger(thumbInputs[0], 'keydown', { key: 'PageDown' });
        expect(last(w().emitted('update:modelValue'))?.[0]).toBe(0);
      });
    });
  });

  describe('fillOrigin', () => {
    const indicatorStyle = () => attr(indicator, 'style');

    describe('When fillOrigin is the default (\'start\')', () => {
      beforeEach(() => {
        mockProps = { value: 25, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the min end toward the thumb, with its static cap flush at the control edge', () => {
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-start: 0;');
        expect(style).toContain('width: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });

    describe('When fillOrigin is \'start\' and the thumb is at min', () => {
      beforeEach(() => {
        mockProps = { value: 0, min: 0, max: 100 };
        updateWrapper();
      });

      it('stays flush at the control edge, with the thumb-tracking edge exactly at the thumb (no overshoot)', () => {
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-start: 0;');
        expect(style).toContain('width: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0)');
      });
    });

    describe('When fillOrigin is \'end\'', () => {
      beforeEach(() => {
        mockProps = { value: 25, min: 0, max: 100, fillOrigin: 'end' };
        updateWrapper();
      });

      it('fills from the max end toward the thumb, with its static cap flush at the control edge', () => {
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-end: 0;');
        expect(style).toContain('width: calc(100% - calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.25))');
      });
    });

    describe('When fillOrigin is an invalid string', () => {
      it('does not accept a value outside start/end', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = {
          // @ts-expect-error -- fillOrigin is 'start', 'end' or a number
          fillOrigin: 'middle',
        };
        updateWrapper();
        expect(warnSpy.mock.calls[0][0]).toContain('Invalid prop: custom validator check failed for prop "fillOrigin"');
        warnSpy.mockRestore();
      });
    });

    describe('When fillOrigin is set and value equals fillOrigin', () => {
      beforeEach(() => {
        mockProps = { value: 50, fillOrigin: 50 };
        updateWrapper();
      });

      it('renders the indicator with zero width', () => {
        expect(indicatorStyle()).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0)');
      });
    });

    describe('When value is above fillOrigin', () => {
      beforeEach(() => {
        mockProps = { value: 75, fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the origin toward the thumb', () => {
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.5)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });

    describe('When value is below fillOrigin', () => {
      beforeEach(() => {
        mockProps = { value: 25, fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the thumb back toward the origin', () => {
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.25)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });

    describe('When fillOrigin is outside [min, max]', () => {
      it('clamps fillOrigin above max to max', () => {
        mockProps = { value: 60, fillOrigin: 150, min: 0, max: 100 };
        updateWrapper();
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.6)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.4)');
      });

      it('clamps fillOrigin below min to min', () => {
        mockProps = { value: 40, fillOrigin: -50, min: 0, max: 100 };
        updateWrapper();
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.4)');
      });
    });

    describe('When fillOrigin is set in range mode', () => {
      beforeEach(() => {
        mockProps = { value: [20, 80], fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('ignores fillOrigin and fills between the two thumbs', () => {
        const style = indicatorStyle();
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.2)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.6)');
      });
    });

    describe('When fillOrigin is set with vertical orientation', () => {
      beforeEach(() => {
        mockProps = { value: 75, fillOrigin: 50, min: 0, max: 100, orientation: 'vertical' };
        updateWrapper();
      });

      it('fills from origin toward thumb along the block axis', () => {
        const style = indicatorStyle();
        expect(style).toContain('bottom: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.5)');
        expect(style).toContain('height: calc((100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });
  });

  describe('Reserved space for marks/readout', () => {
    const reserved = () => classes(w().container.querySelector('.d-slider__body'));
    const reserveClass = 'd-slider__body--reserve-annotation-space';

    it('does not reserve space by default — showMarks defaults false and readout defaults to tooltip (rendered above, not below)', () => {
      updateWrapper();
      expect(reserved()).not.toContain(reserveClass);
    });

    it('does not reserve space when both marks and readout are turned off', () => {
      mockProps = { showMarks: false, readout: 'never' };
      updateWrapper();
      expect(reserved()).not.toContain(reserveClass);
    });

    it('does not reserve space for a tooltip readout, even with marks off — nothing renders in the below-track row', () => {
      mockProps = { showMarks: false, readout: 'tooltip' };
      updateWrapper();
      expect(reserved()).not.toContain(reserveClass);
    });

    it('still reserves space for readout alone, with marks turned off', () => {
      mockProps = { showMarks: false, readout: 'always' };
      updateWrapper();
      expect(reserved()).toContain(reserveClass);
    });

    it('still reserves space for marks alone, with readout turned off', () => {
      mockProps = { showMarks: [0, 100], readout: 'never' };
      updateWrapper();
      expect(reserved()).toContain(reserveClass);
    });

    it('still reserves space for marks alone, even with a tooltip readout', () => {
      mockProps = { showMarks: [0, 100], readout: 'tooltip' };
      updateWrapper();
      expect(reserved()).toContain(reserveClass);
    });

    it('does not reserve space in vertical orientation — marks/readout sit beside the track there, not below it', () => {
      mockProps = { orientation: 'vertical' };
      updateWrapper();
      expect(reserved()).not.toContain(reserveClass);
    });
  });

  // A real parent with a genuine controlled round trip — setProps would skip
  // the child-reports-then-parent-echoes-back cycle the bug needs.
  describe('Parent v-model feedback during a drag', () => {
    const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };

    it('holds a magnetic snap point through a real parent v-model echo, then reports the quantized commit on release', async () => {
      const parent: { value: SliderValue; changeEvents: SliderValue[] } = { value: 75, changeEvents: [] };

      function ParentWithVModel (): ReactNode {
        const [value, setValue] = useState<SliderValue>(75);
        parent.value = value;
        return (
          <DtSlider
            label="Volume"
            value={value}
            onValueChange={setValue}
            onValueCommit={(payload) => parent.changeEvents.push(payload)}
            min={0}
            max={100}
            step={25}
            snapPoints={[42]}
          />
        );
      }

      const container = document.createElement('div');
      const result = render(<ParentWithVModel />, { container });
      const control = container.querySelector<HTMLElement>('[data-qa="dt-slider-control"]')!;
      control.setPointerCapture = () => {};
      stubRect(control, controlRect);

      await trigger(control, 'pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 75, buttons: 1 });
      await trigger(control, 'pointermove', { pointerId: 1, clientX: 42, buttons: 1 });
      await nextTick();
      // The parent's echo of 42 must come back as 42, not re-snapped onto the step grid (50).
      expect(parent.value).toBe(42);

      await trigger(control, 'pointerup', { pointerId: 1 });
      await nextTick();

      // Release re-quantizes the held off-grid value onto the real grid.
      expect(parent.value).toBe(50);
      expect(parent.changeEvents).toEqual([50]);

      result.unmount();
    });
  });
});
