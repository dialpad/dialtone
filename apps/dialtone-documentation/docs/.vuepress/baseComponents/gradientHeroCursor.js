import { TRAIL_LENGTH } from './gradientHeroShader.js';

/**
 * Pointer-carry controller for the homepage hero's halftone burst.
 *
 * Owns its own animation frame and reports through a callback rather than reactive state:
 * these values change every frame while the pointer moves, are only ever read by the
 * shader, and putting them in a ref would re-render the hero subtree ~60 times a second
 * for nothing.
 *
 * Three separate easings keep the motion fluid instead of snapping. `lagged` trails the
 * pointer, so the shader samples the field from where the cursor has been — that lag is
 * what produces the carried brightness. `held` trails slower still, so the patch lingers.
 * `intensity` is a separate envelope that rises while moving and decays when still;
 * decoupling it from position is what gives the "stays affected, then fades" behaviour.
 *
 * Positions are normalized against the canvas box rather than the viewport, because the
 * shader multiplies them by the canvas resolution. That box is not the same element the
 * pointer is listened on: the canvas layer is taller than the hero and slides for
 * parallax, so `element` is where events come from and `rectElement` is the coordinate
 * space they are measured in.
 *
 * @module baseComponents/gradientHeroCursor
 */

// Per-frame easing constants, assuming ~60fps.
const CURSOR_LAG = 0.10; // trailing sample point
const CURSOR_HOLD = 0.03; // second-order trail, so the patch lingers
const CURSOR_ATTACK = 0.1; // rise while the pointer is moving

// Decay is speed-dependent: a slow drift fades quickly, a fast flick leaves a long-lived
// streak. Per-frame retention factors at each end of the speed range.
const CURSOR_DECAY_SLOW = 0.986; // ~2s tail
const CURSOR_DECAY_FAST = 0.9965; // ~8s tail
const CURSOR_SPEED_FULL = 0.03; // normalized widths per frame that counts as "fast"

// Speed also scales how hard each segment displaces the field.
const CURSOR_GAIN_SLOW = 0.4;
const CURSOR_GAIN_FAST = 1.0;

// Minimum gap between trail samples, so a stationary pointer stacks samples on one spot
// (reading as an orb) instead of laying down a path.
const TRAIL_MIN_STEP = 0.008;

// Below this the sample is dropped rather than kept as an imperceptible smudge.
const TRAIL_MIN_INTENSITY = 0.02;
const ENVELOPE_MIN_INTENSITY = 0.004;

const MOVE_EPSILON = 0.0005;
const SPEED_SMOOTHING = 0.7;
const SPEED_DECAY_WHEN_STILL = 0.9;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

/**
 * @typedef {object} GradientHeroCursorState
 * @property {number} x Normalized pointer x within the host element (0-1).
 * @property {number} y Normalized pointer y within the host element (0-1).
 * @property {number} prevX Normalized x of the lagging sample point.
 * @property {number} prevY Normalized y of the lagging sample point.
 * @property {number} intensity Envelope, 0-1.
 * @property {Array<[number, number, number, number]>} trail Newest first.
 */

/**
 * @param {object} options
 * @param {HTMLElement} options.element Element pointer events are listened on.
 * @param {HTMLElement} [options.rectElement] Box coordinates are normalized against.
 *   Defaults to `element`. Pass the canvas layer when it does not share the hero's box.
 * @param {(state: GradientHeroCursorState | null) => void} options.onChange
 *   Called with the current state each frame, and once with `null` when the effect has
 *   fully decayed or tracking stops.
 * @returns {{ start: () => void, stop: () => void, dispose: () => void }}
 */
export function createGradientHeroCursor ({ element, rectElement, onChange }) {
  const target = { x: -1, y: -1 };
  const lagged = { x: -1, y: -1 };
  const held = { x: -1, y: -1 };

  // Newest first. Each sample decays independently, so the oldest end of the streak
  // fades first and the path dissolves from the tail.
  let trail = [];
  let seen = false;
  let intensity = 0;
  let movedThisFrame = false;
  let speed = 0;
  let frame = 0;
  let running = false;

  // Lays down a new segment (or refreshes the head while inching along), then decays
  // every sample — head included, since exempting it leaves a permanent spot under a
  // resting pointer.
  const advanceTrail = (decay, gain) => {
    const head = trail[0];
    const gap = head
      ? Math.hypot(target.x - head[0], target.y - head[1])
      : Infinity;

    if (gap > TRAIL_MIN_STEP) {
      trail.unshift([target.x, target.y, gain, 0]);
    } else if (head && movedThisFrame) {
      head[2] = Math.max(head[2], gain);
    }

    trail = trail
      .map(([x, y, a]) => [x, y, a * decay, 0])
      .filter(([, , a]) => a > TRAIL_MIN_INTENSITY)
      .slice(0, TRAIL_LENGTH);
  };

  const tick = () => {
    if (!running) {
      frame = 0;

      return;
    }

    // Before the first pointer move there is nothing to ease toward.
    if (!seen) {
      frame = requestAnimationFrame(tick);

      return;
    }

    lagged.x += (target.x - lagged.x) * CURSOR_LAG;
    lagged.y += (target.y - lagged.y) * CURSOR_LAG;
    held.x += (lagged.x - held.x) * CURSOR_HOLD;
    held.y += (lagged.y - held.y) * CURSOR_HOLD;

    if (!movedThisFrame) speed *= SPEED_DECAY_WHEN_STILL;

    // Decay and gain are both sampled when a segment is laid down, so each segment keeps
    // the character of the gesture that drew it.
    const speedT = clamp01(speed / CURSOR_SPEED_FULL);
    const decay = CURSOR_DECAY_SLOW + (CURSOR_DECAY_FAST - CURSOR_DECAY_SLOW) * speedT;

    advanceTrail(decay, CURSOR_GAIN_SLOW + (CURSOR_GAIN_FAST - CURSOR_GAIN_SLOW) * speedT);

    intensity = movedThisFrame
      ? intensity + (1 - intensity) * CURSOR_ATTACK
      : intensity * decay;
    movedThisFrame = false;

    if (intensity < ENVELOPE_MIN_INTENSITY && trail.length === 0) {
      onChange(null);
      // Nothing left to animate. Park instead of scheduling another frame; a pointer move
      // restarts the loop when there is work again.
      frame = 0;

      return;
    }

    onChange({
      x: target.x,
      y: target.y,
      prevX: held.x,
      prevY: held.y,
      intensity,
      trail,
    });

    frame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => {
    // Read live rather than cached: the canvas layer translates as the page scrolls.
    const rect = (rectElement ?? element).getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;

    if (!seen) {
      // First sighting — seed both trails at the pointer so the effect does not drag a
      // stale value in from wherever it previously was.
      lagged.x = held.x = nx;
      lagged.y = held.y = ny;
      seen = true;
    }

    const step = Math.hypot(nx - target.x, ny - target.y);
    if (step > MOVE_EPSILON) {
      movedThisFrame = true;
      // Smoothed so one jittery frame does not spike the decay time.
      speed = speed * SPEED_SMOOTHING + step * (1 - SPEED_SMOOTHING);
    }

    target.x = nx;
    target.y = ny;

    if (frame === 0) frame = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;

    running = true;
    // Deliberately no pointerleave handler: cutting the effect dead on leave is the
    // abrupt behaviour the decay envelope exists to avoid.
    element.addEventListener('pointermove', onPointerMove, { passive: true });
  };

  const stop = () => {
    if (!running) return;

    running = false;
    element.removeEventListener('pointermove', onPointerMove);

    if (frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    onChange(null);
  };

  const dispose = () => {
    stop();
    trail = [];
    seen = false;
    intensity = 0;
    speed = 0;
  };

  return { start, stop, dispose };
}

/**
 * Cursor state as shader uniforms. `null` yields the "pointer absent" values, which the
 * shader short-circuits on.
 *
 * @param {GradientHeroCursorState | null} cursor
 * @param {number} strength
 * @returns {object}
 */
export function getCursorUniforms (cursor, strength) {
  return {
    u_cursorUv: cursor ? [cursor.x, cursor.y] : [-1, -1],
    u_cursorPrevUv: cursor ? [cursor.prevX, cursor.prevY] : [-1, -1],
    u_cursorStrength: strength * (cursor?.intensity ?? 1),
    // Copied, not referenced: ShaderMount keeps the last value it was given to decide
    // whether a uniform changed, and `advanceTrail` mutates the head sample in place.
    // Handing over live references would let that mutation reach into its cache.
    u_trail: Array.from(
      { length: TRAIL_LENGTH },
      (_, index) => {
        const node = cursor?.trail?.[index];

        return node ? [node[0], node[1], node[2], node[3]] : [0, 0, 0, 0];
      },
    ),
  };
}
