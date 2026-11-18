import {
  isValidElement,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { devWarn } from '../../common/dev';
import { hasContent, renderSlot } from '../../common/slots';
import { DtText, TEXT_SIZE_MODIFIERS, TEXT_STRENGTH_MODIFIERS, type TextStrength } from '../Text';
import {
  SLIDER_DEFAULT_LARGE_STEP,
  SLIDER_FILL_ORIGINS,
  SLIDER_ORIENTATIONS,
  SLIDER_READOUT_MODES,
  type SliderFillOrigin,
  type SliderOrientation,
  type SliderReadoutMode,
} from './SliderConstants';
import { isValidMark, type SliderMark } from './utils';
import type { ResolvedSliderProps, SliderEmit, SliderValue } from './Composables/types';
import { useSliderCollisionAvoidance } from './Composables/UseSliderCollisionAvoidance';
import { useSliderDevWarnings } from './Composables/UseSliderDevWarnings';
import { useSliderDirection } from './Composables/UseSliderDirection';
import { useSliderGeometry } from './Composables/UseSliderGeometry';
import { useSliderInteraction } from './Composables/UseSliderInteraction';
import { useSliderMagneticSnap } from './Composables/UseSliderMagneticSnap';
import { useSliderMarksAndTicks } from './Composables/UseSliderMarksAndTicks';
import { useSliderTooltipReadout } from './Composables/UseSliderTooltipReadout';
import { useSliderValue } from './Composables/UseSliderValue';

export type { SliderValue } from './Composables/types';
export type { SliderMark } from './utils';

type LabelSize = (typeof TEXT_SIZE_MODIFIERS)['label'][number];
/** '300' → 300: Vue's validator accepts each label size as a string or a number. */
type NumericSize<S> = S extends `${infer N extends number}` ? N : never;

/** The label render prop's scope (Vue's scoped `#label` slot). */
export interface SliderLabelScope {
  /** The live value: a number, or a pair in range mode, updating as a thumb is dragged. */
  value: SliderValue;
}

/** The methods Vue exposes on the component, through `ref`. */
export interface DtSliderHandle {
  /** Focuses the first thumb. */
  focus: () => void;
  /** Blurs whichever thumb has focus. */
  blur: () => void;
}

// These go to each native thumb <input> instead of the root — the wrapper
// <div> isn't a form control, so leaving them there would duplicate the name
// and strand the rest where assistive tech querying the input never sees them.
type ThumbAriaKey = 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'aria-errormessage' | 'aria-details'
  | 'aria-invalid';

interface DtSliderOwnProps {
  /**
   * The current value (Vue's modelValue). A number enables single-thumb mode; an array of two numbers enables range
   * mode. When omitted (or null), resolves to the midpoint of [min, max] — matching native <input type="range">.
   * As with Vue's v-model, the slider keeps its own value and follows this one whenever it changes.
   */
  value?: SliderValue | null;

  /** The initial value when `value` is unset. */
  defaultValue?: SliderValue | null;

  /** Fired on every value change (drag, keyboard, track click) — Vue's `update:modelValue`. */
  onValueChange?: (value: SliderValue) => void;

  /**
   * Fired when a value change commits — Vue's `change`: pointer up, blur, or a min/max/step/minGapSteps correction
   * that lands outside any in-progress drag. Use this for API calls or persistence.
   */
  onValueCommit?: (value: SliderValue) => void;

  /** Native focus event on a thumb. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;

  /** Native blur event on a thumb. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;

  /** The minimum allowed value. Must be finite. */
  min?: number;

  /** The maximum allowed value. Must be finite. */
  max?: number;

  /** The increment/decrement step. Must be finite. */
  step?: number;

  /**
   * Magnetic snap points the thumb pulls toward while dragging — unlike step, this doesn't restrict which values are
   * selectable. Pass a number for an evenly spaced interval (e.g. 25), or an array for arbitrary values
   * (e.g. [10, 42, 90]). Pointer drag only — keyboard stepping (step/largeStep) is unaffected.
   * Values must be finite numbers; malformed array entries are ignored.
   */
  snapPoints?: number | readonly number[];

  /**
   * Disables the slider, preventing interaction.
   * @values true, false
   */
  disabled?: boolean;

  /**
   * Track orientation.
   * @values horizontal, vertical
   */
  orientation?: SliderOrientation;

  /**
   * Which end the indicator fills from, toward the thumb: "start" (the default, aka left) fills from the min end,
   * "end" (aka right) fills from the max end. Pass a number instead to fill outward from that value toward the
   * thumb (aka center-fill). A numeric origin is clamped to [min, max]. Ignored in range mode.
   */
  fillOrigin?: SliderFillOrigin | number;

  /**
   * Renders tick marks along the track. Pass true to put a tick at every step; pass a number instead to space ticks
   * at that interval (same units as step).
   */
  showTicks?: boolean | number;

  /**
   * Minimum gap, in steps (not raw values), that must remain between the two thumbs in range mode: the actual minimum
   * gap enforced between their values is minGapSteps * step.
   */
  minGapSteps?: number;

  /**
   * Label for the slider. A string is the visible label text, and becomes the thumbs' aria-label when showLabel is
   * false. Any other content replaces it, as Vue's `#label` slot does; a function receives `{ value }`, the live
   * value(s). Required for accessibility; if omitted, provide aria-label on the component. Rich content can't
   * collapse to the flat string aria-label requires, so pass a string when the label is hidden.
   */
  label?: ReactNode | ((scope: SliderLabelScope) => ReactNode);

  /**
   * When false, the label is removed and its text (a string label, not other content) is promoted to aria-label
   * instead.
   * @values true, false
   */
  showLabel?: boolean;

  /**
   * Overrides the label text size.
   * @values 100, 200, 300, 400
   */
  labelSize?: LabelSize | NumericSize<LabelSize> | null;

  /**
   * Overrides the label font weight.
   * @values bold, semibold, medium, normal
   */
  labelStrength?: TextStrength | null;

  /**
   * A function returning the user-facing text for a value — shared by the readout and each thumb's aria-valuetext.
   * index is the thumb index (use it to differentiate thumbs in range mode). Not used for a mark's own
   * auto-generated text, which uses prefix/suffix. Takes precedence over prefix/suffix for the readout and
   * aria-valuetext.
   */
  getValueText?: ((value: number, index?: number) => string) | null;

  /** Text prepended to the raw number wherever it's displayed — e.g. prefix="$". Always applied to marks. */
  prefix?: string;

  /** Text appended to the raw number wherever it's displayed — e.g. suffix="%". Always applied to marks. */
  suffix?: string;

  /** Native name attribute for form submission. In range mode, both inputs share this name. */
  name?: string;

  /**
   * Roughly how far to move on Page Up/Page Down or Shift + Arrow, in the same units as step — rounded to the nearest
   * whole number of steps (at least one).
   */
  largeStep?: number;

  /** Additional class(es) applied to the body wrapper containing the start slot, control, and end slot. */
  bodyClass?: ClassValue;

  /** Additional class(es) applied to the label wrapper element. */
  labelClass?: ClassValue;

  /** Additional class(es) applied to the inline-start slot wrapper (aka left). */
  startClass?: ClassValue;

  /** Additional class(es) applied to the inline-end slot wrapper (aka right). */
  endClass?: ClassValue;

  /**
   * Controls the live value readout for each thumb: a tooltip-styled bubble above the thumb shown only while
   * hovering, dragging, or focusing it (the default); always visible below the track; or never shown. The tooltip
   * uses the native Popover API; browsers without it don't display the floating readout.
   * @values tooltip, always, never
   */
  readout?: SliderReadoutMode;

  /** Additional class(es) applied to the individual and merged inline readouts when readout is 'always'. */
  readoutClass?: ClassValue;

  /**
   * Text annotations rendered below the track at specific positions, independent of ticks. Pass true to label min
   * and max only. Pass an array for explicit control: each entry is a plain number (text formatted with
   * prefix/suffix) or an object with a required value and optional text override.
   * Mark values must be finite numbers; malformed entries are ignored.
   */
  showMarks?: boolean | readonly SliderMark[];

  /**
   * Optional content at the inline-start end of the track (aka left). When using icon-only content, add aria-label
   * or hidden text to the icon.
   */
  start?: ReactNode;

  /**
   * Optional content at the inline-end end of the track (aka right). When using icon-only content, add aria-label or
   * hidden text to the icon.
   */
  end?: ReactNode;

  /** The component's methods (Vue's exposed focus and blur). */
  ref?: Ref<DtSliderHandle>;
}

/**
 * Like Vue's `$attrs`, `className`, `style` and every other attribute go on the root, except the thumb aria attributes
 * (aria-label, aria-labelledby, aria-describedby, aria-errormessage, aria-details, aria-invalid), which go on each
 * native thumb input.
 */
export interface DtSliderProps extends DtSliderOwnProps,
  Omit<ComponentPropsWithoutRef<'div'>, keyof DtSliderOwnProps | 'children' | 'onChange'> {}

// Recurses into content for actual TEXT, not just "something renders" — an
// icon-only label would otherwise count as providing an accessible name.
function hasText (node: ReactNode): boolean {
  if (typeof node === 'string') return node.trim() !== '';
  if (typeof node === 'number' || typeof node === 'bigint') return true;
  if (Array.isArray(node)) return node.some(hasText);
  if (isValidElement(node)) return hasText((node.props as { children?: ReactNode }).children);
  return false;
}

const LABEL_SIZES: readonly string[] = TEXT_SIZE_MODIFIERS.label;
const LABEL_STRENGTHS = Object.keys(TEXT_STRENGTH_MODIFIERS);
const ORIENTATIONS: readonly unknown[] = SLIDER_ORIENTATIONS;
const FILL_ORIGINS: readonly unknown[] = SLIDER_FILL_ORIGINS;
const READOUT_MODES: readonly unknown[] = SLIDER_READOUT_MODES;

/**
 * Vue's prop validators: each warns when its prop changes to a value it rejects. Absent props aren't validated, as in
 * Vue. The ref keeps StrictMode's second mount from warning twice.
 */
function useValidatedProp (name: string, value: unknown, isValid: (value: never) => boolean) {
  const validated = useRef<{ value: unknown } | null>(null);
  useEffect(() => {
    if (validated.current && Object.is(validated.current.value, value)) return;
    validated.current = { value };
    if (value == null) return;
    if (!isValid(value as never)) devWarn(`Invalid prop: custom validator check failed for prop "${name}".`);
    // isValid is a fixed function per prop; only the value decides when to validate.
  }, [value]);
}

/**
 * A slider lets users select a value, or a range of values, by dragging a thumb along a track.
 * @see https://dialtone.dialpad.com/components/slider.html
 */
export function DtSlider ({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  onFocus,
  onBlur,
  min = 0,
  max = 100,
  step = 1,
  snapPoints,
  disabled = false,
  orientation = 'horizontal',
  fillOrigin = 'start',
  showTicks = false,
  minGapSteps = 0,
  label = '',
  showLabel = true,
  labelSize = null,
  labelStrength = null,
  getValueText = null,
  prefix = '',
  suffix = '',
  name = '',
  largeStep = SLIDER_DEFAULT_LARGE_STEP,
  bodyClass = '',
  labelClass = '',
  startClass = '',
  endClass = '',
  readout = 'tooltip',
  readoutClass = '',
  showMarks = false,
  start,
  end,
  ref,
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  'aria-errormessage': ariaErrormessage,
  'aria-details': ariaDetails,
  'aria-invalid': ariaInvalid,
  ...rootAttrs
}: DtSliderProps) {
  // Vue's v-model value; without one, defaultValue seeds the slider's own value.
  const modelValue = value === undefined ? defaultValue : value;
  const props: ResolvedSliderProps = {
    value: modelValue,
    min,
    max,
    step,
    snapPoints,
    disabled,
    orientation,
    fillOrigin,
    showTicks,
    minGapSteps,
    getValueText,
    prefix,
    suffix,
    largeStep,
    readout,
    showMarks,
  };
  const emit: SliderEmit = {
    valueChange: (next) => onValueChange?.(next),
    valueCommit: (next) => onValueCommit?.(next),
  };

  useValidatedProp('value', value, (v: SliderValue) => !Array.isArray(v) || v.length === 2);
  useValidatedProp('min', min, Number.isFinite);
  useValidatedProp('max', max, Number.isFinite);
  useValidatedProp('step', step, Number.isFinite);
  useValidatedProp('snapPoints', snapPoints, (v: unknown) => (
    Number.isFinite(v) || (Array.isArray(v) && v.every(Number.isFinite))
  ));
  useValidatedProp('orientation', orientation, (v: unknown) => ORIENTATIONS.includes(v));
  useValidatedProp('fillOrigin', fillOrigin, (v: unknown) => typeof v === 'number' || FILL_ORIGINS.includes(v));
  useValidatedProp('labelSize', labelSize, (v: unknown) => LABEL_SIZES.includes(String(v)));
  useValidatedProp('labelStrength', labelStrength, (v: string) => LABEL_STRENGTHS.includes(v));
  useValidatedProp('readout', readout, (v: unknown) => READOUT_MODES.includes(v));
  useValidatedProp('showMarks', showMarks, (v: unknown) => (
    typeof v === 'boolean' || (Array.isArray(v) && v.every(isValidMark))
  ));

  // ─── Internal state ───────────────────────────────────────────────────────

  const labelId = `slider-label-${useId()}`;
  const [controlEl, setControlEl] = useState<HTMLDivElement | null>(null);
  const thumbEls = useRef<(HTMLInputElement | null)[]>([]);
  const thumbVisualEls = useRef<(HTMLDivElement | null)[]>([]);

  // Prop-derived, not owned by any one composable.
  const isRange = Array.isArray(modelValue);
  const isVertical = orientation === 'vertical';

  const { isRtl } = useSliderDirection(controlEl);

  // Before useSliderValue, so its watchers can tell a held magnetic snap
  // apart from a genuinely new external value.
  const { activeSnapValue, findMagneticSnapPoint } = useSliderMagneticSnap(props, { controlEl, isVertical });

  const {
    internalValues,
    lastCommittedValues,
    currentValue,
    decimalPlaces,
    snapToStep,
    thumbPercent,
    thumbNativeMin,
    thumbNativeMax,
    thumbNativeStep,
    formatValue,
  } = useSliderValue(props, emit, { isRange, activeSnapValue });
  const values = internalValues.value;

  // A string is Vue's label prop; any other content is its #label slot, which
  // fully replaces the prop's own markup when passed.
  const labelText = typeof label === 'string' ? label : '';
  const labelSlotPassed = typeof label !== 'string' && label != null;
  const labelContent = labelSlotPassed ? renderSlot(label, { value: currentValue }) : null;

  // Whether what ACTUALLY renders for the label has real text — independent
  // of showLabel, which only controls visibility.
  const hasLabelContent = labelSlotPassed ? hasText(labelContent) : !!labelText.trim();

  // Each native thumb input names itself from the visible label when there is
  // one; otherwise it falls back to whatever aria-label/aria-labelledby a
  // consumer passed in (or the label's own text when it's hidden).
  const usesVisibleLabelAsName = showLabel && hasLabelContent;
  const resolvedAriaLabelledby = usesVisibleLabelAsName ? labelId : ariaLabelledby;
  const resolvedAriaLabel = usesVisibleLabelAsName
    ? undefined
    : (!showLabel && labelText ? labelText : ariaLabel);

  const hasAccessibleName = usesVisibleLabelAsName || !!(
    String(resolvedAriaLabel ?? '').trim() || String(resolvedAriaLabelledby ?? '').trim()
  );

  const resolvedLabelSize = labelSize ?? 300;

  const {
    isDragging,
    activeThumbIndex,
    focusedThumbIndex,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onThumbInput,
    onThumbKeydown,
    onThumbFocus,
    onThumbBlur,
    onThumbHitPointerEnter,
    onThumbHitPointerLeave,
    isReadoutOpen,
  } = useSliderInteraction(props, emit, {
    controlEl,
    thumbEls,
    internalValues,
    isRange,
    isVertical,
    decimalPlaces,
    snapToStep,
    lastCommittedValues,
    findMagneticSnapPoint,
    activeSnapValue,
    isRtl,
  });

  // ─── Computed visual helpers ──────────────────────────────────────────────

  const { computedTickValues, computedMarks, reservesAnnotationSpace } = useSliderMarksAndTicks(
    props,
    { isVertical, thumbPercent },
  );

  const {
    elements,
    markCollisionHidden,
    readoutMerged,
    markEdgeOffsetPx,
    readoutEdgeOffsetPx,
    mergedReadoutEdgeOffsetPx,
    readoutVisibility,
    formattedValues,
    requestUpdate,
  } = useSliderCollisionAvoidance(props, {
    controlEl,
    isVertical,
    isRange,
    internalValues: values,
    thumbPercent,
    isRtl,
    isReadoutOpen,
    computedMarks,
    formatValue,
    readoutClass,
  });

  const {
    thumbPositionStyle,
    tickPositionStyle,
    markStyle,
    readoutStyle,
    mergedReadoutPct,
    mergedReadoutText,
    indicatorStyle,
  } = useSliderGeometry(props, {
    isVertical,
    isRange,
    internalValues: values,
    thumbPercent,
    isRtl,
    markEdgeOffsetPx,
    formatValue,
  });

  // Same "edge" detection computedMarks uses for its own min/max marks — a
  // readout tracking a thumb sitting exactly at min/max gets the same
  // flush-edge treatment.
  function readoutEdge (val: number): 'start' | 'end' | null {
    return val === min ? 'start' : val === max ? 'end' : null;
  }

  useSliderTooltipReadout(props, {
    thumbVisualEls,
    tooltipEls: elements.tooltipEls,
    isVertical,
    isRtl,
    readoutVisibility,
    formattedValues,
    onPosition: requestUpdate,
  });

  // ─── Dev warnings ─────────────────────────────────────────────────────────

  useSliderDevWarnings(props, { isRange, hasAccessibleName });

  // ─── Exposed API ──────────────────────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    focus () {
      thumbEls.current[0]?.focus();
    },
    blur () {
      // Whichever thumb actually has focus, not always thumb 0 — the wrong one
      // would leave the real one's deferred keyboard commit never firing.
      thumbEls.current.find((el) => !!el && el === document.activeElement)?.blur();
    },
  }), []);

  // Callback refs that keep each element at its own index, and let go of it
  // when it unmounts (range shrinking to single mode).
  function indexedRef<T> (slots: { current: (T | null)[] }, i: number) {
    return (el: T | null) => {
      slots.current[i] = el;
      return () => {
        if (slots.current[i] === el) slots.current[i] = null;
      };
    };
  }

  const thumbTouchAction = isVertical ? 'pan-x' : 'pan-y';

  return (
    <div
      {...rootAttrs}
      className={cx(
        'd-slider',
        className,
        {
          'd-slider--disabled': disabled,
          'd-slider--vertical': isVertical,
          'd-slider--inverted': fillOrigin === 'end',
          'd-slider--dragging': isDragging,
        },
      )}
      style={style}
      data-disabled={disabled || undefined}
      data-orientation={orientation}
      data-dragging={isDragging || undefined}
      data-qa="dt-slider"
    >
      {showLabel && (
        <div
          id={labelId}
          className={cx('d-slider__label', labelClass)}
          data-qa="dt-slider-label"
        >
          {labelSlotPassed
            ? labelContent
            : labelText && (
              <DtText
                kind="label"
                size={resolvedLabelSize}
                strength={labelStrength}
                tone={disabled ? 'disabled' : 'secondary'}
              >
                {labelText}
              </DtText>
            )}
        </div>
      )}
      <div
        className={cx(
          'd-slider__body',
          bodyClass,
          { 'd-slider__body--reserve-annotation-space': reservesAnnotationSpace },
        )}
        data-qa="dt-slider-body"
      >
        {hasContent(start) && (
          <div className={cx('d-slider__start', startClass)} data-qa="dt-slider-start">
            {start}
          </div>
        )}
        <div
          ref={setControlEl}
          className="d-slider__control"
          style={{ touchAction: thumbTouchAction }}
          data-qa="dt-slider-control"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="d-slider__track" data-qa="dt-slider-track" />
          <div className="d-slider__indicator" style={indicatorStyle} data-qa="dt-slider-indicator" />
          {/* .d-slider__indicator's own z-index (slider.less) covers any tick within its filled span. */}
          {!!showTicks && computedTickValues.map((tickValue, i) => (
            <div key={i} className="d-slider__tick" style={tickPositionStyle(tickValue)} data-qa="dt-slider-tick" />
          ))}
          {values.map((val, i) => (
            <div
              key={`thumb-visual-${i}`}
              ref={indexedRef(thumbVisualEls, i)}
              className={cx('d-slider__thumb-visual', {
                'd-slider__thumb-visual--focused': focusedThumbIndex === i,
                'd-slider__thumb-visual--active': activeThumbIndex === i,
              })}
              style={thumbPositionStyle(val)}
              data-qa="dt-slider-thumb-visual"
            />
          ))}
          {values.map((val, i) => (
            <div
              key={`thumb-hit-${i}`}
              className="d-slider__thumb-hit"
              style={{ ...thumbPositionStyle(val), touchAction: thumbTouchAction }}
              data-qa="dt-slider-thumb-hit"
              onPointerEnter={() => onThumbHitPointerEnter(i)}
              onPointerLeave={() => onThumbHitPointerLeave(i)}
            />
          ))}
          {values.map((val, i) => (
            <input
              key={`thumb-input-${i}`}
              ref={indexedRef(thumbEls, i)}
              type="range"
              className="d-slider__thumb"
              min={thumbNativeMin(i)}
              max={thumbNativeMax(i)}
              step={thumbNativeStep(i)}
              value={val}
              disabled={disabled}
              name={name || undefined}
              aria-labelledby={resolvedAriaLabelledby}
              aria-label={resolvedAriaLabel}
              aria-describedby={ariaDescribedby}
              aria-errormessage={ariaErrormessage}
              aria-details={ariaDetails}
              aria-invalid={ariaInvalid}
              aria-valuetext={formatValue(val, i)}
              aria-orientation={isVertical ? 'vertical' : undefined}
              data-qa="dt-slider-thumb"
              onChange={(event) => onThumbInput(i, event)}
              onKeyDown={(event) => onThumbKeydown(i, event)}
              onFocus={(event) => {
                onThumbFocus(i);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                onThumbBlur(i);
                onBlur?.(event);
              }}
            />
          ))}
          {computedMarks.map((mark, i) => (
            <div
              key={`mark-${i}`}
              ref={indexedRef(elements.markEls, i)}
              className={cx('d-slider__mark', { 'd-slider__mark--collision-hidden': markCollisionHidden[i] })}
              style={markStyle(mark.pct, i, mark.edge)}
              data-mark-index={i}
              data-qa="dt-slider-mark"
            >
              {mark.text}
            </div>
          ))}
          {/* Plain, CSS-positioned text — deliberately not a floating tooltip/portal, so it never needs JS
              measurement or a reposition loop that could desync from the thumb. */}
          {readout === 'always' && (
            <>
              {values.map((val, i) => (
                <div
                  key={`readout-${i}`}
                  ref={indexedRef(elements.readoutEls, i)}
                  className={cx(
                    'd-slider__readout',
                    !readoutMerged ? 'd-slider__readout--show' : 'd-slider__readout--hide',
                    readoutClass,
                  )}
                  style={readoutStyle(thumbPercent(val), readoutEdgeOffsetPx[i], readoutEdge(val))}
                  data-readout-index={i}
                  aria-hidden="true"
                  data-qa="dt-slider-thumb-readout"
                >
                  {formatValue(val, i)}
                </div>
              ))}
              {/* Range mode only: when the two readouts would overlap, they're hidden (still measurable) and
                  this single merged pill takes over, centered between the thumbs. */}
              {readoutMerged && (
                <div
                  ref={elements.mergedReadoutEl}
                  className={cx('d-slider__readout', 'd-slider__readout--show', readoutClass)}
                  style={readoutStyle(mergedReadoutPct, mergedReadoutEdgeOffsetPx)}
                  aria-hidden="true"
                  data-qa="dt-slider-thumb-readout-merged"
                >
                  {mergedReadoutText}
                </div>
              )}
            </>
          )}
          {/* Keep DOM parentage for inherited themes; native popovers paint outside every ancestor's overflow,
              clip path, and mask. */}
          {readout === 'tooltip' && values.map((val, i) => (
            <div
              key={`readout-tooltip-${i}`}
              ref={indexedRef(elements.tooltipEls, i)}
              className="d-tooltip d-slider__readout-tooltip"
              popover="manual"
              inert
              aria-hidden="true"
              data-qa="dt-slider-thumb-readout-tooltip"
            >
              <span className="d-slider__tooltip-content">{formatValue(val, i)}</span>
            </div>
          ))}
        </div>
        {hasContent(end) && (
          <div className={cx('d-slider__end', endClass)} data-qa="dt-slider-end">
            {end}
          </div>
        )}
      </div>
    </div>
  );
}
