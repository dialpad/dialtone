import { useId, type ComponentPropsWithRef, type CSSProperties } from 'react';
import { cx } from '../../common/cx';
import {
  PROGRESS_CIRCLE_KINDS,
  PROGRESS_CIRCLE_SIZES,
  type ProgressCircleKind,
  type ProgressCircleSize,
} from './ProgressCircleConstants';

interface DtProgressCircleOwnProps {
  /** Accessible label read by screen readers. */
  ariaLabel: string;

  /** Current progress value (0–100). */
  progress?: number;

  /**
   * The size of the progress indicator, aligning to Dialtone icon sizes.
   * @values 100, 200, 300, 400, 500, 600, 700, 800
   */
  size?: ProgressCircleSize;

  /**
   * The color variant of the progress indicator.
   * @values default, brand, critical, positive, warning, info, ai
   */
  kind?: ProgressCircleKind;
}

export type DtProgressCircleProps =
  DtProgressCircleOwnProps & Omit<ComponentPropsWithRef<'div'>, keyof DtProgressCircleOwnProps>;

const STROKE_WIDTH = 3.25;
const CIRCLE_RADIUS = 12 - (STROKE_WIDTH / 2);
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
// A fill shorter than this still shows as this much, so a small value stays visible.
const MIN_VISUAL_PROGRESS = 5;

// Draws a full circle as two arcs so getTotalLength() returns the circumference.
const CIRCLE_PATH = (() => {
  const r = CIRCLE_RADIUS;
  const top = 12 - r;
  const bottom = 12 + r;
  return `M 12 ${top} A ${r} ${r} 0 0 1 12 ${bottom} A ${r} ${r} 0 0 1 12 ${top} Z`;
})();

// stroke-dasharray/offset control how much of the circle is visually "filled".
function getCssVars (progress: number): CSSProperties {
  const C = CIRCLE_CIRCUMFERENCE;
  const visualProgress = (progress > 0 && progress < MIN_VISUAL_PROGRESS) ? MIN_VISUAL_PROGRESS : progress;
  const fillLength = C * visualProgress / 100;
  const sw = STROKE_WIDTH;
  const capArc = sw / 2;

  // When both arcs are visible, round linecaps extend capArc past each endpoint.
  // Shorten each arc by capArc at both ends (total sw per arc) so the caps meet
  // exactly at each junction without overlapping. Rotate the fill forward by
  // capArc so its start cap lands at 12 o'clock.
  const both = progress > 0 && progress < 100;
  const adj = both ? sw : 0;

  return {
    // Full-circle arcs use 'none' to avoid round-cap overlap at the path seam.
    '--stroke-dasharray': (!both && progress >= 100) ? 'none' : C,
    '--fill-dashoffset': C - Math.max(0, fillLength - adj),
    '--fill-rotate': `${both ? (capArc / C * 360) : 0}deg`,
    '--track-dasharray': (!both && progress <= 0) ? 'none' : `${Math.max(0, C - fillLength - adj)} ${C}`,
    '--track-dashoffset': -(fillLength + (both ? capArc : 0)),
  } as CSSProperties;
}

/**
 * Circular SVG progress indicator for determinate upload or processing progress.
 * @see https://dialtone.dialpad.com/components/progress-circle.html
 */
export function DtProgressCircle ({
  ariaLabel,
  progress = 0,
  size = 500,
  kind = 'default',
  className,
  'aria-label': ariaLabelAttribute,
  ...rest
}: DtProgressCircleProps) {
  const isAi = kind === 'ai';
  // Unique per-instance to avoid collisions when multiple progress circles coexist.
  const aiGradientId = `progress-circle-ai-gradient-${useId()}`;
  // SVG stroke doesn't support CSS gradients, so the "ai" kind uses an inline
  // SVG <linearGradient> referenced via url(#id) instead of a CSS variable.
  const fillStrokeStyle: CSSProperties = isAi ? { stroke: `url(#${aiGradientId})` } : {};
  const sizeClass = PROGRESS_CIRCLE_SIZES[`${size}` as `${keyof typeof PROGRESS_CIRCLE_SIZES}`];
  const kindClass = PROGRESS_CIRCLE_KINDS[kind];

  return (
    <div
      className={cx('d-progress-circle', sizeClass, kindClass, className)}
      role="progressbar"
      // Vue reads a hyphenated `aria-label` attribute as the `ariaLabel` prop, so either spelling labels it.
      aria-label={ariaLabel ?? ariaLabelAttribute}
      tabIndex={-1}
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      data-qa="dt-progress-circle"
      {...rest}
    >
      <svg
        className="d-progress-circle__bar"
        style={getCssVars(progress)}
        viewBox="0 0 24 24"
      >
        {isAi && (
          <defs>
            <linearGradient
              id={aiGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {/* This emulates the AI gradient, for which each color isn't directly mappable to a CSS variable */}
              <stop offset="0%" stopColor="var(--dt-color-brand-gold)" />
              <stop offset="33%" stopColor="var(--dt-color-brand-red)" />
              <stop offset="66%" stopColor="var(--dt-color-brand-magenta)" />
              <stop offset="100%" stopColor="var(--dt-color-brand-purple)" />
            </linearGradient>
          </defs>
        )}
        {progress <= 95 && (
          <path
            d={CIRCLE_PATH}
            className="d-progress-circle__shape d-progress-circle__shape--track"
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        )}
        {progress > 0 && (
          <path
            d={CIRCLE_PATH}
            className="d-progress-circle__shape d-progress-circle__shape--fill"
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            style={fillStrokeStyle}
          />
        )}
      </svg>
    </div>
  );
}
