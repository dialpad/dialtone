import { mount } from '@vue/test-utils';
import DtCard from './card.vue';

// Constants
const content = '<div data-qa="content-element"> card content </div>';
const header = '<div data-qa="header-element"> card header </div>';
const footer = '<div data-qa="footer-element"> card footer </div>';

describe('DtCard Tests', () => {
  // Wrappers
  let wrapper;
  let contentElement;
  let headerElement;
  let footerElement;

  // Environment
  const slots = { content, header, footer };

  const _clearChildWrappers = () => {
    contentElement = undefined;
    headerElement = undefined;
    footerElement = undefined;
  };

  const _setChildWrappers = () => {
    contentElement = wrapper.find('[data-qa="content-element"]');
    headerElement = wrapper.find('[data-qa="header-element"]');
    footerElement = wrapper.find('[data-qa="footer-element"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtCard, {
      slots,
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  beforeEach(() => {
    _mountWrapper();
  });

  afterEach(async () => {
    _clearChildWrappers();
  });

  describe('Test default rendering', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the header', () => {
      expect(headerElement.exists()).toBeTruthy();
    });

    it('should render the content', () => {
      expect(contentElement.exists()).toBeTruthy();
    });

    it('should render the footer', () => {
      expect(footerElement.exists()).toBeTruthy();
    });
  });
});
