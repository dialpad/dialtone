import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeIvrNode from './ivr_node.vue';
import {
  IVR_NODE_COLOR_MAPPING, IVR_NODE_HANGUP, IVR_NODE_LABELS,
} from '@/recipes/cards/ivr_node/ivr_node_constants';

const basePropsData = {
  menuButtonAriaLabel: 'Node menu',
  nodeType: IVR_NODE_HANGUP,
  nodeLabel: IVR_NODE_LABELS[IVR_NODE_HANGUP],
  isSelected: false,
};

const baseSlots = {
  content: '<p>Hangup</p>',
  menuItems: '<ul><li>edit</li><li>copy</li><li>delete</li></ul>',
};

const connector = '<div data-qa="dt-connector-element"> connector content </div>';

describe('DtPagination Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let topConnector;
  let nodeIcon;

  // Environment
  let propsData = basePropsData;
  let slots = baseSlots;
  let listeners;

  // Helpers
  const _setChildWrappers = () => {
    topConnector = wrapper.find('[data-qa="dt-top-connector"]');
    nodeIcon = wrapper.find('[data-qa="dt-ivr-node-icon"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeIvrNode, {
      propsData,
      slots,
      listeners,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    slots = baseSlots;
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      beforeEach(() => {
        _setWrappers();
      });
      it(
        'should render the component',
        () => { assert.exists(wrapper, 'wrapper exists'); }
      );
      it(
        'should render top connector dot',
        () => { assert.exists(topConnector, 'top connector exists'); }
      );
      it('Default slot renders correctly as card content', () => {
        const content = wrapper.find('.d-card__content');
        expect(content.text()).toEqual('Hangup');
      });
    });

    describe('When top connector has dtmf', () => {
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          dtmfKey: '2',
        };
        await _setWrappers();
      });
      it('should render dtmf connector', () => {
        const dtmfDot = wrapper.find('[data-qa="dt-top-connector-dtmf"]');
        assert.exists(dtmfDot, 'dtmf dot exists');
        expect(dtmfDot.text()).toEqual('2');
      });
    });

    describe('When top connector has different template', () => {
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          connector,
        };
        await _setWrappers();
      });
      it('should render connector', () => {
        const dtmfDot = wrapper.find('[data-qa="dt-connector-element"]');
        assert.exists(dtmfDot, 'connector exists');
      });
    });

    describe('When node is selected', () => {
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          isSelected: true,
        };
        await _setWrappers();
      });
      it('should include selected class', () => {
        const card = wrapper.find('[data-qa="dt-card"]');
        const header = wrapper.find('.d-card__header');
        expect(card.classes().includes(IVR_NODE_COLOR_MAPPING[IVR_NODE_HANGUP].selected)).toBe(true);
        expect(
          header.classes().includes(IVR_NODE_COLOR_MAPPING[IVR_NODE_HANGUP].selected)
        ).toBe(true);
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      _setWrappers();
    });

    describe('When node is clicked', () => {
      beforeEach(async () => {
        await nodeIcon.trigger('click');
      });
      it('should emit click event', () => {
        expect(wrapper.emitted().click).toEqual();
      });
    });
  });
});
