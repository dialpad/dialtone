/**
 * Split text into words, collapsing all whitespace.
 * @param {string} text
 * @returns {string[]}
 */
export function splitWords (text) {
  return text?.match(/\S+/g) || [];
}

/**
 * The slice of one continuous gradient each word shows, as background-size / background-position.
 * Spaces between words are excluded (matching the Figma spec). The gradient runs left to right
 * like other Ai gradient treatments, so in RTL, where the first word sits on the right, slices
 * are mirrored to keep it continuous across the line.
 * @param {number[]} widths rendered word widths, in reading order
 * @param {boolean} isRtl
 * @returns {Array<{ size: string, position: string } | null>} null for words without a width
 */
export function getGradientSlices (widths, isRtl = false) {
  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  let offset = 0;

  return widths.map(width => {
    const start = isRtl ? totalWidth - offset - width : offset;
    offset += width;

    if (!(width > 0)) return null;

    return {
      size: `${(totalWidth / width) * 100}% 100%`,
      position: totalWidth > width ? `${(start / (totalWidth - width)) * 100}% 0%` : '0% 0%',
    };
  });
}
