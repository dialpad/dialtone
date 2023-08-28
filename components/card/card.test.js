import { mount } from '@vue/test-utils';
import DtCard from './card.vue';

const MOCK_CONTENT = '<div data-qa="content-element"> card content </div>';
const MOCK_HEADER = '<div data-qa="header-element"> card header </div>';
const MOCK_FOOTER = '<div data-qa="footer-element"> card footer </div>';

const baseSlots = {
  content: MOCK_CONTENT,
  header: MOCK_HEADER,
  footer: MOCK_FOOTER,
};

let mockSlots = {};
describe('DtCard Tests', () => {
  let wrapper;
  let contentElement;
  let headerElement;
  let footerElement;

  const updateWrapper = () => {
    wrapper = mount(DtCard, {
      slots: { ...baseSlots, ...mockSlots },
      attachTo: document.body,
    });

    contentElement = wrapper.find('[data-qa="content-element"]');
    headerElement = wrapper.find('[data-qa="header-element"]');
    footerElement = wrapper.find('[data-qa="footer-element"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockSlots = {};
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
