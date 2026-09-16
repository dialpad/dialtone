/**
 * Layout sizing values accepted by Vue sizing props.
 * Includes 0, which resolves to raw CSS 0 rather than a --dt-layout-* token.
 * Remaining values must stay in sync with LAYOUT_STOPS in
 * packages/dialtone-css/postcss/constants.cjs.
 *
 * Non-zero bare integers are scale-indexed on the 64px layout base:
 * value_in_px = stop * 64 / 100.
 * '*px' values are literal off-scale pixel exceptions.
 * @type {string[]}
 */
export const LAYOUT_SIZE_VALUES = [
  '0',
  '1px', '2px', '8px', '25', '20px', '24px', '50', '75', '100', '125', '150',
  '175', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650',
  '700', '750', '800', '850', '900', '950', '1000', '1050', '1100', '1150',
  '1200', '1250', '1300', '1350', '1400', '1450', '1500', '1550', '1600',
];

/**
 * Percentage layout values accepted by DtBox layout props.
 * @type {string[]}
 */
export const LAYOUT_PERCENT_VALUES = [
  '10p', '20p', '25p', '30p', '33p', '40p', '50p',
  '60p', '66p', '70p', '75p', '80p', '90p', '95p', '100p',
];

/**
 * Layout token and percentage values accepted by DtBox layout props.
 * @type {string[]}
 */
export const LAYOUT_VALUES = [
  ...LAYOUT_SIZE_VALUES,
  ...LAYOUT_PERCENT_VALUES,
];

export default {
  LAYOUT_SIZE_VALUES,
  LAYOUT_PERCENT_VALUES,
  LAYOUT_VALUES,
};
