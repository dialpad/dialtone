import { shallowMount } from '@vue/test-utils';
import DtRootLayoutBody from './root_layout_body.vue';
import { ROOT_LAYOUT_SIDEBAR_POSITIONS } from '@/components/root_layout/root_layout_constants';

// Constants
const baseProps = {
  sidebarWidth: '256px',
};

const baseSlotsData = {
  sidebar: 'sidebar slot content',
  content: 'content slot content',
};

describe('DtRootLayoutBody Tests', () => {
  // Wrappers
  let wrapper;

  let body;
  let sidebar;
  let content;

  // Environment
  let props = baseProps;
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    body = wrapper.find('[data-qa="dt-root-layout-body"]');
    sidebar = wrapper.find('[data-qa="dt-root-layout-sidebar"]');
    content = wrapper.find('[data-qa="dt-root-layout-content"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRootLayoutBody, {
      props,
      slots,
    });
    _setChildWrappers();
  };

  // Setup

  // Teardown
  afterEach(() => {
    props = baseProps;
    slots = baseSlotsData;
  });

  describe('Presentation Tests', () => {
    describe('When root layout body renders', () => {
      beforeEach(() => { _setWrappers(); });

      it('root should exist', () => { expect(wrapper.exists()).toBe(true); });
      it('body should exist', () => { expect(body.exists()).toBe(true); });
      it('sidebar should exist', () => { expect(sidebar.exists()).toBe(true); });
      it('content should exist', () => { expect(content.exists()).toBe(true); });
    });

    describe('When slot content renders', () => {
      it('sidebar slot is passed down correctly', async () => {
        expect(sidebar.text()).toBe(slots.sidebar);
      });

      it('content slot is passed down correctly', async () => {
        expect(content.text()).toBe(slots.content);
      });
    });

    describe('When dynamic inline styles are set', () => {
      beforeEach(() => { _setWrappers(); });

      it('should set the sidebar width', () => {
        expect(sidebar.element.style.getPropertyValue('flex-basis')).toBe(props.sidebarWidth);
      });
    });

    const itBehavesLikeExcludesBodyInvertClass = () => {
      it('Has correct class', async () => {
        expect(body.classes('d-root-layout__body--invert')).toBe(false);
      });
    };

    describe('When sidebarPosition is set to default', () => {
      itBehavesLikeExcludesBodyInvertClass();
    });

    describe('When sidebarPosition is set to left', () => {
      beforeEach(async () => {
        await wrapper.setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.LEFT });
      });

      itBehavesLikeExcludesBodyInvertClass();
    });

    describe('When sidebarPosition is set to right', () => {
      beforeEach(async () => {
        await wrapper.setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT });
      });

      it('Has correct class', async () => {
        expect(body.classes('d-root-layout__body--invert')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When sidebar is rendered', () => {
      it('Uses `aside` tag', async () => {
        expect(sidebar.element.tagName).toBe('ASIDE');
      });
    });

    describe('When content is rendered', () => {
      it('Uses `main` tag', async () => {
        expect(content.element.tagName).toBe('MAIN');
      });
    });
  });
});
