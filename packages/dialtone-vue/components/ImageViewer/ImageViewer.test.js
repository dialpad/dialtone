import { mount } from '@vue/test-utils';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';
import { flushPromises } from '@/common/utils';
import DtImageViewer from './ImageViewer.vue';

const baseProps = {
  imageSrc: 'test.png',
  imageAlt: 'imageAltText',
  imageButtonClass: 'd-wmn-100 d-hmn-100 w-wmx332 d-hmx332',
  ariaLabel: 'Click to open image',
};

let mockProps = {};

describe('DtImageViewer Tests', () => {
  let wrapper;
  let imageViewerPreview;
  let imageViewerFull;
  let closeButton;
  let previewImage;
  let fullImage;
  let overlay;

  const updateWrapper = () => {
    wrapper = mount(DtImageViewer, {
      props: { ...baseProps, ...mockProps },
      global: {
        plugins: [DtFocustrapDirective],
        stubs: {
          teleport: true,
        },
      },
      attachTo: document.body,
    });

    imageViewerPreview = wrapper.find('[data-qa="dt-image-viewer-preview"]');
    previewImage = imageViewerPreview.find('img');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
    mockProps = {};
  });

  const _openModal = async () => {
    await imageViewerPreview.trigger('click');

    imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');
    fullImage = imageViewerFull.find('img');
    closeButton = wrapper.find('[data-qa="dt-image-viewer-close-btn"]');
    overlay = wrapper.find('[data-qa="dt-modal"]');
  };

  describe('Presentation Tests', () => {
    describe('Viewing the image as a preview', () => {
      it('should render the component', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('Should display the image in a preview form', () => {
        expect(imageViewerPreview.exists()).toBeTruthy();
        expect(previewImage.exists()).toBeTruthy();
      });
    });

    describe('Viewing the image in full screen modal', () => {
      beforeEach(async () => {
        await _openModal();
      });

      it('Should show the image and a close button', () => {
        expect(fullImage.exists()).toBeTruthy();
        expect(imageViewerPreview.exists()).toBeTruthy();
        expect(closeButton.exists()).toBeTruthy();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When image has not been clicked', () => {
      it('should have an aria labels', () => {
        expect(previewImage.attributes('alt')).toBe(baseProps.imageAlt);
        expect(imageViewerPreview.attributes('aria-label')).toBe(baseProps.ariaLabel);
      });
    });

    describe('After the image is open', () => {
      it('should have an aria labels', async () => {
        await _openModal();

        expect(fullImage.attributes('alt')).toBe(baseProps.imageAlt);
      });
    });
  });

  describe('Focus trapping', () => {
    it('keeps focus trapped inside the open modal (Tab is intercepted)', async () => {
      await _openModal();
      await flushPromises();

      const closeEl = wrapper.find('[data-qa="dt-image-viewer-close-btn"]').element;
      closeEl.focus();
      expect(document.activeElement).toBe(closeEl);

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      overlay.element.dispatchEvent(tabEvent);

      // v-dt-focustrap intercepts Tab at the boundary so focus cannot escape the modal.
      expect(tabEvent.defaultPrevented).toBe(true);
    });
  });

  describe('Interactivity Tests', () => {
    describe('As an image preview', () => {
      it('should open on click', async () => {
        await _openModal();

        expect(fullImage.exists()).toBeTruthy();
      });
    });

    describe('After the image is open', () => {
      beforeEach(async () => {
        await _openModal();
      });

      it('Should close the image when I press close', async () => {
        expect(imageViewerFull.exists()).toBeTruthy();

        await closeButton.trigger('click');

        imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');

        expect(imageViewerFull.exists()).toBe(false);
      });

      it('Should close the image when I press the background', async () => {
        expect(imageViewerFull.exists()).toBeTruthy();

        await overlay.trigger('click');

        imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');

        expect(imageViewerFull.exists()).toBe(false);
      });

      it('Should close the image when I press esc', async () => {
        expect(imageViewerFull.exists()).toBeTruthy();

        await imageViewerFull.trigger('keydown', {
          code: 'Esc',
        });

        imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');

        expect(imageViewerFull.exists()).toBe(false);
      });
    });
  });

  describe('appendTo behavior', () => {
    // These tests need the real Teleport (not the module-level `teleport: true` stub)
    // to observe where the viewer actually lands in the DOM.
    describe('when anchor is inside a <dialog> element and appendTo is "body"', () => {
      it('resolves to the dialog element, not document.body', async () => {
        const dialogEl = document.createElement('dialog');
        document.body.appendChild(dialogEl);

        const localWrapper = mount(DtImageViewer, {
          props: { ...baseProps },
          global: { plugins: [DtFocustrapDirective] },
          attachTo: dialogEl,
        });

        await localWrapper.find('[data-qa="dt-image-viewer-preview"]').trigger('click');

        expect(localWrapper.vm.resolvedAppendToTarget).toBe(dialogEl);
        expect(dialogEl.querySelector('[data-qa="dt-modal"]')).not.toBeNull();

        localWrapper.unmount();
        document.body.removeChild(dialogEl);
      });

      it('resolves to the dialog even when open=true is already set on mount', () => {
        // Regression: resolvedAppendToTarget must be resolved in mounted() and stored in
        // reactive data, not computed from $refs — a computed reading $refs directly would
        // evaluate before the ref is assigned and permanently cache the wrong target.
        const dialogEl = document.createElement('dialog');
        document.body.appendChild(dialogEl);

        const localWrapper = mount(DtImageViewer, {
          props: { ...baseProps, open: true },
          global: { plugins: [DtFocustrapDirective] },
          attachTo: dialogEl,
        });

        expect(localWrapper.vm.resolvedAppendToTarget).toBe(dialogEl);

        localWrapper.unmount();
        document.body.removeChild(dialogEl);
      });
    });

    describe('when anchor is NOT inside a <dialog> element and appendTo is "body"', () => {
      it('resolves to document.body', async () => {
        const localWrapper = mount(DtImageViewer, {
          props: { ...baseProps },
          global: { plugins: [DtFocustrapDirective] },
          attachTo: document.body,
        });

        await localWrapper.find('[data-qa="dt-image-viewer-preview"]').trigger('click');

        expect(localWrapper.vm.resolvedAppendToTarget).toBe(document.body);

        localWrapper.unmount();
      });
    });

    describe('when anchor is inside a <dialog> but appendTo is explicitly set', () => {
      it('uses the explicit appendTo target, bypassing dialog detection', async () => {
        const dialogEl = document.createElement('dialog');
        const customTarget = document.createElement('div');
        customTarget.id = 'custom-target';
        dialogEl.appendChild(customTarget);
        document.body.appendChild(dialogEl);

        const localWrapper = mount(DtImageViewer, {
          props: { ...baseProps, appendTo: '#custom-target' },
          global: { plugins: [DtFocustrapDirective] },
          attachTo: dialogEl,
        });

        await localWrapper.find('[data-qa="dt-image-viewer-preview"]').trigger('click');

        expect(localWrapper.vm.resolvedAppendToTarget).toBe('#custom-target');

        localWrapper.unmount();
        document.body.removeChild(dialogEl);
      });
    });
  });
});
