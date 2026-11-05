import { render, screen } from '@testing-library/react';
import { createIcon } from './createIcon';

const DtIconTest = createIcon('DtIconTest', { class: 'd-icon d-icon--test', viewBox: '0 0 12 12' }, '<path d="M0 0h12v12H0z"/>', false);

describe('createIcon', () => {
  it('hides an unlabelled icon from assistive technology', () => {
    render(<DtIconTest />);
    const icon = screen.getByTestId('dt-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('aria-label');
  });

  // Vue maps an aria-label attribute onto the ariaLabel prop, so both must label the icon and expose it.
  it.each([
    ['ariaLabel', { ariaLabel: 'Search' }],
    ['aria-label', { 'aria-label': 'Search' }],
  ])('labels and exposes an icon given %s', (_, props) => {
    render(<DtIconTest {...props} />);
    const icon = screen.getByTestId('dt-icon');
    expect(icon).toHaveAttribute('aria-label', 'Search');
    expect(icon).toHaveAttribute('aria-hidden', 'false');
  });
});
