import { mount, createLocalVue } from '@vue/test-utils';
import DtRecipeMessageInput from './message_input.vue';

// Wrappers
let wrapper;
let editor;

let imageInputEl;
let characterLimitEl;

let imageBtn;
let emojiPickerBtn;
let sendBtn;

// Test Environment
let propsData;
let slots;
let listeners;
const getClientRectsMock = vi.fn(() => [{}]);
const getBoundingClientRectMock = vi.fn(() => [{}]);
const scrollByMock = vi.fn();

// Constants
const baseProps = {
  value: 'initial value',
  inputAriaLabel: 'aria-label text',
  inputClass: 'qa-editor',
};

const randoText = 'ricketyrick';

const baseSlots = {
  middle: 'image carousel',
};

const testContext = {};
// Helpers
const _setChildWrappers = () => {
  editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');

  // buttons
  imageBtn = wrapper.find('[data-qa="dt-message-input-image-btn"]');
  emojiPickerBtn = wrapper.find('[data-qa="dt-message-input-emoji-picker-btn"]');
  sendBtn = wrapper.find('[data-qa="dt-message-input-send-btn"]');

  // Els
  imageInputEl = wrapper.find('[data-qa="dt-message-input-image-input"]');
  characterLimitEl = wrapper.find('[data-qa="dt-message-input-character-limit"]');
};

const _mountWrapper = () => {
  wrapper = mount(DtRecipeMessageInput, {
    propsData,
    listeners,
    slots,
    localVue: testContext.localVue,
    attachTo: document.body,
  });
};

describe('DtRecipeMessageInput tests', () => {
  // Test Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
    global.Range.prototype.getClientRects = getClientRectsMock;
    global.Range.prototype.getBoundingClientRect = getBoundingClientRectMock;
    global.scrollBy = scrollByMock;
  });

  beforeEach(async () => {
    propsData = baseProps;
    slots = baseSlots;
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(function () {
    propsData = baseProps;
    slots = baseSlots;
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () {
      expect(wrapper.exists()).toBe(true);
    });

    it('should contain the initial value', function () {
      expect(editor.text()).toBe('initial value');
    });

    it('should contain image button', function () {
      expect(imageBtn.exists()).toBe(true);
    });

    it('should contain emoji picker btn', function () {
      expect(emojiPickerBtn.exists()).toBe(true);
    });

    it('should contain send button', function () {
      expect(sendBtn.exists()).toBe(true);
    });

    describe('When character Limit is disabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          showCharacterLimit: false,
          value: randoText,
        });
      });

      it('should not show any limit on reaching the character Warning', () => {
        expect(editor.text()).toBe(randoText);
        expect(characterLimitEl.isVisible()).toBe(false);
      });
    });

    describe('When character Limit is enabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          showCharacterLimit: {
            count: 15,
            warning: 5,
            message: 'test warning',
          },
          value: randoText,
        });
        _setChildWrappers();
      });

      it('should show the remaining characters', () => {
        expect(editor.text()).toBe(randoText);
        expect(characterLimitEl.text()).toBe('4');
      });
    });
  });

  describe('Interactivity tests', function () {
    describe('When send button is clicked', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          value: randoText,
        });
        _setChildWrappers();
      });
      // eslint-disable-next-line vitest/expect-expect
      it('should fire submit event with the text as payload', async () => {
        await sendBtn.trigger('click');
        expect(wrapper.emitted('submit')[0][0]).toBe(randoText);
      });
    });

    // select-media event
    describe('When image input is selected', () => {
      beforeEach(async () => {
        await imageInputEl.trigger('input');
      });

      it('should emit select-media event', () => {
        expect(wrapper.emitted()).toHaveProperty('select-media');
      });
    });
  });
});
