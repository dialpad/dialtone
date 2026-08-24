/**
 * Small numeric helpers the theme's animation code reaches for repeatedly.
 *
 * These were each written inline in several places — `Math.min(1, Math.max(0, x))` alone
 * appeared four times across three files, in two different argument orders. Naming them
 * makes the intent readable at the call site and gives the edge cases one home.
 *
 * @module theme/utils/math
 */

/**
 * @param {number} value
 * @returns {number} `value` limited to 0-1.
 */
export const clamp01 = (value) => Math.min(1, Math.max(0, value));

/**
 * @param {number} from
 * @param {number} to
 * @param {number} t Unclamped, so callers can deliberately overshoot.
 * @returns {number}
 */
export const lerp = (from, to, t) => from + (to - from) * t;

/**
 * Hermite ease over 0-1, matching GLSL's `smoothstep` for an already-normalized input.
 *
 * @param {number} t
 * @returns {number}
 */
export const smoothstep = (t) => t * t * (3 - 2 * t);

/**
 * One step of exponential smoothing: moves `current` a fraction of the way to `target`.
 *
 * Rate is per-call, not per-second, so the feel of anything using this is tied to the
 * frame rate it runs at.
 *
 * @param {number} current
 * @param {number} target
 * @param {number} rate 0-1.
 * @returns {number}
 */
export const approach = (current, target, rate) => current + (target - current) * rate;
