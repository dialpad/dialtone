/**
 * Dialtone layout token stops.
 * Must stay in sync with LAYOUT_STOPS in packages/dialtone-css/postcss/constants.cjs.
 *
 * Bare integers are scale-indexed on the 64px layout base:
 * value_in_px = stop * 64 / 100.
 * '*px' values are literal off-scale pixel exceptions.
 * @type {string[]}
 */
export const DIALTONE_LAYOUT_TOKEN_VALUES = [
  '1px', '2px', '8px', '25', '20px', '24px', '50', '75', '100', '125', '150',
  '175', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650',
  '700', '750', '800', '850', '900', '950', '1000', '1050', '1100', '1150',
  '1200', '1250', '1300', '1350', '1400', '1450', '1500', '1550', '1600',
];

/**
 * Layout sizing values accepted by Vue sizing props.
 * Includes 0, which resolves to raw CSS 0 rather than a --dt-layout-* token.
 * @type {string[]}
 */
export const DIALTONE_LAYOUT_SIZE_VALUES = [
  '0',
  ...DIALTONE_LAYOUT_TOKEN_VALUES,
];

/**
 * Percentage layout values.
 * @type {string[]}
 */
export const DIALTONE_LAYOUT_PERCENT_VALUES = [
  '10p', '20p', '25p', '30p', '33p', '40p', '50p',
  '60p', '66p', '70p', '75p', '80p', '90p', '95p', '100p',
];

/**
 * Layout token and percentage values accepted by DtBox layout props.
 * @type {string[]}
 */
export const DIALTONE_LAYOUT_VALUES = [
  ...DIALTONE_LAYOUT_SIZE_VALUES,
  ...DIALTONE_LAYOUT_PERCENT_VALUES,
];

export default {
  DIALTONE_LAYOUT_TOKEN_VALUES,
  DIALTONE_LAYOUT_SIZE_VALUES,
  DIALTONE_LAYOUT_PERCENT_VALUES,
  DIALTONE_LAYOUT_VALUES,
};
