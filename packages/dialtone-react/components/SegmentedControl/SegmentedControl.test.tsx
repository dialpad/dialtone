import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';
import { DtSegmentedControl, type DtSegmentedControlProps } from './SegmentedControl';
import { DtSegmentedControlItem, type DtSegmentedControlItemProps } from './SegmentedControlItem';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_SPREADS,
} from './SegmentedControlConstants';

const ITEMS = [
  { value: 'all', text: 'All' },
  { value: 'favorites', text: 'Favorites' },
  { value: 'recent', text: 'Recent' },
];

const defaultSlot = (overrides: Partial<DtSegmentedControlItemProps>[] = []) => ITEMS.map((item, i) => (
  <DtSegmentedControlItem
    key={item.value}
    value={item.value}
    {...overrides[i]}
  >
    {item.text}
  </DtSegmentedControlItem>
));

const baseProps = {
  value: 'all',
  ariaLabel: 'Test segmented control',
};

describe('DtSegmentedControl Tests', () => {
  let onValueChange: Mock<(value: string) => void>;
  let onChange: Mock<(value: string) => void>;
  let onBeforeChange: Mock<(event: Event) => void>;

  const _setWrapper = (props: Partial<DtSegmentedControlProps> = {}, slot?: ReactNode) => {
    onValueChange = vi.fn<(value: string) => void>();
    onChange = vi.fn<(value: string) => void>();
    onBeforeChange = vi.fn<(event: Event) => void>();
    return render(
      <DtSegmentedControl
        {...baseProps}
        onValueChange={onValueChange}
        onChange={onChange}
        onBeforeChange={onBeforeChange}
        {...props}
      >
        {slot ?? defaultSlot()}
      </DtSegmentedControl>,
    );
  };

  const items = () => screen.getAllByTestId('dt-segmented-control-item');
  const container = () => screen.getByTestId('dt-segmented-control');

  describe('Presentation Tests', () => {
    it('renders all items', () => {
      _setWrapper();

      expect(items().length).toBe(ITEMS.length);
    });

    it('applies active class to selected item', () => {
      _setWrapper({ value: 'favorites' });

      expect(items()[1]).toHaveClass('d-btn--active');
    });

    it('disables all items when disabled prop is true', () => {
      _setWrapper({ disabled: true });

      items().forEach((item) => {
        expect(item).toHaveAttribute('disabled');
      });
    });
  });

  describe('When size is numeric', () => {
    it('should apply the correct size class for numeric size 200', () => {
      _setWrapper({ size: 200 });

      expect(container()).toHaveClass('d-segmented-control--sm');
    });
  });

  describe('Interactivity Tests', () => {
    it('emits update:modelValue on child click', async () => {
      _setWrapper();

      await userEvent.click(items()[2]);

      expect(onValueChange.mock.calls[0]).toEqual(['recent']);
    });

    it('does not emit when group is disabled', async () => {
      _setWrapper({ disabled: true });

      await userEvent.click(items()[1]);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('emits on Enter key', async () => {
      _setWrapper();

      act(() => items()[2].focus());
      await userEvent.keyboard('{Enter}');

      expect(onValueChange.mock.calls[0]).toEqual(['recent']);
    });

    it('emits on arrow nav when activationMode is auto', async () => {
      _setWrapper({ activationMode: 'auto' });

      act(() => items()[0].focus());
      await userEvent.keyboard('{ArrowRight}');

      expect(onValueChange.mock.calls[0]).toEqual(['favorites']);
    });

    it('does not emit on arrow nav when activationMode is manual', async () => {
      _setWrapper({ activationMode: 'manual' });

      act(() => items()[0].focus());
      await userEvent.keyboard('{ArrowRight}');

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    it('has role="radiogroup" with aria-label on container', () => {
      _setWrapper({ ariaLabel: 'My control' });

      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'My control');
    });

    it('items have role="radio" and aria-checked', () => {
      _setWrapper({ value: 'favorites' });

      expect(items()[0]).toHaveAttribute('role', 'radio');
      expect(items()[0]).toHaveAttribute('aria-checked', 'false');
      expect(items()[1]).toHaveAttribute('aria-checked', 'true');
    });

    it('selected item has tabindex 0, others have -1', () => {
      _setWrapper({ value: 'favorites' });

      expect(items()[0]).toHaveAttribute('tabindex', '-1');
      expect(items()[1]).toHaveAttribute('tabindex', '0');
      expect(items()[2]).toHaveAttribute('tabindex', '-1');
    });

    it('sets aria-disabled on disabled items', () => {
      _setWrapper({ value: 'a' }, (
        <>
          <DtSegmentedControlItem value="a">A</DtSegmentedControlItem>
          <DtSegmentedControlItem
            value="b"
            disabled
          >
            B
          </DtSegmentedControlItem>
          <DtSegmentedControlItem value="c">C</DtSegmentedControlItem>
        </>
      ));

      expect(items()[1]).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Change Event Tests', () => {
    it('emits change event on child click', async () => {
      _setWrapper();

      await userEvent.click(items()[2]);

      expect(onChange.mock.calls[0]).toEqual(['recent']);
    });

    it('does not emit change when clicking the already-selected item', async () => {
      _setWrapper({ value: 'all' });

      await userEvent.click(items()[0]);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not emit change when group is disabled', async () => {
      _setWrapper({ disabled: true });

      await userEvent.click(items()[1]);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Before-Change Event Tests', () => {
    it('emits before-change on child click', async () => {
      _setWrapper();

      await userEvent.click(items()[1]);

      expect(onBeforeChange).toHaveBeenCalledWith(expect.any(Event));
    });

    it('prevents selection when before-change is cancelled', async () => {
      const cancelChange = vi.fn((event: Event) => {
        event.preventDefault();
      });
      _setWrapper({ onBeforeChange: cancelChange });

      await userEvent.click(items()[1]);

      expect(cancelChange).toHaveBeenCalled();
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Item Click/Focus Event Tests', () => {
    it('emits click event on item', async () => {
      const onItemClick = vi.fn();
      _setWrapper({}, defaultSlot([{}, { onClick: onItemClick }]));

      await userEvent.click(items()[1]);

      expect(onItemClick).toHaveBeenCalled();
    });

    it('emits focus event on item', () => {
      const onItemFocus = vi.fn();
      _setWrapper({}, defaultSlot([{}, { onFocus: onItemFocus }]));

      act(() => items()[1].focus());

      expect(onItemFocus).toHaveBeenCalled();
    });
  });

  describe('Id Prop Tests', () => {
    it('auto-generates an id when not provided', () => {
      _setWrapper();

      expect(screen.getByRole('radiogroup').getAttribute('id')).toBeTruthy();
    });

    it('uses provided id', () => {
      _setWrapper({ id: 'my-segmented-control' });

      expect(screen.getByRole('radiogroup')).toHaveAttribute('id', 'my-segmented-control');
    });
  });

  describe('Data-QA Tests', () => {
    it('has data-qa on the container', () => {
      _setWrapper();

      expect(screen.queryByTestId('dt-segmented-control')).toBeInTheDocument();
    });
  });

  describe('Tabbable Fallback Tests', () => {
    it('falls back to first enabled item when selected item is disabled', () => {
      _setWrapper({ value: 'a' }, (
        <>
          <DtSegmentedControlItem
            value="a"
            disabled
          >
            A
          </DtSegmentedControlItem>
          <DtSegmentedControlItem value="b">B</DtSegmentedControlItem>
          <DtSegmentedControlItem value="c">C</DtSegmentedControlItem>
        </>
      ));

      expect(items()[1]).toHaveAttribute('tabindex', '0');
    });

    it('falls back to first enabled item when modelValue matches no item', () => {
      _setWrapper({ value: 'nonexistent' });

      expect(items()[0]).toHaveAttribute('tabindex', '0');
    });

    it('no item is tabbable when group is disabled', () => {
      _setWrapper({ disabled: true });

      items().forEach((item) => {
        expect(item).toHaveAttribute('tabindex', '-1');
      });
    });
  });

  // Vue tests the props' validators; here the type is the validator, and the tests check what renders.
  describe('Validation Tests', () => {
    it('validates size prop', () => {
      const { rerender } = _setWrapper({ size: SEGMENTED_CONTROL_SIZES[0] });
      expect(container()).toHaveClass('d-segmented-control--xs');

      rerender(
        <DtSegmentedControl
          {...baseProps}
          // @ts-expect-error: not a segmented control size
          size="INVALID"
        >
          {defaultSlot()}
        </DtSegmentedControl>,
      );
      expect(container().className).not.toMatch(/d-segmented-control--(xs|sm|md|lg|xl)/);
    });

    it('validates orientation prop', () => {
      const { rerender } = _setWrapper({ orientation: SEGMENTED_CONTROL_ORIENTATIONS[0] });
      expect(container()).toHaveAttribute('aria-orientation', 'horizontal');
      expect(container()).toHaveClass('d-stack--row');

      rerender(
        <DtSegmentedControl
          {...baseProps}
          // @ts-expect-error: not a segmented control orientation
          orientation="INVALID"
        >
          {defaultSlot()}
        </DtSegmentedControl>,
      );
      expect(container()).not.toHaveClass('d-segmented-control--vertical');
    });

    it('validates activationMode prop', async () => {
      const { unmount } = _setWrapper({ activationMode: SEGMENTED_CONTROL_ACTIVATION_MODES[0] });
      act(() => items()[0].focus());
      await userEvent.keyboard('{ArrowRight}');
      expect(onValueChange).toHaveBeenCalledWith('favorites');
      unmount();

      _setWrapper({
        // @ts-expect-error: not a segmented control activation mode
        activationMode: 'INVALID',
      });
      act(() => items()[0].focus());
      await userEvent.keyboard('{ArrowRight}');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('validates spread prop', () => {
      const { rerender } = _setWrapper({ spread: SEGMENTED_CONTROL_SPREADS[1] });
      expect(container()).toHaveClass('d-segmented-control--spread-evenly');

      rerender(
        <DtSegmentedControl
          {...baseProps}
          // @ts-expect-error: not a segmented control spread
          spread="INVALID"
        >
          {defaultSlot()}
        </DtSegmentedControl>,
      );
      expect(container()).not.toHaveClass('d-segmented-control--spread-evenly');
    });
  });

  describe('React-only Tests', () => {
    it('selects on click when uncontrolled', async () => {
      render(
        <DtSegmentedControl
          defaultValue="all"
          ariaLabel="Uncontrolled"
        >
          {defaultSlot()}
        </DtSegmentedControl>,
      );

      await userEvent.click(items()[2]);

      expect(items()[2]).toHaveAttribute('aria-checked', 'true');
      expect(items()[0]).toHaveAttribute('aria-checked', 'false');
    });

    it('calls the consumer onKeyDown after handling the key', async () => {
      const onKeyDown = vi.fn();
      _setWrapper({ onKeyDown });

      act(() => items()[0].focus());
      await userEvent.keyboard('{End}');

      expect(document.activeElement).toBe(items()[2]);
      expect(onValueChange).toHaveBeenCalledWith('recent');
      expect(onKeyDown).toHaveBeenCalled();
    });

    it('prefers the ariaLabel prop over an aria-label attribute, as Vue does', () => {
      _setWrapper({ ariaLabel: 'Prop label', 'aria-label': 'Attribute label' });

      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Prop label');
    });

    it('passes the item attributes through to the button', () => {
      _setWrapper({}, defaultSlot([{ trailingClass: 'custom-trailing', trailing: '3', className: 'custom-item' }]));

      expect(items()[0]).toHaveClass('d-segmented-control__item', 'custom-item');
      expect(items()[0].querySelector('.d-btn__trailing')).toHaveClass('custom-trailing');
    });
  });
});
