import cssConstants from '../../../dialtone-css/postcss/constants.cjs';
import { LAYOUT_SIZE_VALUES, LAYOUT_VALUES } from '@/common/constants';

const LAYOUT_PERCENT_VALUES = [
  '10p', '20p', '25p', '30p', '33p', '40p', '50p',
  '60p', '66p', '70p', '75p', '80p', '90p', '95p', '100p',
];

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
