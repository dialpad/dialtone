import cssConstants from '../../../dialtone-css/postcss/constants.cjs';
import {
  DIALTONE_LAYOUT_PERCENT_VALUES,
  DIALTONE_LAYOUT_SIZE_VALUES,
  DIALTONE_LAYOUT_TOKEN_VALUES,
  DIALTONE_LAYOUT_VALUES,
} from './layout.js';

describe('layout constants', () => {
  it('matches the CSS layout token stops', () => {
    expect(DIALTONE_LAYOUT_TOKEN_VALUES).toEqual(cssConstants.LAYOUT_STOPS.map(String));
  });

  it('builds size values from token values', () => {
    expect(DIALTONE_LAYOUT_SIZE_VALUES).toEqual(['0', ...DIALTONE_LAYOUT_TOKEN_VALUES]);
  });

  it('builds layout values from size and percentage values', () => {
    expect(DIALTONE_LAYOUT_VALUES).toEqual([
      ...DIALTONE_LAYOUT_SIZE_VALUES,
      ...DIALTONE_LAYOUT_PERCENT_VALUES,
    ]);
  });
});
