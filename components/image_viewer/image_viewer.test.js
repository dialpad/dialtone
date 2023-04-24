import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtButton from '../button/button.vue';
import DtImageViewer from './image_viewer.vue';

// Constants
const basePropsData = {
  imageSrc: 'test.png',
  imageAlt: 'imageAltText',
  closeAriaLabel: 'closeButtonAriaLabel',
  imageButtonClass: 'd-wmn64 d-hmn64 w-wmx332 d-hmx332',
  ariaLabel: 'Click to open image',
};

describe('DtImageViewer Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let imageViewerPreview;
  let imageViewerFull;
  let closeButton;
  let previewImage;
  let fullImage;
  let overlay;

  // Environment
  let propsData = basePropsData;
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
    wrapper = shallowMount(DtImageViewer, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: testContext.localVue,
      stubs: {
        DtButton,
      },
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });
  afterAll(() => {
  });

  describe('Presentation Tests', () => {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

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
    /*
     * Test(s) to ensure that the component is accessible
     */

    describe('When image has not been clicked', () => {
      it('should have an aria labels', () => {
        expect(previewImage.attributes('alt')).toBe(propsData.imageAlt);
        expect(imageViewerPreview.attributes('aria-label')).toBe(propsData.ariaLabel);
      });
    });

    describe('After the image is open', () => {
      beforeEach(async () => {
        await _openModal();
      });

      it('should have an aria labels', () => {
        expect(fullImage.attributes('alt')).toBe(propsData.imageAlt);
        expect(closeButton.attributes('aria-label')).toBe(propsData.closeAriaLabel);
      });
    });
  });

  describe('Interactivity Tests', () => {
    /*
     * Test(s) to ensure that the component correctly handles user input
     */

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

  // No Validation tests
  // No Extendability tests
});
