import { act, cleanup, fireEvent, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DtBanner, type DtBannerProps } from './Banner';

const MOCK_ACTION_SLOT = <a href="#" data-qa="banner-action">Action</a>;

const baseProps: DtBannerProps = {};
const baseSlots: Pick<DtBannerProps, 'children' | 'action'> = {};

let mockProps: DtBannerProps = {};
let mockSlots: Pick<DtBannerProps, 'children' | 'action'> = {};

// Vue Test Utils' flushPromises: lets the focus trap's microtask (initial focus) finish.
const flushPromises = () => act(() => new Promise<void>(resolve => { setTimeout(resolve, 0); }));

describe('DtBanner Tests', () => {
  let result: RenderResult | null;
  let banner: HTMLElement;
  let dialog: HTMLElement;

  const qa = (name: string) => result!.container.querySelector<HTMLElement>(`[data-qa="${name}"]`)!;

  const setChildren = () => {
    banner = qa('dt-banner');
    dialog = qa('dt-banner-dialog');
  };

  const element = (props: DtBannerProps) => (
    <DtBanner {...baseProps} {...props} {...baseSlots} {...mockSlots} />
  );

  const updateWrapper = () => {
    // Unmount any previous instance first: focus tests leave nodes attached to document.body.
    result?.unmount();
    result = render(element(mockProps));
    setChildren();
  };

  const setProps = (props: DtBannerProps) => {
    mockProps = { ...mockProps, ...props };
    result!.rerender(element(mockProps));
    setChildren();
  };

  const actionEl = () => qa('banner-action');
  const closeEl = () => qa('dt-notice-action-close-button');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    result = null;
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should render the banner and its dialog', () => {
      expect(banner).toBeInTheDocument();
      expect(dialog).toBeInTheDocument();
    });

    it('should render default slot content', () => {
      mockSlots = { children: <p data-qa="banner-body">Body</p> };

      updateWrapper();

      expect(qa('banner-body').textContent).toBe('Body');
    });
  });

  describe('Accessibility Tests', () => {
    describe('When not important (default)', () => {
      beforeEach(() => {
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
      });

      it('should use the status role and omit aria-modal', () => {
        expect(dialog.getAttribute('role')).toBe('status');
        expect(dialog.getAttribute('aria-modal')).toBeNull();
      });

      it('should not move initial focus on mount', async () => {
        await flushPromises();

        expect(banner.contains(document.activeElement)).toBe(false);
      });

      it('should not wrap focus on Tab (trap inactive)', async () => {
        await flushPromises();
        act(() => closeEl().focus());

        fireEvent.keyDown(banner, { key: 'Tab' });

        // Trap is inactive, so focus is NOT wrapped back to the first element.
        expect(document.activeElement).toBe(closeEl());
        expect(document.activeElement).not.toBe(actionEl());
      });
    });

    describe('When important', () => {
      beforeEach(async () => {
        mockProps = { important: true };
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
        await flushPromises();
      });

      it('should use the alertdialog role and set aria-modal', () => {
        expect(dialog.getAttribute('role')).toBe('alertdialog');
        expect(dialog.getAttribute('aria-modal')).toBe('true');
      });

      it('should move initial focus to the first focusable element', () => {
        expect(document.activeElement).toBe(actionEl());
      });

      it('should wrap focus to the first element on Tab from the last', () => {
        act(() => closeEl().focus());

        fireEvent.keyDown(banner, { key: 'Tab' });

        expect(document.activeElement).toBe(actionEl());
      });

      it('should wrap focus to the last element on Shift+Tab from the first', () => {
        act(() => actionEl().focus());

        fireEvent.keyDown(banner, { key: 'Tab', shiftKey: true });

        expect(document.activeElement).toBe(closeEl());
      });
    });

    describe('When important is toggled on at runtime', () => {
      it('should activate the trap and move focus into the banner', async () => {
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
        await flushPromises();
        expect(banner.contains(document.activeElement)).toBe(false);

        setProps({ important: true });
        await flushPromises();

        expect(document.activeElement).toBe(actionEl());
      });
    });

    describe('Focus restoration', () => {
      let outsideButton: HTMLButtonElement;

      beforeEach(() => {
        outsideButton = document.createElement('button');
        document.body.appendChild(outsideButton);
        outsideButton.focus();
      });

      afterEach(() => {
        outsideButton.remove();
      });

      it('should restore focus via the directive when an important banner unmounts', async () => {
        // showClose: false disables NoticeAction's own focus restoration, so this
        // proves the focus trap (restoreFocus: true) is the restorer.
        mockProps = { important: true, showClose: false };
        mockSlots = { action: MOCK_ACTION_SLOT };

        updateWrapper();
        await flushPromises();
        // Focus has moved into the banner.
        expect(document.activeElement).toBe(actionEl());

        result!.unmount();
        // Null out so teardown / the next mount does not double-unmount.
        result = null;

        expect(document.activeElement).toBe(outsideButton);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When the close button is clicked', () => {
      it('should emit a close event', async () => {
        const onClose = vi.fn();
        mockProps = { onClose };
        updateWrapper();

        await userEvent.click(closeEl());

        expect(onClose).toHaveBeenCalled();
      });
    });
  });
});
