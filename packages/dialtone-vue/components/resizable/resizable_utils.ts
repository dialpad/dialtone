import type { ResizableSizeValue } from './resizable_constants';

// ─── Size Token Maps ────────────────────────────────────────────────────────
// Inline token maps for size resolution. These mirror Dialtone sizing tokens.

const SIZE_TOKENS: Record<string, number> = {
  '0': 0,
  '50': 0.5,
  '100': 1,
  '200': 2,
  '300': 4,
  '350': 6,
  '400': 8,
  '450': 12,
  '500': 16,
  '525': 20,
  '550': 24,
  '600': 32,
  '625': 42,
  '650': 48,
  '700': 64,
  '720': 72,
  '730': 84,
  '750': 96,
  '760': 102,
  '775': 114,
  '800': 128,
  '825': 164,
  '850': 192,
  '875': 216,
  '900': 256,
  '905': 264,
  '925': 332,
  '950': 384,
  '975': 464,
  '1000': 512,
  '1020': 628,
  '1040': 764,
  '1050': 768,
  '1060': 828,
  '1080': 912,
  '1100': 1024,
  '1115': 1140,
  '1120': 1268,
  '1125': 1280,
  '1130': 1340,
  '1150': 1536,
  '1200': 2048,
};

const PERCENTAGE_VALUES: Record<string, number> = {
  '0p': 0,
  '5p': 5,
  '10p': 10,
  '20p': 20,
  '25p': 25,
  '30p': 30,
  '33p': 33.333,
  '40p': 40,
  '50p': 50,
  '60p': 60,
  '66p': 66.7,
  '70p': 70,
  '75p': 75,
  '80p': 80,
  '90p': 90,
  '95p': 95,
  '100p': 100,
};

// ─── Token Helpers ──────────────────────────────────────────────────────────

function isSizeToken(value: string): boolean {
  return value in SIZE_TOKENS;
}

function isPercentageToken(value: string): boolean {
  return value in PERCENTAGE_VALUES;
}

export function isValidSizing(value: string): boolean {
  return isSizeToken(value) || isPercentageToken(value);
}

function parseTokenToPixels(value: string, containerSize: number): number {
  if (isSizeToken(value)) {
    return SIZE_TOKENS[value];
  }

  if (isPercentageToken(value)) {
    const percentage = PERCENTAGE_VALUES[value];
    return (percentage / 100) * containerSize;
  }

  console.warn(`[resizable] Invalid sizing value: ${value}`);
  return 0;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Options for parseSizeToPixels
 */
export interface ParseSizeOptions {
  /**
   * When true, clamps the result to container size.
   * Panels cannot exceed their parent container.
   * @default true
   */
  clampToContainer?: boolean;
}

/**
 * Parses a ResizableSizeValue and returns the pixel value.
 * Handles size tokens (e.g., '925') and percentage tokens (e.g., '50p').
 *
 * @param value - Size token or percentage token
 * @param containerSize - Container size in pixels
 * @param options - Optional configuration
 * @returns Pixel value, clamped to container by default
 *
 * @example
 * parseSizeToPixels('925', 1000)  // Returns 332 (token lookup)
 * parseSizeToPixels('50p', 1000)  // Returns 500 (50% of 1000)
 * parseSizeToPixels('1100', 1000) // Returns 1000 (clamped from 1024px)
 * parseSizeToPixels('1100', 1000, { clampToContainer: false }) // Returns 1024 (unclamped)
 */
export function parseSizeToPixels(
  value: ResizableSizeValue,
  containerSize: number,
  options?: ParseSizeOptions
): number {
  const { clampToContainer = true } = options ?? {};
  const validatedContainerSize = validateContainerSize(containerSize);

  if (isCollapsedPanel(validatedContainerSize, value)) {
    return 0;
  }

  const calculationContainerSize = validatedContainerSize === 0 ? 1000 : validatedContainerSize;

  if (typeof value === 'string' && isValidSizing(value)) {
    const result = parseTokenToPixels(value, calculationContainerSize);
    return validatePixelResult(result, value, validatedContainerSize, clampToContainer);
  }

  console.warn(
    `[resizable] Invalid ResizableSizeValue: ${value}. Expected a size token or percentage with 'p' suffix.`
  );
  return 0;
}

export function validateContainerSize(containerSize: number): number {
  if (!isFinite(containerSize) || containerSize < 0) {
    console.warn(`[resizable] Invalid containerSize: ${containerSize}. Using fallback value of 1000px.`);
    return 1000;
  }

  if (containerSize > 10000) {
    console.warn(`[resizable] Unusually large containerSize: ${containerSize}px. Capping at 10000px.`);
    return 10000;
  }

  return containerSize;
}

function isCollapsedPanel(containerSize: number, value: ResizableSizeValue): boolean {
  return containerSize === 0 && value === '0';
}

/**
 * Validates and optionally clamps pixel result to container bounds.
 *
 * @param result - Raw pixel value from token/percentage parsing
 * @param value - Original size value for error messages
 * @param containerSize - Container size in pixels
 * @param clampToContainer - When true, clamps result to containerSize
 * @returns Validated (and optionally clamped) pixel value
 */
function validatePixelResult(
  result: number,
  value: ResizableSizeValue,
  containerSize: number,
  clampToContainer: boolean
): number {
  if (!isFinite(result) || result < 0) {
    console.warn(
      `[resizable] Invalid pixel calculation result: ${result} for value: ${value}, containerSize: ${containerSize}`
    );
    return 0;
  }

  // Clamp to container when enabled (default behavior)
  if (clampToContainer && containerSize > 0 && result > containerSize) {
    console.warn(
      `[resizable] Size value '${value}' (${result}px) exceeds container (${containerSize}px). Clamping to container.`
    );
    return containerSize;
  }

  return result;
}

/**
 * Checks if a size value is a percentage token (with 'p' suffix)
 */
export function isPercentageValue(value: ResizableSizeValue): boolean {
  return isPercentageToken(value);
}

/**
 * Checks if a size value is a fixed size token (pixel-based token)
 */
export function isCSSValue(value: ResizableSizeValue): boolean {
  return isSizeToken(value);
}

/**
 * Converts a pixel value back to a percentage based on container size
 */
export function pixelsToPercentage(pixels: number, containerSize: number): number {
  return (pixels / containerSize) * 100;
}

/**
 * Checks if a panel's userMinSize is percentage-based (e.g., '50p').
 * Percentage-based userMinSize panels scale with viewport and should be protected
 * during compression (compressed last). Token-based userMinSize panels have fixed
 * pixel values and should compress first.
 *
 * @param panel - Panel state with optional userMinSize property
 * @returns true if userMinSize is a percentage token (e.g., '50p'), false otherwise
 *
 * @example
 * hasPercentageMinSize({ userMinSize: '50p' })  // true - percentage
 * hasPercentageMinSize({ userMinSize: '925' })  // false - token (fixed)
 * hasPercentageMinSize({ })                     // false - no userMinSize
 */
export function hasPercentageMinSize(panel: { userMinSize?: ResizableSizeValue }): boolean {
  if (!panel.userMinSize) return false;
  return isPercentageToken(panel.userMinSize);
}
