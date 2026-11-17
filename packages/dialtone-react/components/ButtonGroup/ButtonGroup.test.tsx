import { render, screen } from '@testing-library/react';
import { DtButton } from '../Button/Button';
import { DtButtonGroup, type DtButtonGroupProps } from './ButtonGroup';
import { BUTTON_GROUP_ALIGNMENT } from './ButtonGroupConstants';

const DEFAULT_ALIGNMENT = 'start';

const baseProps: DtButtonGroupProps = {};

let mockProps: DtButtonGroupProps = {};

function ButtonsFixture () {
  return (
    <div>
      <DtButton importance="primary">Confirm</DtButton>
      <DtButton importance="outlined">Cancel</DtButton>
    </div>
  );
}

describe('DtButtonGroup Tests', () => {
  let unmount: (() => void) | null = null;
  let buttonGroup: HTMLElement | null;

  // Remounts, as Vue's mount does, rather than rendering a second group beside the first.
  const updateWrapper = () => {
    unmount?.();
    ({ unmount } = render(<DtButtonGroup {...baseProps} {...mockProps} />));

    buttonGroup = screen.queryByTestId('dt-button-group');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    unmount = null;
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('should have a button group', () => {
        expect(buttonGroup).toBeInTheDocument();
      });

      it('should not have buttons', () => {
        expect(screen.queryAllByTestId('dt-button')).toHaveLength(0);
      });
    });

    describe('When buttons are provided', () => {
      describe('When the button group renders', () => {
        it('should have buttons', () => {
          mockProps = { children: <ButtonsFixture /> };

          updateWrapper();

          expect(screen.getAllByTestId('dt-button')).toHaveLength(2);
        });
      });
    });

    describe('When alignment is set to end', () => {
      it('should have correct class', () => {
        mockProps = { alignment: 'end' };

        updateWrapper();

        expect(buttonGroup).toHaveClass('d-btn-group--end');
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      it('shows correct role', () => {
        expect(buttonGroup).toHaveAttribute('role', 'group');
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Alignment Validator', () => {
      describe('When provided alignment is in BUTTON_GROUP_ALIGNMENT', () => {
        it('passes custom prop validation', () => {
          expect(Object.keys(BUTTON_GROUP_ALIGNMENT)).toContain(DEFAULT_ALIGNMENT);
          expect(buttonGroup).toHaveClass(BUTTON_GROUP_ALIGNMENT[DEFAULT_ALIGNMENT]);
        });
      });

      describe('When provided alignment is not in BUTTON_GROUP_ALIGNMENT', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error alignment only accepts the keys of BUTTON_GROUP_ALIGNMENT
          mockProps = { alignment: 'INVALID_ALIGNMENT' };

          updateWrapper();

          expect(Object.keys(BUTTON_GROUP_ALIGNMENT)).not.toContain('INVALID_ALIGNMENT');
          expect(buttonGroup).toHaveAttribute('role', 'group');
        });
      });
    });
  });
});
