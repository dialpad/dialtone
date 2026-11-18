import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DtToggle, type DtToggleProps } from './Toggle';

const baseLabel = 'My Toggle Label';

const toggleWith = (props: DtToggleProps = {}) => <DtToggle {...props}>{baseLabel}</DtToggle>;

const byQa = (qa: string) => document.querySelector<HTMLElement>(`[data-qa="${qa}"]`);
const getButton = () => document.querySelector('button') as HTMLButtonElement;
const getLabel = () => byQa('toggle-label');
const getIcon = () => document.querySelector('.d-toggle__inner');

describe('DtToggle Tests', () => {
  describe('Presentation Tests', () => {
    describe('Common toggle button attrs', () => {
      it('should exist', () => {
        render(toggleWith());

        expect(getButton()).toBeInTheDocument();
      });

      it('should have d-toggle class', () => {
        render(toggleWith());

        expect(getButton()).toHaveClass('d-toggle');
      });

      it('should have type button', () => {
        render(toggleWith());

        expect(getButton()).toHaveAttribute('type', 'button');
      });

      it('should have role switch', () => {
        render(toggleWith());

        expect(getButton()).toHaveAttribute('role', 'switch');
      });

      it('should show the icon', () => {
        render(toggleWith());

        expect(getIcon()).toBeInTheDocument();
      });

      it('should hide the icon when showIcon prop is false', () => {
        const { rerender } = render(toggleWith());
        rerender(toggleWith({ showIcon: false }));

        expect(getIcon()).not.toBeInTheDocument();
      });

      describe('disabled behaviour', () => {
        it('should set correct disabled attributes when disabled prop is false', () => {
          render(toggleWith());

          expect(getButton()).toHaveAttribute('aria-disabled', 'false');
          expect(getButton()).not.toHaveAttribute('disabled');
          expect(getButton()).not.toHaveClass('d-toggle--disabled');
        });

        it('should set correct disabled attributes when disabled prop is true', () => {
          const { rerender } = render(toggleWith());
          rerender(toggleWith({ disabled: true }));

          expect(getButton()).toHaveAttribute('aria-disabled', 'true');
          expect(getButton().disabled).toBe(true);
          expect(getButton()).toHaveClass('d-toggle--disabled');
        });

        it('should set correct size class with t-shirt alias', () => {
          const { rerender } = render(toggleWith());
          rerender(toggleWith({ size: 'sm' }));

          expect(getButton()).toHaveClass('d-toggle--small');
        });

        it('should set correct size class with numeric size', () => {
          const { rerender } = render(toggleWith());
          rerender(toggleWith({ size: 200 }));

          expect(getButton()).toHaveClass('d-toggle--small');
        });

        it('should render default size with numeric 300', () => {
          render(toggleWith());

          expect(getButton()).not.toHaveClass('d-toggle--small');
          expect(getButton()).toHaveClass('d-toggle');
        });
      });
    });

    describe('Unchecked Toggle', () => {
      beforeEach(() => {
        render(toggleWith({ checked: false }));
      });

      it('should exist', () => {
        expect(getButton()).toBeInTheDocument();
      });

      describe('checked behaviour', () => {
        it('should set correct checked attributes when modelValue prop is false', () => {
          expect(getButton()).toHaveAttribute('aria-checked', 'false');
          expect(getButton()).not.toHaveClass('d-toggle--checked');
        });
      });

      describe('label behaviour', () => {
        it('should exist', () => {
          expect(getLabel()).toBeInTheDocument();
        });

        it('should match provided label prop', () => {
          expect(getLabel()).toHaveTextContent(baseLabel);
        });
      });
    });

    describe('Checked Toggle', () => {
      beforeEach(() => {
        render(toggleWith({ checked: true, disabled: false }));
      });

      it('should exist', () => {
        expect(getButton()).toBeInTheDocument();
      });

      describe('checked behaviour', () => {
        it('should set correct checked attributes when checked prop is true', () => {
          expect(getButton()).toHaveAttribute('aria-checked', 'true');
          expect(getButton()).toHaveClass('d-toggle--checked');
        });
      });

      describe('label behaviour', () => {
        it('should exist', () => {
          expect(getLabel()).toBeInTheDocument();
        });

        it('should match provided label prop', () => {
          expect(getLabel()).toHaveTextContent(baseLabel);
        });
      });
    });

    describe('Indeterminate Toggle', () => {
      beforeEach(() => {
        render(toggleWith({ checked: 'mixed' }));
      });

      it('should set indeterminate state when checked prop is mixed', () => {
        expect(getButton()).toHaveClass('d-toggle--indeterminate');
      });

      it('should set the correct aria-checked attribute', () => {
        expect(getButton()).toHaveAttribute('aria-checked', 'mixed');
      });
    });

    describe('When showLabel is false', () => {
      it('should not render a label', () => {
        render(toggleWith({ showLabel: false }));

        expect(getLabel()).not.toBeInTheDocument();
      });
    });
  });

  describe('React-only Tests', () => {
    it('should label the button through the label element', () => {
      render(toggleWith());

      expect(screen.getByRole('switch', { name: baseLabel })).toBeInTheDocument();
    });

    it('should use the checkbox role when indeterminate', () => {
      render(toggleWith({ checked: 'mixed' }));

      expect(screen.getByRole('checkbox', { name: baseLabel })).toBeInTheDocument();
    });

    it('should put className and style on the root and other attributes on the button', () => {
      render(toggleWith({ className: 'my-class', style: { color: 'red' }, 'aria-label': 'Custom', id: 'my-id' }));

      const root = getButton().parentElement as HTMLElement;
      expect(root).toHaveClass('d-toggle-wrapper', 'my-class');
      expect(root.style.color).toBe('red');
      expect(getButton()).toHaveAttribute('aria-label', 'Custom');
      expect(getButton()).toHaveAttribute('id', 'my-id');
      expect(getLabel()).toHaveAttribute('for', 'my-id');
    });

    it('should apply labelClass and labelChildProps to the label', () => {
      render(toggleWith({ labelClass: 'my-label', labelChildProps: { className: 'child-label', title: 'Title' } }));

      expect(getLabel()).toHaveClass('my-label', 'child-label');
      expect(getLabel()).toHaveAttribute('title', 'Title');
    });

    it('should forward the ref to the button', () => {
      let node: HTMLButtonElement | null = null;
      render(<DtToggle ref={el => { node = el; }}>{baseLabel}</DtToggle>);

      expect(node).toBe(getButton());
    });

    describe('toggling', () => {
      it('should toggle on click when uncontrolled and emit the next value', async () => {
        const onCheckedChange = vi.fn();
        render(toggleWith({ onCheckedChange }));

        await userEvent.click(getButton());

        expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
        expect(getButton()).toHaveAttribute('aria-checked', 'true');
        expect(getButton()).toHaveClass('d-toggle--checked');

        await userEvent.click(getButton());

        expect(onCheckedChange).toHaveBeenLastCalledWith(false);
        expect(getButton()).toHaveAttribute('aria-checked', 'false');
      });

      it('should start from defaultChecked', () => {
        render(toggleWith({ defaultChecked: true }));

        expect(getButton()).toHaveAttribute('aria-checked', 'true');
      });

      it('should emit false and become unchecked when clicked while indeterminate', async () => {
        const onCheckedChange = vi.fn();
        render(toggleWith({ defaultChecked: 'mixed', onCheckedChange }));

        await userEvent.click(getButton());

        expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(false);
        expect(getButton()).toHaveAttribute('role', 'switch');
        expect(getButton()).toHaveAttribute('aria-checked', 'false');
      });

      it('should leave the value to the consumer when controlled', async () => {
        const onCheckedChange = vi.fn();
        const { rerender } = render(toggleWith({ checked: false, onCheckedChange }));

        await userEvent.click(getButton());

        expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
        expect(getButton()).toHaveAttribute('aria-checked', 'false');

        rerender(toggleWith({ checked: true, onCheckedChange }));

        expect(getButton()).toHaveAttribute('aria-checked', 'true');
      });

      it('should emit but not toggle when toggleOnClick is false', async () => {
        const onCheckedChange = vi.fn();
        render(toggleWith({ toggleOnClick: false, onCheckedChange }));

        await userEvent.click(getButton());

        expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
        expect(getButton()).toHaveAttribute('aria-checked', 'false');
      });

      it('should not toggle or emit when disabled', async () => {
        const onCheckedChange = vi.fn();
        render(toggleWith({ disabled: true, onCheckedChange }));

        await userEvent.click(getButton());

        expect(onCheckedChange).not.toHaveBeenCalled();
        expect(getButton()).toHaveAttribute('aria-checked', 'false');
      });

      it('should call the consumer onClick after toggling', async () => {
        const order: string[] = [];
        const onClick = vi.fn(() => { order.push('click'); });
        const onCheckedChange = vi.fn(() => { order.push('change'); });
        render(toggleWith({ onClick, onCheckedChange }));

        await userEvent.click(getButton());

        expect(onClick).toHaveBeenCalledOnce();
        expect(order).toEqual(['change', 'click']);
      });

      it('should toggle when its label is clicked', async () => {
        const onCheckedChange = vi.fn();
        render(toggleWith({ onCheckedChange }));

        await userEvent.click(screen.getByText(baseLabel));

        expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
      });
    });

    describe('label info', () => {
      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('should log once when there is no label or aria-label, even under StrictMode', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => {});
        const { rerender } = render(<StrictMode><DtToggle /></StrictMode>);
        rerender(<StrictMode><DtToggle disabled /></StrictMode>);

        expect(info).toHaveBeenCalledOnce();
        expect(info.mock.calls[0][0]).toContain('A label is required for accessibility');
        info.mockRestore();
      });

      it('should not log with an aria-label', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => {});
        render(<DtToggle aria-label="Toggle" />);

        expect(info).not.toHaveBeenCalled();
        info.mockRestore();
      });

      it('should not log with a visible label', () => {
        const info = vi.spyOn(console, 'info').mockImplementation(() => {});
        render(toggleWith());

        expect(info).not.toHaveBeenCalled();
        info.mockRestore();
      });
    });
  });
});
