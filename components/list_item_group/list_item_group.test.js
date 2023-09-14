import { mount } from '@vue/test-utils';
import DtListItemGroup from './list_item_group.vue';

const baseProps = {
  heading: 'Heading',
  id: 'list-item-group',
};

let mockProps = {};

describe('DtListItemGroup Tests', () => {
  let wrapper;
  let heading;

  const updateWrapper = () => {
    wrapper = mount(DtListItemGroup, {
      props: { ...baseProps, ...mockProps },
    });

    heading = wrapper.find('[data-qa="dt-dropdown-list-heading"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('List Group has a heading set', () => {
      it('displays the heading correctly', () => {
        expect(heading.text()).toBe(baseProps.heading);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('List Group has a heading set', () => {
      it('the root ul is aria-labelledby the id of the header element', () => {
        expect(wrapper.attributes('aria-labelledby')).toBe(baseProps.id + '-heading');
      });
    });
  });
});
