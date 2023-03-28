import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtImageViewer from './image_viewer.vue';

// Constants
const baseProps = {
  imageSrc: 'test.png',
  imageAlt: 'imageAltText',
  closeAriaLabel: 'closeButtonAriaLabel',
  imageButtonClass: 'd-wmn64 d-hmn64 w-wmx332 d-hmx332',
  ariaLabel: 'Click to open image',
};

describe('DtImageViewer Tests', function () {
  // Wrappers
  let wrapper;
  let imageViewerPreview;
  let imageViewerFull;
  let closeButton;
  let previewImage;
  let fullImage;
  let overlay;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    imageViewerPreview = wrapper.find('[data-qa="dt-image-viewer-preview"]');
    previewImage = imageViewerPreview.find('img');
  };

  const _openModal = async () => {
    await imageViewerPreview.trigger('click');
    _setFullImageChildWrappers();
  };

  const _setFullImageChildWrappers = () => {
    imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');
    fullImage = imageViewerFull.find('img');
    closeButton = wrapper.find('[data-qa="dt-image-viewer-close-btn"');
    overlay = wrapper.find('[data-qa="dt-modal"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtImageViewer, {
      props,
      attrs,
      slots,
      provide,
      global: {
        stubs: {
          teleport: true,
        },
      },
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  // Setup
  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
  });
  after(function () {
  });

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('Viewing the image as a preview', function () {
      it('should render the component', function () {
        assert.exists(wrapper);
      });

      it('Should display the image in a preview form', function () {
        assert.exists(imageViewerPreview);
        assert.exists(previewImage);
      });
    });

    describe('Viewing the image in full screen modal', function () {
      beforeEach(async function () {
        await _openModal();
      });

      it('Should show the image and a close button', function () {
        assert.exists(fullImage);
        assert.exists(imageViewerFull.find('img'));
        assert.exists(closeButton);
      });
    });
  });

  describe('Accessibility Tests', function () {
    /*
     * Test(s) to ensure that the component is accessible
     */

    describe('When image has not been clicked', function () {
      it('should have an aria labels', function () {
        assert.strictEqual(previewImage.attributes('alt'), baseProps.imageAlt);
        assert.strictEqual(imageViewerPreview.attributes('aria-label'), baseProps.ariaLabel);
      });
    });

    describe('After the image is open', function () {
      beforeEach(async function () {
        await _openModal();
      });

      it('should have an aria labels', function () {
        assert.strictEqual(fullImage.attributes('alt'), baseProps.imageAlt);
        assert.strictEqual(closeButton.attributes('aria-label'), baseProps.closeAriaLabel);
      });
    });
  });

  describe('Interactivity Tests', function () {
    /*
     * Test(s) to ensure that the component correctly handles user input
     */

    describe('As an image preview', function () {
      it('should open on click', async function () {
        await _openModal();
        assert.exists(fullImage);
      });
    });

    describe('After the image is open', function () {
      beforeEach(async function () {
        await _openModal();
      });

      it('Should close the image when I press close', async function () {
        assert.exists(imageViewerFull);

        await closeButton.trigger('click');
        imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');
        assert.isFalse(imageViewerFull.exists());
      });

      it('Should close the image when I press the background', async function () {
        assert.exists(imageViewerFull);

        await overlay.trigger('click');

        imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');

        assert.isFalse(imageViewerFull.exists());
      });

      it('Should close the image when I press esc', async function () {
        assert.exists(imageViewerFull);

        await imageViewerFull.trigger('keydown', {
          code: 'Esc',
        });

        imageViewerFull = wrapper.find('[data-qa="dt-image-viewer-full"]');

        assert.isFalse(imageViewerFull.exists());
      });
    });
  });

  // No Validation tests
  // No Extendability tests
});
