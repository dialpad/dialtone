import { cleanup, render, type RenderResult } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { DtListItemGroup, type DtListItemGroupProps } from './ListItemGroup';

const baseProps = {
  heading: 'Heading',
  id: 'list-item-group',
} satisfies DtListItemGroupProps;

let mockProps: Partial<DtListItemGroupProps> = {};

describe('DtListItemGroup Tests', () => {
  let result: RenderResult;
  let heading: HTMLElement | null;

  const updateWrapper = () => {
    cleanup();
    result = render(<DtListItemGroup {...baseProps} {...mockProps} />);

    heading = result.container.querySelector('[data-qa="dt-dropdown-list-heading"]');
  };

  beforeEach(() => {
    mockProps = {};
    updateWrapper();
  });

  describe('Presentation Tests', () => {
    describe('List Group has a heading set', () => {
      it('displays the heading correctly', () => {
        expect(heading?.textContent?.trim()).toBe(baseProps.heading);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('List Group has a heading set', () => {
      it('the root ul is aria-labelledby the id of the header element', () => {
        const root = result.container.firstElementChild;
        expect(root?.getAttribute('aria-labelledby')).toBe(baseProps.id + '-heading');
      });
    });

    describe('List Group has a node heading and no id', () => {
      it('generates an id and the root is aria-labelledby the heading element', () => {
        cleanup();
        const { container } = render(<DtListItemGroup heading={<span>Node heading</span>} />);
        const root = container.firstElementChild;
        const nodeHeading = container.querySelector('[data-qa="dt-dropdown-list-heading"]');
        expect(nodeHeading?.textContent).toBe('Node heading');
        expect(nodeHeading?.id).toBeTruthy();
        expect(root?.id).toBeTruthy();
        expect(root?.getAttribute('aria-labelledby')).toBe(nodeHeading?.id);
      });
    });
  });

  describe('Heading omitted', () => {
    it('does not render a heading element', () => {
      cleanup();
      const { container } = render(<DtListItemGroup id="no-heading" />);
      expect(container.querySelector('[data-qa="dt-dropdown-list-heading"]')).toBeNull();
    });
  });
});
