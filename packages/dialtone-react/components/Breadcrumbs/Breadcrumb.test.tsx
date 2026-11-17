import { render, screen, within } from '@testing-library/react';
import { DtBreadcrumbs, type DtBreadcrumbsProps } from './Breadcrumbs';
import { BREADCRUMB_ITEM_SELECTED_MODIFIER, BREADCRUMBS_INVERTED_MODIFIER } from './BreadcrumbsConstants';

const MOCK_ROOT_CLASS = 'custom-class';

// Vue's test passes `url`, which isn't a prop of the item: it falls through to the link as an attribute.
const baseBreadcrumbs = [
  { url: '#', label: 'Root' },
  { url: '#', label: 'Section' },
  { url: '#', label: 'Section' },
  { url: '#', label: 'Section' },
  { url: '#', label: 'Current Page', selected: true },
];

const baseProps: DtBreadcrumbsProps = {
  inverted: false,
  breadcrumbs: baseBreadcrumbs,
};

let mockProps: DtBreadcrumbsProps = {};

describe('DtBreadcrumb Tests', () => {
  const updateWrapper = () => render(<DtBreadcrumbs {...baseProps} {...mockProps} />);

  const getBreadcrumbs = () => screen.getByTestId('dt-breadcrumbs');
  const getItems = () => screen.getAllByTestId('dt-breadcrumb-item');

  beforeEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      const { container } = updateWrapper();

      expect(container).not.toBeEmptyDOMElement();
    });

    it('should render the breadcrumbs', () => {
      updateWrapper();

      expect(getBreadcrumbs()).toBeInTheDocument();
    });

    it('should render the item breadcrumb', () => {
      updateWrapper();

      expect(getItems().length).toBeGreaterThan(0);
    });

    describe('When the breadcrumb has default state', () => {
      it('should have correct aria-current', () => {
        updateWrapper();

        const elementWithValidAria = getItems().filter(item => {
          return item.querySelector('[aria-current="location"]') !== null;
        });

        expect(elementWithValidAria.length).toBe(1);
      });

      it('should have correct rendered items', () => {
        updateWrapper();

        expect(getItems().length).toEqual(baseBreadcrumbs.length);
      });

      it('should have correct sequence', () => {
        updateWrapper();

        const items = getItems();
        expect(items.length).toEqual(baseBreadcrumbs.length);

        baseBreadcrumbs.forEach(({ label }, i) => {
          expect(items[i]).toHaveTextContent(new RegExp(`^${label}$`));
        });
      });
    });

    describe('When a inverted is provided to breadcrumbs', () => {
      it('should render label', () => {
        mockProps = { inverted: true };

        updateWrapper();

        expect(getBreadcrumbs()).toHaveClass(BREADCRUMBS_INVERTED_MODIFIER);
      });
    });

    describe('When a selected is provided to breadcrumbs', () => {
      it('should render label', () => {
        updateWrapper();

        const elementWithValidAria = getItems().filter(item => {
          return item.classList.contains(BREADCRUMB_ITEM_SELECTED_MODIFIER);
        });

        expect(elementWithValidAria.length).toBe(1);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a new aria-label is provided', () => {
      it('should update aria-label value', () => {
        mockProps = { ariaLabel: 'newAria' };

        updateWrapper();

        expect(within(document.body).getByRole('navigation')).toHaveAttribute('aria-label', 'newAria');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When a class is provided to a breadcrumb item', () => {
      it('should include the class', () => {
        mockProps = {
          breadcrumbs: [{
            href: '#',
            label: 'Root',
            className: MOCK_ROOT_CLASS,
          }],
        };

        updateWrapper();

        expect(getItems()[0]).toHaveClass(MOCK_ROOT_CLASS);
      });
    });
  });
});
