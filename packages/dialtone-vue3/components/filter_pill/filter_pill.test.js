import { mount } from '@vue/test-utils';
import DtFilterPill from './filter_pill.vue';
import { DtPopover } from '@/components/popover';

const MOCK_OPEN_STUB = vi.fn();
const MOCK_RESET_STUB = vi.fn();

const MOCK_LABEL = 'Filter pill label';
const MOCK_HEADER_CONTENT = 'Popover header';
const MOCK_CONTENT = 'Popover content';
const MOCK_FOOTER_CONTENT = 'Popover footer';

const baseProps = {};
const baseSlots = {};
const baseAttrs = {
  onOpen: MOCK_OPEN_STUB,
  onReset: MOCK_RESET_STUB,
};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};

describe('DtFilterPill Tests', function () {
  let wrapper;
  let button;
  let label;
  let icon;
  let resetButton;
  let skeleton;
  let headerContent;
  let content;
  let footerContent;

  const updateWrapper = () => {
    wrapper = mount(DtFilterPill, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        stubs: {
          transition: false,
        },
      },
      attrs: { ...baseAttrs, ...mockAttrs },
      attachTo: document.body,
    });

    button = wrapper.find('[data-qa="dt-filter-pill__button"]');
    label = button.find('[data-qa="dt-button-label"]');
    icon = wrapper.find('[data-qa="dt-filter-pill__icon"]');
    resetButton = wrapper.find('[data-qa="dt-filter-pill__reset-button"]');
    skeleton = wrapper.find('[data-qa="skeleton-text-body"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    vi.restoreAllMocks();
    wrapper.unmount();
    document.body.innerHTML = '';
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(button.exists()).toBe(true);
        expect(icon.exists()).toBe(true);
      });

      it('Should not render reset button', () => {
        expect(resetButton.exists()).toBe(false);
      });
    });

    describe('When active is set', () => {
      it('Should have active styling', () => {
        mockProps = { active: true };

        updateWrapper();

        expect(button.classes().includes('d-filter-pill--active')).toBe(true);
      });
    });

    describe('When disabled is set', () => {
      it('Should have disabled attribute', () => {
        mockProps = { disabled: true };

        updateWrapper();

        expect(button.attributes()).toHaveProperty('disabled');
      });
    });

    describe('When label is set', () => {
      it('Should render custom label', () => {
        mockProps = { label: MOCK_LABEL };

        updateWrapper();

        expect(label.html()).toContain(MOCK_LABEL);
      });
    });

    describe('When loading is set', () => {
      it('Should render skeleton', () => {
        mockProps = { loading: true };

        updateWrapper();

        expect(skeleton.exists()).toBe(true);
      });

      describe('When loading-skeleton-width is set', () => {
        it('Should have custom width', () => {
          mockProps = {
            loading: true,
            loadingSkeletonWidth: '50px',
          };

          updateWrapper();

          expect(skeleton.attributes('style')).toContain('width: 50px');
        });
      });
    });

    describe('When show-reset is set', () => {
      it('Should render reset button', () => {
        mockProps = { showReset: true };

        updateWrapper();

        expect(resetButton.exists()).toBe(true);
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      mockProps = {
        showReset: true,
      };

      updateWrapper();
    });

    describe('When filter pill is clicked', () => {
      beforeEach(async () => {
        await button.trigger('click');
      });

      it('Should call listener once', () => {
        expect(MOCK_OPEN_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit "open" event', () => {
        expect(wrapper.emitted()).toHaveProperty('open');
      });
    });

    describe('When reset button  is clicked', () => {
      beforeEach(async () => {
        await resetButton.trigger('click');
      });

      it('Should call listener once', () => {
        expect(MOCK_RESET_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit "reset" event', () => {
        expect(wrapper.emitted()).toHaveProperty('reset');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When headerContent is set', () => {
      beforeEach(async () => {
        mockSlots = { headerContent: MOCK_HEADER_CONTENT };

        updateWrapper();

        await button.trigger('click');

        headerContent = wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'popover__header' });
      });

      it('Renders the popover header', async () => {
        expect(headerContent.exists()).toBe(true);
      });

      it('Renders the content on the popover header', async () => {
        expect(headerContent.html()).toContain(MOCK_HEADER_CONTENT);
      });
    });

    describe('When content is set', () => {
      beforeEach(async () => {
        mockSlots = { content: MOCK_CONTENT };

        updateWrapper();

        await button.trigger('click');

        content = wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' });
      });

      it('Renders the popover content', async () => {
        expect(content.exists()).toBe(true);
      });

      it('Renders the content on the popover', async () => {
        expect(content.html()).toContain(MOCK_CONTENT);
      });
    });

    describe('When footerContent is set', () => {
      beforeEach(async () => {
        mockSlots = { footerContent: MOCK_FOOTER_CONTENT };

        updateWrapper();

        await button.trigger('click');

        footerContent = wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'popover__footer' });
      });

      it('Renders the popover footer', async () => {
        expect(footerContent.exists()).toBe(true);
      });

      it('Renders the content on the popover footer', async () => {
        expect(footerContent.html()).toContain(MOCK_FOOTER_CONTENT);
      });
    });
  });
});
