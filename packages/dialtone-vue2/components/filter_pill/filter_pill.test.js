import { createLocalVue, mount } from '@vue/test-utils';
import DtFilterPill from './filter_pill.vue';
import { DtPopover } from '@/components/popover';

const MOCK_OPEN_STUB = vi.fn();
const MOCK_CLEAR_STUB = vi.fn();

const MOCK_LABEL = 'Filter pill label';
const MOCK_CONTENT = 'Popover content';
const MOCK_DEFAULT_SLOT = 'Default slot';
const MOCK_TEST_FILTERS = [
  { name: 'Test item 1' },
  { name: 'Test item 2' },
];

const baseProps = {
  value: MOCK_TEST_FILTERS,
};

const baseSlots = {};

const baseListeners = {
  open: MOCK_OPEN_STUB,
  clear: MOCK_CLEAR_STUB,
};

let mockProps = {};
let mockSlots = {};
let mockListeners = {};

const testContext = {};

describe('DtFilterPill Tests', function () {
  let wrapper;
  let button;
  let label;
  let icon;
  let clearButton;
  let content;

  const updateWrapper = () => {
    wrapper = mount(DtFilterPill, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      listeners: { ...baseListeners, ...mockListeners },
      localVue: testContext.localVue,
      attachTo: document.body,
    });

    button = wrapper.find('[data-qa="dt-filter-pill__button"]');
    label = button.find('[data-qa="dt-button-label"]');
    icon = wrapper.find('[data-qa="dt-filter-pill__icon"]');
    clearButton = wrapper.find('[data-qa="dt-filter-pill__clear-button"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => { updateWrapper(); });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockListeners = {};
    vi.restoreAllMocks();
    wrapper.destroy();
    document.body.innerHTML = '';
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(button.exists()).toBe(true);
        expect(icon.exists()).toBe(true);
      });

      it('Should not render clear button', () => {
        expect(clearButton.exists()).toBe(false);
      });
    });

    describe('When an active element is passed', () => {
      it('Should have active styling', () => {
        mockProps = { value: [{ name: 'Test item 1', active: true }] };

        updateWrapper();

        expect(button.classes().includes('d-filter-pill--selected')).toBe(true);
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

    describe('When hide-clear is set', () => {
      it('Should not render clear button', () => {
        mockProps = {
          value: [{ name: 'Test item 1', active: true }],
          hideClear: true,
        };

        updateWrapper();

        expect(clearButton.exists()).toBe(false);
      });
    });
  });

  describe('Interactivity Tests', () => {
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

    describe('When clear button  is clicked', () => {
      beforeEach(async () => {
        mockProps = {
          value: [{ name: 'Test item 1', active: true }],
        };

        updateWrapper();

        await clearButton.trigger('click');
      });

      it('Should call listener once', () => {
        expect(MOCK_CLEAR_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit "clear" event', () => {
        expect(wrapper.emitted()).toHaveProperty('clear');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When default slot is set', () => {
      it('Should render custom label', () => {
        mockSlots = { default: MOCK_DEFAULT_SLOT };

        updateWrapper();

        expect(wrapper.html()).toContain(MOCK_DEFAULT_SLOT);
      });
    });

    describe('When content slot is set', () => {
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
  });
});
