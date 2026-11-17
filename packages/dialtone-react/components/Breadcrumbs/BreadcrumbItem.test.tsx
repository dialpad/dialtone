import { render, screen } from '@testing-library/react';
import { DtBreadcrumbItem, type DtBreadcrumbItemProps } from './BreadcrumbItem';

const baseProps: DtBreadcrumbItemProps = {
  href: '#',
  label: 'Section',
};
const baseSlots: { default?: string } = {};

let mockProps: DtBreadcrumbItemProps = {};
let mockSlots: { default?: string } = {};

describe('DtBreadcrumbItem Tests', () => {
  const updateWrapper = () => render(
    <DtBreadcrumbItem {...baseProps} {...mockProps}>{mockSlots.default ?? baseSlots.default}</DtBreadcrumbItem>,
  );

  beforeEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should render the breadcrumbItem', () => {
      updateWrapper();

      expect(screen.getByTestId('dt-breadcrumb-item')).toBeInTheDocument();
    });

    describe('When a default slot is provided to breadcrumb item', () => {
      it('should render default slot label', () => {
        mockSlots = { default: 'Slotted section' };

        updateWrapper();

        expect(screen.getByTestId('dt-breadcrumb-item')).toHaveTextContent(/^Slotted section$/);
      });
    });

    describe('When a label is provided to breadcrumb item', () => {
      it('should render label', () => {
        updateWrapper();

        expect(screen.getByTestId('dt-breadcrumb-item')).toHaveTextContent(/^Section$/);
      });
    });

    it('should apply d-breadcrumbs__link class to the link element', () => {
      updateWrapper();

      expect(screen.getByTestId('breadcrumb-item')).toHaveClass('d-breadcrumbs__link');
    });
  });
});
