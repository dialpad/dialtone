import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DtTextList from './TextList.vue';
import DtTextListItem from './TextListItem.vue';
import {
  DT_TEXT_LIST_DEFAULT_GAP,
  DT_TEXT_LIST_GAP,
  DT_TEXT_LIST_MARKER_TONES,
  DT_TEXT_LIST_MARKERS,
  DT_TEXT_LIST_ORDERED_MARKERS,
  DT_TEXT_LIST_TYPES,
  DT_TEXT_LIST_UNORDERED_MARKERS,
} from './TextListConstants';
import {
  textListGapValidator,
  textListMarkerToneValidator,
  textListMarkerValidator,
  textListTypeValidator,
} from './Validators';

const ITEM_ONE = 'Item one';
const ITEM_TWO = 'Item two';
const ORDERED_TYPE = DT_TEXT_LIST_TYPES.find(type => type === 'ordered');
const MARKER_NONE = DT_TEXT_LIST_MARKERS.find(marker => marker === 'none');
const MARKER_SQUARE = DT_TEXT_LIST_UNORDERED_MARKERS.find(marker => marker === 'square');
const MARKER_CRITICAL = DT_TEXT_LIST_MARKER_TONES.find(tone => tone === 'critical');
const MARKER_POSITIVE = DT_TEXT_LIST_MARKER_TONES.find(tone => tone === 'positive');
const GAP_200 = '200';
const GAP_400 = DT_TEXT_LIST_GAP.find(gap => gap === '400');
const GAP_450 = '450';

const baseProps = {};
const baseAttrs = {};
const baseSlots = {
  default: `
    <dt-text-list-item>${ITEM_ONE}</dt-text-list-item>
    <dt-text-list-item>${ITEM_TWO}</dt-text-list-item>
  `,
};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtTextList', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtTextList, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        components: { DtTextList, DtTextListItem },
        stubs: {
          DtIconClose: {
            props: ['size'],
            template: '<svg data-qa="dt-icon-close" :data-size="size" />',
          },
          DtIcon: {
            props: ['name', 'size'],
            template: '<svg data-qa="dt-icon" :data-name="name" :data-size="size" />',
          },
        },
      },
    });
  };

  const textListItems = () => wrapper.findAll('[data-qa="dt-text-list-item"]');
  const markerWrappers = () => wrapper.findAll('[data-qa="dt-text-list-item-marker"]');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    vi.restoreAllMocks();
  });

  describe('Presentation Tests', () => {
    it('renders an unordered list by default', () => {
      expect(wrapper.element.tagName).toBe('UL');
      expect(wrapper.classes()).toContain('d-text-list');
      expect(wrapper.classes()).toContain(`d-text-list--gap-${DT_TEXT_LIST_DEFAULT_GAP}`);
      expect(wrapper.attributes('data-qa')).toBe('dt-text-list');
    });

    it('passes class through to the list root', () => {
      mockAttrs = { class: 'my-list-root' };

      updateWrapper();

      expect(wrapper.classes()).toContain('my-list-root');
    });

    it('passes class through to the item root', () => {
      mockSlots = {
        default: '<dt-text-list-item class="my-item-root">Classed item</dt-text-list-item>',
      };

      updateWrapper();

      expect(textListItems()[0].classes()).toContain('my-item-root');
    });

    it('renders an ordered list when type is ordered', () => {
      mockProps = { type: ORDERED_TYPE };

      updateWrapper();

      expect(wrapper.element.tagName).toBe('OL');
      expect(wrapper.classes()).toContain('d-text-list--ordered');
    });

    it('applies marker, markerTone, and gap classes', () => {
      mockProps = {
        marker: MARKER_SQUARE,
        markerTone: MARKER_CRITICAL,
        gap: GAP_200,
      };

      updateWrapper();

      expect(wrapper.classes()).toContain(`d-text-list--marker-${MARKER_SQUARE}`);
      expect(wrapper.classes()).toContain(`d-text-list--marker-tone-${MARKER_CRITICAL}`);
      expect(wrapper.classes()).toContain(`d-text-list--gap-${GAP_200}`);
    });

    it('applies markerTone to individual items as an override', () => {
      mockProps = { markerTone: MARKER_CRITICAL };
      mockSlots = {
        default: `
          <dt-text-list-item marker-tone="${MARKER_POSITIVE}">${ITEM_ONE}</dt-text-list-item>
          <dt-text-list-item>${ITEM_TWO}</dt-text-list-item>
        `,
      };

      updateWrapper();

      expect(wrapper.classes()).toContain(`d-text-list--marker-tone-${MARKER_CRITICAL}`);
      expect(textListItems()[0].classes()).toContain(`d-text-list__item--marker-tone-${MARKER_POSITIVE}`);
      expect(textListItems()[1].classes()).not.toContain(`d-text-list__item--marker-tone-${MARKER_POSITIVE}`);
    });
  });

  describe('Accessibility Tests', () => {
    it('applies role="list" when markers are hidden', () => {
      mockProps = { marker: MARKER_NONE };

      updateWrapper();

      expect(wrapper.attributes('role')).toBe('list');
    });

    it('marks custom marker wrappers as decorative', () => {
      mockSlots = {
        default: `
          <dt-text-list-item>
            <template #marker><span>+</span></template>
            ${ITEM_ONE}
          </dt-text-list-item>
          <dt-text-list-item>
            <template #marker><span>-</span></template>
            ${ITEM_TWO}
          </dt-text-list-item>
        `,
      };

      updateWrapper();

      expect(markerWrappers()).toHaveLength(2);
      markerWrappers().forEach((markerWrapper) => {
        expect(markerWrapper.attributes('aria-hidden')).toBe('true');
      });
    });

    it('renders DtTextListItem children as list items', () => {
      const items = textListItems();

      expect(items).toHaveLength(2);
      expect(items[0].text()).toBe(ITEM_ONE);
      expect(items[1].text()).toBe(ITEM_TWO);
    });

    it('wraps native-marker item content', () => {
      expect(wrapper.findAll('[data-qa="dt-text-list-item-content"]')).toHaveLength(2);
    });

    it('passes ordered-list start and reversed attributes only to ordered lists', () => {
      mockProps = { type: ORDERED_TYPE, start: 4, reversed: true };

      updateWrapper();

      expect(wrapper.attributes('start')).toBe('4');
      expect(wrapper.attributes('reversed')).toBe('');
    });

    it('does not pass ordered-list attributes to unordered lists', () => {
      mockProps = { start: 4, reversed: true };
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper();

      expect(wrapper.attributes('start')).toBeUndefined();
      expect(wrapper.attributes('reversed')).toBeUndefined();
    });

    it('passes item value inside an ordered list', () => {
      mockProps = { type: ORDERED_TYPE };
      mockSlots = {
        default: '<dt-text-list-item :value="5">Fifth item</dt-text-list-item>',
      };

      updateWrapper();

      expect(textListItems()[0].attributes('value')).toBe('5');
    });

    it('does not pass item value inside an unordered list', () => {
      mockSlots = {
        default: '<dt-text-list-item :value="5">Fifth item</dt-text-list-item>',
      };
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper();

      expect(textListItems()[0].attributes('value')).toBeUndefined();
    });
  });

  describe('Validation Tests', () => {
    it.each([
      ['type', textListTypeValidator, DT_TEXT_LIST_TYPES[0], 'invalid'],
      ['marker', textListMarkerValidator, DT_TEXT_LIST_MARKERS[0], 'invalid'],
      ['markerTone', textListMarkerToneValidator, DT_TEXT_LIST_MARKER_TONES[0], 'invalid'],
      ['gap', textListGapValidator, GAP_400, GAP_450],
    ])('validates %s values', (_name, validator, validValue, invalidValue) => {
      expect(validator(validValue)).toBe(true);
      expect(validator(invalidValue)).toBe(false);
    });

    it('warns when ordered-list props are used on unordered lists', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockProps = { start: 2, reversed: true };

      updateWrapper();

      expect(warn).toHaveBeenCalledWith('[DtTextList] The start prop only applies when type="ordered".');
      expect(warn).toHaveBeenCalledWith('[DtTextList] The reversed prop only applies when type="ordered".');
    });

    it.each([
      [ORDERED_TYPE, DT_TEXT_LIST_UNORDERED_MARKERS[0], 'unordered'],
      [DT_TEXT_LIST_TYPES[0], DT_TEXT_LIST_ORDERED_MARKERS[0], 'ordered'],
    ])('warns when %s list uses a %s-family marker', (type, marker, expectedFamily) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockProps = { type, marker };

      updateWrapper();

      expect(warn).toHaveBeenCalledWith(
        `[DtTextList] The marker="${marker}" value is usually used with type="${expectedFamily}".`,
      );
    });

    it('warns when direct children are not DtTextListItem', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockSlots = { default: '<li>Raw list item</li>' };

      updateWrapper();

      expect(warn).toHaveBeenCalledWith('[DtTextList] Use DtTextListItem as the direct child of DtTextList.');
      expect(wrapper.find('li').text()).toBe('Raw list item');
    });

    it('warns when DtTextListItem value is used outside an ordered list', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockSlots = {
        default: '<dt-text-list-item :value="2">Second item</dt-text-list-item>',
      };

      updateWrapper();

      expect(warn).toHaveBeenCalledWith('[DtTextListItem] The value prop only applies inside a DtTextList with type="ordered".');
    });

    it('warns when DtTextListItem is mounted without DtTextList', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mount(DtTextListItem, { slots: { default: 'Orphan item' } });

      expect(warn).toHaveBeenCalledWith('[DtTextListItem] DtTextListItem must be used inside DtTextList.');
    });
  });

  describe('Extendability Tests', () => {
    it('supports the marker slot', () => {
      mockSlots = {
        default: `
          <dt-text-list-item>
            <template #marker><span data-qa="custom-marker">*</span></template>
            Slotted marker
          </dt-text-list-item>
        `,
      };

      updateWrapper();

      expect(wrapper.find('[data-qa="custom-marker"]').exists()).toBe(true);
    });

    it('supports Dialtone icons through the marker slot', () => {
      mockSlots = {
        default: `
          <dt-text-list-item>
            <template #marker><dt-icon-close size="200" /></template>
            Tree-shakable icon marker
          </dt-text-list-item>
          <dt-text-list-item>
            <template #marker><dt-icon name="close" size="200" /></template>
            Generic icon marker
          </dt-text-list-item>
        `,
      };

      updateWrapper();

      expect(wrapper.find('[data-qa="dt-icon-close"]').attributes('data-size')).toBe('200');
      expect(wrapper.find('[data-qa="dt-icon"]').attributes('data-name')).toBe('close');
    });

    it('applies contentClass to native-marker item content', () => {
      mockSlots = {
        default: '<dt-text-list-item content-class="my-content">Styled item</dt-text-list-item>',
      };

      updateWrapper();

      expect(wrapper.find('[data-qa="dt-text-list-item-content"]').classes()).toContain('my-content');
      expect(wrapper.find('[data-qa="dt-text-list-item-marker"]').exists()).toBe(false);
    });

    it('applies markerClass and contentClass to custom-marker item wrappers', () => {
      mockSlots = {
        default: `
          <dt-text-list-item marker-class="my-marker" content-class="my-content">
            <template #marker><span>*</span></template>
            Styled item
          </dt-text-list-item>
        `,
      };

      updateWrapper();

      expect(wrapper.find('[data-qa="dt-text-list-item-marker"]').classes()).toContain('my-marker');
      expect(wrapper.find('[data-qa="dt-text-list-item-content"]').classes()).toContain('my-content');
    });

    it('supports nested mixed list types', () => {
      mockSlots = {
        default: `
          <dt-text-list-item>
            Parent
            <dt-text-list type="${ORDERED_TYPE}">
              <dt-text-list-item>Nested ordered item</dt-text-list-item>
            </dt-text-list>
          </dt-text-list-item>
        `,
      };

      updateWrapper();

      const lists = wrapper.findAll('[data-qa="dt-text-list"]');
      const orderedList = lists.find(list => list.element.tagName === 'OL');

      expect(lists.some(list => list.element.tagName === 'UL')).toBe(true);
      expect(orderedList.exists()).toBe(true);
      expect(orderedList.findAll('[data-qa="dt-text-list-item"]')).toHaveLength(1);
    });
  });
});
