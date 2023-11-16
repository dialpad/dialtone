import { mount } from '@vue/test-utils';
import DtRecipeIvrNode from './ivr_node.vue';
import {
  IVR_NODE_COLOR_MAPPING, IVR_NODE_HANGUP, IVR_NODE_LABELS,
} from '@/recipes/cards/ivr_node/ivr_node_constants';

const baseProps = {
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
  // Wrappers
  let wrapper;
  let topConnector;
  let nodeIcon;

  // Environment
  let props = baseProps;
  let slots = baseSlots;

  // Helpers
  const _setChildWrappers = () => {
    topConnector = wrapper.find('[data-qa="dt-top-connector"]');
    nodeIcon = wrapper.find('[data-qa="dt-ivr-node-icon"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeIvrNode, {
      props,
      slots,
    });
    _setChildWrappers();
  };

  // Teardown
  afterEach(() => {
    props = baseProps;
    slots = baseSlots;
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      beforeEach(() => {
        _setWrappers();
      });
      it(
        'should render the component',
        () => { expect(wrapper.exists()).toBe(true); },
      );
      it(
        'should render top connector dot',
        () => { expect(topConnector.exists()).toBeTruthy(); },
      );
      it('Default slot renders correctly as card content', () => {
        const content = wrapper.find('.d-card__content');
        expect(content.text()).toEqual('Hangup');
      });
    });

    describe('When top connector has dtmf', () => {
      beforeEach(async () => {
        props = {
          ...baseProps,
          dtmfKey: '2',
        };
        await _setWrappers();
      });
      it('should render dtmf connector', () => {
        const dtmfDot = wrapper.find('[data-qa="dt-top-connector-dtmf"]');
        expect(dtmfDot.exists()).toBeTruthy();
        expect(dtmfDot.text()).toEqual('2');
      });
    });

    describe('When top connector has different template', () => {
      beforeEach(async () => {
        props = {
          ...baseProps,
          connector,
        };
        await _setWrappers();
      });
      it('should render connector', () => {
        const dtmfDot = wrapper.find('[data-qa="dt-top-connector"]');
        expect(dtmfDot.exists()).toBeTruthy();
      });
    });

    describe('When node is selected', () => {
      beforeEach(async () => {
        props = {
          ...baseProps,
          isSelected: true,
        };
        await _setWrappers();
      });
      it('should include selected class', () => {
        const card = wrapper.find('[data-qa="dt-card"]');
        const header = wrapper.find('.d-card__header');
        expect(card.classes().includes(IVR_NODE_COLOR_MAPPING[IVR_NODE_HANGUP].selected)).toBe(true);
        expect(
          header.classes().includes(IVR_NODE_COLOR_MAPPING[IVR_NODE_HANGUP].selected),
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
        expect(wrapper.emitted().click).toBeTruthy();
      });
    });
  });
});
