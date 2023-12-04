import { config, mount } from '@vue/test-utils';
import DtCollapsible from './collapsible.vue';

const MOCK_CONTENT_SLOT = '<div data-qa="content-element"> Test Text </div>';

const baseProps = {
  anchorText: 'anchor text',
};
const baseSlots = {
  content: MOCK_CONTENT_SLOT,
};

let mockProps = {};
let mockSlots = {};

describe('DtCollapsible Tests', () => {
  let wrapper;
  let contentElement;
  let contentWrapperElement;
  let anchorElement;

  const updateWrapper = () => {
    wrapper = mount(DtCollapsible, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      attachTo: document.body,
    });

    anchorElement = wrapper.find('[data-qa="dt-button"]');
    contentElement = wrapper.find('[data-qa="content-element"]');
    contentWrapperElement = wrapper.getComponent('[data-qa="dt-collapsible--content"]');
  };

  beforeAll(() => {
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
    config.global.renderStubDefaultSlot = true;
  });

  afterAll(() => {
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
    config.global.renderStubDefaultSlot = false;
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Test default rendering', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the anchor', () => {
      expect(anchorElement.exists()).toBeTruthy();
    });

    it('should render the content', () => {
      expect(contentElement.exists()).toBeTruthy();
    });
  });

  describe('When scoped slot is provided', () => {
    it('should render the scoped slot', () => {
      expect(anchorElement.exists()).toBeTruthy();
    });
  });

  describe('Test open prop undefined', () => {
    it('content should be expanded by default', () => {
      expect(contentElement.isVisible()).toBe(true);
    });

    it('should toggle the content when clicked', async () => {
      await anchorElement.trigger('click');

      expect(contentElement.isVisible()).toBe(false);
    });
  });

  describe('Test open prop defined', () => {
    describe('Test open prop set to true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: true });
      });

      it('content is expanded', () => {
        expect(contentElement.isVisible()).toBe(true);
      });

      it('clicking does not collapse content', async () => {
        await anchorElement.trigger('click');

        expect(contentElement.isVisible()).toBe(true);
      });

      it('updating open prop does collapse content', async () => {
        await wrapper.setProps({ open: false });

        expect(contentElement.isVisible()).toBe(false);
      });
    });

    describe('Test open prop set to false', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
      });

      it('content starts collapsed', () => {
        expect(contentElement.isVisible()).toBe(false);
      });

      it('clicking does not expand content', async () => {
        await anchorElement.trigger('click');

        expect(contentElement.isVisible()).toBe(false);
      });

      it('updating open prop does collapse content', async () => {
        await wrapper.setProps({ open: true });

        expect(contentElement.isVisible()).toBe(true);
      });
    });
  });

  describe('If anchor text and anchor slot content are falsy', () => {
    it('should output error message', async () => {
      let consoleErrorSpy = vi.spyOn(console, 'error').mockClear();

      mockProps = { anchorText: undefined };

      updateWrapper();

      expect(consoleErrorSpy).toHaveBeenCalledWith('anchor text and anchor slot content cannot both be falsy');

      consoleErrorSpy = null;

      console.error.mockRestore();
    });
  });

  describe('Accessibility Tests', () => {
    describe('Content is expanded', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: true, id: 'contentId' });
      });

      it('aria-controls on anchor should be set to the id of the contentWrapper', () => {
        expect(anchorElement.attributes('aria-controls')).toBe('contentId');
        expect(contentWrapperElement.attributes('id')).toBe('contentId');
      });

      it('aria-expanded should be true', () => {
        expect(anchorElement.attributes('aria-expanded')).toBe('true');
      });
    });

    describe('Content is collapsed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
      });

      it('aria-expanded should be "false"', () => {
        expect(anchorElement.attributes('aria-expanded')).toBe('false');
      });
    });
  });
});
