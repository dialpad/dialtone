import { act, cleanup, fireEvent, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTabbableElements } from '../../common/focustrap/focustrap_utils';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtModal, type DtModalProps } from './Modal';
import { MODAL_BANNER_KINDS } from './ModalConstants';

const MOCK_MODAL_COPY = 'test modal copy';
const MOCK_MODAL_HEADER_TEXT = 'test modal header text';
const MOCK_MODAL_BANNER = 'test modal banner';
const MOCK_MODAL_DEFAULT_SLOT = 'test content';
const MOCK_MODAL_HEADER_SLOT = 'test header';
const MOCK_MODAL_BANNER_SLOT = 'title';

const baseProps: DtModalProps = {
  headerText: MOCK_MODAL_HEADER_TEXT,
  copy: MOCK_MODAL_COPY,
  bannerHeaderText: MOCK_MODAL_BANNER,
  open: true,
};

type Slots = Pick<DtModalProps, 'children' | 'header' | 'banner' | 'footer'>;

let mockProps: Partial<DtModalProps> = {};
let mockSlots: Slots = {};

// Vue Test Utils' flushPromises: lets pending microtasks and timers (the focus trap's, the initial focus) finish.
const flushPromises = () => act(() => new Promise<void>(resolve => { setTimeout(resolve, 0); }));

// Mock native <dialog> methods not supported in JSDOM
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

afterAll(() => {
  const proto = HTMLDialogElement.prototype as Partial<HTMLDialogElement>;
  delete proto.showModal;
  delete proto.show;
  delete proto.close;
});

describe('DtModal Tests', () => {
  let result: RenderResult;
  let closeBtn: HTMLElement | null;
  let srOnlyCloseBtn: HTMLElement | null;
  let copy: HTMLElement;
  let overlay: HTMLDialogElement;
  let title: HTMLElement | null;
  let banner: HTMLElement | null;

  // Vue's emitted('update:open') and emitted('keydown').
  const onOpenChange = vi.fn();
  const onKeyDown = vi.fn();

  const qa = (name: string) => document.body.querySelector<HTMLElement>(`[data-qa="${name}"]`);

  const element = (props: Partial<DtModalProps> = {}) => (
    <DtModal
      {...baseProps}
      {...mockProps}
      {...mockSlots}
      {...props}
      onOpenChange={onOpenChange}
      onKeyDown={onKeyDown}
    />
  );

  const findElements = () => {
    closeBtn = qa('dt-modal-close-button');
    srOnlyCloseBtn = qa('dt-sr-only-close-button');
    copy = qa('dt-modal-copy')!;
    overlay = qa('dt-modal') as HTMLDialogElement;
    title = qa('dt-modal-title');
    banner = qa('dt-modal-banner');
  };

  // Vue Test Utils stubs <transition>, so the Vue tests see the modal opened at once, without its after-enter
  // `update:open` (true). The port runs the real transition: let it finish, then forget that call.
  const updateWrapper = async () => {
    cleanup();
    result = render(element(), { container: document.body.appendChild(document.createElement('div')) });
    await finishTransitions();
    onOpenChange.mockClear();
    findElements();
  };

  // Vue's wrapper.setProps.
  const setProps = async (props: Partial<DtModalProps>) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(element());
    await finishTransitions();
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    cleanup();
    document.body.innerHTML = '';
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(overlay).toBeTruthy();
    });

    it('should render using a native dialog element', () => {
      expect(overlay.tagName).toBe('DIALOG');
    });

    it('should render the header text content', () => {
      expect(title).toBeTruthy();
      expect(title!.textContent).toEqual(MOCK_MODAL_HEADER_TEXT);
    });

    it('should render the banner content', () => {
      expect(banner).toBeTruthy();
      expect(banner!.textContent).toEqual(MOCK_MODAL_BANNER);
    });

    it('should render the copy content', () => {
      expect(copy).toBeTruthy();
      expect(copy.textContent).toEqual(MOCK_MODAL_COPY);
    });

    it('Close button is visible by default', () => {
      expect(closeBtn).toBeTruthy();
    });

    it('Should NOT contain a visually hidden close button', () => {
      expect(srOnlyCloseBtn).toBeNull();
    });

    it('Should set default banner kind when no kind is set', async () => {
      expect(banner!.classList.contains(MODAL_BANNER_KINDS.warning)).toBe(true);
    });

    it('Should open without entering the top layer when show is true', () => {
      expect(overlay.show).toHaveBeenCalled();
      expect(overlay.showModal).not.toHaveBeenCalled();
    });

    it('Should leave the page outside the dialog reachable while open', () => {
      // An application overlay rendered as a sibling of the dialog — a toast, or a
      // call notification with its own controls — has to stay interactive, which is
      // the whole reason this mode exists. Marking it inert would render it visible
      // but dead, which is the failure this asserts against.
      const overlaySurface = document.createElement('div');
      const action = document.createElement('button');
      overlaySurface.appendChild(action);
      overlay.parentNode!.appendChild(overlaySurface);

      expect(overlaySurface.inert).toBeFalsy();
      expect(action.inert).toBeFalsy();
      expect([...document.body.children].some(el => (el as HTMLElement).inert)).toBe(false);

      overlaySurface.remove();
    });

    it('Should not claim aria-modal when the page outside stays reachable', () => {
      // aria-modal="true" tells assistive technology to ignore everything outside
      // the dialog. Claiming it while the page is deliberately left reachable would
      // block screen reader users from the very overlays this mode exists to serve.
      expect(overlay.getAttribute('aria-modal')).toBeNull();
    });

    it('Should not close on Escape when a nested widget already handled it', async () => {
      // Models a dropdown or combobox inside the modal closing its own popup on
      // Escape: it calls preventDefault but lets the event keep bubbling.
      const nested = document.createElement('button');
      overlay.appendChild(nested);
      nested.addEventListener('keydown', event => event.preventDefault());

      const before = onOpenChange.mock.calls.length;
      nested.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      await flushPromises();

      expect(onOpenChange.mock.calls.length).toBe(before);
      nested.remove();
    });

    it('Should close on Escape even though the native cancel event does not fire', async () => {
      fireEvent.keyDown(overlay, { key: 'Escape' });

      expect(onOpenChange.mock.calls.at(-1)).toEqual([false]);
    });

    describe('When modal prop is true', () => {
      beforeEach(async () => {
        mockProps = { ...mockProps, modal: true };

        // The outer beforeEach already mounted a default (non-modal) instance, whose
        // show() call would otherwise still be recorded on the shared prototype mock.
        vi.clearAllMocks();
        await updateWrapper();
      });

      // Inertness is not asserted here: for a top-layer dialog the browser provides
      // it, and JSDOM implements neither the top layer nor its inertness.
      it('Should enter the top layer via showModal', () => {
        expect(overlay.showModal).toHaveBeenCalled();
        expect(overlay.show).not.toHaveBeenCalled();
      });

      it('Should claim aria-modal, since the browser does make the page inert', () => {
        expect(overlay.getAttribute('aria-modal')).toBe('true');
      });
    });

    describe('When fullscreen prop is true', () => {
      beforeEach(async () => {
        mockProps = { ...mockProps, fullscreen: true };

        await updateWrapper();
      });

      it('Should apply the fullscreen modifier class', () => {
        expect(overlay.classList.contains('d-modal--full')).toBe(true);
      });
    });

    describe('When fullscreen prop is false', () => {
      it('Should NOT apply the fullscreen modifier class', () => {
        expect(overlay.classList.contains('d-modal--full')).toBe(false);
      });
    });

    describe('When showClose prop is false', () => {
      beforeEach(async () => {
        mockProps = { ...mockProps, showClose: false };

        await updateWrapper();
      });

      it('Should hide close button', () => {
        expect(closeBtn).toBeNull();
      });

      it('Should contain a visually hidden close button', () => {
        expect(srOnlyCloseBtn).toBeTruthy();
      });
    });

    describe('When slots are provided', () => {
      it('Should display slotted header instead of headerText', async () => {
        mockSlots = {
          header: MOCK_MODAL_HEADER_SLOT,
        };

        await updateWrapper();

        expect(title!.textContent).toEqual(MOCK_MODAL_HEADER_SLOT);
      });

      it('Should display slotted banner instead of bannerHeaderText', async () => {
        mockSlots = {
          banner: MOCK_MODAL_BANNER_SLOT,
        };

        await updateWrapper();

        expect(banner!.textContent).toEqual(MOCK_MODAL_BANNER_SLOT);
      });

      it('Should display slotted content instead of copy', async () => {
        mockSlots = {
          children: MOCK_MODAL_DEFAULT_SLOT,
        };

        await updateWrapper();

        expect(copy.textContent).toEqual(MOCK_MODAL_DEFAULT_SLOT);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('Should emit a sync-able update event when overlay is clicked', async () => {
      expect(onOpenChange).not.toHaveBeenCalled();

      await userEvent.click(overlay);

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.calls[0][0]).toBe(false);
    });

    it('Should not close when drag starts inside dialog and ends on backdrop', async () => {
      // The click goes to the closest common ancestor of the press and the release: the dialog.
      await userEvent.pointer([
        { keys: '[MouseLeft>]', target: copy },
        { keys: '[/MouseLeft]', target: overlay },
      ]);

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('Should not close when drag starts on backdrop and ends inside dialog', async () => {
      await userEvent.pointer([
        { keys: '[MouseLeft>]', target: overlay },
        { keys: '[/MouseLeft]', target: copy },
      ]);

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('Should emit a sync-able update event when close-icon is clicked', async () => {
      expect(onOpenChange).not.toHaveBeenCalled();

      await userEvent.click(closeBtn!);

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.calls[0][0]).toBe(false);
    });

    it('Should emit a sync-able update event when cancel event fires (escape key)', async () => {
      expect(onOpenChange).not.toHaveBeenCalled();

      fireEvent(overlay, new Event('cancel', { cancelable: true }));

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.calls[0][0]).toBe(false);
    });

    it('Should emit keydown event to parent', async () => {
      fireEvent.keyDown(overlay, { code: 'Escape' });

      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe('Focus trapping', () => {
    beforeEach(async () => {
      mockSlots = {
        children: (
          <>
            <button data-qa="modal-trap-a">a</button>
            <button data-qa="modal-trap-b">b</button>
          </>
        ),
      };

      await updateWrapper();
    });

    it('keeps focus trapped inside the open dialog (Tab wraps from last to first)', async () => {
      await flushPromises();

      const focusables = getTabbableElements(overlay);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      last.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      overlay.dispatchEvent(tabEvent);

      // useFocusTrap wraps focus at the boundary and prevents Tab from escaping the dialog.
      expect(tabEvent.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(first);
    });

    it('wraps focus in reverse (Shift+Tab from the first element to the last)', async () => {
      await flushPromises();

      const focusables = getTabbableElements(overlay);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      first.focus();
      const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
      overlay.dispatchEvent(shiftTabEvent);

      expect(shiftTabEvent.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(last);
    });
  });

  describe('Extendability Tests', () => {
    it('Should pass content class through to root modal element', async () => {
      const modalClass = 'modal-class';

      expect(overlay.classList.contains(modalClass)).toBe(false);

      await setProps({ modalClass });

      expect(overlay.classList.contains(modalClass)).toBe(true);
    });

    it('Should not apply transparent-backdrop modifier by default', () => {
      expect(overlay.classList.contains('d-modal--transparent-backdrop')).toBe(false);
    });

    it('Should apply transparent-backdrop modifier when transparentBackdrop is true', async () => {
      await setProps({ transparentBackdrop: true });

      expect(overlay.classList.contains('d-modal--transparent-backdrop')).toBe(true);
    });

    it('Should pass content class through to content modal element', async () => {
      const contentClass = 'content-class';

      expect(copy.classList.contains(contentClass)).toBe(false);

      await setProps({ contentClass });

      expect(copy.classList.contains(contentClass)).toBe(true);
    });

    it('Should apply banner class', async () => {
      const bannerClass = 'banner-class';
      const bannerHeaderText = 'title';

      await setProps({
        open: true,
        bannerHeaderText,
        bannerClass,
      });

      banner = qa('dt-modal-banner');

      expect(banner!.classList.contains(bannerClass)).toBe(true);
    });

    it('Should apply header class to the header text element', async () => {
      const headerClass = 'header-class';

      expect(title!.classList.contains(headerClass)).toBe(false);

      await setProps({ headerClass });

      expect(title!.classList.contains(headerClass)).toBe(true);
    });

    it('Should apply banner kind', async () => {
      await setProps({
        open: true,
        bannerKind: 'info',
        bannerHeaderText: 'title',
      });

      banner = qa('dt-modal-banner');

      expect(banner!.classList.contains(MODAL_BANNER_KINDS.info)).toBe(true);
    });

    it('Should apply critical banner kind', async () => {
      // Vue's test also sets `show: true`, which isn't a DtModal prop.
      await setProps({
        bannerKind: 'critical',
        bannerHeaderText: 'title',
      });

      banner = qa('dt-modal-banner');

      expect(banner!.classList.contains(MODAL_BANNER_KINDS.critical)).toBe(true);
    });

    it('should set data-dt-mode on dialog when contentMode is set', async () => {
      document.documentElement.setAttribute('data-dt-mode', 'light');
      mockProps = { contentMode: 'dark' };
      await updateWrapper();

      const modal = qa('dt-modal')!;
      expect(modal.getAttribute('data-dt-mode')).toBe('dark');

      document.documentElement.removeAttribute('data-dt-mode');
    });

    describe('When rendered inside a shadow root', () => {
      let shadowHost: HTMLDivElement;
      let shadowRoot: ShadowRoot;
      let mountPoint: HTMLDivElement;

      beforeEach(async () => {
        cleanup();
        shadowHost = document.createElement('div');
        document.body.appendChild(shadowHost);
        shadowRoot = shadowHost.attachShadow({ mode: 'open' });

        mountPoint = document.createElement('div');
        shadowRoot.appendChild(mountPoint);

        result = render(element(), { container: mountPoint });

        await act(async () => {});
      });

      afterEach(() => {
        cleanup();
        shadowHost.remove();
      });

      it('should teleport the dialog into the shadow root', () => {
        const dialog = shadowRoot.querySelector('[data-qa="dt-modal"]');
        expect(dialog).not.toBeNull();
        // Into the shadow root itself, as Vue's Teleport does, rather than where it was rendered.
        expect(dialog!.parentNode).toBe(shadowRoot);
      });

      it('should not teleport into shadow root when appendTo prop is provided', async () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        target.id = 'custom-target';

        // Vue's wrapper.unmount(); cleanup() also lets Testing Library mount a new root in the same container.
        cleanup();
        result = render(<DtModal {...baseProps} appendTo="#custom-target" />, { container: mountPoint });

        await act(async () => {});

        expect(shadowRoot.querySelector('[data-qa="dt-modal"]')).toBeNull();
        expect(target.querySelector('[data-qa="dt-modal"]')).not.toBeNull();

        target.remove();
      });
    });
  });

  // React-only: what the Vue suite leaves to the real <transition>, which Vue Test Utils stubs.
  describe('Opening and closing', () => {
    it('reports the opened state once the enter transition ends', async () => {
      cleanup();
      render(element());
      expect(onOpenChange).not.toHaveBeenCalled();

      await finishTransitions();

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('focuses the first focusable element once opened', async () => {
      await flushPromises();

      expect(document.activeElement).toBe(closeBtn);
    });

    it('focuses the initialFocusElement selector once opened', async () => {
      mockSlots = { children: <input id="name-input" aria-label="Name" /> };
      mockProps = { initialFocusElement: '#name-input' };
      await updateWrapper();
      await flushPromises();

      expect(document.activeElement).toBe(document.getElementById('name-input'));
    });

    it('closes the dialog, restores scrolling and gives focus back once the leave transition ends', async () => {
      cleanup();
      const opener = document.body.appendChild(document.createElement('button'));
      opener.focus();
      mockProps = { open: false };
      result = render(element());
      await setProps({ open: true });
      await flushPromises();

      overlay = qa('dt-modal') as HTMLDialogElement;
      expect(overlay.open).toBe(true);
      expect(document.documentElement.classList.contains('d-of-hidden')).toBe(true);

      await setProps({ open: false });
      await flushPromises();

      expect(overlay.open).toBe(false);
      expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
      expect(document.activeElement).toBe(opener);
    });

    it('closes itself when uncontrolled', async () => {
      cleanup();
      render(<DtModal headerText="Uncontrolled" defaultOpen onOpenChange={onOpenChange} />);
      await finishTransitions();

      await userEvent.click(qa('dt-modal-close-button')!);
      await finishTransitions();

      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      expect((qa('dt-modal') as HTMLDialogElement).open).toBe(false);
    });

    it('closes an open dialog and restores scrolling when unmounted', async () => {
      expect(overlay.open).toBe(true);

      result.unmount();

      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
      expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
    });
  });
});
