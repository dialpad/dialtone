import type { ResizableSizeValue } from './resizable_constants';

// ─── Size Token Resolution ─────────────────────────────────────────────────
// Resolves Dialtone size tokens (e.g., '925') to pixel values.
// Reads --dt-size-{token} CSS custom properties at runtime to stay in sync
// with the token pipeline. Falls back to a static map in environments where
// CSS custom properties aren't available (tests, SSR).
//
// Will map to --dt-layout-* tokens when they land on the `next` branch.

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
 * Resolve a Dialtone size token to pixels via CSS custom properties.
 * Falls back to FALLBACK_SIZE_TOKENS when CSS isn't available.
 */
function resolveTokenPixels(token: string): number | undefined {
  if (tokenCache.has(token)) return tokenCache.get(token);

  // Try runtime CSS resolution
  if (typeof document !== 'undefined') {
    const cssValue = getComputedStyle(document.documentElement)
      .getPropertyValue(`--dt-size-${token}`)
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

  // Fallback: static map mirrors --dt-size-* tokens from dialtone-tokens
  // Kept for jsdom tests and SSR where CSS custom properties aren't loaded.
  if (token in FALLBACK_SIZE_TOKENS) {
    const px = FALLBACK_SIZE_TOKENS[token];
    tokenCache.set(token, px);
    return px;
  }

  return undefined;
}

/**
 * Static fallback map — mirrors Dialtone size tokens (base/default.json).
 * Only used when CSS custom properties are unavailable (tests, SSR).
 */
const FALLBACK_SIZE_TOKENS: Record<string, number> = {
  '0': 0, '50': 0.5, '100': 1, '200': 2, '300': 4, '350': 6,
  '400': 8, '450': 12, '500': 16, '525': 20, '550': 24, '600': 32,
  '625': 42, '650': 48, '700': 64, '720': 72, '730': 84, '750': 96,
  '760': 102, '775': 114, '800': 128, '825': 164, '850': 192, '875': 216,
  '900': 256, '905': 264, '925': 332, '950': 384, '975': 464, '1000': 512,
  '1020': 628, '1040': 764, '1050': 768, '1060': 828, '1080': 912,
  '1100': 1024, '1115': 1140, '1120': 1268, '1125': 1280, '1130': 1340,
  '1150': 1536, '1200': 2048,
};

// ─── Percentage Resolution ─────────────────────────────────────────────────
// Percentage tokens use a simple pattern: numeric value + 'p' suffix.

function parsePercentage(value: string): number | undefined {
  if (!value.endsWith('p')) return undefined;
  const num = parseFloat(value.slice(0, -1));
  return isFinite(num) && num >= 0 && num <= 100 ? num : undefined;
}

// ─── Token Helpers ──────────────────────────────────────────────────────────

function isSizeToken(value: string): boolean {
  return resolveTokenPixels(value) !== undefined;
}

function isPercentageToken(value: string): boolean {
  return parsePercentage(value) !== undefined;
}

export function isValidSizing(value: string): boolean {
  return isSizeToken(value) || isPercentageToken(value);
}

function parseTokenToPixels(value: string, containerSize: number): number {
  const sizePixels = resolveTokenPixels(value);
  if (sizePixels !== undefined) return sizePixels;

  const percentage = parsePercentage(value);
  if (percentage !== undefined) return (percentage / 100) * containerSize;

  console.warn(`[resizable] Invalid sizing value: ${value}`);
  return 0;
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
 * Handles size tokens (e.g., '925') and percentage tokens (e.g., '50p').
 *
 * Size tokens resolve from --dt-size-{token} CSS custom properties at runtime,
 * falling back to a static map in test/SSR environments.
 *
 * @param value - Size token or percentage token
 * @param containerSize - Container size in pixels
 * @param options - Optional configuration
 * @returns Pixel value, clamped to container by default
 *
 * @example
 * parseSizeToPixels('925', 1000)  // Returns 332 (from --dt-size-925)
 * parseSizeToPixels('50p', 1000)  // Returns 500 (50% of 1000)
 * parseSizeToPixels('1100', 1000) // Returns 1000 (clamped from 1024px)
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
