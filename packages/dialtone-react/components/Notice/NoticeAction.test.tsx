import { cleanup, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DtNoticeAction, type DtNoticeActionProps } from './index';

// Constants
const baseProps: DtNoticeActionProps = {
  showClose: true,
};

const baseSlotsData = {
  children: 'this is the action slot content',
};

describe('DtNoticeAction tests', () => {
  let result: RenderResult;
  let onClose: ReturnType<typeof vi.fn<() => void>>;
  let props: DtNoticeActionProps;

  const slotsData = baseSlotsData;

  let closeButton: HTMLElement | null;
  let srOnlyCloseButton: HTMLElement | null;

  const element = () => <DtNoticeAction {...props} {...slotsData} onClose={onClose} />;

  const _setWrappers = () => {
    cleanup();
    result = render(element());
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    closeButton = result.container.querySelector('[data-qa="dt-notice-action-close-button"]');
    srOnlyCloseButton = result.container.querySelector('[data-qa="dt-sr-only-close-button"]');
  };

  const setProps = (newProps: DtNoticeActionProps) => {
    props = { ...props, ...newProps };
    result.rerender(element());
  };

  beforeEach(() => {
    props = baseProps;
    onClose = vi.fn<() => void>();
    _setWrappers();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default slot content', () => {
      it('Should render notice action', () => {
        expect(result.container.querySelector('[data-qa="notice-content-actions"]')).toBeInTheDocument();
      });

      it('Default slot renders correctly as action text/html', () => {
        const root = result.container.querySelector('.d-notice__actions');
        expect(root?.textContent).toBe(slotsData.children);
      });

      it('Should not render sr-only close button', () => {
        expect(srOnlyCloseButton).toBeNull();
      });
    });

    describe('When showClose is true', () => {
      it('Close button is displayed', () => {
        expect(closeButton).toBeInTheDocument();
      });
    });

    describe('When showClose is false', () => {
      beforeEach(() => {
        _setWrappers();
        setProps({ showClose: false });
        _setChildWrappers();
      });

      it('Close button is not displayed', () => {
        expect(closeButton).toBeNull();
      });

      it('should contain a visually hidden close button', async () => {
        expect(srOnlyCloseButton).toBeInTheDocument();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When showClose is true', () => {
      describe('When close button is clicked', () => {
        beforeEach(async () => {
          await userEvent.click(closeButton!);
        });
        it('emits event', () => {
          expect(onClose).toHaveBeenCalled();
        });
      });
    });

    describe('When showClose is false', () => {
      beforeEach(async () => {
        setProps({ showClose: false });
        _setChildWrappers();
        await userEvent.click(srOnlyCloseButton!);
      });

      it('emits event', () => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  // React-only: Vue's mounted / beforeUnmount pair.
  describe('Focus Tests', () => {
    let trigger: HTMLButtonElement;

    beforeEach(() => {
      cleanup();
      trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
    });

    afterEach(() => {
      trigger.remove();
    });

    it('gives focus back to what had it on mount, on unmount', () => {
      result = render(element());
      result.getByRole('button', { name: 'Click to close' }).focus();
      result.unmount();

      expect(trigger).toHaveFocus();
    });

    it('does not move focus on unmount when the close button did not show on mount', () => {
      props = { showClose: false };
      result = render(element());
      trigger.blur();
      result.unmount();

      expect(trigger).not.toHaveFocus();
    });
  });
});
