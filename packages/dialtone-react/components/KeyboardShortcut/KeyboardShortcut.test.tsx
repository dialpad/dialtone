import { cleanup, render, screen } from '@testing-library/react';
import { DtKeyboardShortcut, type DtKeyboardShortcutProps } from './KeyboardShortcut';
import { SHORTCUTS_ALIASES_LIST } from './KeyboardShortcutConstants';
import { TEXT_TONE_MODIFIERS } from '../Text/TextConstants';

const baseProps: DtKeyboardShortcutProps = {
  shortcut: SHORTCUTS_ALIASES_LIST.join('+').trim(),
};

let mockProps: Partial<DtKeyboardShortcutProps> = {};

describe('DtKeyboardShortcut Tests', () => {
  // Like Vue's remount: the previous render goes away, so queries find a single shortcut.
  const updateWrapper = () => {
    cleanup();
    render(<DtKeyboardShortcut {...baseProps} {...mockProps} />);
  };

  const srText = () => screen.getByTestId('dt-keyboard-shortcut-sr-text');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(screen.getByTestId('dt-keyboard-shortcut')).toBeInTheDocument();
    });

    it('should render 13 icons', () => {
      expect(screen.getAllByTestId('dt-icon')).toHaveLength(13);
    });
  });

  describe('DtText Rendering', () => {
    it('should render text items as DtText with tone="tertiary"', () => {
      mockProps = { shortcut: 'X' };

      updateWrapper();

      expect(screen.getByTestId('dt-text')).toHaveClass(TEXT_TONE_MODIFIERS.tertiary);
    });

    it('should render inverted text items as DtText with tone="tertiary"', () => {
      mockProps = { shortcut: 'X', inverted: true };

      updateWrapper();

      expect(screen.getByTestId('dt-text')).toHaveClass(TEXT_TONE_MODIFIERS.tertiary);
    });
  });

  describe('Accessibility Tests', () => {
    describe('Auto-generated aria-label', () => {
      it('should generate aria-label with icon aliases converted to text', () => {
        mockProps = {
          shortcut: '{cmd}+X',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Command plus X$/);
      });

      it('should convert key abbreviations to full names', () => {
        mockProps = {
          shortcut: 'Ctrl+Alt+Del',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Control plus Alt plus Delete$/);
      });

      it('should handle mixed icon aliases and key abbreviations', () => {
        mockProps = {
          shortcut: '{cmd}+Ctrl+X',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Command plus Control plus X$/);
      });

      it('should handle arrow key icons', () => {
        mockProps = {
          shortcut: '{arrow-up}+{arrow-down}',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Up Arrow plus Down Arrow$/);
      });

      it('should handle Windows key icon', () => {
        mockProps = {
          shortcut: '{win}+D',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Windows plus D$/);
      });

      it('should handle Option key icon', () => {
        mockProps = {
          shortcut: '{opt}+C',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Option plus C$/);
      });
    });

    describe('screenReaderText override', () => {
      it('should use screenReaderText when provided', () => {
        mockProps = {
          shortcut: '{cmd}+X',
          screenReaderText: 'Custom accessible text',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Custom accessible text$/);
      });

      it('should use auto-generated aria-label when screenReaderText is not provided', () => {
        mockProps = {
          shortcut: '{cmd}+X',
        };
        updateWrapper();

        expect(srText()).toHaveTextContent(/^Command plus X$/);
      });
    });
  });

  describe('React-only', () => {
    it('should keep a consumer className, data-qa and attributes on the kbd root', () => {
      cleanup();
      render(
        <DtKeyboardShortcut {...baseProps} className="my-class" data-qa="my-qa" id="my-id" aria-label="label" />,
      );

      const root = screen.getByTestId('my-qa');
      expect(root.tagName).toBe('KBD');
      expect(root).toHaveClass('d-keyboard-shortcut', 'my-class');
      expect(root).toHaveAttribute('id', 'my-id');
      expect(root).toHaveAttribute('aria-label', 'label');
    });

    it('should apply inverted classes to the root, icons and text items', () => {
      mockProps = { shortcut: '{cmd}+X', inverted: true };
      updateWrapper();

      const root = screen.getByTestId('dt-keyboard-shortcut');
      expect(root).toHaveClass('d-keyboard-shortcut--inverted');
      expect(root.querySelector('.d-keyboard-shortcut__icon--inverted')).not.toBeNull();
      expect(root.querySelector('.d-keyboard-shortcut__item--inverted')).not.toBeNull();
    });

    it('should hide the visual items from assistive technology', () => {
      mockProps = { shortcut: '{cmd}+X' };
      updateWrapper();

      const root = screen.getByTestId('dt-keyboard-shortcut');
      expect(screen.getByTestId('dt-text')).toHaveAttribute('aria-hidden', 'true');
      expect(root.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
