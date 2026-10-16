import { defineComponent, h, nextTick, ref } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { computePosition } from '@floating-ui/dom';
import { DtText } from '@/components/Text';
import DtSlider from './Slider.vue';

// Pass-through spy, so tests can see what the tooltip readout asks
// Floating UI for without changing how it positions.
vi.mock('@floating-ui/dom', async (importOriginal) => {
  const floatingUi = await importOriginal();
  return { ...floatingUi, computePosition: vi.fn(floatingUi.computePosition) };
});

// Matches Slider.vue's updateCollisions: nextTick() alone doesn't guarantee
// jsdom/the browser has painted the latest patch — it waits a real frame
// (twice) after each Vue flush, so tests exercising collision detection need
// to wait the same way rather than relying on microtask ticks alone.
const nextFrame = () => new Promise((resolve) => {
  requestAnimationFrame(() => requestAnimationFrame(resolve));
});
const settleCollisions = async () => {
  await nextTick();
  await nextFrame();
  await nextTick();
  await nextFrame();
};

// jsdom's getComputedStyle doesn't resolve inherited properties (a dir set on
// an ancestor never reaches a descendant), so mock it directly for the
// control element rather than relying on jsdom to resolve a real dir
// attribute. Toggling documentElement's own dir still triggers the
// dirObserver's resync (UseSliderDirection) — it only cares that *a* dir
// attribute changed somewhere, not which element. Restore the spy
// (mockControlDirectionSpy?.mockRestore()) and remove the dir attribute in
// an afterEach wherever this is used.
let mockControlDirectionSpy;
async function mockControlDirection(direction) {
  const original = window.getComputedStyle.bind(window);
  mockControlDirectionSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, ...rest) => {
    if (el?.dataset?.qa === 'dt-slider-control') return { direction };
    return original(el, ...rest);
  });
  document.documentElement.setAttribute('dir', direction);
  // The MutationObserver callback that triggers syncDirection() is queued
  // as its own microtask separate from the attribute assignment above —
  // await a tick so it's guaranteed to have run by the time callers
  // interact with the component, instead of racing it.
  await nextTick();
}

const baseProps = {
  label: 'Volume',
  modelValue: 50,
};
const baseAttrs = {};
const baseSlots = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtSlider Tests', () => {
  const openPopovers = new WeakSet();
  let matchesSpy;

  beforeAll(() => {
    const matches = HTMLElement.prototype.matches;
    matchesSpy = vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (selector) {
      return selector === ':popover-open' ? openPopovers.has(this) : matches.call(this, selector);
    });
    HTMLElement.prototype.showPopover = function () { openPopovers.add(this); };
    HTMLElement.prototype.hidePopover = function () { openPopovers.delete(this); };
  });

  afterAll(() => {
    matchesSpy.mockRestore();
    delete HTMLElement.prototype.showPopover;
    delete HTMLElement.prototype.hidePopover;
  });

  let wrapper;
  let root;
  let track;
  let indicator;
  let label;
  let thumbVisuals;
  let thumbInputs;

  const updateWrapper = () => {
    wrapper?.unmount();
    wrapper = mount(DtSlider, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
    });

    root = wrapper.find('[data-qa="dt-slider"]');
    track = wrapper.find('[data-qa="dt-slider-track"]');
    indicator = wrapper.find('[data-qa="dt-slider-indicator"]');
    label = wrapper.find('[data-qa="dt-slider-label"]');
    thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
    thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(async () => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    wrapper?.unmount();
    // An open tooltip readout's last positioning pass can still be in flight
    // after unmount; let it settle so it can't leak into the next test.
    await flushPromises();
    mockControlDirectionSpy?.mockRestore();
    document.documentElement.removeAttribute('dir');
  });

  describe('Presentation Tests', () => {
    it('renders the component', () => {
      expect(wrapper).toBeDefined();
      expect(root.exists()).toBe(true);
    });

    it('has the d-slider root class', () => {
      expect(root.classes()).toContain('d-slider');
    });

    it('renders a track element', () => {
      expect(track.exists()).toBe(true);
    });

    it('renders an indicator element', () => {
      expect(indicator.exists()).toBe(true);
    });

    it('renders the label text', () => {
      expect(label.text()).toBe(baseProps.label);
    });

    it('renders one thumb in single mode', () => {
      expect(thumbInputs).toHaveLength(1);
    });

    it('renders one visual thumb in single mode', () => {
      expect(thumbVisuals).toHaveLength(1);
    });

    it('sets data-orientation to horizontal by default', () => {
      expect(root.attributes('data-orientation')).toBe('horizontal');
    });

    it('does not apply the dot-centering position style to the full-size native input', () => {
      // thumbPositionStyle's bottom/transform pair is sized for the small
      // thumb-visual/thumb-hit dots — applied to this inset:0, 100%x100%
      // native input instead, it shoves the whole (invisible,
      // pointer-events:none) element out past its container, which then
      // overflows any ancestor with overflow:auto into a scrollbar to
      // nothing visible.
      expect(thumbInputs[0].attributes('style')).toBeUndefined();
    });

    describe('Range mode', () => {
      beforeEach(() => {
        mockProps = { modelValue: [20, 70] };
        updateWrapper();
      });

      it('renders two thumb inputs', () => {
        expect(thumbInputs).toHaveLength(2);
      });

      it('renders two visual thumbs', () => {
        expect(thumbVisuals).toHaveLength(2);
      });

      it('sets the first input value to the low bound', () => {
        expect(thumbInputs[0].element.value).toBe('20');
      });

      it('sets the second input value to the high bound', () => {
        expect(thumbInputs[1].element.value).toBe('70');
      });

      it('warns via prop validator when modelValue is an array with a length other than 2', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { modelValue: [10, 20, 30] };
        updateWrapper();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
      });
    });

    describe('When min equals max (degenerate range)', () => {
      beforeEach(() => {
        mockProps = { modelValue: 50, min: 50, max: 50 };
        updateWrapper();
      });

      it('does not produce NaN positioning for the thumb', () => {
        // insetInlineStart (not left) is the actual CSS property the
        // component sets — see positionStyle in Slider.vue. Asserting on
        // .style.left here would pass unconditionally regardless of the
        // NaN guard, since the component never touches that property at all.
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].element.style.insetInlineStart).not.toContain('NaN');
      });

      it('does not produce NaN positioning for default marks', () => {
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        marks.forEach((mark) => {
          expect(mark.element.style.insetInlineStart).not.toContain('NaN');
        });
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };
        updateWrapper();
      });

      it('adds d-slider--disabled class', () => {
        expect(root.classes()).toContain('d-slider--disabled');
      });

      it('sets data-disabled attribute', () => {
        expect(root.attributes('data-disabled')).toBeDefined();
      });

      it('sets disabled on the input', () => {
        expect(thumbInputs[0].attributes('disabled')).toBeDefined();
      });
    });

    describe('When orientation is vertical', () => {
      beforeEach(() => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
      });

      it('adds d-slider--vertical class', () => {
        expect(root.classes()).toContain('d-slider--vertical');
      });

      it('sets data-orientation to vertical', () => {
        expect(root.attributes('data-orientation')).toBe('vertical');
      });

      it('sets aria-orientation to vertical on the thumb input, since the native default is horizontal', () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('aria-orientation')).toBe('vertical');
      });
    });

    describe('When fillOrigin is \'end\'', () => {
      beforeEach(() => {
        mockProps = { fillOrigin: 'end' };
        updateWrapper();
      });

      it('adds d-slider--inverted class', () => {
        expect(root.classes()).toContain('d-slider--inverted');
      });
    });

    describe('Readout', () => {
      // The readout is a plain CSS-positioned element in the same row as marks (not
      // a floating tooltip/portal), so it can't desync from its thumb while scrolling.
      // It's found via data-qa and shown/hidden via the d-slider__readout--show /
      // --hide modifier classes instead of an `open` component prop.
      const readouts = () => wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');

      it('renders no readout when readout is "never"', async () => {
        mockProps = { readout: 'never' };
        updateWrapper();
        await nextTick();
        expect(readouts()).toHaveLength(0);
        expect(wrapper.find('[data-qa="dt-slider-thumb-readout-tooltip"]').exists()).toBe(false);
      });

      it('rejects the removed "interaction" readout mode', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        try {
          mockProps = { readout: 'interaction' };
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
        expect(els[0].classes()).toContain('d-slider__readout--show');
      });

      it('renders the formatted value as the readout content', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('50');
      });

      it('hides the readout from the accessibility tree, since it duplicates the thumb input\'s own aria-valuetext', async () => {
        mockProps = { readout: 'always' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].attributes('aria-hidden')).toBe('true');
      });

      it('renders one readout per thumb in range mode', async () => {
        mockProps = { readout: 'always', modelValue: [20, 70] };
        updateWrapper();
        await nextTick();
        const els = readouts();
        expect(els).toHaveLength(2);
        expect(els[0].text()).toBe('20');
        expect(els[1].text()).toBe('70');
      });

      it('applies suffix to the readout content', async () => {
        mockProps = { readout: 'always', suffix: '%' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('50%');
      });

      it('applies prefix to the readout content', async () => {
        mockProps = { readout: 'always', prefix: '$' };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('$50');
      });

      it('prefers getValueText over suffix for the readout content', async () => {
        mockProps = { readout: 'always', suffix: '%', getValueText: (v) => `${v} units` };
        updateWrapper();
        await nextTick();
        expect(readouts()[0].text()).toBe('50 units');
      });

      it('anchors onto the thumb\'s own inset band at the edges, not a flush track percentage', async () => {
        // Anchored (UseSliderGeometry's anchorPct), same band the thumb
        // itself renders on — otherwise this pill would sit up to a full
        // --slider-edge-inset away from the thumb it's meant to track,
        // worst-case right at min/max. Centering itself still comes from
        // .d-slider__readout's own CSS transform, not an inline style, so
        // the absence of an inline transform here is expected, not a gap.
        mockProps = { readout: 'always', modelValue: 100 };
        updateWrapper();
        await nextTick();
        const style = readouts()[0].attributes('style');
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 1)');
        expect(style).not.toContain('transform');
      });
    });

    describe('readout: "tooltip" (the default)', () => {
      // Top-layer rendering preserves DOM parentage and local theme inheritance.
      const tooltipReadouts = () => wrapper.findAll('[data-qa="dt-slider-thumb-readout-tooltip"]');

      it('opens while its thumb is focused and closes on blur', async () => {
        const tooltip = tooltipReadouts()[0].element;
        await thumbInputs[0].trigger('focus');
        expect(tooltip.matches(':popover-open')).toBe(true);
        await thumbInputs[0].trigger('blur');
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('closes on Escape while keeping focus, matching DtTooltip\'s own Escape handling', async () => {
        const tooltip = tooltipReadouts()[0].element;
        await thumbInputs[0].trigger('focus');
        expect(tooltip.matches(':popover-open')).toBe(true);
        await thumbInputs[0].trigger('keydown', { key: 'Escape' });
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      // document.activeElement only tracks elements actually attached to the
      // document (see "Exposed public API" below) — a real DOM focus check,
      // not just a synthetic 'focus' event, is the only way to prove Escape
      // doesn't blur the thumb (a naive Escape-blurs-the-thumb implementation
      // would close the tooltip identically but fail this one).
      it('does not move real DOM focus off the thumb on Escape', async () => {
        const attachedWrapper = mount(DtSlider, { props: baseProps, attachTo: document.body });
        try {
          const input = attachedWrapper.find('[data-qa="dt-slider-thumb"]');
          input.element.focus();
          await nextTick();
          const tooltip = attachedWrapper.find('[data-qa="dt-slider-thumb-readout-tooltip"]').element;
          expect(tooltip.matches(':popover-open')).toBe(true);
          await input.trigger('keydown', { key: 'Escape' });
          expect(tooltip.matches(':popover-open')).toBe(false);
          expect(document.activeElement).toBe(input.element);
        } finally {
          attachedWrapper.unmount();
        }
      });

      it('reopens on the next hover after an Escape dismissal, without needing to refocus', async () => {
        const hitTarget = wrapper.find('[data-qa="dt-slider-thumb-hit"]');
        const tooltip = tooltipReadouts()[0].element;
        await thumbInputs[0].trigger('focus');
        await thumbInputs[0].trigger('keydown', { key: 'Escape' });
        expect(tooltip.matches(':popover-open')).toBe(false);
        await hitTarget.trigger('pointerenter');
        expect(tooltip.matches(':popover-open')).toBe(true);
      });

      it('reopens on the next arrow-key press after an Escape dismissal, without needing to blur/refocus', async () => {
        const tooltip = tooltipReadouts()[0].element;
        await thumbInputs[0].trigger('focus');
        await thumbInputs[0].trigger('keydown', { key: 'Escape' });
        expect(tooltip.matches(':popover-open')).toBe(false);
        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight' });
        expect(tooltip.matches(':popover-open')).toBe(true);
      });

      it('dismisses only the Escaped thumb\'s own tooltip in range mode, leaving the other thumb open', async () => {
        mockProps = { modelValue: [20, 70] };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        const tooltips = tooltipReadouts();
        await thumbInputs[0].trigger('focus');
        const hitTargets = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]');
        await hitTargets[1].trigger('pointerenter');
        expect(tooltips[0].element.matches(':popover-open')).toBe(true);
        expect(tooltips[1].element.matches(':popover-open')).toBe(true);
        await thumbInputs[0].trigger('keydown', { key: 'Escape' });
        expect(tooltips[0].element.matches(':popover-open')).toBe(false);
        expect(tooltips[1].element.matches(':popover-open')).toBe(true);
      });

      it('does not open while disabled, even when its thumb is hovered', async () => {
        mockProps = { disabled: true };
        updateWrapper();
        await wrapper.find('[data-qa="dt-slider-thumb-hit"]').trigger('pointerenter');
        expect(tooltipReadouts()[0].element.matches(':popover-open')).toBe(false);
      });

      it('closes its open readout on unmount', async () => {
        await thumbInputs[0].trigger('focus');
        const tooltip = tooltipReadouts()[0].element;
        wrapper.unmount();
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('is the default readout mode', async () => {
        await nextTick();
        const els = tooltipReadouts();
        expect(els).toHaveLength(1);
        expect(wrapper.findAll('[data-qa="dt-slider-thumb-readout"]')).toHaveLength(0);
      });

      it('renders inline inside .d-slider__control, not teleported elsewhere', async () => {
        await nextTick();
        const control = wrapper.find('[data-qa="dt-slider-control"]');
        expect(control.find('[data-qa="dt-slider-thumb-readout-tooltip"]').exists()).toBe(true);
      });

      it('renders hidden at rest', async () => {
        await nextTick();
        expect(tooltipReadouts()[0].element.matches(':popover-open')).toBe(false);
      });

      it('shows on thumb-hit hover', async () => {
        await nextTick();
        const hitTarget = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]')[0];
        const tooltip = tooltipReadouts()[0].element;
        await hitTarget.trigger('pointerenter');
        expect(tooltip.matches(':popover-open')).toBe(true);
        await hitTarget.trigger('pointerleave');
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      it('keeps the readout open on hover-leave if that thumb is still keyboard-focused', async () => {
        const hitTarget = wrapper.find('[data-qa="dt-slider-thumb-hit"]');
        await thumbInputs[0].trigger('focus');
        await hitTarget.trigger('pointerenter');
        await hitTarget.trigger('pointerleave');
        expect(tooltipReadouts()[0].element.matches(':popover-open')).toBe(true);
      });

      it('renders the formatted value as its content', async () => {
        await nextTick();
        expect(tooltipReadouts()[0].text()).toBe('50');
      });

      it('is a decorative manual popover: inert and hidden from the accessibility tree, since it duplicates the thumb input\'s own aria-valuetext', async () => {
        await nextTick();
        const tooltip = tooltipReadouts()[0];
        expect(tooltip.attributes('popover')).toBe('manual');
        expect(tooltip.attributes('inert')).toBe('');
        expect(tooltip.attributes('aria-hidden')).toBe('true');
      });

      it('renders one independent tooltip per thumb in range mode, with no merge-into-one-pill behavior', async () => {
        mockProps = { modelValue: [20, 70] };
        updateWrapper();
        await nextTick();
        const els = tooltipReadouts();
        expect(els).toHaveLength(2);
        expect(els[0].text()).toBe('20');
        expect(els[1].text()).toBe('70');
        expect(wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]').exists()).toBe(false);
      });

      it('does not merge two tooltip bubbles into one even when they genuinely overlap — tooltip mode has no merged-pill UI to fall back to', async () => {
        mockProps = { modelValue: [55, 60], min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
        // 20px wide each — 55 vs 60 is 15px apart on this 300px control,
        // well inside the combined 20px of half-widths: a genuine overlap.
        const tooltipRect = { top: 0, left: 0, right: 20, bottom: 20 };
        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const tooltips = tooltipReadouts();
        tooltips[0].element.getBoundingClientRect = () => tooltipRect;
        tooltips[1].element.getBoundingClientRect = () => tooltipRect;

        // Tooltip mode has no 'always'-equivalent — isReadoutOpen needs a
        // distinct interaction signal per thumb to have both open at once, so
        // focus one and hover the other, same as a drag-near-the-other-thumb
        // gesture would.
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        const hitTargets = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]');
        await hitTargets[1].trigger('pointerenter');
        await settleCollisions();

        expect(tooltipReadouts()[0].element.matches(':popover-open')).toBe(true);
        expect(tooltipReadouts()[1].element.matches(':popover-open')).toBe(true);
        expect(wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]').exists()).toBe(false);
      });

      it('closes the removed thumb\'s readout when range switches to single', async () => {
        mockProps = { modelValue: [20, 70] };
        updateWrapper();
        await wrapper.findAll('[data-qa="dt-slider-thumb-hit"]')[1].trigger('pointerenter');
        const high = tooltipReadouts()[1].element;
        expect(high.matches(':popover-open')).toBe(true);
        await wrapper.setProps({ modelValue: 20 });
        expect(high.matches(':popover-open')).toBe(false);
      });

      it('repositions its readout when a stable getValueText callback\'s text changes', async () => {
        const unit = ref(' dollars');
        mockProps = { getValueText: value => `${value}${unit.value}` };
        updateWrapper();
        await wrapper.find('[data-qa="dt-slider-thumb"]').trigger('focus');
        computePosition.mockClear();
        unit.value = ' euros';
        await nextTick();
        expect(computePosition).toHaveBeenCalledTimes(1);
      });

      it('opens a vertical thumb\'s readout to its physical left under rtl', async () => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
        await mockControlDirection('rtl');
        await thumbInputs[0].trigger('focus');
        expect(computePosition.mock.lastCall[2].placement).toBe('left');
      });

      it('recovers a hovered readout after the browser closes its popover externally', async () => {
        const attached = mount(DtSlider, { props: baseProps, attachTo: document.body });
        try {
          // jsdom has no rendered boxes; model a visible, connected owner.
          attached.find('[data-qa="dt-slider-thumb-visual"]').element.checkVisibility = () => true;
          await attached.find('[data-qa="dt-slider-thumb-hit"]').trigger('pointerenter');
          const tooltip = attached.find('[data-qa="dt-slider-thumb-readout-tooltip"]').element;
          tooltip.hidePopover();
          await attached.setProps({ modelValue: 60 });
          expect(tooltip.matches(':popover-open')).toBe(true);
        } finally {
          attached.unmount();
        }
      });

      it('hides the readout when its stationary thumb stops being visible', async () => {
        // Floating UI's hide() needs a non-zero viewport with the thumb inside
        // it. The checkVisibility stub honors only the older option names, so
        // this also covers Chrome/Edge 114–120.
        const visual = thumbVisuals[0].element;
        const widthSpy = vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
        const heightSpy = vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);
        visual.getBoundingClientRect = () => (
          { x: 100, y: 100, left: 100, top: 100, right: 116, bottom: 116, width: 16, height: 16 }
        );
        let ownerVisible = true;
        visual.checkVisibility = options => ownerVisible || !(options.checkOpacity && options.checkVisibilityCSS);
        try {
          await thumbInputs[0].trigger('focus');
          await flushPromises();
          const tooltip = tooltipReadouts()[0].element;
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
        const tooltip = tooltipReadouts()[0].element;
        tooltip.showPopover = undefined;
        await thumbInputs[0].trigger('focus');
        expect(tooltip.matches(':popover-open')).toBe(false);
      });

      describe('Per-frame position check is throttled (performance)', () => {
        // UseSliderTooltipReadout's checkFrame reschedules itself via rAF every
        // frame regardless, but only runs its own expensive body (an anchor
        // rect read + visibility check) once the throttle window has elapsed.
        // Mocking requestAnimationFrame to capture callbacks instead of firing
        // them lets this drive checkFrame with controlled timestamps — real
        // browser frame timing can't deterministically land inside vs. past a
        // 100ms window from a test.
        let rafCallbacks;
        let rafSpy;

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

        function fireNextFrame(timestamp) {
          const cb = rafCallbacks.shift();
          cb?.(timestamp);
        }

        it('skips the expensive per-frame check inside the throttle window, then runs it once the window elapses', async () => {
          await thumbInputs[0].trigger('focus');
          // The first checkFrame() runs synchronously (inside open(), timestamp
          // defaults to 0) before this spy can intercept it — clear those
          // calls so only the throttled, rAF-driven frames below are counted.
          const anchor = wrapper.find('[data-qa="dt-slider-thumb-visual"]').element;
          const rectSpy = vi.spyOn(anchor, 'getBoundingClientRect');
          rectSpy.mockClear();

          // Still inside the 100ms window the synchronous first check (t=0)
          // opened — the expensive body must not run.
          fireNextFrame(50);
          expect(rectSpy).not.toHaveBeenCalled();

          // Past that window — the gate reopens and the body runs.
          fireNextFrame(150);
          expect(rectSpy).toHaveBeenCalled();
        });
      });
    });

    describe('When showLabel is false', () => {
      beforeEach(() => {
        mockProps = { showLabel: false };
        updateWrapper();
      });

      it('removes the label from the DOM, matching DtInput/DtCheckbox/DtRadio/DtSelectMenu', () => {
        expect(label.exists()).toBe(false);
      });

      it('promotes the label prop to aria-label on each thumb input', () => {
        expect(thumbInputs[0].attributes('aria-label')).toBe(baseProps.label);
        expect(thumbInputs[0].attributes('aria-labelledby')).toBeUndefined();
      });
    });

    describe('Label size and strength', () => {
      it('defaults label size to 300', () => {
        const dtText = wrapper.findComponent(DtText);
        expect(dtText.props('size')).toBe(300);
      });

      it('leaves label strength unset by default, so the label kind\'s own semibold weight applies (matching DtInput)', () => {
        const dtText = wrapper.findComponent(DtText);
        expect(dtText.props('strength')).toBe(null);
      });

      it('overrides the default label size via labelSize', () => {
        mockProps = { labelSize: 400 };
        updateWrapper();
        const dtText = wrapper.findComponent(DtText);
        expect(dtText.props('size')).toBe(400);
      });

      it('overrides the default label strength via labelStrength', () => {
        mockProps = { labelStrength: 'bold' };
        updateWrapper();
        const dtText = wrapper.findComponent(DtText);
        expect(dtText.props('strength')).toBe('bold');
      });

      it('sets label tone to disabled when the slider is disabled', () => {
        mockProps = { disabled: true };
        updateWrapper();
        const dtText = wrapper.findComponent(DtText);
        expect(dtText.props('tone')).toBe('disabled');
      });

      it('sets label tone to secondary when not disabled', () => {
        const dtText = wrapper.findComponent(DtText);
        expect(dtText.props('tone')).toBe('secondary');
      });
    });

    describe('When ticks is set to an interval', () => {
      beforeEach(() => {
        mockProps = { showTicks: 10, min: 0, max: 100, step: 10 };
        updateWrapper();
      });

      it('renders tick marks', () => {
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks.length).toBeGreaterThan(0);
      });

      it('renders 11 ticks for showTicks=10 over 0–100', () => {
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks).toHaveLength(11);
      });
    });

    describe('When ticks is left at its default', () => {
      it('renders zero ticks', () => {
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks).toHaveLength(0);
      });
    });

    describe('Dense generated points are capped', () => {
      let warnSpy;

      beforeEach(() => {
        warnSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      });

      afterEach(() => {
        warnSpy.mockRestore();
      });

      it('caps tick generation instead of hanging on a too-small ticks interval', () => {
        mockProps = { showTicks: 0.001, min: 0, max: 100 };
        updateWrapper();
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks.length).toBeLessThanOrEqual(1001); // +1 for the guaranteed end-of-domain point
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('ticks'));
      });

      it('still covers the FULL domain when capped, not just the beginning of it', () => {
        // The cap used to generate points sequentially from `min` and
        // truncate at 1000 — for showTicks=0.001 over 0–100 that covered
        // only 0 through 0.999 (the first ~1% of the range): a plausible-
        // looking but materially false representation of the range, with
        // no ticks or snap targets anywhere past it.
        mockProps = { showTicks: 0.001, min: 0, max: 100 };
        updateWrapper();
        const tickPositions = wrapper.findAll('[data-qa="dt-slider-tick"]').map((t) => t.attributes('style'));
        const lastTickStyle = tickPositions.at(-1);
        // anchorPct's calc() ends in `* <pct/100>)` — close to 1 (not some
        // early fraction) confirms the last tick lands near the end of the
        // domain, not truncated into just its first ~1%.
        expect(lastTickStyle).toMatch(/\) \* (0\.9\d+|1)\);/);
      });

      it('caps snapPoints generation instead of hanging on a too-small interval', async () => {
        // computedSnapPoints is lazily evaluated — only findMagneticSnapPoint
        // (a pointer drag with allowSnap) actually reads it, so mounting
        // alone never triggers the warning; a drag start is required.
        mockProps = { snapPoints: 0.001, min: 0, max: 100 };
        updateWrapper();
        const control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('snapPoints'));
      });
    });

    describe('Dense generated points, production mode', () => {
      let warnSpy;
      let originalNodeEnv;

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
        mockSlots = { start: '<span data-testid="start-slot">Low</span>' };
        updateWrapper();
        const startWrapper = wrapper.find('[data-qa="dt-slider-start"]');
        expect(startWrapper.find('[data-testid="start-slot"]').exists()).toBe(true);
      });

      it('renders the end slot', () => {
        mockSlots = { end: '<span data-testid="end-slot">High</span>' };
        updateWrapper();
        const endWrapper = wrapper.find('[data-qa="dt-slider-end"]');
        expect(endWrapper.find('[data-testid="end-slot"]').exists()).toBe(true);
      });

      it('renders the label slot', () => {
        mockSlots = { label: '<span data-testid="custom-label">Custom</span>' };
        updateWrapper();
        expect(label.find('[data-testid="custom-label"]').exists()).toBe(true);
      });

      it('exposes the live value via the label slot scope, updating as the thumb moves', async () => {
        mockSlots = {
          label: (scope) => h('span', { 'data-testid': 'live-label' }, String(scope.value)),
        };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(label.find('[data-testid="live-label"]').text()).toBe('50');

        thumbInputs[0].element.value = '75';
        await thumbInputs[0].trigger('input');
        expect(label.find('[data-testid="live-label"]').text()).toBe('75');
      });

      it('exposes the value as an array via the label slot scope in range mode', () => {
        mockProps = { modelValue: [20, 70] };
        mockSlots = {
          label: (scope) => h('span', { 'data-testid': 'live-label' }, scope.value.join('-')),
        };
        updateWrapper();
        expect(label.find('[data-testid="live-label"]').text()).toBe('20-70');
      });
    });

    describe('Slot class props', () => {
      it('applies labelClass to the label wrapper', () => {
        mockProps = { labelClass: 'custom-label-class' };
        updateWrapper();
        expect(label.classes()).toContain('custom-label-class');
      });

      it('applies startClass to the start slot wrapper', () => {
        mockProps = { startClass: 'custom-start-class' };
        mockSlots = { start: '<span>Low</span>' };
        updateWrapper();
        expect(wrapper.find('[data-qa="dt-slider-start"]').classes()).toContain('custom-start-class');
      });

      it('applies endClass to the end slot wrapper', () => {
        mockProps = { endClass: 'custom-end-class' };
        mockSlots = { end: '<span>High</span>' };
        updateWrapper();
        expect(wrapper.find('[data-qa="dt-slider-end"]').classes()).toContain('custom-end-class');
      });
    });

    describe('Empty start/end slots', () => {
      // Suppresses the wrapper markup entirely rather than leaving an empty
      // <div class="d-slider__start"></div> — otherwise the track doesn't
      // align flush to the overall container's own inline edges when neither
      // slot is used (the common case).
      it('does not render the start wrapper when the start slot is empty', () => {
        expect(wrapper.find('[data-qa="dt-slider-start"]').exists()).toBe(false);
      });

      it('does not render the end wrapper when the end slot is empty', () => {
        expect(wrapper.find('[data-qa="dt-slider-end"]').exists()).toBe(false);
      });

      it('renders the start wrapper once the slot has content', () => {
        mockSlots = { start: '<span>Low</span>' };
        updateWrapper();
        expect(wrapper.find('[data-qa="dt-slider-start"]').exists()).toBe(true);
      });
    });

    describe('name prop', () => {
      it('forwards name to each thumb input, so range mode values can be retrieved together via FormData.getAll', () => {
        mockProps = { name: 'volume', modelValue: [20, 70] };
        updateWrapper();
        expect(thumbInputs[0].attributes('name')).toBe('volume');
        expect(thumbInputs[1].attributes('name')).toBe('volume');
      });

      it('omits the name attribute entirely when unset, rather than rendering name=""', () => {
        expect(thumbInputs[0].attributes('name')).toBeUndefined();
      });
    });

    describe('Attrs passthrough (inheritAttrs: false)', () => {
      it('forwards a consumer class onto the root element, merged with the component\'s own classes', () => {
        mockAttrs = { class: 'consumer-class' };
        updateWrapper();
        expect(root.classes()).toContain('consumer-class');
        expect(root.classes()).toContain('d-slider');
      });

      it('forwards consumer style onto the root element', () => {
        mockAttrs = { style: 'margin-top: 8px;' };
        updateWrapper();
        expect(root.attributes('style')).toContain('margin-top');
      });

      it('forwards non-class/style attrs like data-testid onto the root element', () => {
        mockAttrs = { 'data-testid': 'volume-slider' };
        updateWrapper();
        expect(root.attributes('data-testid')).toBe('volume-slider');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('thumb input has type range', () => {
      expect(thumbInputs[0].attributes('type')).toBe('range');
    });

    it('thumb input has aria-labelledby pointing to the label', () => {
      const labelId = label.attributes('id');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBe(labelId);
    });

    it('falls back to aria-label, not aria-labelledby to an empty node, when the label slot renders nothing', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume' };
      mockSlots = { label: '' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBeUndefined();
      expect(thumbInputs[0].attributes('aria-label')).toBe('Volume');
    });

    it('falls back to aria-label, not aria-labelledby to an empty node, when the label PROP is non-empty but a provided #label slot overrides it with no text', () => {
      // A provided #label slot fully replaces the prop's own fallback markup
      // — its text is never actually rendered, so a non-empty prop alone
      // must not count as "has a visible label".
      mockProps = { label: 'Volume' };
      mockAttrs = { 'aria-label': 'Explicit volume' };
      mockSlots = { label: '<svg aria-hidden="true"><use href="#icon-volume" /></svg>' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBeUndefined();
      expect(thumbInputs[0].attributes('aria-label')).toBe('Explicit volume');
    });

    it('forwards a consumer-supplied aria-labelledby to each thumb when there is no visible label', () => {
      // Standard "label via an external heading" pattern — before this fix,
      // removeClassStyleAttrs only stripped class/style, so aria-labelledby
      // landed on the inert wrapper div and never reached the actual
      // role="slider" inputs, leaving them with no accessible name at all.
      mockProps = { label: undefined };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBe('external-heading');
      expect(thumbInputs[0].attributes('aria-label')).toBeUndefined();
    });

    it('prefers the internal label over a consumer-supplied aria-labelledby when both are present', () => {
      mockProps = { label: 'Volume' };
      mockAttrs = { 'aria-labelledby': 'external-heading' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const labelId = wrapper.find('[data-qa="dt-slider-label"]').attributes('id');
      expect(thumbInputs[0].attributes('aria-labelledby')).toBe(labelId);
    });

    it('does not duplicate aria-label/aria-labelledby onto the root wrapper — only the thumb inputs get them', () => {
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume', 'aria-labelledby': 'external-heading' };
      updateWrapper();
      expect(root.attributes('aria-label')).toBeUndefined();
      expect(root.attributes('aria-labelledby')).toBeUndefined();
    });

    it('forwards aria-describedby, aria-errormessage, aria-details, and aria-invalid to each thumb input', () => {
      mockAttrs = {
        'aria-describedby': 'hint-id',
        'aria-errormessage': 'error-id',
        'aria-details': 'details-id',
        'aria-invalid': 'true',
      };
      mockProps = { modelValue: [20, 70] };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      for (const input of thumbInputs) {
        expect(input.attributes('aria-describedby')).toBe('hint-id');
        expect(input.attributes('aria-errormessage')).toBe('error-id');
        expect(input.attributes('aria-details')).toBe('details-id');
        expect(input.attributes('aria-invalid')).toBe('true');
      }
    });

    it('does not leave aria-describedby/aria-errormessage/aria-details/aria-invalid on the root wrapper', () => {
      // Before this fix, only class/style were stripped from $attrs before
      // binding the rest to the root <div> — these form-control relationship
      // attributes stayed on that inert wrapper and never reached the actual
      // role="slider" inputs at all.
      mockAttrs = {
        'aria-describedby': 'hint-id',
        'aria-errormessage': 'error-id',
        'aria-details': 'details-id',
        'aria-invalid': 'true',
      };
      updateWrapper();
      expect(root.attributes('aria-describedby')).toBeUndefined();
      expect(root.attributes('aria-errormessage')).toBeUndefined();
      expect(root.attributes('aria-details')).toBeUndefined();
      expect(root.attributes('aria-invalid')).toBeUndefined();
    });

    it('sets aria-valuemin from min prop', () => {
      expect(thumbInputs[0].attributes('min')).toBe('0');
    });

    it('sets aria-valuemax from max prop', () => {
      expect(thumbInputs[0].attributes('max')).toBe('100');
    });

    it('sets aria-valuenow from modelValue', () => {
      expect(thumbInputs[0].element.value).toBe('50');
    });

    it('applies getValueText result to aria-valuetext', () => {
      mockProps = { getValueText: (v) => `Volume: ${v}%` };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('Volume: 50%');
    });

    it('applies prefix/suffix to aria-valuetext when getValueText is not set', () => {
      mockProps = { prefix: '$', suffix: ' USD' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('$50 USD');
    });

    it('prefers getValueText over prefix/suffix when both are set', () => {
      mockProps = { getValueText: (v) => `${v}%`, prefix: '$', suffix: ' USD' };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('50%');
    });
  });

  describe('Dev-only accessibility warnings (console.info)', () => {
    let infoSpy;

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
        mockProps = { label: undefined, modelValue: [20, 70] }; // range mode + no label: would normally warn twice
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
      mockProps = { label: undefined };
      mockSlots = { label: '<span>Custom label</span>' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not warn when the label slot wraps its text in a child component, not a bare text node', () => {
      // slotHasText recurses into a plain string/array vnode.children, but a
      // child COMPONENT vnode (e.g. <dt-text>{{ label }}</dt-text>, exactly
      // the pattern this component's own default fallback markup uses) has
      // children as a slots object instead — this pins that it's recognized
      // as real text, not silently misclassified as empty.
      mockProps = { label: undefined };
      mockSlots = { label: () => h(DtText, null, { default: () => 'Volume' }) };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('still warns when the label slot exists but renders nothing — an empty slot provides no accessible name', () => {
      mockProps = { label: undefined };
      mockSlots = { label: '' };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('does not crash mounting with a scoped #label slot that indexes into value, in range mode', () => {
      // The #label slot is documented as scoped with :value — a range-mode
      // consumer destructuring it (e.g. the shipped 'call duration filter'
      // Combinator preset: {{ value[0] }}–{{ value[1] }}) used to throw
      // during hasLabelContent's hasSlotContent probe, which called the slot
      // with no props at all, leaving `value` undefined.
      mockProps = { label: undefined, modelValue: [20, 70] };
      mockSlots = { label: '<template #label="{ value }">{{ value[0] }}-{{ value[1] }}</template>' };
      expect(() => updateWrapper()).not.toThrow();
    });

    it('warns about missing getValueText in range mode, independent of whether a label is set', () => {
      mockProps = { label: 'Price range', modelValue: [20, 70] };
      updateWrapper();
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide getValueText'));
    });

    it('does not re-log an unchanged warning on every value tick while dragging', async () => {
      // The accessible-name check reads currentValue.value (to safely probe
      // a scoped #label slot — see hasLabelContent above), which changes on
      // every drag tick. Watching that raw value directly (a bare
      // watchEffect) would re-run — and re-log — on every tick even though
      // the warning CONDITION never changes; a boolean-sourced watch() only
      // re-invokes when the condition itself flips.
      mockProps = { label: undefined, modelValue: 50 };
      updateWrapper();
      const callsAtMount = infoSpy.mock.calls.length;
      expect(callsAtMount).toBeGreaterThan(0); // sanity: the warning did fire once

      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      for (const val of [51, 52, 53, 54, 55]) {
        thumbInputs[0].element.value = String(val);
        await thumbInputs[0].trigger('input');
      }

      expect(infoSpy.mock.calls.length).toBe(callsAtMount);
    });

    it('does not warn about getValueText when it is provided', () => {
      mockProps = { label: 'Price range', modelValue: [20, 70], getValueText: (v) => `${v}` };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide getValueText'));
    });

    it('falls back to the raw formatted value, without crashing, when getValueText throws', () => {
      // formatValue is called on every render path (aria-valuetext, every
      // readout style) — an uncaught throw there would crash the whole
      // component, not just degrade one value's text.
      mockProps = {
        modelValue: 42,
        getValueText: () => { throw new Error('boom'); },
      };
      expect(() => updateWrapper()).not.toThrow();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('42');
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('getValueText threw'));
    });

    it('does not crash when getValueText returns a non-string value', () => {
      mockProps = { modelValue: 42, getValueText: () => 42 };
      expect(() => updateWrapper()).not.toThrow();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('aria-valuetext')).toBe('42');
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

      await wrapper.setProps({ label: '' });
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('warns as soon as a parent removes aria-label after mount, not just at mount time', async () => {
      // Older Vue docs caution that useAttrs() isn't reactive, which would
      // make the watch() below (sourcing attrs['aria-label']) miss this
      // change entirely unless some OTHER tracked dependency (e.g.
      // hasLabelContent) happened to change on the same render. Verified
      // against the installed Vue version (attrs reads ARE tracked here) —
      // this pins that behavior so a future Vue bump that regresses it
      // gets caught.
      mockProps = { label: undefined };
      mockAttrs = { 'aria-label': 'Volume' };
      updateWrapper();
      expect(infoSpy).not.toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));

      await wrapper.setProps({ 'aria-label': undefined });
      expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining('provide a label prop'));
    });

    it('still warns when the label slot renders only a non-text element (e.g. an icon) with no text content', () => {
      // A childless icon has no accessible text of its own unless the
      // consumer labels it directly — counting its mere presence as a
      // "visible label" would silently leave the thumb unnamed with no
      // indication anything's wrong.
      mockProps = { label: undefined };
      mockSlots = { label: '<svg aria-hidden="true"><use href="#icon-volume" /></svg>' };
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

      await wrapper.setProps({ min: 150 });
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
    it('emits update:modelValue when thumb input event fires', async () => {
      const input = thumbInputs[0].element;
      input.value = '75';
      await thumbInputs[0].trigger('input');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toBeTruthy();
      expect(emitted[emitted.length - 1][0]).toBe(75);
    });

    it('emits change on blur when value has changed', async () => {
      const input = thumbInputs[0].element;
      input.value = '80';
      await thumbInputs[0].trigger('input');
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('does not emit change on blur when value is unchanged', async () => {
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('change')).toBeFalsy();
    });

    it('does not emit a false change on blur after an external modelValue update with no user interaction', async () => {
      await wrapper.setProps({ modelValue: 60 });
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('change')).toBeFalsy();
    });

    it('still emits change on blur when the user interacts after an external modelValue update', async () => {
      await wrapper.setProps({ modelValue: 60 });
      thumbInputs[0].element.value = '65';
      await thumbInputs[0].trigger('input');
      await thumbInputs[0].trigger('blur');
      const emitted = wrapper.emitted('change');
      expect(emitted).toBeTruthy();
      expect(emitted[emitted.length - 1][0]).toBe(65);
    });

    it('does not interact when disabled', async () => {
      mockProps = { disabled: true };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('disabled')).toBeDefined();
    });

    it('emits change (not just update:modelValue) when reactively narrowing max forces a value correction', async () => {
      // Without this, a consumer relying on 'change' for persistence (per its
      // own documented contract) never learns the value was corrected — the
      // displayed value visibly changes but nothing gets persisted.
      mockProps = { modelValue: 50, min: 0, max: 100 };
      updateWrapper();
      await wrapper.setProps({ max: 40 });
      const emitted = wrapper.emitted('change');
      expect(emitted).toBeTruthy();
      expect(emitted[emitted.length - 1][0]).toBe(40);
    });

    it('does not emit change when a reactive min/max/step/minGapSteps change does not actually move the value', async () => {
      mockProps = { modelValue: 50, min: 0, max: 100 };
      updateWrapper();
      await wrapper.setProps({ max: 90 });
      expect(wrapper.emitted('change')).toBeFalsy();
    });

    it('emits focus on thumb focus', async () => {
      await thumbInputs[0].trigger('focus');
      expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('emits blur on thumb blur', async () => {
      await thumbInputs[0].trigger('blur');
      expect(wrapper.emitted('blur')).toBeTruthy();
    });

    describe('Exposed public API', () => {
      // document.activeElement only tracks elements actually attached to the
      // document — the shared `wrapper` from the outer beforeEach isn't, so
      // these mount their own instance with attachTo instead.
      let attachedWrapper;

      afterEach(() => {
        attachedWrapper?.unmount();
      });

      it('focus() focuses the first thumb input', () => {
        attachedWrapper = mount(DtSlider, { props: baseProps, attachTo: document.body });
        const input = attachedWrapper.find('[data-qa="dt-slider-thumb"]').element;
        attachedWrapper.vm.focus();
        expect(document.activeElement).toBe(input);
      });

      it('blur() blurs the first thumb input', () => {
        attachedWrapper = mount(DtSlider, { props: baseProps, attachTo: document.body });
        const input = attachedWrapper.find('[data-qa="dt-slider-thumb"]').element;
        input.focus();
        expect(document.activeElement).toBe(input);
        attachedWrapper.vm.blur();
        expect(document.activeElement).not.toBe(input);
      });

      it('blur() blurs whichever thumb is actually focused in range mode, not always the first one', () => {
        attachedWrapper = mount(DtSlider, {
          props: { ...baseProps, modelValue: [20, 80] },
          attachTo: document.body,
        });
        const inputs = attachedWrapper.findAll('[data-qa="dt-slider-thumb"]');
        inputs[1].element.focus();
        expect(document.activeElement).toBe(inputs[1].element);
        attachedWrapper.vm.blur();
        expect(document.activeElement).not.toBe(inputs[1].element);
      });
    });

    describe('Pointer drag', () => {
      let control;

      beforeEach(() => {
        control = wrapper.find('[data-qa="dt-slider-control"]');
        // jsdom does not implement the Pointer Capture API.
        control.element.setPointerCapture = () => {};
      });

      it('adds the active class to the thumb on pointerdown', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--active');
      });

      it('focuses the nearest thumb input on pointerdown, so a keyboard nudge works immediately after', async () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        const focusSpy = vi.spyOn(thumbInputs[0].element, 'focus');
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        expect(focusSpy).toHaveBeenCalled();
      });

      it('does not add the keyboard-focus ring class for a pointer-driven focus', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--focused');
      });

      it('adds the keyboard-focus ring once the user arrow-navigates after a pointer-driven focus', async () => {
        // A click-to-focus never fires a second 'focus' event just because the
        // user starts using the keyboard afterward — the ring must still
        // appear once a keydown proves keyboard interaction is happening.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight' });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--focused');
      });

      it('adds the keyboard-focus ring class for a real keyboard (Tab) focus', async () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--focused');
      });

      it('does not corrupt the next real focus after a pointerdown on an already-focused thumb', async () => {
        // Attached to document.body (unlike the shared wrapper) so real
        // .focus()/.blur() genuinely move document.activeElement — the fix
        // checks that, and .trigger('focus') alone never touches it.
        const attached = mount(DtSlider, { props: baseProps, attachTo: document.body });
        try {
          const attachedControl = attached.find('[data-qa="dt-slider-control"]');
          attachedControl.element.setPointerCapture = () => {};
          const attachedInput = attached.find('[data-qa="dt-slider-thumb"]');

          attachedInput.element.focus();
          await nextTick();
          expect(document.activeElement).toBe(attachedInput.element);

          // .focus() on an already-focused element fires no focus event, so
          // if onPointerDown still called it unconditionally, isPointerFocus
          // would leak into the next real focus below and suppress its ring.
          await attachedControl.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
          await attachedControl.trigger('pointerup', { pointerId: 1 });

          attachedInput.element.blur();
          await nextTick();
          attachedInput.element.focus();
          await nextTick();

          expect(attached.find('[data-qa="dt-slider-thumb-visual"]').classes()).toContain('d-slider__thumb-visual--focused');
        } finally {
          attached.unmount();
        }
      });

      it('clears the keyboard-focus ring when a pointer drag starts on an already keyboard-focused thumb', async () => {
        // onPointerDown skips focus() for an already-focused thumb, so
        // onThumbFocus never runs to clear the ring — needs an explicit clear.
        // Attached to document.body so document.activeElement genuinely
        // reflects the focused thumb, which onPointerDown's check depends on.
        const attached = mount(DtSlider, { props: baseProps, attachTo: document.body });
        try {
          const attachedControl = attached.find('[data-qa="dt-slider-control"]');
          attachedControl.element.setPointerCapture = () => {};
          const attachedInput = attached.find('[data-qa="dt-slider-thumb"]');

          attachedInput.element.focus();
          await nextTick();
          expect(attached.find('[data-qa="dt-slider-thumb-visual"]').classes()).toContain('d-slider__thumb-visual--focused');

          await attachedControl.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
          const thumbVisual = attached.find('[data-qa="dt-slider-thumb-visual"]');
          expect(thumbVisual.classes()).not.toContain('d-slider__thumb-visual--focused');
          expect(thumbVisual.classes()).toContain('d-slider__thumb-visual--active');
        } finally {
          attached.unmount();
        }
      });

      it('restores focus to the remaining thumb when a controlled modelValue switches from range to single mode while the high thumb is focused', async () => {
        // Switching range->single unmounts thumb index 1's native input (its
        // function ref self-cleans) — if it held focus, the browser drops
        // focus to <body> with nothing to restore it otherwise.
        const attached = mount(DtSlider, {
          props: { ...baseProps, modelValue: [20, 70] },
          attachTo: document.body,
        });
        try {
          const inputs = attached.findAll('[data-qa="dt-slider-thumb"]');
          inputs[1].element.focus();
          await nextTick();
          expect(document.activeElement).toBe(inputs[1].element);

          await attached.setProps({ modelValue: 50 });
          await nextTick();
          await nextTick();

          const remaining = attached.find('[data-qa="dt-slider-thumb"]');
          expect(document.activeElement).toBe(remaining.element);
        } finally {
          attached.unmount();
        }
      });

      it('does not recreate a second thumb input when a controlled modelValue switches range to single mid-drag', async () => {
        // Range -> single mid-drag shrinks internalValues to length 1 while
        // the high thumb (index 1) is still the active drag target —
        // without clearing activeThumbIndex, the next pointermove revives a
        // second input even though the public model stayed scalar.
        const attached = mount(DtSlider, {
          props: { ...baseProps, modelValue: [20, 80] },
          attachTo: document.body,
        });
        try {
          const attachedControl = attached.find('[data-qa="dt-slider-control"]');
          attachedControl.element.setPointerCapture = () => {};
          attachedControl.element.getBoundingClientRect = () => (
            { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 }
          );

          // Grab the high thumb (value 80) and nudge it slightly, establishing
          // activeThumbIndex === 1.
          await attachedControl.trigger('pointerdown', {
            pointerId: 1, pointerType: 'mouse', button: 0, clientX: 80, buttons: 1,
          });
          await attachedControl.trigger('pointermove', { pointerId: 1, clientX: 80, buttons: 1 });
          expect(attached.findAll('[data-qa="dt-slider-thumb"]')).toHaveLength(2);

          // An external update collapses to single-thumb mode while the
          // pointer is still down and moving.
          await attached.setProps({ modelValue: 50 });
          await nextTick();
          expect(attached.findAll('[data-qa="dt-slider-thumb"]')).toHaveLength(1);

          await attachedControl.trigger('pointermove', { pointerId: 1, clientX: 70, buttons: 1 });
          await nextTick();

          expect(attached.findAll('[data-qa="dt-slider-thumb"]')).toHaveLength(1);
        } finally {
          attached.unmount();
        }
      });

      it('ignores pointerup/pointermove from an unrelated second pointer, so it cannot prematurely commit or freeze the real drag', async () => {
        // setPointerCapture only retargets pointer 1's events — an
        // unrelated second pointer's own pointerup would end and commit the
        // first pointer's drag, silently dropping its continued movement.
        control.element.getBoundingClientRect = () => (
          { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 }
        );
        await control.trigger('pointerdown', {
          pointerId: 1, pointerType: 'mouse', button: 0, clientX: 20, buttons: 1,
        });

        // An unrelated second pointer releases over the same control.
        await control.trigger('pointerup', { pointerId: 2 });

        // The real pointer keeps moving — if its drag had been prematurely
        // ended by the other pointer's release, this would be a no-op.
        await control.trigger('pointermove', { pointerId: 1, clientX: 60, buttons: 1 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(60);

        // The real pointer's own release still properly ends the drag.
        await control.trigger('pointerup', { pointerId: 1 });
        const emitted = wrapper.emitted('change');
        expect(emitted).toBeTruthy();
      });

      it('ignores a second pointer\'s pointerdown mid-drag, so it cannot hijack ownership and strand the real drag', async () => {
        // A second pointerdown reassigning activePointerId to itself would
        // make the FIRST pointer's own eventual pointerup fail the ownership
        // check this same fix added — stranding that drag with no commit and
        // isDragging stuck true, a worse outcome than the pre-fix behavior.
        control.element.getBoundingClientRect = () => (
          { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 }
        );
        await control.trigger('pointerdown', {
          pointerId: 1, pointerType: 'mouse', button: 0, clientX: 20, buttons: 1,
        });

        // An unrelated second pointer touches down mid-drag.
        await control.trigger('pointerdown', {
          pointerId: 2, pointerType: 'mouse', button: 0, clientX: 80, buttons: 1,
        });

        // The real (first) pointer's own release must still end its drag.
        await control.trigger('pointerup', { pointerId: 1 });
        expect(wrapper.emitted('change')).toBeTruthy();
      });

      it('prevents the default browser action on pointerdown, which would otherwise steal focus back after our own .focus() call', async () => {
        const event = new Event('pointerdown', { bubbles: true, cancelable: true });
        Object.assign(event, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        control.element.dispatchEvent(event);
        await nextTick();
        expect(event.defaultPrevented).toBe(true);
      });

      it('removes the active class on pointerup', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await control.trigger('pointerup', { pointerId: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--active');
      });

      it('keeps dragging while a pointermove still reports the button held', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await control.trigger('pointermove', { pointerId: 1, clientX: 10, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--active');
      });

      it('stops dragging when a pointermove reports the button released, even without a matching pointerup', async () => {
        // Simulates the button being released outside this document (e.g. a
        // parent frame, or outside the OS window), where no pointerup ever
        // reaches us.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await control.trigger('pointermove', { pointerId: 1, clientX: 10, buttons: 0 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--active');
      });

      it('ignores a non-primary mouse button, so the native context menu still works', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 2, clientX: 0, buttons: 2 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--active');
      });

      it('adds d-slider--dragging while a pointer drag is active, and removes it on release', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        expect(wrapper.find('[data-qa="dt-slider"]').classes()).toContain('d-slider--dragging');
        await control.trigger('pointerup', { pointerId: 1 });
        expect(wrapper.find('[data-qa="dt-slider"]').classes()).not.toContain('d-slider--dragging');
      });

      it('does not start or continue a drag on a disabled slider', async () => {
        mockProps = { disabled: true };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        await control.trigger('pointermove', { pointerId: 1, clientX: 50, buttons: 1 });
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      });

      it('stops accepting drag input the moment disabled flips true mid-drag', async () => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        await wrapper.setProps({ disabled: true });
        const emittedBefore = (wrapper.emitted('update:modelValue') || []).length;
        await control.trigger('pointermove', { pointerId: 1, clientX: 90, buttons: 1 });
        const emittedAfter = (wrapper.emitted('update:modelValue') || []).length;
        expect(emittedAfter).toBe(emittedBefore);
      });

      it('clears the keyboard-focus ring when disabled flips true while a thumb is focused', async () => {
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await thumbInputs[0].trigger('focus');
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--focused');

        await wrapper.setProps({ disabled: true });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).not.toContain('d-slider__thumb-visual--focused');
      });

      it('closes the tooltip readout when disabled flips true while a thumb is hovered', async () => {
        const hitTarget = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]')[0];
        await hitTarget.trigger('pointerenter');
        const readout = wrapper.find('[data-qa="dt-slider-thumb-readout-tooltip"]').element;
        expect(readout.matches(':popover-open')).toBe(true);

        await wrapper.setProps({ disabled: true });
        expect(readout.matches(':popover-open')).toBe(false);
      });

      it('routes a pointerdown to the thumb opposite the one last dragged, when both thumbs coincide', async () => {
        mockProps = { modelValue: [50, 50] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};

        // First drag: neither thumb has been active yet, so it grabs thumb 0.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--active');
        await control.trigger('pointerup', { pointerId: 1 });

        // Thumbs are still coincident — a fresh pointerdown must route to the
        // OTHER thumb, not fall back to thumb 0 again (the regression this
        // guards: activeThumbIndex resets to null on every pointerup, which
        // would make this always route to thumb 0).
        await control.trigger('pointerdown', { pointerId: 2, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[1].classes()).toContain('d-slider__thumb-visual--active');
      });

      it('hands a coincident drag off to the sibling thumb once the crossing clamp pins the active one', async () => {
        mockProps = { modelValue: [0, 0], min: 0, max: 100 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => (
          { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 }
        );

        // No prior drag yet, so this grabs thumb 0 (same as the test above).
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        // Dragging toward max: thumb 0 can never pass thumb 1 (both still at
        // 0), so without handing off, this would stay frozen at 0 forever.
        await control.trigger('pointermove', { pointerId: 1, clientX: 60, buttons: 1 });

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(0);
        expect(Number(thumbInputs[1].element.value)).toBe(60);
      });

      it('does not hand off a drag that started on a clearly distinct thumb, even after it converges with its sibling', async () => {
        mockProps = { modelValue: [40, 60], min: 0, max: 100 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => (
          { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 }
        );

        // Unambiguously grabs the low thumb — the pair isn't coincident yet.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 40, buttons: 1 });
        // First move lands exactly on the high thumb's value (40 -> 60),
        // becoming coincident as a RESULT of this gesture, not at its start.
        await control.trigger('pointermove', { pointerId: 1, clientX: 60, buttons: 1 });
        // A further move past that point is what the old (pre-narrowing) fix
        // incorrectly handed off to the high thumb — this gesture started on
        // a clearly distinct thumb, so it must stay pinned here instead.
        await control.trigger('pointermove', { pointerId: 1, clientX: 90, buttons: 1 });

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(60);
        expect(Number(thumbInputs[1].element.value)).toBe(60);
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisuals[0].classes()).toContain('d-slider__thumb-visual--active');
        expect(thumbVisuals[1].classes()).not.toContain('d-slider__thumb-visual--active');
      });
    });

    describe('Pointer-to-value mapping matches the thumb\'s own inset anchor', () => {
      // UseSliderGeometry's anchorPct compresses the thumb's rendered
      // position into an inset band (so it never renders past a consumer's
      // own overflow:hidden edge) — without the same compression in reverse
      // here, clicking exactly on the rendered thumb at min/max computed a
      // value a few units off 0/100 instead of landing on it, since the raw
      // pointer fraction spans the control's true (uncompressed) edges.
      // jsdom never computes real CSS layout, so getValueFromPointerEvent's
      // measurement probe (which asks the real browser to resolve
      // --slider-edge-inset to a pixel value) reads back a zero-width rect
      // here regardless of its own inline-size — these mocks simulate what
      // a real browser would actually resolve it to, so the inset-compressed
      // formula itself is under test, not just its zero-inset fallback path.
      const controlRect = { top: 0, left: 0, right: 200, bottom: 20, width: 200, height: 20 };
      const insetPx = 20;
      let control;
      let rectSpy;

      beforeEach(() => {
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;
        // Only the probe gets a fake rect — everything else (including
        // whatever the tooltip composable measures internally) falls
        // through to jsdom's own real implementation, same as every other
        // currently-passing test that never touches this mock at all.
        // Restoring this specific spy (not vi.restoreAllMocks()) matters:
        // the latter would also tear down the file-level beforeAll's own
        // :popover-open polyfill spy, breaking every test after this one.
        const realGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
        rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
          if (this.style.inlineSize === 'var(--slider-edge-inset)') {
            return { width: insetPx, height: 0, top: 0, left: 0, right: insetPx, bottom: 0 };
          }
          return realGetBoundingClientRect.call(this);
        });
      });

      afterEach(() => {
        rectSpy.mockRestore();
      });

      it('maps a click exactly on the min thumb\'s rendered position to min, not a few units off it', async () => {
        mockProps = { modelValue: 50 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: insetPx, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0);
      });

      it('maps a click exactly on the max thumb\'s rendered position to max', async () => {
        mockProps = { modelValue: 50 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: controlRect.width - insetPx, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(100);
      });

      it('clamps a click at the control\'s true edge, past the inset band, to min', async () => {
        mockProps = { modelValue: 50 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0);
      });

      it('maps a click at the control\'s own midpoint to the midpoint value — the inset term cancels out exactly at 50%', async () => {
        mockProps = { modelValue: 0 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: controlRect.width / 2, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(50);
      });
    });

    describe('Magnetic snapping (snapPoints)', () => {
      let control;

      // A 100px-wide control with the default min/max of [0, 100] makes the
      // fixed 10px snap threshold and the value threshold numerically
      // identical, which keeps the expected values in each test easy to
      // verify by hand.
      const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };

      const dragTo = async (clientX) => {
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX, buttons: 1 });
      };

      const moveTo = async (clientX) => {
        await control.trigger('pointermove', { pointerId: 1, clientX, buttons: 1 });
      };

      beforeEach(() => {
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;
      });

      it('pulls a dragged value within the snap threshold to the nearest interval snap point', async () => {
        mockProps = { snapPoints: 25 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(23); // distance 2 from the 25 snap point, within the fixed 10px threshold
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);
      });

      it('leaves a value outside the snap threshold freely selectable', async () => {
        mockProps = { snapPoints: 25 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(12); // distance 12 from the nearest interval point (0), outside the fixed 10px threshold
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(12);
      });

      it('pulls a dragged value within the snap threshold to the nearest arbitrary snap point', async () => {
        mockProps = { snapPoints: [10, 42, 90] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(41); // distance 1 from the 42 snap point
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(42);
      });

      it('uses normal step quantization, unaffected, for values far from any snap point', async () => {
        mockProps = { snapPoints: [10, 42, 90], step: 1 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(65);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(65);
      });

      it('does not snap keyboard-driven input, even near a snap point', async () => {
        mockProps = { snapPoints: 25 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');

        thumbInputs[0].element.value = '23';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(23);
      });

      it('leaves default behavior unchanged when snapPoints is not set', async () => {
        await dragTo(37);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(37);
      });

      it('re-quantizes an off-grid magnetic-snap value onto the step grid once the drag ends, restoring the real step for the next keyboard nudge', async () => {
        // Left in place, the next plain Arrow-key press would be handled
        // entirely natively using step="any"'s own default increment
        // instead of props.step.
        mockProps = {
          modelValue: 50, min: 0, max: 100, step: 25, snapPoints: [42],
        };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(42);
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].element.value).toBe('42');
        expect(thumbInputs[0].attributes('step')).toBe('any');

        await control.trigger('pointerup', { pointerId: 1 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].element.value).toBe('50'); // nearest real step-grid point
        expect(thumbInputs[0].attributes('step')).toBe('25');
      });

      it('holds a snapped thumb through hysteresis, past the entry radius, until it clears the wider release radius', async () => {
        // Fixed 10px entry radius, release radius 10 * SNAP_RELEASE_MULTIPLIER (2) = 20.
        mockProps = { snapPoints: 25 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(23); // distance 2, within entry radius 10 — snaps to 25
        let emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);

        await moveTo(10); // distance 15 from 25 — past entry radius, but within release radius 20
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25); // stays pinned via hysteresis

        await moveTo(0); // distance 25 — past the release radius, breaks free
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0);
      });

      it('snaps each thumb independently in range mode while still respecting the no-crossing clamp', async () => {
        mockProps = { modelValue: [40, 60], snapPoints: 25 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(23); // routes to the low thumb, snaps to 25 — well clear of the high thumb at 60
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([25, 60]);
      });

      it('snaps exactly at the threshold boundary (inclusive)', async () => {
        mockProps = { snapPoints: 25 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(15); // distance exactly 10 from the 25 snap point, equal to the fixed threshold
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);
      });

      it('never offers a snap point outside [min, max] as a target, so the emitted value can never leave the documented range', async () => {
        mockProps = { min: 0, max: 100, snapPoints: [105] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(98); // distance 7 from the out-of-range 105 "snap point" — must not pull toward it
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(98);
      });

      it('snaps correctly for a vertical slider, using the control height rather than width', async () => {
        const verticalRect = { top: 0, left: 0, right: 20, bottom: 100, width: 20, height: 100 };
        mockProps = { orientation: 'vertical', snapPoints: 25 };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => verticalRect;

        // Vertical value = min + (1 - (clientY - top) / height) * (max - min); clientY 77 -> value 23,
        // distance 2 from the 25 snap point, within the threshold.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 77, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);
      });

      it('releases hysteresis when the range-crossing clamp blocks the snap point, instead of freezing the thumb at the other thumb\'s boundary', async () => {
        // A snap point beyond the high thumb can pull the low thumb toward
        // it, but the crossing clamp then stops it short — hysteresis must
        // not keep comparing later drag positions against that unreachable
        // point, or the thumb stays stuck at 75 across a wide swath of the
        // drag that has nothing to do with the 90 snap point. High thumb is
        // placed at 75 (not 60) so the fixed 20px release radius around 90
        // still reaches a position (72) below the high thumb's clamp.
        mockProps = { modelValue: [40, 75], snapPoints: [90] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(41); // grabs the low thumb (nearer to 40 than 75)
        await moveTo(85); // distance 5 from 90, within entry radius 10 — snaps to 90, crossing-clamped to 75
        let emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([75, 75]);

        await moveTo(72); // distance 18 from 90 — past entry radius; would still be inside the OLD, un-reconciled
        // release radius (20), but the thumb is no longer near the point it's ostensibly "holding," and 72 is
        // not blocked by the high thumb at 75, so it must move freely.
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([72, 75]);
      });

      it('releases a held snap point immediately if snapPoints reactively changes to no longer include it, instead of staying latched', async () => {
        mockProps = { snapPoints: [20, 80] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(22); // distance 2 from 20, within the fixed 10px entry threshold — snaps to 20
        let emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(20);

        // 20 is removed mid-drag — 25 is still within 20's old release
        // radius, which previously stayed latched regardless.
        await wrapper.setProps({ snapPoints: [80] });
        await moveTo(25);
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(25);
      });

      it('holds a fractional snap point exactly in range mode, same as single-thumb mode, instead of re-rounding it onto the step grid', async () => {
        // The crossing clamp never touches this value — the low thumb is
        // nowhere near the high one — yet range mode's rounding used to run
        // unconditionally, re-rounding the held 42.5 down to 43 (step=1).
        mockProps = { modelValue: [20, 80], step: 1, snapPoints: [42.5] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(20); // grabs the low thumb
        await moveTo(42); // distance 0.5 from 42.5, within the fixed 10px threshold
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([42.5, 80]);
      });

      it('keeps a held fractional snap point through a reactive minGapSteps change mid-drag', async () => {
        // The min/max/step/minGapSteps watcher (UseSliderValue) re-applies the
        // full constraint pipeline on any of those props changing — unlike a
        // modelValue echo, it used to re-snap a held value with no exception
        // for an active magnetic hold at all.
        mockProps = { modelValue: [20, 80], step: 1, snapPoints: [42.5] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(20);
        await moveTo(42);
        await wrapper.setProps({ minGapSteps: 5 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0][0]).toBe(42.5);
      });

      it('enforces the exact required gap around a held value, not a gap computed against its snapped stand-in', async () => {
        // enforceRangeGap used to run on the already-snapped pair (42.5 -> 42
        // at step=1), position the sibling relative to THAT, then restore the
        // raw 42.5 afterward — leaving an actual gap of 4.6, short of the 5
        // minGapSteps promises. Threading the held value through the gap
        // computation itself keeps it exact.
        mockProps = { modelValue: [20, 44], step: 1, snapPoints: [42.4] };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(20);
        await moveTo(42); // distance 0.4 from 42.4, within the fixed 10px threshold
        await wrapper.setProps({ minGapSteps: 5 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([42.4, 47.4]);
      });

      it('clears a stale hold left behind by a coincident-drag handoff, so a later gap change still corrects that thumb', async () => {
        // resolveCoincidentHandoff reassigns which thumb is active but never
        // used to clear the ABANDONED thumb's own activeSnapValue entry —
        // updateThumbValue never runs for that index again this gesture, so
        // it stayed "held" indefinitely, letting a later gap requirement skip
        // correcting it entirely instead of just leaving it off-grid.
        mockProps = {
          modelValue: [50, 50], min: 0, max: 100, step: 1, snapPoints: [50],
        };
        updateWrapper();
        control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await dragTo(50); // grabs thumb 0 (no prior drag), latches onto 50
        await moveTo(70); // hands off to thumb 1 — thumb 0's hold must clear

        await wrapper.setProps({ minGapSteps: 60 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([10, 70]);
      });
    });

    describe('Keyboard: PageUp / PageDown / Shift+Arrow', () => {
      it('increases value by largeStep on PageUp', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(60); // 50 + 10
      });

      it('decreases value by largeStep on PageDown', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(40); // 50 - 10
      });

      it.each(['ArrowRight', 'ArrowUp'])('increases value by largeStep on Shift+%s', async (key) => {
        await thumbInputs[0].trigger('keydown', { key, shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(60); // 50 + 10
      });

      it.each(['ArrowLeft', 'ArrowDown'])('decreases value by largeStep on Shift+%s', async (key) => {
        await thumbInputs[0].trigger('keydown', { key, shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(40); // 50 - 10
      });

      it('does not apply largeStep on a plain, non-shifted ArrowRight', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight' });
        // Plain arrows are handled natively by <input type="range">, not by this
        // handler — no update should be emitted from the keydown handler itself.
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      });
    });

    describe('Range: minGapSteps', () => {
      beforeEach(() => {
        mockProps = { modelValue: [40, 60], minGapSteps: 10 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('clamps lower thumb when it would violate min gap', async () => {
        // Try to move lower thumb to 55 (would violate gap of 10 with upper at 60)
        thumbInputs[0].element.value = '55';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        // Should be clamped to 50 (60 - 10*1)
        expect(emitted[emitted.length - 1][0][0]).toBe(50);
      });
    });

    describe('Range: thumbs cannot cross (no minGapSteps set)', () => {
      beforeEach(() => {
        mockProps = { modelValue: [40, 60] };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('stops the lower thumb at the upper thumb\'s value instead of crossing it', async () => {
        thumbInputs[0].element.value = '90';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([60, 60]);
      });

      it('stops the upper thumb at the lower thumb\'s value instead of crossing it', async () => {
        thumbInputs[1].element.value = '10';
        await thumbInputs[1].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([40, 40]);
      });

      it('lets the two thumbs meet exactly (equal values are allowed)', async () => {
        thumbInputs[0].element.value = '60';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([60, 60]);
      });

      it('enforces the same constraint via PageUp/PageDown (largeStep)', async () => {
        // Lower thumb PageUp by the default largeStep (10) from 40 would reach 50 — fine —
        // but repeated presses should still stop it at the upper thumb's value.
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toEqual([60, 60]);
      });
    });

    it('corrects the native input DOM value when the crossing clamp leaves internalValues unchanged', async () => {
      // Native plain-arrow keyboard stepping is handled entirely by the
      // browser itself (see onThumbKeydown) — it writes straight into the
      // input's own DOM .value before Vue's 'input' handler ever runs, and
      // it isn't constrained to the sibling thumb's position the way this
      // range-mode crossing clamp is. Simulate exactly that: the low thumb
      // is already at 60 (touching the high thumb), and the native element
      // has already stepped itself one further, to 61.
      mockProps = { modelValue: [60, 60] };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      // Let mount fully settle first — pending post-mount reactive effects
      // (e.g. the collision-detection watcher's own nextTick) can otherwise
      // land on the same tick as the manual DOM write below and coincidentally
      // force-resync every input's value as an unrelated side effect of
      // Vue's own value-binding patch, masking whether THIS fix is what
      // actually corrected it.
      await settleCollisions();

      thumbInputs[0].element.value = '61';
      await thumbInputs[0].trigger('input');

      // The crossing clamp reduces 61 back to 60 — already the thumb's
      // current logical value — so internalValues never changes and no
      // update:modelValue fires. Without the fix, the native input's own
      // DOM value would be left at the wrong '61' anyway.
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(thumbInputs[0].element.value).toBe('60');
    });

    describe('Range: an inverted modelValue is normalized, not left crossed', () => {
      it('swaps an inverted initial modelValue on mount', () => {
        mockProps = { modelValue: [70, 30] };
        updateWrapper();
        expect(wrapper.props('modelValue')).toEqual([70, 30]); // prop itself is untouched
        thumbVisuals = wrapper.findAll('[data-qa="dt-slider-thumb-visual"]');
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // internal rendering is swapped to [30, 70] so low <= high internally
        expect(Number(thumbInputs[0].element.value)).toBe(30);
        expect(Number(thumbInputs[1].element.value)).toBe(70);
      });

      it('emits the corrected pair on mount so a v-model source stays in sync, not just the render', () => {
        mockProps = { modelValue: [70, 30] };
        updateWrapper();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toEqual([30, 70]);
      });

      it('swaps an inverted modelValue pushed in later via prop update', async () => {
        mockProps = { modelValue: [20, 80] };
        updateWrapper();
        await wrapper.setProps({ modelValue: [90, 10] });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(10);
        expect(Number(thumbInputs[1].element.value)).toBe(90);
      });

      it('emits the corrected pair when a later prop update arrives inverted', async () => {
        mockProps = { modelValue: [20, 80] };
        updateWrapper();
        await wrapper.setProps({ modelValue: [90, 10] });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toEqual([10, 90]);
      });

      it('does not re-emit when a later prop update is already in order', async () => {
        mockProps = { modelValue: [20, 80] };
        updateWrapper();
        await wrapper.setProps({ modelValue: [25, 75] });
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      });
    });

    describe('RTL (dir="rtl")', () => {
      // See mockControlDirection's own comment near the top of the file.
      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      it('mirrors pointer-to-value mapping — a physically-left position maps toward max, not min', async () => {
        await mockControlDirection('rtl');
        const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };
        const control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        // 10% across from the physical left edge is 90% under RTL (min renders
        // on the physical right), not 10% as it would under LTR.
        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(90);
      });

      it('does not mirror pointer mapping when direction is (explicitly or by default) ltr', async () => {
        await mockControlDirection('ltr');
        const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };
        const control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => controlRect;

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(10);
      });

      it('resyncs isRtl when direction changes via CSS/style rather than the dir attribute itself', async () => {
        // The dir ATTRIBUTE never changes — only what getComputedStyle
        // resolves to, as a CSS rule would produce. The observer must watch
        // more than dir, or isRtl stays stuck on its stale LTR value.
        const original = window.getComputedStyle.bind(window);
        let direction = 'ltr';
        mockControlDirectionSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el, ...rest) => {
          if (el?.dataset?.qa === 'dt-slider-control') return { direction };
          return original(el, ...rest);
        });

        const control = wrapper.find('[data-qa="dt-slider-control"]');
        control.element.setPointerCapture = () => {};
        control.element.getBoundingClientRect = () => (
          { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 }
        );

        direction = 'rtl';
        // Mutates `class`, not `dir` — simulates a CSS-only direction change.
        document.documentElement.classList.add('rtl-test-marker');
        await nextTick();

        await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 10, buttons: 1 });
        const emitted = wrapper.emitted('update:modelValue');
        // Physical 10% from the left is 90 under correctly-resynced RTL.
        expect(emitted[emitted.length - 1][0]).toBe(90);

        document.documentElement.classList.remove('rtl-test-marker');
      });

      it('does not resync on a class/style mutation to an unrelated element elsewhere in the document', async () => {
        // The observer used to watch the whole document (subtree: true on
        // documentElement), re-running getComputedStyle on any class/style
        // mutation anywhere on the page — including document.body, which is
        // neither controlRef's own ancestor chain nor documentElement itself.
        const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
        const callsBefore = getComputedStyleSpy.mock.calls.length;

        document.body.classList.add('unrelated-marker');
        await nextTick();

        expect(getComputedStyleSpy.mock.calls.length).toBe(callsBefore);
        document.body.classList.remove('unrelated-marker');
      });

      it('swaps Shift+ArrowRight to decrease (matching the native RTL-flipped arrow keys)', async () => {
        await mockControlDirection('rtl');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight', shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(40); // 50 - largeStep(10), flipped under rtl
      });

      it('swaps Shift+ArrowLeft to increase (matching the native RTL-flipped arrow keys)', async () => {
        await mockControlDirection('rtl');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowLeft', shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(60); // 50 + largeStep(10), flipped under rtl
      });

      it('does not swap Shift+ArrowUp/ArrowDown or PageUp/PageDown under rtl — only Left/Right are direction-relative', async () => {
        await mockControlDirection('rtl');
        await thumbInputs[0].trigger('keydown', { key: 'ArrowUp', shiftKey: true });
        let emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(60); // still increases

        await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
        emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(50); // still decreases, from 60
      });

      it('swaps Shift+ArrowRight/ArrowLeft for a vertical slider under rtl too — the native input is never actually reoriented', async () => {
        mockProps = { orientation: 'vertical' };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        await mockControlDirection('rtl');

        await thumbInputs[0].trigger('keydown', { key: 'ArrowRight', shiftKey: true });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(40); // 50 - largeStep(10), flipped under rtl, same as horizontal
      });

      it('centers the thumb on its actual anchor point under rtl, not one thumb-width off', async () => {
        // translateX(-50%) never mirrors under dir="rtl" — the compensating
        // shift must flip sign (+50%) or the thumb renders a full width away
        // from its anchor. controlRef isn't bound during the first render, so
        // mount normally first, then arm the mock and force a re-render.
        await mockControlDirection('rtl');
        await wrapper.setProps({ modelValue: 51 });
        const thumbVisual = wrapper.find('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisual.attributes('style')).toContain('translate(50%, -50%)');
      });

      it('keeps the ltr centering transform when direction is ltr', async () => {
        await mockControlDirection('ltr');
        await wrapper.setProps({ modelValue: 51 });
        const thumbVisual = wrapper.find('[data-qa="dt-slider-thumb-visual"]');
        expect(thumbVisual.attributes('style')).toContain('translate(-50%, -50%)');
      });

      it('centers ticks on their anchor point under rtl too', async () => {
        // Every tick (edge or not) shares the same anchorPct + centering
        // transform now — index 1 just exercises a genuine mid-track tick
        // (25 of [0, 25, 50, 75, 100]) rather than min/max specifically.
        mockProps = { showTicks: 25 };
        updateWrapper();
        await mockControlDirection('rtl');
        await wrapper.setProps({ modelValue: 51 });
        const tick = wrapper.findAll('[data-qa="dt-slider-tick"]')[1];
        expect(tick.attributes('style')).toContain('translateX(50%)');
      });
    });

    describe('modelValue bounds and shape validation', () => {
      it('resolves an omitted modelValue to the midpoint of [min, max], matching native <input type="range">', () => {
        mockProps = { modelValue: undefined, min: 10, max: 100 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(55);
      });

      it('clamps an initial modelValue above max down to max', () => {
        mockProps = { modelValue: 150, min: 0, max: 100 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(100);
      });

      it('clamps an initial modelValue below min up to min', () => {
        mockProps = { modelValue: -50, min: 0, max: 100 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(0);
      });

      it('emits the clamped correction on mount so v-model does not disagree with what is rendered', () => {
        mockProps = { modelValue: 150, min: 0, max: 100 };
        updateWrapper();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted[emitted.length - 1][0]).toBe(100);
      });

      it('clamps a later out-of-bounds modelValue prop update', async () => {
        mockProps = { modelValue: 50, min: 0, max: 100 };
        updateWrapper();
        await wrapper.setProps({ modelValue: 500 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(100);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(100);
      });

      it('re-clamps the current value when max shrinks below it, without modelValue itself changing', async () => {
        mockProps = { modelValue: 90, min: 0, max: 100 };
        updateWrapper();
        await wrapper.setProps({ max: 50 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(50);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(50);
      });

      it('re-clamps the current value when min rises above it, without modelValue itself changing', async () => {
        mockProps = { modelValue: 10, min: 0, max: 100 };
        updateWrapper();
        await wrapper.setProps({ min: 30 });
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(30);
      });

      it('truncates a modelValue array longer than 2 to the first two entries instead of rendering extra thumbs', () => {
        mockProps = { modelValue: [10, 50, 90] };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs).toHaveLength(2);
        expect(Number(thumbInputs[0].element.value)).toBe(10);
        expect(Number(thumbInputs[1].element.value)).toBe(50);
      });

      it('degrades a single-entry modelValue array to that one clamped value rather than an unmanaged partial thumb', () => {
        mockProps = { modelValue: [150], min: 0, max: 100 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs).toHaveLength(1);
        expect(Number(thumbInputs[0].element.value)).toBe(100);
      });
    });
  });

  describe('step edge cases', () => {
    it('does not produce NaN when step is 0 — falls back to the clamped raw value', async () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      thumbInputs[0].element.value = '73';
      await thumbInputs[0].trigger('input');
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toBe(73);
    });

    it('does not produce NaN when step is negative — falls back to the clamped raw value', async () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: -5 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      thumbInputs[0].element.value = '40';
      await thumbInputs[0].trigger('input');
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toBe(40);
    });

    it('falls back to the raw largeStep value for Shift+Arrow when step is 0', async () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      await thumbInputs[0].trigger('keydown', { key: 'ArrowRight', shiftKey: true });
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toBe(60); // 50 + default largeStep(10)
    });
  });

  describe('Controlled values stay on the native step grid', () => {
    it('snaps a controlled modelValue that does not land on the step grid, correcting the parent', () => {
      // The HTML range-state algorithm silently rounds any value assigned to
      // a step mismatch relative to the native input's own min — without
      // snapping this on mount, Vue's internal state (visual thumb, readout,
      // aria-valuetext, emitted modelValue) would say 42 while the browser's
      // own .value, implicit aria-valuenow, and form data would say 50.
      mockProps = { modelValue: 42, min: 0, max: 100, step: 25 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].element.value).toBe('50');
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toBe(50);
    });

    it('sets step="any" on a thumb whose value is off-grid from an active magnetic snap point', async () => {
      // snapPoints is documented to intentionally allow off-grid values
      // ("unlike step, this doesn't restrict which values are selectable")
      // — the real `step` attribute would otherwise let the browser silently
      // round that intentional value away the moment it's applied.
      mockProps = { modelValue: 50, min: 0, max: 100, step: 25, snapPoints: [42] };
      updateWrapper();
      const control = wrapper.find('[data-qa="dt-slider-control"]');
      control.element.setPointerCapture = () => {};
      control.element.getBoundingClientRect = () => (
        { left: 0, top: 0, right: 100, bottom: 20, width: 100, height: 20 }
      );
      await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 42, buttons: 1 });
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].element.value).toBe('42');
      expect(thumbInputs[0].attributes('step')).toBe('any');
    });

    it('uses the real step attribute for an on-grid value (the common case)', () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: 25 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('step')).toBe('25');
    });

    it('uses step="any" for any thumb when step itself is non-positive', () => {
      mockProps = { modelValue: 50, min: 0, max: 100, step: 0 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('step')).toBe('any');
    });
  });

  describe('Range: dependent per-thumb native bounds', () => {
    it('enforces minGapSteps on a controlled modelValue at mount, not just during interaction', () => {
      mockProps = { modelValue: [40, 60], min: 0, max: 100, step: 1, minGapSteps: 30 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(hi - lo).toBeGreaterThanOrEqual(30);
      expect(wrapper.emitted('update:modelValue')?.at(-1)[0]).toEqual([lo, hi]);
    });

    it('re-enforces the gap reactively when minGapSteps changes after mount', async () => {
      mockProps = { modelValue: [40, 60], min: 0, max: 100, step: 1 };
      updateWrapper();
      await wrapper.setProps({ minGapSteps: 30 });
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(hi - lo).toBeGreaterThanOrEqual(30);
    });

    it('binds each thumb\'s native min/max to the sibling-dependent range, not the full [min, max]', () => {
      // WAI-ARIA's multi-thumb slider pattern requires each thumb's
      // aria-valuemin/aria-valuemax (native min/max on a range input) to
      // reflect the OTHER thumb's current position, not the full domain.
      mockProps = { modelValue: [40, 60], min: 0, max: 100, step: 1, minGapSteps: 5 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('min')).toBe('0');
      expect(thumbInputs[0].attributes('max')).toBe('55'); // 60 - gap(5)
      expect(thumbInputs[1].attributes('min')).toBe('45'); // 40 + gap(5)
      expect(thumbInputs[1].attributes('max')).toBe('100');
    });

    it('single-thumb mode is unaffected — each thumb still uses the full [min, max]', () => {
      mockProps = { modelValue: 50, min: 0, max: 100 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('min')).toBe('0');
      expect(thumbInputs[0].attributes('max')).toBe('100');
    });

    it('does not apply the sibling gap when a malformed single-element array reaches range mode', () => {
      // isRange is a bare Array.isArray check — a prop validator only warns in
      // dev, it never coerces — so modelValue={[50]} still reaches
      // internalValues as a length-1 array while isRange stays true. There's
      // no second thumb to leave a gap against.
      mockProps = { modelValue: [50], min: 0, max: 100, step: 1, minGapSteps: 5 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].attributes('min')).toBe('0');
      expect(thumbInputs[0].attributes('max')).toBe('100');
    });

    it('keeps the result within [min, max] and lo <= hi when minGapSteps*step exceeds the domain span', () => {
      // enforceRangeGap's fallback math (widen from hi, then pull lo down,
      // then re-clamp to min) can only approximate an impossible gap — this
      // pins that it degrades safely rather than producing an inverted or
      // out-of-bounds pair.
      mockProps = {
        modelValue: [8, 12], min: 0, max: 20, step: 1, minGapSteps: 50,
      };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(lo).toBeGreaterThanOrEqual(0);
      expect(hi).toBeLessThanOrEqual(20);
      expect(lo).toBeLessThanOrEqual(hi);
    });

    it('never emits a gap-widened value above max, even when rounding at a coarser precision than max\'s own would overshoot it', () => {
      // Widening hi (0.9+0.3) would overshoot max (0.96), so this shrinks lo
      // instead. Previously, rounding at min/step's precision (1 decimal
      // place) could push a hi pinned at max (0.96) out to 1 — above max.
      mockProps = {
        modelValue: [0.8, 0.9], min: 0, max: 0.96, step: 0.1, minGapSteps: 3,
      };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(hi).toBeLessThanOrEqual(0.96);
      expect(hi - lo).toBeCloseTo(0.3, 5);
    });

    it('prefers shrinking the low end over pinning the high end at max, so the high thumb is not left frozen', () => {
      // Widening hi (80+20) would overshoot max (95), so this shrinks lo
      // instead of the old "always push hi to max" fallback — hi stays at
      // 90, lo moves to 70.
      mockProps = {
        modelValue: [80, 90], min: 0, max: 95, step: 10, minGapSteps: 2,
      };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect([lo, hi]).toEqual([70, 90]);
      // Its native min/max window must not collapse to a single point.
      expect(thumbInputs[1].attributes('min')).not.toBe(thumbInputs[1].attributes('max'));
    });

    it('keeps the result within [min, max] when min/max reactively shrink below a previously-valid gap', async () => {
      mockProps = {
        modelValue: [8, 12], min: 0, max: 20, step: 1, minGapSteps: 5,
      };
      updateWrapper();
      await wrapper.setProps({ max: 10, minGapSteps: 50 });
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(lo).toBeGreaterThanOrEqual(0);
      expect(hi).toBeLessThanOrEqual(10);
      expect(lo).toBeLessThanOrEqual(hi);
    });

    it('does not let a negative minGapSteps invert the drag-time crossing clamp', async () => {
      // Unvalidated, a negative gap flips the sign in the crossing-clamp
      // math and lets the low thumb be dragged PAST the high thumb instead
      // of only up to it — the opposite of what minGapSteps is for.
      mockProps = {
        modelValue: [30, 60], min: 0, max: 100, step: 1, minGapSteps: -5,
      };
      updateWrapper();
      const control = wrapper.find('[data-qa="dt-slider-control"]');
      control.element.setPointerCapture = () => {};
      control.element.getBoundingClientRect = () => (
        { left: 0, top: 0, right: 100, bottom: 20, width: 100, height: 20 }
      );
      await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 30, buttons: 1 });
      await control.trigger('pointermove', { pointerId: 1, clientX: 70, buttons: 1 });
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      const [lo, hi] = [Number(thumbInputs[0].element.value), Number(thumbInputs[1].element.value)];
      expect(lo).toBeLessThanOrEqual(hi);
    });

    it('does not let a single NaN element in a controlled range modelValue contaminate the other thumb via enforceRangeGap', () => {
      mockProps = { modelValue: [NaN, 5], min: 0, max: 100, step: 1, minGapSteps: 2 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].element.value).not.toBe('NaN');
      expect(thumbInputs[1].element.value).not.toBe('NaN');
      expect(Number.isNaN(Number(thumbInputs[0].element.value))).toBe(false);
      expect(Number.isNaN(Number(thumbInputs[1].element.value))).toBe(false);
    });

    it('grid-aligns the sibling thumb\'s native bound when the other thumb holds an off-grid magnetic snap point, instead of permanently mismatching its native step', async () => {
      // A native <input>'s stepMismatch is relative to its OWN min — if the
      // low thumb's off-grid snap (42) became the high thumb's native min
      // as-is, every real grid value it could reach would mismatch it.
      mockProps = {
        modelValue: [25, 75], min: 0, max: 100, step: 25, snapPoints: [42],
      };
      updateWrapper();
      const control = wrapper.find('[data-qa="dt-slider-control"]');
      control.element.setPointerCapture = () => {};
      control.element.getBoundingClientRect = () => (
        { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 }
      );

      // Grab the low thumb and pull it onto the 42 snap point.
      await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 40, buttons: 1 });
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(Number(thumbInputs[0].element.value)).toBe(42);

      // Native min must be a real grid point (50), not the raw off-grid 42.
      expect(thumbInputs[1].attributes('min')).toBe('50');
    });
  });

  describe('Vertical orientation + range mode combined', () => {
    // Neither combination has its own dedicated coverage elsewhere — vertical
    // tests use single-thumb mode, range tests use horizontal — leaving
    // UseSliderGeometry's vertical-range indicatorStyle branch and
    // getNearestThumbIndex's clientY-based routing unexercised together.
    const verticalRect = { top: 0, left: 0, right: 20, bottom: 100, width: 20, height: 100 };

    it('drags each thumb independently via clientY and updates the vertical range indicator', async () => {
      mockProps = { orientation: 'vertical', modelValue: [20, 70] };
      updateWrapper();
      const control = wrapper.find('[data-qa="dt-slider-control"]');
      control.element.setPointerCapture = () => {};
      control.element.getBoundingClientRect = () => verticalRect;

      // value = min + (1 - (clientY - top) / height) * (max - min)
      // Low thumb: 20 (clientY 80) -> 30 (clientY 70)
      await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 80, buttons: 1 });
      await control.trigger('pointermove', { pointerId: 1, clientY: 70, buttons: 1 });
      await control.trigger('pointerup', { pointerId: 1 });

      // High thumb: 70 (clientY 30) -> 60 (clientY 40)
      await control.trigger('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientY: 30, buttons: 1 });
      await control.trigger('pointermove', { pointerId: 1, clientY: 40, buttons: 1 });
      await control.trigger('pointerup', { pointerId: 1 });

      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      expect(thumbInputs[0].element.value).toBe('30');
      expect(thumbInputs[1].element.value).toBe('60');

      const style = wrapper.find('[data-qa="dt-slider-indicator"]').attributes('style');
      // Range mode's indicator anchors both edges onto the same inset band as
      // the thumbs themselves (anchorPct/anchorSpanPct), not raw percentages
      // — see UseSliderGeometry's indicatorStyle.
      expect(style).toContain('bottom: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.3)');
      expect(style).toContain('height: calc((100% - var(--slider-edge-inset) * 2) * 0.3)');
    });
  });

  describe('largeStep always moves when step is coarser than largeStep', () => {
    it('moves by a full step instead of no-op-ing when step > 2 * largeStep', async () => {
      // Rounding largeStep's raw sum to the NEAREST step-grid point could
      // round backward to the starting value (e.g. step=25, largeStep=10:
      // 100 + 10 = 110 rounds back to 100) — a silent no-op on a documented
      // keyboard operation. This is exactly the shipped playback/zoom demo
      // configuration (step=25, largeStep left at its default of 10).
      mockProps = { modelValue: 100, min: 0, max: 200, step: 25 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe(125);
    });

    it('still moves by exactly one step when even one step would overshoot largeStep by a lot', async () => {
      mockProps = { modelValue: 100, min: 0, max: 105, step: 25, largeStep: 1 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
      expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe(75);
    });

    it('keeps exact backward-compatible behavior for the common case (step=1, default largeStep=10)', async () => {
      mockProps = { modelValue: 50 };
      updateWrapper();
      thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
      expect(wrapper.emitted('update:modelValue').at(-1)[0]).toBe(60);
    });
  });

  describe('Fractional step precision', () => {
    describe('Decimal modelValue rendering', () => {
      it('renders a fractional modelValue on the native input', () => {
        mockProps = { modelValue: 3.141, min: 0, max: 10, step: 0.001 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].element.value).toBe('3.141');
      });

      it('renders a fractional min on the native input attribute', () => {
        mockProps = { modelValue: 1.5, min: 0.5, max: 2.5, step: 0.25 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('min')).toBe('0.5');
      });

      it('renders a fractional max on the native input attribute', () => {
        mockProps = { modelValue: 1.5, min: 0.5, max: 2.5, step: 0.25 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('max')).toBe('2.5');
      });

      it('renders a fractional step on the native input attribute', () => {
        mockProps = { modelValue: 0.5, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(thumbInputs[0].attributes('step')).toBe('0.1');
      });
    });

    describe('Snap precision (no IEEE 754 drift)', () => {
      it('emits exact value for step=0.1 — avoids 3×0.1 = 0.30000000000000004', async () => {
        mockProps = { modelValue: 0, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '0.3';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0.3);
      });

      it('emits exact value for step=0.001 — avoids 3141×0.001 = 3.1410000000000004', async () => {
        mockProps = { modelValue: 0, min: 0, max: 10, step: 0.001 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '3.141';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(3.141);
      });

      it('emits exact value for step=0.05', async () => {
        mockProps = { modelValue: 0, min: 0, max: 1, step: 0.05 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '0.15';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0.15);
      });

      it('preserves a tiny modelValue expressed in scientific notation on mount, instead of truncating it to 0', () => {
        // String(5e-7) has no "." for decimalPlaces' plain branch to find,
        // so it previously reported 0 places and toFixed(0) truncated to 0.
        mockProps = {
          modelValue: 5e-7, min: 0, max: 1e-6, step: 1e-7,
        };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        expect(Number(thumbInputs[0].element.value)).toBe(5e-7);
      });

      it('emits exact value for step=0.25 with non-zero min', async () => {
        mockProps = { modelValue: 0.25, min: 0.25, max: 2.0, step: 0.25 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '1.25';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(1.25);
      });

      it('emits exact integer for integer step (no regression)', async () => {
        mockProps = { modelValue: 0, min: 0, max: 100, step: 1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '73';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(73);
      });

      it('clamps to max without drift for fractional step', async () => {
        mockProps = { modelValue: 0, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '1.5';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(1);
      });

      it('clamps to min without drift for fractional step', async () => {
        mockProps = { modelValue: 0.5, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '-0.5';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0);
      });
    });

    describe('Tick generation with fractional interval', () => {
      it('generates 5 ticks for showTicks=0.25 over 0–1', () => {
        mockProps = { showTicks: 0.25, min: 0, max: 1, step: 0.25 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(5);
      });

      it('generates 11 ticks for showTicks=0.1 over 0–1', () => {
        mockProps = { showTicks: 0.1, min: 0, max: 1, step: 0.1 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(11);
      });

      it('generates 5 ticks for showTicks=2.5 over 0–10', () => {
        mockProps = { showTicks: 2.5, min: 0, max: 10, step: 2.5 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(5);
      });

      it('generates exactly 11 ticks for step=0.1 over 0–1 — no extra tick from loop drift', () => {
        mockProps = { showTicks: true, step: 0.1, min: 0, max: 1 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-tick"]')).toHaveLength(11);
      });
    });

    describe('Marks default', () => {
      it('renders no marks by default', async () => {
        await nextTick();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')).toHaveLength(0);
      });

      it('renders start and end marks when showMarks is true', async () => {
        mockProps = { showMarks: true };
        updateWrapper();
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks).toHaveLength(2);
        expect(marks[0].text()).toBe(String(baseProps.min ?? 0));
        expect(marks[1].text()).toBe(String(baseProps.max ?? 100));
      });

      it('renders no marks when showMarks is explicitly false', async () => {
        mockProps = { showMarks: false };
        updateWrapper();
        await nextTick();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')).toHaveLength(0);
      });

      it('applies suffix to default and bare-number marks, but not explicit text', async () => {
        mockProps = { suffix: '%', showMarks: [25, { value: 75, text: 'Cap' }] };
        updateWrapper();
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[0].text()).toBe('25%');
        expect(marks[1].text()).toBe('Cap');
      });

      it('ignores getValueText for a bare-number mark and falls back to suffix — a mark has no thumb index for getValueText to differentiate on', async () => {
        mockProps = { suffix: '%', getValueText: (v, i) => i === 0 ? `${v} low` : `${v} high`, showMarks: [25] };
        updateWrapper();
        await nextTick();
        expect(wrapper.find('[data-qa="dt-slider-mark"]').text()).toBe('25%');
      });

      it('ignores getValueText for the min/max marks too', async () => {
        mockProps = { suffix: '%', showMarks: true, getValueText: (v, i) => i === 0 ? `Minimum: ${v}` : `Maximum: ${v}` };
        updateWrapper();
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[0].text()).toBe(`${baseProps.min ?? 0}%`);
        expect(marks[1].text()).toBe(`${baseProps.max ?? 100}%`);
      });

      it('still uses an explicit mark text override even when getValueText is set', async () => {
        mockProps = { getValueText: (v) => `${v} units`, showMarks: [{ value: 25, text: 'Cap' }] };
        updateWrapper();
        await nextTick();
        expect(wrapper.find('[data-qa="dt-slider-mark"]').text()).toBe('Cap');
      });
    });

    describe('Thumb and tick edge inset — the thumb never visually crosses the first/last tick', () => {
      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      // Pinning the exact calc() formula (not just "some inset exists"), same
      // rationale as the tooltip's own equivalent test above: it's the only
      // way to catch a future regression that silently drops the inset.
      const EDGE_INSET = 'var(--slider-edge-inset)';

      it('insets the thumb at min instead of reaching the control\'s true 0% edge', () => {
        mockProps = { modelValue: 0 };
        updateWrapper();
        const style = thumbVisuals[0].attributes('style');
        expect(style).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 0)`);
      });

      it('insets the thumb at max instead of reaching the control\'s true 100% edge', () => {
        mockProps = { modelValue: 100 };
        updateWrapper();
        const style = thumbVisuals[0].attributes('style');
        expect(style).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 1)`);
      });

      it('applies the same inset to the thumb-hit area as the visible thumb, so the draggable/hit target stays under it', () => {
        mockProps = { modelValue: 0 };
        updateWrapper();
        const hit = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]')[0];
        const expected = `inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 0)`;
        expect(hit.attributes('style')).toContain(expected);
      });

      it('insets the min tick onto the same anchorPct band as the thumb, instead of centering it on the true 0% edge', () => {
        // showTicks: 100 (not true) — a 100-wide interval on the default
        // [0, 100] range generates exactly the two edge ticks, no middle ones.
        mockProps = { showTicks: 100 };
        updateWrapper();
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks[0].attributes('style')).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 0)`);
        expect(ticks[0].attributes('style')).toContain('translateX(-50%)');
      });

      it('insets the max tick onto the same anchorPct band as the thumb, instead of centering it on the true 100% edge', () => {
        mockProps = { showTicks: 100 };
        updateWrapper();
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks[1].attributes('style')).toContain(`inset-inline-start: calc(${EDGE_INSET} + (100% - ${EDGE_INSET} * 2) * 1)`);
        expect(ticks[1].attributes('style')).toContain('translateX(-50%)');
      });

      it('mirrors the edge tick\'s centering transform under rtl, same as every other track element', async () => {
        mockProps = { showTicks: 100 };
        updateWrapper();
        await mockControlDirection('rtl');
        await nextTick();
        const ticks = wrapper.findAll('[data-qa="dt-slider-tick"]');
        expect(ticks[0].attributes('style')).toContain('translateX(50%)');
        expect(ticks[1].attributes('style')).toContain('translateX(50%)');
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
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[0].attributes('style')).toContain('translateX(1px)');
      });

      it('nudges the max mark 1px inward from the flush edge, shifted by its own full width', async () => {
        mockProps = { showMarks: true };
        updateWrapper();
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[1].attributes('style')).toContain('translateX(calc(-100% + -1px))');
      });

      it('still centers a custom mark that does not land on min or max — no inline transform override, relying on the CSS default', async () => {
        mockProps = { showMarks: [50] };
        updateWrapper();
        await nextTick();
        const mark = wrapper.find('[data-qa="dt-slider-mark"]');
        expect(mark.attributes('style')).not.toContain('transform');
      });

      it('mirrors the end-edge shift under rtl, same sign flip as the centering transform', async () => {
        mockProps = { showMarks: true };
        updateWrapper();
        await mockControlDirection('rtl');
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[1].attributes('style')).toContain('translateX(calc(100% + 1px))');
      });

      it('does not edge-align marks in vertical orientation, where this distinction does not apply', async () => {
        mockProps = { showMarks: true, orientation: 'vertical' };
        updateWrapper();
        await nextTick();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks[0].attributes('style')).not.toContain('transform');
        expect(marks[1].attributes('style')).not.toContain('transform');
      });
    });

    describe('Mark / readout collision avoidance', () => {
      // jsdom has no real layout engine — getBoundingClientRect() returns an
      // all-zero rect for every element by default. Marks are still measured
      // directly (their position doesn't animate, so no analytical treatment
      // needed), but the always readout's position is computed
      // analytically from pct + the control's own rect (see
      // analyticalReadoutRect in UseSliderCollisionAvoidance), so the control
      // needs a stub too — that readout's stubbed rect only contributes its
      // width. The tooltip readout's rect is measured as-is.
      const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
      const readoutSize = { top: 0, left: 0, right: 20, bottom: 20 }; // 20px wide
      const nearReadoutRect = { top: 0, left: 150, right: 170, bottom: 20 }; // overlaps a readout at pct 51
      // Inside controlRect's own bounds (0–300), not past them — a rect
      // that overflows the control's edges now also feeds the edge-clamp
      // offset (see "Edge-aware mark label clamping" below), which these
      // collision-only tests aren't about and shouldn't have to account for.
      const farRect = { top: 0, left: 250, right: 270, bottom: 20 };

      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      it('observes the control on mount and disconnects on unmount', () => {
        const observeSpy = vi.spyOn(global.ResizeObserver.prototype, 'observe');
        const disconnectSpy = vi.spyOn(global.ResizeObserver.prototype, 'disconnect');
        updateWrapper();
        expect(observeSpy).toHaveBeenCalledWith(wrapper.find('[data-qa="dt-slider-control"]').element);
        wrapper.unmount();
        expect(disconnectSpy).toHaveBeenCalled();
        observeSpy.mockRestore();
        disconnectSpy.mockRestore();
      });

      it('actually recomputes collisions when the observed control resizes, not just a no-op subscription', async () => {
        // The global ResizeObserver mock (tests/setupTests.js) is a true
        // no-op — observe() never invokes its callback — so a passing
        // observe()/disconnect() spy alone wouldn't prove the callback body
        // itself does anything. Install a local stub that captures the real
        // callback the component registers, and invoke it directly to
        // simulate an actual resize.
        let observerCallback;
        const OriginalResizeObserver = global.ResizeObserver;
        global.ResizeObserver = class {
          constructor (callback) {
            observerCallback = callback;
          }

          observe () {}
          disconnect () {}
          unobserve () {}
        };

        try {
          mockProps = { readout: 'always', showMarks: [0, 100], modelValue: 50 };
          updateWrapper();
          await nextTick();

          wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
          const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
          const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
          marks[0].element.getBoundingClientRect = () => farRect;
          marks[1].element.getBoundingClientRect = () => farRect;
          readouts[0].element.getBoundingClientRect = () => readoutSize;
          thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
          thumbInputs[0].element.value = '51';
          await thumbInputs[0].trigger('input');
          await settleCollisions();
          expect(wrapper.findAll('[data-qa="dt-slider-mark"]')[0].classes())
            .not.toContain('d-slider__mark--collision-hidden');

          // Simulate the control actually resizing: the mark's rect now
          // overlaps the readout, with nothing else (value, getValueText,
          // prefix/suffix, orientation, dir) changing — only the captured
          // observer callback itself can be what re-triggers the recheck.
          marks[0].element.getBoundingClientRect = () => nearReadoutRect;
          observerCallback();
          await settleCollisions();

          expect(wrapper.findAll('[data-qa="dt-slider-mark"]')[0].classes())
            .toContain('d-slider__mark--collision-hidden');
        } finally {
          global.ResizeObserver = OriginalResizeObserver;
        }
      });

      it('hides a mark once it overlaps the visible readout', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        marks[0].element.getBoundingClientRect = () => nearReadoutRect;
        marks[1].element.getBoundingClientRect = () => farRect;
        readouts[0].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).toContain('d-slider__mark--collision-hidden');
        expect(marksAfter[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('hides a mark once it overlaps the tooltip readout (the default mode) — tooltip elements are looked up by their own ref array, not data-readout-index', async () => {
        // readoutElByIndex used to only search readoutElRefs (data-readout-index,
        // the always readout's own lookup) — the tooltip readout
        // has no such attribute, so with readout left at its default
        // ('tooltip'), this collision check was silently a no-op: marks and
        // the tooltip bubble could overlap with zero hiding ever applied.
        mockProps = { showMarks: [0, 100], modelValue: 50 }; // readout defaults to 'tooltip'
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const hitTarget = wrapper.findAll('[data-qa="dt-slider-thumb-hit"]')[0];
        await hitTarget.trigger('pointerenter'); // opens the tooltip so it's considered for collisions
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const tooltip = wrapper.find('[data-qa="dt-slider-thumb-readout-tooltip"]');
        tooltip.element.getBoundingClientRect = () => nearReadoutRect;
        marks[0].element.getBoundingClientRect = () => nearReadoutRect;
        marks[1].element.getBoundingClientRect = () => farRect;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // Far from mark 0 by percent math — only the measured bubble overlaps it.
        thumbInputs[0].element.value = '10';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).toContain('d-slider__mark--collision-hidden');
        expect(marksAfter[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('keeps a mark visible when it does not overlap the readout', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        marks[0].element.getBoundingClientRect = () => farRect;
        marks[1].element.getBoundingClientRect = () => farRect;
        readouts[0].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).not.toContain('d-slider__mark--collision-hidden');
        expect(marksAfter[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('restores a mark when the overlapping tooltip readout closes', async () => {
        mockProps = { showMarks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        marks[0].element.getBoundingClientRect = () => nearReadoutRect;
        wrapper.find('[data-qa="dt-slider-thumb-readout-tooltip"]').element.getBoundingClientRect = () => nearReadoutRect;

        const hitTarget = wrapper.find('[data-qa="dt-slider-thumb-hit"]');
        await hitTarget.trigger('pointerenter');
        await settleCollisions();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')[0].classes()).toContain('d-slider__mark--collision-hidden');

        await hitTarget.trigger('pointerleave');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('re-checks collisions when getValueText changes the readout text, even though the value itself did not change', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], modelValue: 50, getValueText: (v) => `${v}` };
        updateWrapper();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        marks[0].element.getBoundingClientRect = () => farRect;
        marks[1].element.getBoundingClientRect = () => farRect;
        readouts[0].element.getBoundingClientRect = () => readoutSize;
        // Let the mount-triggered check settle FIRST, on a non-colliding
        // baseline — otherwise that initial check (not the getValueText
        // change below) could be the one that picks up an already-stubbed
        // colliding rect, making this test pass for the wrong reason.
        await settleCollisions();
        let marksNow = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksNow[0].classes()).not.toContain('d-slider__mark--collision-hidden');

        // Now make the mark's rect overlap the readout's, but touch nothing
        // except getValueText — modelValue is untouched, so internalValues
        // never changes; only the collision watcher's getValueText
        // dependency can be what triggers a recheck from here.
        marks[0].element.getBoundingClientRect = () => nearReadoutRect;
        await wrapper.setProps({ getValueText: (v) => `Volume: ${v}` });
        await settleCollisions();

        marksNow = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksNow[0].classes()).toContain('d-slider__mark--collision-hidden');
        expect(marksNow[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('detects a readout/mark collision correctly under rtl, where pct mirrors to the physical right', async () => {
        // analyticalReadoutRect computes the readout's collision rect from
        // pct + the control's own rect — under RTL that pct is measured
        // from the physical right (insetInlineStart mirrors), so the
        // calculation has to mirror too, or it places the readout on the
        // wrong side entirely and the system ends up hiding the wrong mark
        // (or missing/inventing a collision) rather than the one that's
        // actually overlapping on screen.
        mockProps = { readout: 'always', showMarks: [0, 100], modelValue: 50 };
        updateWrapper();
        await nextTick();

        await mockControlDirection('rtl');
        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        readouts[0].element.getBoundingClientRect = () => readoutSize;

        // At modelValue 90 under RTL, the readout's correctly-mirrored
        // analytical center sits near the physical LEFT (effective pct
        // 100-90=10 -> ~30px on this 300px-wide control), not near the
        // physical right (~270px) an un-mirrored calculation would place
        // it. Stub a mark's rect exactly where the mirrored readout should
        // land, and the far mark well outside either candidate position.
        const nearMirroredReadoutRect = { top: 0, left: 20, right: 40, bottom: 20 };
        marks[0].element.getBoundingClientRect = () => nearMirroredReadoutRect;
        marks[1].element.getBoundingClientRect = () => farRect;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '90';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].classes()).toContain('d-slider__mark--collision-hidden');
        expect(marksAfter[1].classes()).not.toContain('d-slider__mark--collision-hidden');
      });

      it('re-measures collisions on a pure runtime dir flip, with no value/marks/prefix/suffix change', async () => {
        mockProps = { readout: 'always', showMarks: [0, 100], modelValue: 90 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        readouts[0].element.getBoundingClientRect = () => readoutSize;
        // Neither the LTR readout position at modelValue 90 (~260-280, see
        // the RTL mirroring test above) nor its RTL-mirrored position
        // (~20-40) — genuinely clear of both, for a real baseline.
        const neutralRect = { top: 0, left: 120, right: 140, bottom: 20 };
        marks[0].element.getBoundingClientRect = () => neutralRect;
        marks[1].element.getBoundingClientRect = () => neutralRect;
        await settleCollisions();

        // Baseline under LTR: nothing overlaps, nothing hidden.
        let marksNow = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksNow[0].classes()).not.toContain('d-slider__mark--collision-hidden');

        // Re-stub mark[0] where the RTL-mirrored readout would land (see the
        // RTL mirroring test above) — only the dir attribute changes next,
        // not modelValue/marks/prefix/suffix, so this only gets measured if
        // isRtl is itself a reactive source the collision watcher reacts to.
        const nearMirroredReadoutRect = { top: 0, left: 20, right: 40, bottom: 20 };
        marks[0].element.getBoundingClientRect = () => nearMirroredReadoutRect;
        await mockControlDirection('rtl');
        await settleCollisions();

        marksNow = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksNow[0].classes()).toContain('d-slider__mark--collision-hidden');
      });
    });

    describe('Edge-aware mark label clamping', () => {
      // 300px-wide control, matching the collision-avoidance describe above.
      const controlRect = { top: 0, left: 100, right: 400, bottom: 20 };

      // A real browser's getBoundingClientRect() reflects whatever offset a
      // previous updateCollisions call already applied (which the "back out
      // any previous offset" step expects) — jsdom has no layout engine, so
      // read the mark's own applied inline offset back out of its style to
      // simulate that.
      function rectWithCurrentOffset (el, naturalLeft, naturalRight) {
        const match = (el.style.transform || '').match(/calc\([^+]+\+\s*(-?[\d.]+)px\)/);
        const offset = match ? parseFloat(match[1]) : 0;
        return { top: 0, left: naturalLeft + offset, right: naturalRight + offset, bottom: 20 };
      }

      afterEach(() => {
        mockControlDirectionSpy?.mockRestore();
        document.documentElement.removeAttribute('dir');
      });

      it('does not shift a mark whose overflow already fits within the existing overflow-clip-margin tolerance (32px)', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        // Hangs 20px past the left edge — within the 32px tolerance.
        marks[0].element.getBoundingClientRect = () => ({ top: 0, left: 80, right: 150, bottom: 20 });
        marks[1].element.getBoundingClientRect = () => ({ top: 0, left: 350, right: 420, bottom: 20 });

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(style).not.toContain('translateX(calc(');
      });

      it('does not shift a mark whose overflow lands exactly at the 32px tolerance boundary (the condition is a strict >)', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        // Hangs exactly 32px past the left edge — not "beyond" it.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 68, 150);
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 420);

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(style).not.toContain('translateX(calc(');
      });

      it('shifts a mark by exactly 1px once its overflow is just 1px past the 32px tolerance boundary', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        // Hangs 33px past the left edge — 1px beyond the 32px tolerance.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 67, 150);
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 420);

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(style).toContain('translateX(calc(-50% + 1px))');
      });

      it('shifts a start-edge mark inward by only the excess past the 32px tolerance, not the full overflow', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        // Hangs 50px past the left edge — 18px beyond the 32px tolerance.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 50, 150);
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 420);

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(style).toContain('translateX(calc(-50% + 18px))');
      });

      it('shifts an end-edge mark inward (the opposite direction) by only the excess past the tolerance', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 500, 520);
        // Hangs 50px past the right edge — 18px beyond the 32px tolerance.
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 450);

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[1].attributes('style');
        expect(style).toContain('translateX(calc(-50% + -18px))');
      });

      it('re-measures from the natural (unshifted) position, so a later smaller overflow reduces the offset instead of compounding on top of it', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        // First: 50px overflow -> +18px offset.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 50, 150);
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 420);
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style')).toContain('+ 18px');

        // Then: a shorter value now only overflows by 40px -> +8px offset,
        // not 18 + 8. The mark's own element is the same one already
        // carrying the +18px transform from the check above — swapping its
        // stub to a smaller natural overflow (40px, not 50px) and
        // re-measuring proves the offset shrinks with it, rather than
        // stacking on top of the stale +18px.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 60, 150);
        thumbInputs[0].element.value = '52';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(style).toContain('translateX(calc(-50% + 8px))');
      });

      it('does not apply any offset in vertical orientation, where marks sit beside the track rather than below it', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50, orientation: 'vertical' };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        marks[0].element.getBoundingClientRect = () => ({ top: 0, left: 50, right: 150, bottom: 20 });
        marks[1].element.getBoundingClientRect = () => ({ top: 0, left: 350, right: 420, bottom: 20 });

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(style).not.toContain('translateX(calc(');
      });

      it('drops an already-applied offset immediately when orientation switches from horizontal to vertical', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        // Hangs 50px past the left edge — 18px beyond the 32px tolerance.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 50, 150);
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 420);
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();
        // Sanity: the offset really did apply while still horizontal.
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style')).toContain('translateX(calc(');

        // markEdgeOffsetPx itself is never cleared on this switch (see
        // updateMarkEdgeOffsets's own early bail) — it's markStyle's own
        // !isVertical.value check that has to stop that now-stale +18px
        // from leaking into vertical mode's translateY-based transform.
        await wrapper.setProps({ orientation: 'vertical' });

        const styleAfter = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(styleAfter).not.toContain('translateX(calc(');
      });

      it('mirrors the shift direction under RTL, same as the existing centering transform', async () => {
        mockProps = { showMarks: [5, 95], modelValue: 50 };
        updateWrapper();
        await nextTick();

        await mockControlDirection('rtl');
        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        // Hangs 50px past the left edge — 18px beyond the 32px tolerance.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 50, 150);
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 420);

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const style = wrapper.findAll('[data-qa="dt-slider-mark"]')[0].attributes('style');
        expect(style).toContain('translateX(calc(50% + 18px))');
      });

      it('composes correctly with mark/readout collision-hiding — an edge-clamped mark can still be hidden by an overlapping readout', async () => {
        // The readout's rect is analytical — analyticalReadoutRect derives
        // its CENTER from pct + controlRect, only borrowing WIDTH from the
        // stubbed element (see that function). With controlRect 100–400
        // (300px wide) and modelValue 21 (post-trigger), pct 21 puts its
        // center at 100 + 0.21*300 = 163; a 10px-wide stub centers that at
        // 158–168 — inside this mark's corrected (post-edge-clamp) position
        // (68–168), so the two features' outcomes (a shifted transform AND
        // a hidden mark) are expected to hold simultaneously.
        mockProps = { readout: 'always', showMarks: [5, 95], modelValue: 20 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        // Hangs 50px past the left edge — 18px beyond the 32px tolerance.
        marks[0].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[0].element, 50, 150);
        marks[1].element.getBoundingClientRect = () => rectWithCurrentOffset(marks[1].element, 350, 420);
        readouts[0].element.getBoundingClientRect = () => ({ top: 0, left: 0, right: 10, bottom: 20 });

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '21';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const marksAfter = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marksAfter[0].attributes('style')).toContain('translateX(calc(-50% + 18px))');
        expect(marksAfter[0].classes()).toContain('d-slider__mark--collision-hidden');
      });
    });

    describe('Range readout collision merge', () => {
      // Position is now computed analytically from pct + the control's rect
      // (not read off the readout element directly — see analyticalReadoutRect
      // in Slider.vue), so the control needs a stub too; the readout's own
      // stubbed rect only contributes its width to the calculation.
      const controlRect = { top: 0, left: 0, right: 300, bottom: 20 };
      const readoutSize = { top: 0, left: 0, right: 20, bottom: 20 }; // 20px wide

      it('merges both readouts into a single centered pill once they overlap', async () => {
        mockProps = { readout: 'always', modelValue: [40, 60], min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        let readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        readouts[0].element.getBoundingClientRect = () => readoutSize;
        readouts[1].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // 55 vs 60: 5% apart on a 300px control (15px), well inside the
        // combined 20px of half-widths (10px each) — genuinely overlaps.
        thumbInputs[0].element.value = '55';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        expect(readouts[0].classes()).toContain('d-slider__readout--hide');
        expect(readouts[1].classes()).toContain('d-slider__readout--hide');

        const merged = wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]');
        expect(merged.exists()).toBe(true);
        expect(merged.text()).toBe('55–60');
      });

      it('keeps both readouts separate when they do not overlap', async () => {
        mockProps = { readout: 'always', modelValue: [20, 80], min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const readouts = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        readouts[0].element.getBoundingClientRect = () => readoutSize;
        readouts[1].element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // 21 vs 80: nowhere close on a 300px control.
        thumbInputs[0].element.value = '21';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        const readoutsAfter = wrapper.findAll('[data-qa="dt-slider-thumb-readout"]');
        expect(readoutsAfter[0].classes()).toContain('d-slider__readout--show');
        expect(readoutsAfter[1].classes()).toContain('d-slider__readout--show');
        expect(wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]').exists()).toBe(false);
      });

      it('does not merge outside range mode', async () => {
        mockProps = { readout: 'always', modelValue: 50, min: 0, max: 100 };
        updateWrapper();
        await nextTick();

        wrapper.find('[data-qa="dt-slider-control"]').element.getBoundingClientRect = () => controlRect;
        const readout = wrapper.find('[data-qa="dt-slider-thumb-readout"]');
        readout.element.getBoundingClientRect = () => readoutSize;

        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        thumbInputs[0].element.value = '51';
        await thumbInputs[0].trigger('input');
        await settleCollisions();

        expect(wrapper.find('[data-qa="dt-slider-thumb-readout-merged"]').exists()).toBe(false);
      });
    });

    describe('Marks with fractional positions', () => {
      it('renders the correct number of marks for a fractional marks array', () => {
        mockProps = { showMarks: [0.25, 0.5, 0.75], min: 0, max: 1, step: 0.25 };
        updateWrapper();
        expect(wrapper.findAll('[data-qa="dt-slider-mark"]')).toHaveLength(3);
      });

      it('renders mark text for a fractional number entry', () => {
        mockProps = { showMarks: [0.5], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        const mark = wrapper.find('[data-qa="dt-slider-mark"]');
        expect(mark.text()).toBe('0.5');
      });

      it('renders mark text from an object entry at a fractional position', () => {
        mockProps = { showMarks: [{ value: 0.5, text: 'Halfway' }], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        expect(wrapper.find('[data-qa="dt-slider-mark"]').text()).toBe('Halfway');
      });

      it('renders exactly the two min/max marks when showMarks is true, even with a fractional step', () => {
        mockProps = { showMarks: true, step: 0.25, min: 0, max: 1 };
        updateWrapper();
        const marks = wrapper.findAll('[data-qa="dt-slider-mark"]');
        expect(marks).toHaveLength(2);
        expect(marks[0].text()).toBe('0');
        expect(marks[1].text()).toBe('1');
      });
    });

    describe('Range mode with fractional step', () => {
      beforeEach(() => {
        mockProps = { modelValue: [0.2, 0.8], min: 0, max: 1, step: 0.1 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('renders the lower bound on the first input', () => {
        expect(thumbInputs[0].element.value).toBe('0.2');
      });

      it('renders the upper bound on the second input', () => {
        expect(thumbInputs[1].element.value).toBe('0.8');
      });

      it('emits exact fractional values for range mode update', async () => {
        thumbInputs[0].element.value = '0.3';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0][0]).toBe(0.3);
      });

      it('enforces minGapSteps gap with fractional step', async () => {
        mockProps = { modelValue: [1.0, 3.0], min: 0, max: 10, step: 0.5, minGapSteps: 2 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // gap = 2 × 0.5 = 1.0; lower thumb max = 3.0 − 1.0 = 2.0
        thumbInputs[0].element.value = '2.5';
        await thumbInputs[0].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0][0]).toBe(2);
      });

      it('rounds out IEEE-754 drift in the minGapSteps gap (3 * 0.1 !== 0.3 in raw JS)', async () => {
        mockProps = { modelValue: [0.3, 0.9], min: 0, max: 1, step: 0.1, minGapSteps: 3 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
        // High thumb (index 1) nudged toward the low thumb: gap = 3 * 0.1, which is
        // 0.30000000000000004 in raw JS float math — the emitted value must be the
        // clean 0.6, not that literal.
        thumbInputs[1].element.value = '0.31';
        await thumbInputs[1].trigger('input');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0][1]).toBe(0.6);
      });
    });

    describe('PageUp / PageDown with fractional largeStep', () => {
      beforeEach(() => {
        mockProps = { modelValue: 0.5, min: 0, max: 10, step: 0.1, largeStep: 0.5 };
        updateWrapper();
        thumbInputs = wrapper.findAll('[data-qa="dt-slider-thumb"]');
      });

      it('increases value by fractional largeStep on PageUp', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageUp' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(1);
      });

      it('decreases value by fractional largeStep on PageDown', async () => {
        await thumbInputs[0].trigger('keydown', { key: 'PageDown' });
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[emitted.length - 1][0]).toBe(0);
      });
    });
  });

  describe('fillOrigin', () => {
    describe('When fillOrigin is the default (\'start\')', () => {
      beforeEach(() => {
        mockProps = { modelValue: 25, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the min end toward the thumb, with its static cap flush at the control edge', () => {
        const style = indicator.attributes('style');
        // The fixed end (no thumb there) stays literally flush; the
        // thumb-tracking width anchors onto the same inset band as the
        // thumb itself (anchorPct) — see UseSliderGeometry's indicatorStyle.
        expect(style).toContain('inset-inline-start: 0;');
        expect(style).toContain('width: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });

    describe('When fillOrigin is \'start\' and the thumb is at min', () => {
      beforeEach(() => {
        mockProps = { modelValue: 0, min: 0, max: 100 };
        updateWrapper();
      });

      it('stays flush at the control edge, with the thumb-tracking edge exactly at the thumb (no overshoot)', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: 0;');
        expect(style).toContain('width: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0)');
      });
    });

    describe('When fillOrigin is \'end\'', () => {
      beforeEach(() => {
        mockProps = { modelValue: 25, min: 0, max: 100, fillOrigin: 'end' };
        updateWrapper();
      });

      it('fills from the max end toward the thumb, with its static cap flush at the control edge', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-end: 0;');
        expect(style).toContain('width: calc(100% - calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.25))');
      });
    });

    describe('When fillOrigin is an invalid string', () => {
      it('does not accept a value outside start/end', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { fillOrigin: 'middle' };
        updateWrapper();
        expect(warnSpy.mock.calls[0][0]).toContain('Invalid prop: custom validator check failed for prop "fillOrigin"');
        warnSpy.mockRestore();
      });
    });

    describe('When fillOrigin is set and value equals fillOrigin', () => {
      beforeEach(() => {
        mockProps = { modelValue: 50, fillOrigin: 50 };
        updateWrapper();
      });

      it('renders the indicator with zero width', () => {
        expect(indicator.attributes('style')).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0)');
      });
    });

    describe('When value is above fillOrigin', () => {
      beforeEach(() => {
        mockProps = { modelValue: 75, fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the origin toward the thumb', () => {
        const style = indicator.attributes('style');
        // Both edges (the origin and the thumb) anchor onto the same inset
        // band — see UseSliderGeometry's indicatorStyle.
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.5)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });

    describe('When value is below fillOrigin', () => {
      beforeEach(() => {
        mockProps = { modelValue: 25, fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('fills from the thumb back toward the origin', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.25)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });

    describe('When fillOrigin is outside [min, max]', () => {
      it('clamps fillOrigin above max to max', () => {
        mockProps = { modelValue: 60, fillOrigin: 150, min: 0, max: 100 };
        updateWrapper();
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.6)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.4)');
      });

      it('clamps fillOrigin below min to min', () => {
        mockProps = { modelValue: 40, fillOrigin: -50, min: 0, max: 100 };
        updateWrapper();
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.4)');
      });
    });

    describe('When fillOrigin is set in range mode', () => {
      beforeEach(() => {
        mockProps = { modelValue: [20, 80], fillOrigin: 50, min: 0, max: 100 };
        updateWrapper();
      });

      it('ignores fillOrigin and fills between the two thumbs', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('inset-inline-start: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.2)');
        expect(style).toContain('width: calc((100% - var(--slider-edge-inset) * 2) * 0.6)');
      });
    });

    describe('When fillOrigin is set with vertical orientation', () => {
      beforeEach(() => {
        mockProps = { modelValue: 75, fillOrigin: 50, min: 0, max: 100, orientation: 'vertical' };
        updateWrapper();
      });

      it('fills from origin toward thumb along the block axis', () => {
        const style = indicator.attributes('style');
        expect(style).toContain('bottom: calc(var(--slider-edge-inset) + (100% - var(--slider-edge-inset) * 2) * 0.5)');
        expect(style).toContain('height: calc((100% - var(--slider-edge-inset) * 2) * 0.25)');
      });
    });
  });

  describe('Reserved space for marks/readout', () => {
    // Marks/readout are position:absolute (see slider.less), so they don't
    // naturally reserve layout space — without the reserve-space class,
    // content right after <dt-slider> renders on top of them.
    const bodySelector = '.d-slider__body';

    it('does not reserve space by default — showMarks defaults false and readout defaults to tooltip (rendered above, not below)', () => {
      updateWrapper();
      expect(wrapper.find(bodySelector).classes()).not.toContain('d-slider__body--reserve-annotation-space');
    });

    it('does not reserve space when both marks and readout are turned off', () => {
      mockProps = { showMarks: false, readout: 'never' };
      updateWrapper();
      expect(wrapper.find(bodySelector).classes()).not.toContain('d-slider__body--reserve-annotation-space');
    });

    it('does not reserve space for a tooltip readout, even with marks off — nothing renders in the below-track row', () => {
      mockProps = { showMarks: false, readout: 'tooltip' };
      updateWrapper();
      expect(wrapper.find(bodySelector).classes()).not.toContain('d-slider__body--reserve-annotation-space');
    });

    it('still reserves space for readout alone, with marks turned off', () => {
      mockProps = { showMarks: false, readout: 'always' };
      updateWrapper();
      expect(wrapper.find(bodySelector).classes()).toContain('d-slider__body--reserve-annotation-space');
    });

    it('still reserves space for marks alone, with readout turned off', () => {
      mockProps = { showMarks: [0, 100], readout: 'never' };
      updateWrapper();
      expect(wrapper.find(bodySelector).classes()).toContain('d-slider__body--reserve-annotation-space');
    });

    it('still reserves space for marks alone, even with a tooltip readout', () => {
      mockProps = { showMarks: [0, 100], readout: 'tooltip' };
      updateWrapper();
      expect(wrapper.find(bodySelector).classes()).toContain('d-slider__body--reserve-annotation-space');
    });

    it('does not reserve space in vertical orientation — marks/readout sit beside the track there, not below it', () => {
      mockProps = { orientation: 'vertical' };
      updateWrapper();
      expect(wrapper.find(bodySelector).classes()).not.toContain('d-slider__body--reserve-annotation-space');
    });
  });

  // A real parent with a genuine v-model round trip — wrapper.setProps()
  // would skip the child-emits-then-parent-echoes-back cycle the bug needs.
  describe('Parent v-model feedback during a drag', () => {
    const controlRect = { top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20 };

    it('holds a magnetic snap point through a real parent v-model echo, then reports the quantized commit on release', async () => {
      const ParentWithVModel = defineComponent({
        name: 'ParentWithVModel',
        components: { DtSlider },
        data() {
          return { value: 75, changeEvents: [] };
        },

        methods: {
          onChange(payload) {
            this.changeEvents.push(payload);
          },
        },

        render() {
          return h(DtSlider, {
            label: 'Volume',
            modelValue: this.value,
            'onUpdate:modelValue': (v) => { this.value = v; },
            onChange: this.onChange,
            min: 0,
            max: 100,
            step: 25,
            snapPoints: [42],
          });
        },
      });

      const parentWrapper = mount(ParentWithVModel);
      const control = parentWrapper.find('[data-qa="dt-slider-control"]');
      control.element.setPointerCapture = () => {};
      control.element.getBoundingClientRect = () => controlRect;

      // Drag from 75 onto the 42 snap point, then release — the repro shape.
      await control.trigger('pointerdown', {
        pointerId: 1, pointerType: 'mouse', button: 0, clientX: 75, buttons: 1,
      });
      await control.trigger('pointermove', { pointerId: 1, clientX: 42, buttons: 1 });
      await nextTick();
      // The parent's echo of 42 should have already round-tripped — it must
      // come back as 42, not get silently re-snapped onto the step grid
      // (50) just because it passed through a real v-model assignment.
      expect(parentWrapper.vm.value).toBe(42);

      await control.trigger('pointerup', { pointerId: 1 });
      await nextTick();

      // Release re-quantizes the held off-grid value onto the real grid —
      // this part is intentional, not the bug the hold above guards against.
      expect(parentWrapper.vm.value).toBe(50);
      expect(parentWrapper.vm.changeEvents).toEqual([50]);

      parentWrapper.unmount();
    });
  });
});
