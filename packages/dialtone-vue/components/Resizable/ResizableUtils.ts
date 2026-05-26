import type { ResizableSizeValue } from './ResizableConstants';
import { LAYOUT_SIZE_VALUES } from '@/common/constants';

// ─── Layout Token Resolution ───────────────────────────────────────────────
// Resolves Dialtone layout tokens (e.g., '500', '200', '8px') to pixel values.
// Reads --dt-layout-{token} CSS custom properties at runtime to stay in sync
// with the token pipeline. Falls back to a static map in environments where
// CSS custom properties aren't available (tests, SSR).
//
// The size allowlist mirrors the shared Dialtone layout value set so the same
// numeric label resolves to the same pixel size in DtBox, DtResizable, and the
// `d-w-*` / `d-h-*` utility classes.

const LAYOUT_BASE_PX = 64;
const layoutSizeValueSet = new Set<string>(LAYOUT_SIZE_VALUES);

/** Cache for resolved token pixel values (populated on first use). */
const tokenCache = new Map<string, number>();

/** Root font size cache — read once from getComputedStyle. */
let cachedRootFontSize: number | null = null;

function getRootFontSize(): number {
  if (cachedRootFontSize !== null) return cachedRootFontSize;
  if (typeof document !== 'undefined') {
    cachedRootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
  } else {
    cachedRootFontSize = 10; // Dialtone default
  }
  return cachedRootFontSize;
}

/**
 * Resolve a Dialtone layout token to pixels via CSS custom properties.
 * Early-rejects tokens not in the shared layout token allowlist so the
 * accepted value set matches DtBox and the token pipeline.
 * Falls back to derived layout token values when CSS isn't available.
 */
function resolveTokenPixels(token: string): number | undefined {
  if (!isSizeToken(token)) return undefined;
  if (tokenCache.has(token)) return tokenCache.get(token);

  // Try runtime CSS resolution first so theme overrides propagate without rebuild
  if (typeof document !== 'undefined') {
    const cssValue = getComputedStyle(document.documentElement)
      .getPropertyValue(`--dt-layout-${token}`)
      .trim();

    if (cssValue) {
      const remMatch = cssValue.match(/^([\d.]+)rem$/);
      if (remMatch) {
        const px = parseFloat(remMatch[1]) * getRootFontSize();
        tokenCache.set(token, px);
        return px;
      }
      const pxMatch = cssValue.match(/^([\d.]+)px$/);
      if (pxMatch) {
        const px = parseFloat(pxMatch[1]);
        tokenCache.set(token, px);
        return px;
      }
    }
  }

  // Static fallback — kept for jsdom tests and SSR where CSS custom properties aren't loaded.
  const px = getFallbackLayoutTokenPixels(token);
  if (px === undefined) return undefined;

  tokenCache.set(token, px);
  return px;
}

/**
 * Static fallback resolution — mirrors the layout stop rule in
 * `packages/dialtone-css/postcss/constants.cjs`:
 * - '*px' values are literal off-scale pixels.
 * - numeric stops are scale-indexed on the 64px layout base.
 */
function getFallbackLayoutTokenPixels(token: string): number | undefined {
  if (token === '0') return 0;
  if (token.endsWith('px')) return parseFloat(token);

  const stop = Number(token);
  if (!Number.isFinite(stop)) return undefined;

  return (stop * LAYOUT_BASE_PX) / 100;
}

// ─── Percentage Resolution ─────────────────────────────────────────────────
// Percentage tokens use a simple pattern: numeric value + 'p' suffix.

function parsePercentage(value: string): number | undefined {
  if (!value.endsWith('p')) return undefined;
  const num = parseFloat(value.slice(0, -1));
  return isFinite(num) && num >= 0 && num <= 100 ? num : undefined;
}

// ─── Token Helpers ──────────────────────────────────────────────────────────

function isSizeToken(value: string): boolean {
  return layoutSizeValueSet.has(value);
}

function isPercentageToken(value: string): boolean {
  return parsePercentage(value) !== undefined;
}

export function isValidSizing(value: string): boolean {
  return isSizeToken(value) || isPercentageToken(value);
}

function parseSizingToPixels(value: string, containerSize: number): number | undefined {
  const sizePixels = resolveTokenPixels(value);
  if (sizePixels !== undefined) return sizePixels;

  const percentage = parsePercentage(value);
  if (percentage !== undefined) return (percentage / 100) * containerSize;

  return undefined;
}

// ─── Public API ─────────────────────────────────────────────────────────────

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
 * Handles layout tokens (e.g., '500') and percentage tokens (e.g., '50p').
 *
 * Layout tokens resolve from --dt-layout-{token} CSS custom properties at
 * runtime, falling back to a static map in test/SSR environments.
 *
 * @param value - Layout token or percentage token
 * @param containerSize - Container size in pixels
 * @param options - Optional configuration
 * @returns Pixel value, clamped to container by default
 *
 * @example
 * parseSizeToPixels('500', 1000)  // Returns 320 (from --dt-layout-500)
 * parseSizeToPixels('50p', 1000)  // Returns 500 (50% of 1000)
 * parseSizeToPixels('1600', 1000) // Returns 1000 (clamped from 1024px)
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

  if (typeof value === 'string') {
    const result = parseSizingToPixels(value, calculationContainerSize);
    if (result === undefined) return warnInvalidSizeValue(value);

    return validatePixelResult(result, value, validatedContainerSize, clampToContainer);
  }

  return warnInvalidSizeValue(value);
}

function warnInvalidSizeValue(value: ResizableSizeValue): 0 {
  console.warn(
    `[resizable] Invalid ResizableSizeValue: ${value}. Expected a size token or percentage with 'p' suffix.`,
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

  if (clampToContainer && containerSize > 0 && result > containerSize) {
    console.warn(
      `[resizable] Size value '${value}' (${result}px) exceeds container (${containerSize}px). Clamping to container.`
    );
    return containerSize;
  }

  return result;
}

export function isPercentageValue(value: ResizableSizeValue): boolean {
  return isPercentageToken(value);
}

export function isCSSValue(value: ResizableSizeValue): boolean {
  return isSizeToken(value);
}

export function pixelsToPercentage(pixels: number, containerSize: number): number {
  return (pixels / containerSize) * 100;
}

/**
 * Checks if a panel's userMinSize is percentage-based (e.g., '50p').
 */
export function hasPercentageMinSize(panel: { userMinSize?: ResizableSizeValue }): boolean {
  if (!panel.userMinSize) return false;
  return isPercentageToken(panel.userMinSize);
}

/**
 * Invalidate the token cache. Call when the theme changes or
 * when token values may have been updated at runtime.
 */
export function invalidateTokenCache(): void {
  tokenCache.clear();
  cachedRootFontSize = null;
}
