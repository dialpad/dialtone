import { mount } from '@vue/test-utils';
import DtRootLayout from './root_layout.vue';
import { ROOT_LAYOUT_SIDEBAR_POSITIONS } from '@/components/root_layout/root_layout_constants';

const baseProps = {
};

const baseSlots = {
  header: 'header slot content',
  footer: 'footer slot content',
  sidebar: 'sidebar slot content',
  default: 'content slot content',
};

let mockProps = {};
let mockSlots = {};

describe('DtRootLayout Tests', () => {
  let wrapper;
  let header;
  let footer;
  let body;
  let sidebar;
  let content;

  const updateWrapper = () => {
    wrapper = mount(DtRootLayout, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    header = wrapper.find('[data-qa="dt-root-layout-header"]');
    footer = wrapper.find('[data-qa="dt-root-layout-footer"]');
    body = wrapper.find('[data-qa="dt-root-layout-body"]');
    sidebar = wrapper.find('[data-qa="dt-root-layout-sidebar"]');
    content = wrapper.find('[data-qa="dt-root-layout-content"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When root layout renders', () => {
      it('root should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('header should exist', () => {
        expect(header.exists()).toBe(true);
      });

      it('footer should exist', () => {
        expect(footer.exists()).toBe(true);
      });

      it('sidebar should exist', () => {
        expect(sidebar.exists()).toBe(true);
      });

      it('content should exist', () => {
        expect(content.exists()).toBe(true);
      });
    });

    describe('When slot content renders', () => {
      it('header slot is passed down correctly', () => {
        expect(header.text()).toBe(baseSlots.header);
      });

      it('footer slot is passed down correctly', () => {
        expect(footer.text()).toBe(baseSlots.footer);
      });

      it('sidebar slot is passed down correctly', () => {
        expect(sidebar.text()).toBe(baseSlots.sidebar);
      });

      it('content slot is passed down correctly', () => {
        expect(content.text()).toBe(baseSlots.default);
      });
    });

    describe('When headerSticky is set to default', () => {
      it('Has correct class', () => {
        expect(header.classes('d-root-layout__header--sticky')).toBe(false);
      });
    });

    describe('When headerSticky is set to true', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ headerSticky: true });

        expect(header.classes('d-root-layout__header--sticky')).toBe(true);
      });
    });

    describe('When sidebarPosition is set to left', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.LEFT });

        expect(body.classes('d-root-layout__body--invert')).toBe(false);
      });
    });
    describe('When sidebarPosition is set to right', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.LEFT });

        expect(body.classes('d-root-layout__body--invert')).toBe(false);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When header is rendered', () => {
      it('Uses `header` tag', () => {
        expect(header.element.tagName).toBe('HEADER');
      });
    });

    describe('When footer is rendered', () => {
      it('Uses `footer` tag', () => {
        expect(footer.element.tagName).toBe('FOOTER');
      });
    });

    describe('When sidebar is rendered', () => {
      it('Uses `aside` tag', () => {
        expect(sidebar.element.tagName).toBe('ASIDE');
      });
    });

    describe('When content is rendered', () => {
      it('Uses `main` tag', () => {
        expect(content.element.tagName).toBe('MAIN');
      });
    });
  });
});
