import { mount } from '@vue/test-utils';
import DtListSection from './list_section.vue';
import { h } from 'vue';

// Constants
const baseProps = {
  id: 'sectionId',
};

const baseSlotsData = {
  default: [
    h('li', {}, 'first item'),
    h('li', {}, 'second item'),
    h('li', {}, 'third item'),
  ],
};

describe('ListSection tests', () => {
  let wrapper;

  const props = baseProps;
  const slotsData = baseSlotsData;

  let rootElement;
  let content;
  let contentItems;
  let header;
  let showMoreLessButton;

  const _setWrappers = () => {
    wrapper = mount(DtListSection, {
      props,
      slots: slotsData,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    rootElement = wrapper.find('#' + baseProps.id);
    header = wrapper.find(`#${baseProps.id}-list-section-header`);
    content = wrapper.find(`#${baseProps.id}-list-section-content`);
    contentItems = content.findAll('#sectionId-list-section-content > *');
    showMoreLessButton = wrapper.find(`#${baseProps.id}-list-section-show-more-less`);
  };

  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default slot content', () => {
      it('Should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('Id should be set correctly on the root element', () => {
        expect(rootElement.exists()).toBe(true);
      });

      it('Slot content should be displayed', () => {
        expect(content.text()).toBe('first itemsecond itemthird item');
      });

      it('Header should not be displayed', () => {
        expect(header.exists()).toBe(false);
      });
    });

    describe('When header is passed in as a prop', () => {
      const headerText = 'I am a header';
      beforeEach(async () => {
        await wrapper.setProps({ header: headerText });
        _setChildWrappers();
      });
      it('Header text is displayed correctly', () => {
        expect(header.text()).toBe(headerText);
      });
    });

    describe('When separator is set to true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ separator: true });
      });
      it('separator is displayed correctly', () => {
        expect(rootElement.classes('d-bb')).toBe(true);
      });
    });

    describe('When maxDisplayed is set to a number less than number of entries', () => {
      const maxDisplayed = 2;
      beforeEach(async () => {
        await wrapper.setProps({ maxDisplayed });
        _setChildWrappers();
      });

      it('show more button is displayed', async () => {
        expect(showMoreLessButton.isVisible()).toBe(true);
      });

      it('the correct number of entries is shown', async () => {
        expect(contentItems.length).toBe(maxDisplayed);
      });

      describe('Show more was clicked', () => {
        beforeEach(async () => {
          await showMoreLessButton.trigger('click');
        });

        it('show less button is displayed', () => {
          expect(showMoreLessButton.text()).toBe('Show less');
        });
      });
    });

    describe('When maxDisplayed is set to a number greater than number of entries', () => {
      beforeEach(async () => {
        await wrapper.setProps({ maxDisplayed: 5 });
        _setChildWrappers();
      });
      it('show more button is not displayed', () => {
        expect(showMoreLessButton.exists()).toBe(false);
      });
      it('all entries are shown', () => {
        expect(contentItems.length).toBe(3);
      });
    });

    describe('When maxDisplayed is set to 0', () => {
      beforeEach(async () => {
        await wrapper.setProps({ maxDisplayed: 0 });
        _setChildWrappers();
      });
      it('show more button is not displayed', () => {
        expect(showMoreLessButton.exists()).toBe(false);
      });
      it('all entries are shown', () => {
        expect(contentItems.length).toBe(3);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When maxDisplayed is set to a number less than number of entries', () => {
      const maxDisplayed = 2;
      beforeEach(async () => {
        await wrapper.setProps({ maxDisplayed });
        _setChildWrappers();
      });

      describe('When show more button is clicked', () => {
        beforeEach(async () => {
          await showMoreLessButton.trigger('click');
          _setChildWrappers();
        });

        it('displays all entries if show more button is clicked', async () => {
          expect(contentItems.length).toBe(3);
        });
      });

      describe('When show less button is clicked', () => {
        beforeEach(async () => {
          // click show more button to change to a "show less" button
          await showMoreLessButton.trigger('click');
          // cick again to change back to show more
          await showMoreLessButton.trigger('click');
          _setChildWrappers();
        });

        it(
          'displays maxDisplayed number of entries if show less button is clicked',
          async () => {
            expect(contentItems.length).toBe(maxDisplayed);
          },
        );
      });
    });
  });
});
