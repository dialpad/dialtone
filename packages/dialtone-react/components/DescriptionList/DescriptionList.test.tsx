import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DtDescriptionList, type DtDescriptionListProps } from './DescriptionList';

let MOCK_LIST: HTMLElement | null = null;

const baseProps = {
  items: [{
    term: 'Customer Intent',
    description: 'Hello, I\'m looking to return my TV',
  }, {
    term: 'Reason',
    description: 'Refound',
  }],
} satisfies DtDescriptionListProps;

let mockProps: Partial<DtDescriptionListProps> = {};

describe('DtDescriptionList Tests', () => {
  let wrapper: RenderResult;

  const updateWrapper = () => {
    cleanup();
    wrapper = render(<DtDescriptionList {...baseProps} {...mockProps} />);
  };

  const root = () => wrapper.getByTestId('dt-description-list');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the description list', () => {
      expect(wrapper.container.firstElementChild).not.toBeNull();
      expect(root().classList.contains('d-description-list')).toBe(true);
    });

    describe('When direction prop is set', () => {
      it('Should have correct class', () => {
        mockProps = { direction: 'column' };

        updateWrapper();

        expect(root().classList.contains('d-description-list--column')).toBe(true);
      });
    });

    describe('When gap prop is set', () => {
      it('Should have correct class', () => {
        mockProps = { gap: '50' };

        updateWrapper();

        expect(root().classList.contains('d-description-list--gap-50')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(() => {
      updateWrapper();
      MOCK_LIST = wrapper.queryByTestId('dt-description-list');
    });

    it('Should render a <dl> tag', () => {
      expect(MOCK_LIST).not.toBeNull();
      expect(MOCK_LIST!.tagName).toBe('DL');
    });

    it('Should contain two <dt> tags', () => {
      const terms = wrapper.getAllByTestId('dt-description-list-term');

      expect(terms.length).toBe(2);
      expect(terms.every(term => term.tagName === 'DT')).toBe(true);
    });

    it('Should contain two <dd> tags', () => {
      const descriptions = wrapper.getAllByTestId('dt-description-list-description');

      expect(descriptions.length).toBe(2);
      expect(descriptions.every(description => description.tagName === 'DD')).toBe(true);
    });
  });

  // Vue's prop validators are the types here; a rejected value gets `@ts-expect-error`, and the test checks what the
  // component renders for it (Vue only warns, so the value is used as given).
  describe('Validation Tests', () => {
    describe('Direction Validator', () => {
      describe('When provided direction is valid', () => {
        it('passes custom prop validation', () => {
          mockProps = { direction: 'column' };

          updateWrapper();

          expect(root().classList.contains('d-description-list--column')).toBe(true);
        });
      });

      describe('When provided direction is not valid', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error 'INVALID_DIRECTION' is not a DescriptionListDirection
          mockProps = { direction: 'INVALID_DIRECTION' };

          updateWrapper();

          expect(root().classList.contains('d-description-list--INVALID_DIRECTION')).toBe(true);
          expect(root().classList.contains('d-description-list--row')).toBe(false);
        });
      });
    });

    describe('Items Validator', () => {
      describe('When provided items are valid', () => {
        it('passes custom prop validation', () => {
          expect(wrapper.getAllByTestId('dt-description-list-term').map(term => term.textContent))
            .toEqual(['Customer Intent', 'Reason']);
          expect(wrapper.getAllByTestId('dt-description-list-description').map(description => description.textContent))
            .toEqual(['Hello, I\'m looking to return my TV', 'Refound']);
        });
      });

      describe('When provided items are not valid', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error an item needs a term and a description
          mockProps = { items: [{ invalid: 'description' }] };

          updateWrapper();

          expect(wrapper.getByTestId('dt-description-list-term').textContent).toBe('');
          expect(wrapper.getByTestId('dt-description-list-description').textContent).toBe('');
        });
      });
    });

    describe('Gap Validator', () => {
      describe('When provided gap is valid', () => {
        it('passes custom prop validation', () => {
          mockProps = { gap: '300' };

          updateWrapper();

          expect(root().classList.contains('d-description-list--gap-300')).toBe(true);
        });
      });

      describe('When provided gap is not valid', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error 'invalid' is not a StackGap
          mockProps = { gap: 'invalid' };

          updateWrapper();

          expect(root().classList.contains('d-description-list--gap-invalid')).toBe(true);
          expect(root().classList.contains('d-description-list--gap-100')).toBe(false);
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    const customClass = 'my-custom-class';

    describe('When a term class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { termClass: customClass };

        updateWrapper();

        const dtElement = wrapper.getAllByTestId('dt-description-list-term')[0];

        expect(dtElement.classList.contains(customClass)).toBe(true);
      });
    });

    describe('When a description class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { descriptionClass: customClass };

        updateWrapper();

        const ddElement = wrapper.getAllByTestId('dt-description-list-description')[0];

        expect(ddElement.classList.contains(customClass)).toBe(true);
      });
    });
  });
});
