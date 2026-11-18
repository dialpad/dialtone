import { act, cleanup, fireEvent, render, waitFor, within, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtImageViewer, type DtImageViewerProps } from './ImageViewer';

const baseProps: DtImageViewerProps = {
  imageSrc: 'test.png',
  imageAlt: 'imageAltText',
  imageButtonClass: 'd-wmn-100 d-hmn-100 w-wmx332 d-hmx332',
  ariaLabel: 'Click to open image',
};

let mockProps: Partial<DtImageViewerProps> = {};

// Vue Test Utils' flushPromises: lets the focus trap's microtask finish.
const flushPromises = () => act(() => new Promise<void>(resolve => { setTimeout(resolve, 0); }));

// The modal is portalled, so it's looked up from the document rather than from the render's container.
const qa = (name: string) => document.body.querySelector<HTMLElement>(`[data-qa="${name}"]`);

describe('DtImageViewer Tests', () => {
  let result: RenderResult;
  let imageViewerPreview: HTMLElement;
  let imageViewerFull: HTMLElement | null;
  let closeButton: HTMLElement | null;
  let previewImage: HTMLElement;
  let fullImage: HTMLElement | null | undefined;
  let overlay: HTMLElement | null;

  const updateWrapper = () => {
    result = render(<DtImageViewer {...baseProps} {...mockProps} />);

    imageViewerPreview = qa('dt-image-viewer-preview')!;
    previewImage = imageViewerPreview.querySelector('img')!;
  };

  beforeEach(() => {
    updateWrapper();
  });

  // Nodes appended straight to document.body, which cleanup() doesn't remove; removed even when a test fails.
  const fixtures: HTMLElement[] = [];
  const addFixture = <T extends HTMLElement>(el: T): T => {
    document.body.appendChild(el);
    fixtures.push(el);
    return el;
  };

  afterEach(() => {
    cleanup();
    fixtures.splice(0).forEach(el => el.remove());
    mockProps = {};
  });

  const _openModal = async () => {
    await userEvent.click(imageViewerPreview);

    imageViewerFull = qa('dt-image-viewer-full');
    fullImage = imageViewerFull?.querySelector('img');
    closeButton = qa('dt-image-viewer-close-btn');
    overlay = qa('dt-modal');
  };

  describe('Presentation Tests', () => {
    describe('Viewing the image as a preview', () => {
      it('should render the component', () => {
        expect(result.container.firstElementChild).toBeTruthy();
      });

      it('Should display the image in a preview form', () => {
        expect(imageViewerPreview).toBeTruthy();
        expect(previewImage).toBeTruthy();
      });
    });

    describe('Viewing the image in full screen modal', () => {
      beforeEach(async () => {
        await _openModal();
      });

      it('Should show the image and a close button', () => {
        expect(fullImage).toBeTruthy();
        expect(imageViewerPreview).toBeTruthy();
        expect(closeButton).toBeTruthy();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When image has not been clicked', () => {
      it('should have an aria labels', () => {
        expect(previewImage.getAttribute('alt')).toBe(baseProps.imageAlt);
        expect(imageViewerPreview.getAttribute('aria-label')).toBe(baseProps.ariaLabel);
      });
    });

    describe('After the image is open', () => {
      it('should have an aria labels', async () => {
        await _openModal();

        expect(fullImage!.getAttribute('alt')).toBe(baseProps.imageAlt);
      });
    });
  });

  describe('Focus trapping', () => {
    it('keeps focus trapped inside the open modal (Tab is intercepted)', async () => {
      await _openModal();
      await flushPromises();

      const closeEl = qa('dt-image-viewer-close-btn')!;
      closeEl.focus();
      expect(document.activeElement).toBe(closeEl);

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      overlay!.dispatchEvent(tabEvent);

      // The focus trap intercepts Tab at the boundary so focus cannot escape the modal.
      expect(tabEvent.defaultPrevented).toBe(true);
    });

    it('moves focus to the visible close button when focusing the sr-only one swaps them', async () => {
      await _openModal();
      await flushPromises();

      // Focus leaving the visible close button swaps it for the sr-only one.
      act(() => { (document.activeElement as HTMLElement).blur(); });
      fireEvent.mouseLeave(qa('dt-modal')!);
      await finishTransitions();
      const srOnly = qa('dt-sr-only-close-button')!;
      expect(srOnly).toBeTruthy();

      // Focusing it brings the visible button back and unmounts the sr-only one.
      act(() => { srOnly.focus(); });
      await finishTransitions();

      expect(qa('dt-sr-only-close-button')).toBeNull();
      expect(document.activeElement).toBe(qa('dt-image-viewer-close-btn'));
    });

    it('keeps focus inside the modal when the pointer leaves while the visible close button has focus', async () => {
      await _openModal();
      await flushPromises();
      expect(document.activeElement).toBe(qa('dt-image-viewer-close-btn'));

      fireEvent.mouseLeave(qa('dt-modal')!);
      await finishTransitions();

      expect(document.activeElement).toBe(qa('dt-image-viewer-close-btn'));
      expect(overlay!.contains(document.activeElement)).toBe(true);
    });

    it('focuses the visible close button when a controlled viewer reopens after its button was hidden', async () => {
      const local = render(<DtImageViewer {...baseProps} open={true} />);
      await flushPromises();
      act(() => { (document.activeElement as HTMLElement).blur(); });
      await finishTransitions();
      expect(qa('dt-image-viewer-close-btn')).toBeNull();

      local.rerender(<DtImageViewer {...baseProps} open={false} />);
      local.rerender(<DtImageViewer {...baseProps} open={true} />);
      await flushPromises();
      await finishTransitions();

      expect(document.activeElement).toBe(qa('dt-image-viewer-close-btn'));
      local.unmount();
    });

    it('restores focus to the previously focused element when an open viewer unmounts', async () => {
      const outside = addFixture(document.createElement('button'));
      outside.focus();
      const result = render(<DtImageViewer {...baseProps} open={true} />);
      await flushPromises();
      expect(document.activeElement).not.toBe(outside);

      result.unmount();

      expect(document.activeElement).toBe(outside);
    });
  });

  describe('Interactivity Tests', () => {
    describe('As an image preview', () => {
      it('should open on click', async () => {
        await _openModal();

        expect(fullImage).toBeTruthy();
      });
    });

    describe('After the image is open', () => {
      beforeEach(async () => {
        await _openModal();
      });

      it('Should close the image when I press close', async () => {
        expect(imageViewerFull).toBeTruthy();

        await userEvent.click(closeButton!);

        imageViewerFull = qa('dt-image-viewer-full');

        expect(imageViewerFull).toBeNull();
      });

      it('Should close the image when I press the background', async () => {
        expect(imageViewerFull).toBeTruthy();

        await userEvent.click(overlay!);

        imageViewerFull = qa('dt-image-viewer-full');

        expect(imageViewerFull).toBeNull();
      });

      it('Should close the image when I press esc', async () => {
        expect(imageViewerFull).toBeTruthy();

        // Vue's test sends the legacy 'Esc'.
        const notCancelled = fireEvent.keyDown(imageViewerFull!, { code: 'Esc' });

        imageViewerFull = qa('dt-image-viewer-full');

        expect(imageViewerFull).toBeNull();
        // The handled Escape is consumed so an ancestor <dialog> doesn't close with it.
        expect(notCancelled).toBe(false);
      });

      it('Should close the image when I press esc with the standard Escape code', async () => {
        expect(imageViewerFull).toBeTruthy();

        fireEvent.keyDown(imageViewerFull!, { code: 'Escape' });

        expect(qa('dt-image-viewer-full')).toBeNull();
      });
    });
  });

  describe('appendTo behavior', () => {
    // These tests render into their own containers to observe where the viewer actually lands in the DOM.
    describe('when anchor is inside a <dialog> element and appendTo is "body"', () => {
      it('resolves to the dialog element, not document.body', async () => {
        const dialogEl = addFixture(document.createElement('dialog'));

        render(<DtImageViewer {...baseProps} />, { container: dialogEl });

        // A closed <dialog> is inaccessible, so its button only shows up with `hidden`.
        await userEvent.click(within(dialogEl).getByRole('button', { hidden: true }));

        expect(dialogEl.querySelector('[data-qa="dt-modal"]')).not.toBeNull();
        expect(document.body.querySelector('[data-qa="dt-modal"]')?.parentElement).toBe(dialogEl);
      });

      it('resolves to the dialog even when open=true is already set on mount', () => {
        // Regression: the target must be resolved once the preview button is mounted, not while rendering, when
        // there is no button yet to find the dialog from.
        const dialogEl = addFixture(document.createElement('dialog'));

        render(<DtImageViewer {...baseProps} open />, { container: dialogEl });

        expect(document.body.querySelector('[data-qa="dt-modal"]')?.parentElement).toBe(dialogEl);
      });
    });

    describe('when anchor is NOT inside a <dialog> element and appendTo is "body"', () => {
      it('resolves to document.body', async () => {
        await userEvent.click(imageViewerPreview);

        expect(document.body.querySelector('[data-qa="dt-modal"]')?.parentElement).toBe(document.body);
      });
    });

    describe('when anchor is inside a <dialog> but appendTo is explicitly set', () => {
      it('uses the explicit appendTo target, bypassing dialog detection', async () => {
        const dialogEl = document.createElement('dialog');
        const customTarget = document.createElement('div');
        customTarget.id = 'custom-target';
        // React's root empties its container, so the viewer gets a container of its own beside the target.
        const host = document.createElement('div');
        dialogEl.appendChild(customTarget);
        dialogEl.appendChild(host);
        addFixture(dialogEl);

        render(<DtImageViewer {...baseProps} appendTo="#custom-target" />, { container: host });

        await userEvent.click(within(dialogEl).getByRole('button', { hidden: true }));

        expect(document.body.querySelector('[data-qa="dt-modal"]')?.parentElement).toBe(customTarget);
      });
    });

    describe('when appendTo is an explicit HTMLElement', () => {
      it('declares appendTo as accepting HTMLElement, matching its documented contract', () => {
        // The type is the contract: a DOM node typechecks as appendTo, and a node that isn't a string selector works.
        const customTarget = document.createElement('div');
        const appendTo: DtImageViewerProps['appendTo'] = customTarget;

        const local = render(<DtImageViewer {...baseProps} appendTo={appendTo} open />);

        expect(customTarget.querySelector('[data-qa="dt-modal"]')).not.toBeNull();
        local.unmount();
      });

      it('teleports into the given DOM node', async () => {
        const customTarget = addFixture(document.createElement('div'));

        const local = render(<DtImageViewer {...baseProps} appendTo={customTarget} />);

        await userEvent.click(within(local.container).getByRole('button'));

        expect(customTarget.querySelector('[data-qa="dt-modal"]')).not.toBeNull();
      });
    });

    describe('when appendTo changes after mount', () => {
      it('renders the viewer as a direct child of document.body initially', async () => {
        await userEvent.click(imageViewerPreview);

        expect(document.body.querySelector('[data-qa="dt-modal"]')?.parentElement).toBe(document.body);
      });

      it('moves the viewer into the new target when appendTo changes', async () => {
        const customTarget = document.createElement('div');
        customTarget.id = 'custom-target-2';
        addFixture(customTarget);

        await userEvent.click(imageViewerPreview);
        result.rerender(<DtImageViewer {...baseProps} appendTo="#custom-target-2" />);

        await waitFor(() => expect(customTarget.querySelector('[data-qa="dt-modal"]')).not.toBeNull());
      });

      it('resolves a selector for a target mounted in the same update that opens the viewer', () => {
        const Parent = ({ open }: { open: boolean }) => (
          <>
            {open && <div id="late-target" />}
            <DtImageViewer {...baseProps} open={open} appendTo="#late-target" />
          </>
        );
        const local = render(<Parent open={false} />);

        local.rerender(<Parent open={true} />);

        expect(document.querySelector('#late-target [data-qa="dt-modal"]')).not.toBeNull();
      });
    });
  });
});
