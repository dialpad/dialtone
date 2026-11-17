import { render, screen } from '@testing-library/react';
import { DtBreadcrumbItem } from './BreadcrumbItem';
import { DtBreadcrumbs } from './Breadcrumbs';

describe('Empty fragment slot fallback', () => {
  describe('DtBreadcrumbItem', () => {
    it('should fall back to label for an empty fragment', () => {
      render(<DtBreadcrumbItem href="#" label="Section"><></></DtBreadcrumbItem>);

      expect(screen.getByTestId('dt-breadcrumb-item')).toHaveTextContent(/^Section$/);
    });

    it('should fall back to label for nested empty fragments', () => {
      render(<DtBreadcrumbItem href="#" label="Section"><><>{null}</></></DtBreadcrumbItem>);

      expect(screen.getByTestId('dt-breadcrumb-item')).toHaveTextContent(/^Section$/);
    });

    it('should prefer nonempty children inside a fragment', () => {
      render(<DtBreadcrumbItem href="#" label="Section"><><>Slotted</></></DtBreadcrumbItem>);

      expect(screen.getByTestId('dt-breadcrumb-item')).toHaveTextContent(/^Slotted$/);
    });
  });

  describe('DtBreadcrumbs', () => {
    const breadcrumbs = [{ href: '#', label: 'Root' }, { href: '#', label: 'Page' }];

    it('should render the breadcrumbs list for an empty fragment', () => {
      render(<DtBreadcrumbs breadcrumbs={breadcrumbs}><></></DtBreadcrumbs>);

      expect(screen.getAllByTestId('dt-breadcrumb-item')).toHaveLength(2);
    });

    it('should render the breadcrumbs list for nested empty fragments', () => {
      render(<DtBreadcrumbs breadcrumbs={breadcrumbs}><><>{false}</></></DtBreadcrumbs>);

      expect(screen.getAllByTestId('dt-breadcrumb-item')).toHaveLength(2);
    });

    it('should prefer nonempty children inside a fragment', () => {
      render(
        <DtBreadcrumbs breadcrumbs={breadcrumbs}>
          <><DtBreadcrumbItem href="#" label="Custom" /></>
        </DtBreadcrumbs>,
      );

      expect(screen.getAllByTestId('dt-breadcrumb-item')).toHaveLength(1);
      expect(screen.getByTestId('dt-breadcrumb-item')).toHaveTextContent(/^Custom$/);
    });
  });
});
