import { act, cleanup, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DtToast, type DtToastProps } from './Toast';
import { TOAST_MIN_DURATION } from './ToastConstants';

type ToastSlots = Pick<DtToastProps, 'children' | 'action' | 'icon'>;

const baseProps: DtToastProps = { headerText: '', open: true };
const baseSlots: ToastSlots = {};

let mockProps: DtToastProps = {};
let mockSlots: ToastSlots = {};

describe('DtToast Tests', () => {
  let result: RenderResult;
  let toast: HTMLElement | null;
  let actionChild: HTMLElement;
  let contentChild: HTMLElement;
  let iconChild: HTMLElement;

  const qa = (name: string) => result.container.querySelector<HTMLElement>(`[data-qa="${name}"]`);

  const setChildren = () => {
    toast = qa('dt-toast');
    actionChild = qa('notice-content-actions')!;
    contentChild = qa('notice-content')!;
    iconChild = result.container.querySelector<HTMLElement>('.d-notice__icon')!;
  };

  const element = () => <DtToast {...baseProps} {...mockProps} {...baseSlots} {...mockSlots} />;

  const updateWrapper = () => {
    cleanup();
    result = render(element());
    setChildren();
  };

  const setProps = (props: DtToastProps) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(element());
    setChildren();
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    mockProps = {};
    mockSlots = {};
  });

  describe('When only headerText is provided (no message, no default slot)', () => {
    beforeEach(() => {
      mockProps = { headerText: 'Copied to clipboard' };
      updateWrapper();
    });

    it('does not render an empty message paragraph', () => {
      expect(qa('notice-content-message')).not.toBeInTheDocument();
    });

    it('still renders the title', () => {
      expect(qa('notice-content-title')!.textContent).toBe('Copied to clipboard');
    });
  });

  describe('When a message is provided', () => {
    beforeEach(() => {
      mockProps = { headerText: 'Title', message: 'Real message' };
      updateWrapper();
    });

    it('renders the message paragraph with the message text', () => {
      expect(qa('notice-content-message')!.textContent).toBe('Real message');
    });
  });

  describe('Presentation Tests', () => {
    describe('When the toast renders', () => {
      it('should exist', () => {
        expect(result.container).toBeInTheDocument();
      });

      it('should render the toast', () => {
        expect(toast).toBeInTheDocument();
      });
    });

    describe('When the toast renders with slots', () => {
      beforeEach(() => {
        mockSlots = {
          children: 'default slot content',
          action: 'action slot content',
          icon: 'icon slot content',
        };

        updateWrapper();
      });

      it('action slot is passed down correctly', () => {
        expect(actionChild.textContent).toBe(mockSlots.action);
      });

      it('default slot is passed down correctly', () => {
        expect(contentChild.textContent).toBe(mockSlots.children);
      });

      it('icon slot is passed down correctly', () => {
        expect(iconChild.textContent).toBe(mockSlots.icon);
      });
    });

    describe('When the toast renders with props', () => {
      beforeEach(() => {
        mockProps = {
          headerId: 'headerId prop content',
          contentId: 'contentId prop content',
          headerText: '',
          message: 'message prop content',
          showClose: false,
        };

        updateWrapper();
      });

      // Vue reads NoticeContent's headerId prop. The header isn't rendered without a header text, so the port gives it
      // one and checks the id reaches the title element.
      it('headerId prop is passed down correctly', () => {
        setProps({ headerText: 'Title' });

        expect(qa('notice-content-title')).toHaveAttribute('id', mockProps.headerId);
      });

      it('contentId prop is passed down correctly', () => {
        expect(qa('notice-content-message')).toHaveAttribute('id', mockProps.contentId);
      });

      it('headerText prop is passed down correctly', () => {
        expect(qa('notice-content-title')).not.toBeInTheDocument();
      });

      it('message prop is passed down correctly', () => {
        expect(contentChild.querySelector('[data-qa="notice-content-message"]')!.textContent).toBe(mockProps.message);
      });

      it('showClose prop is passed down correctly', () => {
        expect(qa('dt-notice-action-close-button')).not.toBeInTheDocument();
      });
    });

    describe('When kind is not specified', () => {
      it('should use the default kind', () => {
        expect(toast).toHaveClass('d-toast--base');
      });
    });

    describe('When kind is set to critical', () => {
      it('has correct class', () => {
        mockProps = { kind: 'critical' };

        updateWrapper();

        expect(toast).toHaveClass('d-toast--critical');
      });
    });

    describe('When important is not provided', () => {
      it('doesnt have important class', () => {
        expect(toast).not.toHaveClass('d-toast--important');
      });
    });

    describe('When important is true', () => {
      it('has correct class', () => {
        mockProps = { important: true };

        updateWrapper();

        expect(toast).toHaveClass('d-toast--important');
      });
    });

    describe('When duration is not provided', () => {
      it('should show the toast', () => {
        expect(toast).toBeInTheDocument();
      });
    });

    describe('When duration is provided', () => {
      it('should close the toast after duration time is finished', () => {
        vi.useFakeTimers();

        expect(toast).toBeInTheDocument();

        mockProps = { open: true, duration: 6500 };

        updateWrapper();

        act(() => {
          vi.runAllTimers();
        });

        setChildren();

        expect(toast).not.toBeInTheDocument();

        vi.useRealTimers();
      });

      it('should close the toast with close method', () => {
        expect(toast).toBeInTheDocument();

        setProps({ open: false });

        expect(toast).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      const MOCK_ROLE = 'status';

      it('shows correct default role', () => {
        expect(contentChild).toHaveAttribute('role', MOCK_ROLE);
      });

      it('should have aria-hidden set to false when toast is shown', () => {
        expect(toast).toHaveAttribute('aria-hidden', 'false');
      });
    });

    describe('When role is alert', () => {
      it('shows correct role', () => {
        mockProps = { role: 'alert' };

        updateWrapper();

        expect(contentChild).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Duration Validator', () => {
      const MOCK_DURATION = TOAST_MIN_DURATION;

      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      describe('When provided duration is a valid duration', () => {
        it('passes custom prop validation', () => {
          mockProps = { duration: MOCK_DURATION };
          updateWrapper();

          act(() => {
            vi.advanceTimersByTime(MOCK_DURATION);
          });
          setChildren();

          expect(toast).not.toBeInTheDocument();
        });
      });

      describe('When provided duration is not a valid duration', () => {
        it('fails custom prop validation', () => {
          mockProps = { duration: MOCK_DURATION - 1 };
          updateWrapper();

          act(() => {
            vi.runAllTimers();
          });
          setChildren();

          expect(toast).toBeInTheDocument();
        });
      });
    });
  });

  // React-only: what the Vue tests don't exercise.
  describe('Interactivity Tests', () => {
    it('hides the toast and reports close and open change once when the close button is clicked', async () => {
      const onClose = vi.fn();
      const onOpenChange = vi.fn();
      mockProps = { onClose, onOpenChange };
      updateWrapper();

      await userEvent.click(qa('dt-notice-action-close-button')!);
      setChildren();

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(toast).not.toBeInTheDocument();
    });

    it('reports open change when the duration runs out', () => {
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      mockProps = { duration: 6500, onOpenChange };
      updateWrapper();

      act(() => {
        vi.advanceTimersByTime(6499);
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);

      vi.useRealTimers();
    });

    it('stops the timer when open turns false', () => {
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      mockProps = { duration: 6500, onOpenChange };
      updateWrapper();

      setProps({ open: false });
      act(() => {
        vi.runAllTimers();
      });

      expect(onOpenChange).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('shows the toast again when open turns true after it closed itself', async () => {
      await userEvent.click(qa('dt-notice-action-close-button')!);
      setProps({ open: false });
      setProps({ open: true });

      expect(toast).toBeInTheDocument();
    });

    it('passes the consumer\'s listeners to the notice parts', async () => {
      const onClick = vi.fn();
      mockProps = { onClick };
      mockSlots = { action: <button type="button">Action</button> };
      updateWrapper();

      await userEvent.click(result.getByText('Action'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies the consumer\'s class to the root and drops other attributes, as Vue does', () => {
      const attrs = { id: 'toast-id', 'data-testid': 'toast' } as unknown as DtToastProps;
      mockProps = { className: 'my-toast', ...attrs };
      updateWrapper();

      expect(toast).toHaveClass('d-toast', 'my-toast');
      expect(toast).not.toHaveAttribute('id');
      expect(result.container.querySelector('#toast-id')).toBeNull();
    });
  });

  describe('Alternate layout', () => {
    beforeEach(() => {
      mockProps = { layout: 'alternate', headerText: 'Title', message: 'Alternate message' };
      updateWrapper();
    });

    it('renders the alternate toast with the message in its content section', () => {
      expect(toast).toHaveClass('d-toast-alternate');
      expect(toast!.querySelector('.d-toast-alternate__content')!.textContent).toBe('Alternate message');
      expect(qa('notice-content-message')).not.toBeInTheDocument();
    });

    it('renders the kind\'s icon and class', () => {
      setProps({ kind: 'gradient' });

      expect(toast).toHaveClass('d-toast-alternate--gradient');
      expect(toast!.querySelector('.d-toast-layout-alternate__icon svg')).toHaveClass('d-icon--size-200');
    });

    it('has no kind class for base', () => {
      expect([...toast!.classList]).toEqual(['d-toast-alternate']);
    });

    it('calls onClose once when the close button is clicked', async () => {
      const onClose = vi.fn();
      setProps({ onClose });

      await userEvent.click(qa('dt-notice-action-close-button')!);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(qa('dt-toast')).not.toBeInTheDocument();
    });

    it('renders children in place of the message', () => {
      mockSlots = { children: 'Slot content' };
      updateWrapper();

      expect(toast!.querySelector('.d-toast-alternate__content')!.textContent).toBe('Slot content');
    });
  });
});
