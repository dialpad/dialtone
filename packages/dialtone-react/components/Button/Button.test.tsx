import { act, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyComponentFixture } from '../../tests/helpers/fixtures';
import { withRouterLink } from '../../tests/helpers/link';
import { DtButton, type DtButtonProps } from './Button';
import { BUTTON_ICON_SIZES, INVALID_COMBINATION } from './ButtonConstants';
import { SrOnlyCloseButton } from './sr_only_close_button';

const MOCK_BUTTON_STUB = vi.fn();

const baseProps: DtButtonProps = {};

let mockProps: DtButtonProps = {};

describe('DtButton Tests', () => {
  const renderButton = (props: DtButtonProps = {}) => render(<DtButton {...baseProps} {...mockProps} {...props} />);
  const button = () => screen.getByTestId('dt-button');
  const classesOf = (element: Element) => Array.from(element.classList);
  const icon = () => screen.queryByTestId('dt-button-icon');
  const label = () => screen.queryByTestId('dt-button-label');

  afterEach(() => {
    mockProps = {};
    MOCK_BUTTON_STUB.mockReset();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the native button', () => {
        const { container } = renderButton();

        expect(container).not.toBeEmptyDOMElement();
        expect(button().tagName).toBe('BUTTON');
      });

      it('Should render primary by default', () => {
        renderButton();

        expect(button()).toHaveClass('d-btn--primary');
      });

      it('Should not render label', () => {
        renderButton();

        expect(label()).not.toBeInTheDocument();
      });

      describe('When button is a circle', () => {
        it('Should have circle class', () => {
          renderButton({ circle: true, importance: 'outlined' });

          expect(button()).toHaveClass('d-btn--circle');
        });
      });

      describe('When button has kind set to critical', () => {
        it('Should have critical class', () => {
          renderButton({ kind: 'critical' });

          expect(button()).toHaveClass('d-btn--critical');
        });
      });

      describe('When button has an invalid kind prop', () => {
        it('should not have critical class', () => {
          // @ts-expect-error: an invalid kind, as Vue's validator test passes
          renderButton({ kind: 'bad' });

          expect(classesOf(button())).toEqual(['base-button__button', 'd-btn', 'd-btn--primary']);
        });
      });

      describe('When button has importance set to outlined', () => {
        it('Should have outlined class', () => {
          renderButton({ importance: 'outlined' });

          expect(button()).toHaveClass('d-btn--outlined');
        });
      });

      describe('When button has an invalid importance prop', () => {
        it('should not have importance class', () => {
          // @ts-expect-error: an invalid importance, as Vue's validator test passes
          renderButton({ importance: 'bad' });

          expect(classesOf(button())).toEqual(['base-button__button', 'd-btn']);
        });
      });

      describe('When button has loading set to true', () => {
        it('Should have loading class and render a correctly sized loader', () => {
          renderButton({ loading: true });

          const loader = screen.getByTestId('dt-loader');

          expect(button()).toHaveClass('d-btn--loading');
          expect(loader).toHaveAttribute('aria-hidden', 'true');
          expect(screen.getByTestId('dt-loader-icon')).toHaveClass(`d-icon--size-${BUTTON_ICON_SIZES.md}`);
        });
      });

      describe('When button has loading set to false', () => {
        it('should not have loading class or loader', () => {
          renderButton({ loading: false });

          expect(button()).not.toHaveClass('d-btn--loading');
          expect(screen.queryByTestId('dt-loader')).not.toBeInTheDocument();
        });
      });

      describe('When button is unstyled and loading', () => {
        it('Should not render a loader', () => {
          renderButton({ kind: 'unstyled', loading: true });

          expect(screen.queryByTestId('dt-loader')).not.toBeInTheDocument();
        });
      });

      describe('When button has active set to true', () => {
        it('Should have active class', () => {
          renderButton({ active: true });

          expect(button()).toHaveClass('d-btn--active');
        });
      });

      describe('When button has active set to false', () => {
        it('Should not have active class', () => {
          renderButton({ active: false });

          expect(classesOf(button())).toEqual(['base-button__button', 'd-btn', 'd-btn--primary']);
        });
      });

      describe('When button only contains an icon', () => {
        it('should have icon only class', () => {
          renderButton({ icon: <EmptyComponentFixture /> });

          expect(button()).toHaveClass('d-btn--icon-only');
        });
      });

      describe('When button contains an icon and text', () => {
        it('should not have icon only class', () => {
          renderButton({ children: 'text', icon: <EmptyComponentFixture /> });

          expect(classesOf(button())).toEqual(['base-button__button', 'd-btn', 'd-btn--primary']);
        });
      });

      describe('When size is set to xl', () => {
        it('Class is set to the correct size', () => {
          renderButton({ size: 'xl' });

          expect(button()).toHaveClass('d-btn--xl');
        });
      });

      describe('When size is numeric', () => {
        it('should apply the correct size class for numeric size 200', () => {
          renderButton({ size: 200 });

          expect(button()).toHaveClass('d-btn--sm');
        });
      });

      describe('When button has an invalid size prop', () => {
        it('should not have a size class', () => {
          // @ts-expect-error: an invalid size, as Vue's validator test passes
          renderButton({ size: 'extra medium' });

          expect(classesOf(button())).toEqual(['base-button__button', 'd-btn', 'd-btn--primary']);
        });
      });

      describe('When link prop is set to true', () => {
        beforeEach(() => {
          mockProps = { link: true };
        });

        it('d-link class is rendered on button', () => {
          renderButton();

          expect(button()).toHaveClass('d-link');
        });

        describe('When link kind is invalid', () => {
          it('does not set any link kind class', () => {
            // @ts-expect-error: an invalid link kind, as Vue's validator test passes
            renderButton({ linkKind: 'fake kind' });

            expect(classesOf(button())).toEqual(['base-button__button', 'd-link']);
          });
        });

        describe('When link kind is critical', () => {
          it('sets the correct class', () => {
            renderButton({ linkKind: 'critical' });

            expect(button()).toHaveClass('d-link--critical');
          });
        });

        describe('When linkUnderline is false', () => {
          it('should have no-underline class', () => {
            renderButton({ linkUnderline: false });

            expect(button()).toHaveClass('d-link--no-underline');
          });
        });

        describe('When linkUnderline is true (default)', () => {
          it('should not have no-underline class', () => {
            renderButton();

            expect(button()).not.toHaveClass('d-link--no-underline');
          });
        });
      });

      describe('When linkUnderline is false and link is not set', () => {
        it('should not have no-underline class', () => {
          renderButton({ linkUnderline: false });

          expect(button()).not.toHaveClass('d-link--no-underline');
        });
      });

      describe('When button has kind set to unstyled', () => {
        it('Should have unstyled class', () => {
          renderButton({ kind: 'unstyled' });

          expect(button()).toHaveClass('d-btn--unstyled');
        });
      });

      describe('When button has kind set to default', () => {
        it('Should not have unstyled class', () => {
          renderButton({ kind: 'default' });

          expect(button()).not.toHaveClass('d-btn--unstyled');
        });
      });

      describe('When button has kind set to unstyled with any importance', () => {
        const importances = ['clear', 'outlined', 'primary'] as const;
        importances.forEach((importance) => {
          it(`should not render importance class for kind="unstyled" and importance="${importance}"`, () => {
            renderButton({ kind: 'unstyled', importance });

            // Should only have d-btn--unstyled, not any importance class
            expect(button()).toHaveClass('d-btn--unstyled');
            expect(button()).not.toHaveClass('d-btn--outlined');
            expect(button()).not.toHaveClass('d-btn--primary');
          });
        });
      });

      describe('When button is unstyled and has icon and label', () => {
        it('Should not have d-btn classes on icon and label', () => {
          renderButton({ children: 'Button Text', icon: <EmptyComponentFixture />, kind: 'unstyled' });

          // Icon should have base-button__icon class but not d-btn__icon
          expect(icon()).toHaveClass('base-button__icon');
          expect(icon()).not.toHaveClass('d-btn__icon');
          expect(classesOf(icon()!).some(cls => cls.startsWith('d-btn__icon--'))).toBe(false);

          // Label should have base-button__label class but not d-btn__label
          expect(label()).toHaveClass('base-button__label');
          expect(label()).not.toHaveClass('d-btn__label');
        });
      });
    });

    describe('With icon slot populated', () => {
      beforeEach(() => {
        mockProps = { children: 'text', icon: <EmptyComponentFixture /> };
      });

      it('Should add appropriate position class to icon when iconPosition is "left"', () => {
        renderButton({ iconPosition: 'left' });

        expect(icon()).toHaveClass('d-btn__icon--left');
      });

      it('Should add appropriate position class to icon when iconPosition is "right"', () => {
        renderButton({ iconPosition: 'right' });

        expect(icon()).toHaveClass('d-btn__icon--right');
      });

      it('Should add appropriate classes when iconPosition is "top"', () => {
        renderButton({ iconPosition: 'top' });

        expect(icon()).toHaveClass('d-btn__icon--top');
        expect(button()).toHaveClass('d-btn--vertical');
      });

      it('Should add appropriate classes when iconPosition is "bottom"', () => {
        renderButton({ iconPosition: 'bottom' });

        expect(icon()).toHaveClass('d-btn__icon--bottom');
        expect(button()).toHaveClass('d-btn--vertical');
      });
    });

    describe('With startIcon slot populated', () => {
      it('Should render the start icon container', () => {
        renderButton({ children: 'text', startIcon: <EmptyComponentFixture /> });

        const startIcon = screen.getByTestId('dt-button-start-icon');

        expect(startIcon).toHaveClass('d-btn__icon');
        expect(startIcon).toHaveClass('d-btn__icon--left');
      });

      it('Should not render legacy icon slot', () => {
        renderButton({ children: 'text', startIcon: <EmptyComponentFixture /> });

        expect(icon()).not.toBeInTheDocument();
      });

      it('Should have icon-only class when no label is provided', () => {
        renderButton({ startIcon: <EmptyComponentFixture /> });

        expect(button()).toHaveClass('d-btn--icon-only');
      });
    });

    describe('With endIcon slot populated', () => {
      it('Should render the end icon container', () => {
        renderButton({ children: 'text', endIcon: <EmptyComponentFixture /> });

        const endIcon = screen.getByTestId('dt-button-end-icon');

        expect(endIcon).toHaveClass('d-btn__icon');
        expect(endIcon).toHaveClass('d-btn__icon--right');
      });

      it('Should not render legacy icon slot', () => {
        renderButton({ children: 'text', endIcon: <EmptyComponentFixture /> });

        expect(icon()).not.toBeInTheDocument();
      });

      it('Should have icon-only class when no label is provided', () => {
        renderButton({ endIcon: <EmptyComponentFixture /> });

        expect(button()).toHaveClass('d-btn--icon-only');
      });
    });

    describe('With both startIcon and endIcon slots populated', () => {
      it('Should render both icon containers', () => {
        renderButton({ children: 'text', startIcon: <EmptyComponentFixture />, endIcon: <EmptyComponentFixture /> });

        expect(screen.getByTestId('dt-button-start-icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt-button-end-icon')).toBeInTheDocument();
      });

      it('Should suppress legacy icon slot even if provided', () => {
        renderButton({
          children: 'text',
          startIcon: <EmptyComponentFixture />,
          endIcon: <EmptyComponentFixture />,
          icon: <EmptyComponentFixture />,
        });

        expect(icon()).not.toBeInTheDocument();
      });

      it('Should not apply vertical layout', () => {
        renderButton({
          children: 'text',
          startIcon: <EmptyComponentFixture />,
          endIcon: <EmptyComponentFixture />,
          iconPosition: 'top',
        });

        expect(button()).not.toHaveClass('d-btn--vertical');
      });
    });

    describe('With blockStartIcon slot populated', () => {
      it('Should render the block-start icon container', () => {
        renderButton({ children: 'text', blockStartIcon: <EmptyComponentFixture /> });

        const blockStartIcon = screen.getByTestId('dt-button-block-start-icon');

        expect(blockStartIcon).toHaveClass('d-btn__icon');
        expect(blockStartIcon).toHaveClass('d-btn__icon--top');
      });

      it('Should not render legacy icon slot', () => {
        renderButton({ children: 'text', blockStartIcon: <EmptyComponentFixture /> });

        expect(icon()).not.toBeInTheDocument();
      });

      it('Should apply vertical layout class', () => {
        renderButton({ children: 'text', blockStartIcon: <EmptyComponentFixture /> });

        expect(button()).toHaveClass('d-btn--vertical');
      });

      it('Should have icon-only class when no label is provided', () => {
        renderButton({ blockStartIcon: <EmptyComponentFixture /> });

        expect(button()).toHaveClass('d-btn--icon-only');
      });
    });

    describe('With blockEndIcon slot populated', () => {
      it('Should render the block-end icon container', () => {
        renderButton({ children: 'text', blockEndIcon: <EmptyComponentFixture /> });

        const blockEndIcon = screen.getByTestId('dt-button-block-end-icon');

        expect(blockEndIcon).toHaveClass('d-btn__icon');
        expect(blockEndIcon).toHaveClass('d-btn__icon--bottom');
      });

      it('Should not render legacy icon slot', () => {
        renderButton({ children: 'text', blockEndIcon: <EmptyComponentFixture /> });

        expect(icon()).not.toBeInTheDocument();
      });

      it('Should apply vertical layout class', () => {
        renderButton({ children: 'text', blockEndIcon: <EmptyComponentFixture /> });

        expect(button()).toHaveClass('d-btn--vertical');
      });

      it('Should have icon-only class when no label is provided', () => {
        renderButton({ blockEndIcon: <EmptyComponentFixture /> });

        expect(button()).toHaveClass('d-btn--icon-only');
      });
    });

    describe('With both blockStartIcon and blockEndIcon slots populated', () => {
      it('Should render both icon containers', () => {
        renderButton({
          children: 'text',
          blockStartIcon: <EmptyComponentFixture />,
          blockEndIcon: <EmptyComponentFixture />,
        });

        expect(screen.getByTestId('dt-button-block-start-icon')).toBeInTheDocument();
        expect(screen.getByTestId('dt-button-block-end-icon')).toBeInTheDocument();
      });

      it('Should suppress legacy icon slot even if provided', () => {
        renderButton({
          children: 'text',
          blockStartIcon: <EmptyComponentFixture />,
          blockEndIcon: <EmptyComponentFixture />,
          icon: <EmptyComponentFixture />,
        });

        expect(icon()).not.toBeInTheDocument();
      });

      it('Should apply vertical layout class', () => {
        renderButton({
          children: 'text',
          blockStartIcon: <EmptyComponentFixture />,
          blockEndIcon: <EmptyComponentFixture />,
        });

        expect(button()).toHaveClass('d-btn--vertical');
      });
    });

    describe('With icon slot and iconPosition "blockStart"', () => {
      it('Should map "blockStart" to d-btn__icon--top class', () => {
        renderButton({ children: 'text', icon: <EmptyComponentFixture />, iconPosition: 'blockStart' });

        expect(icon()).toHaveClass('d-btn__icon--top');
      });
    });

    describe('With icon slot and iconPosition "blockEnd"', () => {
      it('Should map "blockEnd" to d-btn__icon--bottom class', () => {
        renderButton({ children: 'text', icon: <EmptyComponentFixture />, iconPosition: 'blockEnd' });

        expect(icon()).toHaveClass('d-btn__icon--bottom');
      });
    });

    describe('With icon slot and iconPosition "start"', () => {
      it('Should map "start" to d-btn__icon--left class', () => {
        renderButton({ children: 'text', icon: <EmptyComponentFixture />, iconPosition: 'start' });

        expect(icon()).toHaveClass('d-btn__icon--left');
      });
    });

    describe('With icon slot and iconPosition "end"', () => {
      it('Should map "end" to d-btn__icon--right class', () => {
        renderButton({ children: 'text', icon: <EmptyComponentFixture />, iconPosition: 'end' });

        expect(icon()).toHaveClass('d-btn__icon--right');
      });
    });

    describe('When both startIcon and icon slots are provided', () => {
      it('should render startIcon and suppress the deprecated icon slot', () => {
        renderButton({ children: 'Button Text', startIcon: <span>new</span>, icon: <span>old</span> });

        expect(screen.getByTestId('dt-button-start-icon')).toHaveTextContent('new');
        expect(icon()).not.toBeInTheDocument();
      });
    });

    describe('When default slot is populated with text', () => {
      it('text should display in the button label', () => {
        renderButton({ children: 'hello' });

        expect(label()).toHaveTextContent(/^hello$/);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When button is clicked', () => {
      beforeEach(async () => {
        renderButton({ onClick: MOCK_BUTTON_STUB, icon: <EmptyComponentFixture /> });

        await userEvent.click(button());
      });

      it('Should call listener', () => {
        expect(MOCK_BUTTON_STUB).toHaveBeenCalled();
      });

      it('Should emit click event', () => {
        expect(MOCK_BUTTON_STUB).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
      });
    });
  });

  describe('Extendability Tests', () => {
    const customClass = 'my-custom-class';

    describe('When an label class is provided', () => {
      it('should apply custom class to child', () => {
        const { container } = renderButton({ labelClass: customClass, children: 'My Button Label' });

        expect(container.querySelector(`.${customClass}`)).toBe(label());
      });
    });
  });

  describe('Leading and trailing slots', () => {
    it('should render leading when provided', () => {
      renderButton({ leading: <span data-qa="test-leading">L</span> });

      expect(screen.getByTestId('test-leading')).toBeInTheDocument();
    });

    it('should render trailing when provided', () => {
      renderButton({ trailing: <span data-qa="test-trailing">T</span> });

      expect(screen.getByTestId('test-trailing')).toBeInTheDocument();
    });

    it('should apply leadingClass to the leading wrapper', () => {
      renderButton({ leadingClass: 'my-leading', leading: <span data-qa="test-leading">L</span> });

      expect(screen.getByTestId('test-leading').parentElement).toHaveClass('d-btn__leading', 'my-leading');
    });

    it('should apply trailingClass to the trailing wrapper', () => {
      renderButton({ trailingClass: 'my-trailing', trailing: <span data-qa="test-trailing">T</span> });

      expect(screen.getByTestId('test-trailing').parentElement).toHaveClass('d-btn__trailing', 'my-trailing');
    });

    it('should not render leading or trailing by default', () => {
      const { container } = renderButton();

      expect(container.querySelector('.d-btn__leading')).not.toBeInTheDocument();
      expect(container.querySelector('.d-btn__trailing')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    describe('When assertiveOnFocus is true', () => {
      beforeEach(() => {
        mockProps = { assertiveOnFocus: true };
      });

      describe('When button is focused', () => {
        it('aria-live should be set to "assertive"', () => {
          renderButton();

          act(() => button().focus());

          expect(button()).toHaveAttribute('aria-live', 'assertive');
        });
      });

      describe('When button is not in focus', () => {
        it('aria-live is "falsy"', () => {
          renderButton();

          act(() => button().focus());
          act(() => button().blur());

          expect(button()).not.toHaveAttribute('aria-live');
        });
      });
    });
  });

  describe('Navigation Tests', () => {
    describe('When href is provided', () => {
      beforeEach(() => {
        mockProps = {
          href: 'https://example.com',
          target: '_blank',
          rel: 'noopener noreferrer',
        };
      });

      it('Should render an <a> element', () => {
        renderButton();

        expect(button().tagName).toBe('A');
      });

      it('Should apply href, target, and rel attributes', () => {
        renderButton();

        expect(button()).toHaveAttribute('href', 'https://example.com');
        expect(button()).toHaveAttribute('target', '_blank');
        expect(button()).toHaveAttribute('rel', 'noopener noreferrer');
      });

      it('Should not apply role="button" (element navigates, native link role is correct)', () => {
        renderButton();

        expect(button()).not.toHaveAttribute('role');
      });
    });

    describe('When to is provided', () => {
      const renderWithRouter = (props: DtButtonProps) => render(withRouterLink(<DtButton {...props} />));

      it('Should render a <router-link> component', () => {
        renderWithRouter({ to: '/some-route' });

        // The stub rendered the root, with DtButton's data-qa over its own.
        expect(button()).toHaveAttribute('data-to', '/some-route');
      });

      it('Should pass to and replace props to <router-link>', () => {
        renderWithRouter({ to: '/some-route', replace: true });

        expect(button()).toHaveAttribute('data-to', '/some-route');
        expect(button()).toHaveAttribute('data-replace', 'true');
      });

      describe('When both to and href are provided', () => {
        it('Should render <router-link> (to takes precedence)', () => {
          renderWithRouter({ to: '/some-route', href: 'https://example.com' });

          expect(button()).toHaveAttribute('data-to', '/some-route');
          expect(button()).toHaveAttribute('href', '/some-route');
        });
      });
    });

    describe('Disabled state', () => {
      describe('When <a> is disabled', () => {
        beforeEach(() => {
          mockProps = {
            href: 'https://example.com',
            disabled: true,
          };
        });

        it('Should set aria-disabled="true" and tabindex="-1"', () => {
          renderButton();

          expect(button()).toHaveAttribute('aria-disabled', 'true');
          expect(button()).toHaveAttribute('tabindex', '-1');
        });

        it('Should not render href when disabled', () => {
          renderButton();

          expect(button()).not.toHaveAttribute('href');
        });

        it('Should prevent click', async () => {
          const clickHandler = vi.fn();

          renderButton({ onClick: clickHandler });
          await userEvent.click(button());

          expect(clickHandler).not.toHaveBeenCalled();
        });
      });

      describe('When <router-link> is disabled', () => {
        it('Should set aria-disabled="true" and tabindex="-1"', () => {
          render(withRouterLink(<DtButton to="/some-route" disabled />));

          expect(button()).toHaveAttribute('aria-disabled', 'true');
          expect(button()).toHaveAttribute('tabindex', '-1');
        });
      });

      describe('When <button> is disabled', () => {
        it('Should use native disabled attribute', () => {
          renderButton({ disabled: true });

          expect(button()).toHaveAttribute('disabled');
          expect(button()).not.toHaveAttribute('aria-disabled');
        });
      });
    });

    describe('Keyboard accessibility', () => {
      describe('When <a> receives Space keydown', () => {
        it('Should trigger click', () => {
          renderButton({ href: 'https://example.com' });

          const clickSpy = vi.fn((event: Event) => event.preventDefault());
          button().addEventListener('click', clickSpy);

          fireEvent.keyDown(button(), { key: ' ' });

          expect(clickSpy).toHaveBeenCalled();
        });
      });

      describe('When disabled <a> receives Space keydown', () => {
        it('Should not trigger click', () => {
          renderButton({ href: 'https://example.com', disabled: true });

          const clickSpy = vi.fn();
          button().addEventListener('click', clickSpy);

          fireEvent.keyDown(button(), { key: ' ' });

          expect(clickSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  // React-only tests: behaviour the Vue suite doesn't cover.
  describe('React port', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('passes iconSize to the icon render props', () => {
      const startIcon = vi.fn(({ iconSize }: { iconSize?: string }) => <i data-qa="start" data-size={iconSize} />);

      renderButton({ size: 400, startIcon });

      expect(screen.getByTestId('start')).toHaveAttribute('data-size', BUTTON_ICON_SIZES[400]);
    });

    it('labels a loading button "Loading" unless the consumer passes aria-label', () => {
      const { rerender } = renderButton({ loading: true });

      expect(button()).toHaveAttribute('aria-label', 'Loading');

      rerender(<DtButton loading aria-label="Saving" />);

      expect(button()).toHaveAttribute('aria-label', 'Saving');
    });

    it('applies width as an inline style, merged with the consumer\'s style', () => {
      renderButton({ width: '100%', style: { color: 'red' } });

      expect(button()).toHaveStyle({ width: '100%', color: 'rgb(255, 0, 0)' });
    });

    it('calls onFocus and onBlur with the native events', () => {
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      renderButton({ onFocus, onBlur });

      act(() => button().focus());
      act(() => button().blur());

      expect(onFocus).toHaveBeenCalledWith(expect.objectContaining({ type: 'focus' }));
      expect(onBlur).toHaveBeenCalledWith(expect.objectContaining({ type: 'blur' }));
    });

    it('keeps a disabled link\'s click from reaching its ancestors', async () => {
      const parentClick = vi.fn();
      render(
        // The wrapper only observes the click bubbling up.
        <div onClick={parentClick}><DtButton href="https://example.com" disabled>Link</DtButton></div>,
      );

      await userEvent.click(button());

      expect(parentClick).not.toHaveBeenCalled();
    });

    it('still calls the consumer\'s onKeyDown after handling Space on a link', () => {
      const onKeyDown = vi.fn();
      renderButton({ href: 'https://example.com', onKeyDown });
      button().addEventListener('click', event => event.preventDefault());

      fireEvent.keyDown(button(), { key: ' ' });

      expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: ' ', defaultPrevented: true }));
    });

    it('forwards ref to the rendered element', () => {
      const ref = createRef<HTMLButtonElement | HTMLAnchorElement>();
      render(<DtButton ref={ref}>Label</DtButton>);

      expect(ref.current).toBe(button());
    });

    it('warns once about an invalid combination, and again when it changes', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { rerender } = render(<DtButton circle kind="default" importance="primary" />);

      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn).toHaveBeenCalledWith(INVALID_COMBINATION[0].message);

      rerender(<DtButton circle kind="default" importance="primary" />);
      expect(warn).toHaveBeenCalledTimes(1);

      rerender(<DtButton circle link />);
      expect(warn).toHaveBeenLastCalledWith('You cannot enable circle and link at the same time');
    });
  });
});

describe('SrOnlyCloseButton', () => {
  const closeButton = () => screen.getByTestId('dt-sr-only-close-button');

  it('renders a screen-reader-only close button labelled "Close"', () => {
    render(<SrOnlyCloseButton />);

    expect(closeButton()).toHaveAttribute('id', 'sr-only-close-button');
    expect(closeButton()).toHaveClass('d-vi-visible-sr', 'base-button__button');
    expect(closeButton()).toHaveAttribute('aria-label', 'Close');
    expect(closeButton()).toHaveAttribute('title', 'Close');
    expect(closeButton().querySelector('svg')).toBeInTheDocument();
  });

  it('calls onClose, then the consumer\'s onClick, when clicked', async () => {
    const calls: string[] = [];
    render(<SrOnlyCloseButton onClose={() => calls.push('close')} onClick={() => calls.push('click')} />);

    await userEvent.click(closeButton());

    expect(calls).toEqual(['close', 'click']);
  });

  it('calls onClose on Space, and stops the key event', () => {
    const onClose = vi.fn();
    const parentKeyDown = vi.fn();
    render(
      // The wrapper only observes the key event bubbling up.
      <div onKeyDown={parentKeyDown}><SrOnlyCloseButton onClose={onClose} /></div>,
    );

    const notCancelled = fireEvent.keyDown(closeButton(), { key: ' ' });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(notCancelled).toBe(false);
    expect(parentKeyDown).not.toHaveBeenCalled();
  });

  it('merges the consumer\'s className', () => {
    render(<SrOnlyCloseButton className="extra" />);

    expect(closeButton()).toHaveClass('d-vi-visible-sr', 'extra');
  });
});
