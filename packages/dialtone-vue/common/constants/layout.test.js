import cssConstants from '../../../dialtone-css/postcss/constants.cjs';
import { LAYOUT_SIZE_VALUES, LAYOUT_PERCENT_VALUES, LAYOUT_VALUES } from '@/common/constants';

describe('layout constants', () => {
  it('builds size values from CSS layout token stops', () => {
    expect(LAYOUT_SIZE_VALUES).toEqual(['0', ...cssConstants.LAYOUT_STOPS.map(String)]);
  });

  it('builds layout values from size and percentage values', () => {
    expect(LAYOUT_VALUES).toEqual([
      ...LAYOUT_SIZE_VALUES,
      ...LAYOUT_PERCENT_VALUES,
    ]);
  });
});
