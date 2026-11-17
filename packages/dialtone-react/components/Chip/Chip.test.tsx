import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyComponentFixture } from '../../tests/helpers/fixtures';
import { DtChip, type DtChipProps } from './Chip';

const MOCK_DEFAULT_TEXT = 'TEXT';
const MOCK_LOCALIZED_CLOSE_BUTTON_ARIA_LABEL = 'Click to close';

const baseProps: DtChipProps = {};

let mockProps: DtChipProps = {};
describe('DtChip Tests', () => {
  let unmount: (() => void) | null = null;
  let root: HTMLElement | null;
  let chip: HTMLElement | null;
  let icon: HTMLElement | null;
  let avatar: HTMLElement | null;
  let label: HTMLElement | null;
  let remove: HTMLElement | null;

  // Remounts, as Vue's mount does, rather than rendering a second chip beside the first.
  const updateWrapper = () => {
    unmount?.();
    ({ unmount } = render(<DtChip {...baseProps} {...mockProps} />));

    chip = screen.queryByTestId('dt-chip');
    root = chip?.parentElement ?? null;
    icon = screen.queryByTestId('dt-chip-icon');
    avatar = screen.queryByTestId('dt-chip-avatar');
    label = screen.queryByTestId('dt-chip-label');
    remove = screen.queryByTestId('dt-chip-close');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    unmount = null;
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      beforeEach(() => {
        mockProps = { children: MOCK_DEFAULT_TEXT };

        updateWrapper();
      });

      it('should render the component', () => {
        expect(root).toBeInTheDocument();
        expect(root).toHaveClass('d-chip');
      });

      it('should render chip', () => {
        expect(chip).toBeInTheDocument();
      });

      it('should render remove button', () => {
        expect(remove).toBeInTheDocument();
      });

      it('should render label', () => {
        expect(label).toBeInTheDocument();
      });

      it('should display the correct text', () => {
        expect(label).toHaveTextContent(new RegExp(`^${MOCK_DEFAULT_TEXT}$`));
      });

      it('should not render icon', () => {
        expect(icon).not.toBeInTheDocument();
      });

      it('should not render avatar', () => {
        expect(avatar).not.toBeInTheDocument();
      });

      it('default interactive is false, renders as span', () => {
        expect(chip?.tagName).toBe('SPAN');
      });

      it('chip should have aria-labelledby', () => {
        expect(chip).toHaveAttribute('aria-labelledby', label?.id);
      });

      it('button should have aria-label', () => {
        expect(remove).toHaveAttribute('aria-label', MOCK_LOCALIZED_CLOSE_BUTTON_ARIA_LABEL);
      });
    });

    describe('When size is numeric', () => {
      it('should render correct size class', () => {
        mockProps = { size: 100 };

        updateWrapper();

        expect(chip).toHaveClass('d-chip__label--xs');
      });
    });

    describe('When interactive is false', () => {
      it('should not be interactive', () => {
        mockProps = { interactive: false };

        updateWrapper();

        expect(chip?.tagName).toBe('SPAN');
      });
    });

    describe('When showClose is false', () => {
      it('should not render remove button', () => {
        mockProps = { showClose: false };

        updateWrapper();

        expect(remove).not.toBeInTheDocument();
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };

        updateWrapper();
      });

      it('should apply disabled styles to chip', () => {
        expect(chip).toHaveClass('d-chip--disabled');
      });

      it('should set aria-disabled and tabindex on chip', () => {
        expect(chip).toHaveAttribute('aria-disabled', 'true');
        expect(chip).toHaveAttribute('tabindex', '-1');
      });

      it('should set aria-disabled and tabindex on close button', () => {
        expect(remove).toHaveAttribute('aria-disabled', 'true');
        expect(remove).toHaveAttribute('tabindex', '-1');
      });
    });

    describe('When show avatar', () => {
      it('should render avatar', () => {
        mockProps = { avatar: <EmptyComponentFixture /> };

        updateWrapper();

        expect(avatar).toBeInTheDocument();
      });
    });

    describe('With icon slot', () => {
      it('should render icon', () => {
        mockProps = { icon: <EmptyComponentFixture /> };

        updateWrapper();

        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When close button is clicked', () => {
      it('should emit close event', async () => {
        const onClose = vi.fn();
        mockProps = { onClose };
        updateWrapper();

        await userEvent.click(remove as HTMLElement);

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });

    describe('When delete is pressed on a chip', () => {
      it('should emit close event', () => {
        const onClose = vi.fn();
        mockProps = { onClose };
        updateWrapper();

        fireEvent.keyDown(chip as HTMLElement, { code: 'DELETE' });

        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });
});
