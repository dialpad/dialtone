import { mount } from '@vue/test-utils';
import DtDescriptionList from './description_list.vue';

let MOCK_LIST = null;

const baseProps = {
  items: [{
    term: 'Customer Intent',
    description: 'Hello, I\'m looking to return my TV',
  }, {
    term: 'Reason',
    description: 'Refound',
  }],
};

let mockProps = {};

describe('DtDescriptionList Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtDescriptionList, {
      propsData: { ...baseProps, ...mockProps },
    });
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the description list', () => {
      expect(wrapper).toBeDefined();
      expect(wrapper.classes().includes('dt-description-list')).toBe(true);
    });

    describe('When direction prop is set', () => {
      it('Should have correct class', () => {
        mockProps = { direction: 'column' };

        updateWrapper();

        expect(wrapper.classes().includes('dt-description-list--column')).toBe(true);
      });
    });

    describe('When gap prop is set', () => {
      it('Should have correct class', () => {
        mockProps = { gap: '300' };

        updateWrapper();

        expect(wrapper.classes().includes('dt-description-list--gap-300')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(() => {
      MOCK_LIST = wrapper.find('dl');

      updateWrapper();
    });

    it('Should render a <dl> tag', () => {
      expect(MOCK_LIST.exists()).toBe(true);
    });

    it('Should contain two <dt> tags', () => {
      expect(MOCK_LIST.findAll('dt').length).toBe(2);
    });

    it('Should contain two <dd> tags', () => {
      expect(MOCK_LIST.findAll('dd').length).toBe(2);
    });
  });

  describe('Validation Tests', () => {
    describe('Direction Validator', () => {
      describe('When provided direction is valid', () => {
        it('passes custom prop validation', () => {
          expect(DtDescriptionList.props.direction.validator('column')).toBe(true);
        });
      });

      describe('When provided direction is not valid', () => {
        it('fails custom prop validation', () => {
          expect(DtDescriptionList.props.direction.validator('INVALID_DIRECTION')).toBe(false);
        });
      });
    });

    describe('Items Validator', () => {
      describe('When provided items are valid', () => {
        it('passes custom prop validation', () => {
          expect(DtDescriptionList.props.items.validator(baseProps.items)).toBe(true);
        });
      });

      describe('When provided items are not valid', () => {
        it('fails custom prop validation', () => {
          expect(DtDescriptionList.props.items.validator([{ invalid: 'description' }])).toBe(false);
        });
      });
    });

    describe('Gap Validator', () => {
      describe('When provided gap is valid', () => {
        it('passes custom prop validation', () => {
          expect(DtDescriptionList.props.gap.validator('300')).toBe(true);
        });
      });

      describe('When provided gap is not valid', () => {
        it('fails custom prop validation', () => {
          expect(DtDescriptionList.props.gap.validator('invalid')).toBe(false);
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    const customClass = 'my-custom-class';

    describe('When a term class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { termClass: customClass };

        updateWrapper();

        const dtElement = wrapper.find('dt');

        expect(dtElement.classes().includes(customClass)).toBe(true);
      });
    });

    describe('When a description class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { descriptionClass: customClass };

        updateWrapper();

        const ddElement = wrapper.find('dd');

        expect(ddElement.classes().includes(customClass)).toBe(true);
      });
    });
  });
});
