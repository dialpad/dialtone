import { mount } from '@vue/test-utils';
import DtRecipeMessageInput from './message_input.vue';
import { beforeEach, describe } from '@/node_modules/vitest/dist/index';

// Wrappers
let wrapper;
let editor;

let imageInputEl;
let messageInputEl;
let characterLimitEl;
let errorNoticeEl;

let imageBtn;
let emojiPickerBtn;
let sendBtn;

let footerLeftSlot;
let footerRightSlot;

// Test Environment
let props;
let attrs;
let slots;
let listeners;
const getClientRectsMock = vi.fn(() => [{}]);
const getBoundingClientRectMock = vi.fn(() => [{}]);
const scrollByMock = vi.fn();

// Constants
const baseProps = {
  modelValue: 'initial value',
  inputAriaLabel: 'aria-label text',
  inputClass: 'qa-editor',
};

const randoText = 'ricketyrick';

const baseSlots = {
  middle: 'image carousel',
  footerLeft: 'footer left',
  footerRight: 'footer right',
};

// Helpers
const _setChildWrappers = () => {
  editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');

  // buttons
  imageBtn = wrapper.find('[data-qa="dt-message-input-image-btn"]');
  emojiPickerBtn = wrapper.find('[data-qa="dt-message-input-emoji-picker-btn"]');
  sendBtn = wrapper.find('[data-qa="dt-message-input-send-btn"]');

  // Els
  imageInputEl = wrapper.find('[data-qa="dt-message-input-image-input"]');
  messageInputEl = wrapper.find('[data-qa="dt-message-input"]');
  characterLimitEl = wrapper.find('[data-qa="dt-message-input-character-limit"]');
  errorNoticeEl = wrapper.find('[data-qa="dt-message-input-error-notice"]');

  // slot divs
  footerLeftSlot = wrapper.find('[data-qa="dt-message-input-footer-left"]');
  footerRightSlot = wrapper.find('[data-qa="dt-message-input-footer-right"]');
};

const _mountWrapper = () => {
  wrapper = mount(DtRecipeMessageInput, {
    props,
    listeners,
    attrs,
    slots,
    attachTo: document.body,
  });
};

describe('DtMessage tests', () => {
  // Test Setup
  beforeAll(() => {
    global.Range.prototype.getClientRects = getClientRectsMock;
    global.Range.prototype.getBoundingClientRect = getBoundingClientRectMock;
    global.scrollBy = scrollByMock;
  });

  beforeEach(async () => {
    props = baseProps;
    attrs = {};
    slots = baseSlots;
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(function () {
    props = baseProps;
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

    it('should contain left footer slot', function () {
      expect(footerLeftSlot.text()).toBe(baseSlots.footerLeft);
    });

    it('should contain right footer slot', function () {
      expect(footerRightSlot.text()).toBe(baseSlots.footerRight);
    });

    it('should not have border applied on message-input when not focused', () => {
      expect(messageInputEl.classes('d-bc-default')).toBe(true);
      expect(messageInputEl.classes('d-bc-black-500')).toBe(false);
    });

    describe('When we focus anywhere on the message input', () => {
      it('should focus and add the border for the message input', async () => {
        await messageInputEl.trigger('focusin');
        expect(messageInputEl.classes('d-bc-black-500')).toBe(true);
      });

      it('should programmatically focus to input', async () => {
        wrapper.vm.focus();
        await wrapper.vm.$nextTick();
        expect(messageInputEl.classes('d-bc-black-500')).toBe(true);
      });
    });

    describe('When character Limit is disabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          hasCharacterLimit: false,
          characterLimitCount: 15,
          characterLimitWarning: 5,
          modelValue: randoText,
        });
      });

      it('should not show any limit on reaching the character Warning', () => {
        expect(editor.text()).toBe(randoText);
        expect(characterLimitEl.exists()).toBe(false);
      });
    });

    describe('When character Limit is enabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          hasCharacterLimit: true,
          characterLimitCount: 15,
          characterLimitWarning: 5,
          modelValue: randoText,
        });
        _setChildWrappers();
      });

      it('should show the remaining characters', () => {
        expect(editor.text()).toBe(randoText);
        expect(characterLimitEl.text()).toBe('4');
      });
    });

    // Error notice tests
    it('By default error notice should not be shown', () => {
      expect(errorNoticeEl.exists()).toBe(false);
    });

    describe('When error Notice is enabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          showNotice: true,
          noticeMessage: randoText,
        });
        _setChildWrappers();
      });
      it('should show the noticeMessage in the text', () => {
        expect(errorNoticeEl.exists()).toBe(true);
        expect(errorNoticeEl.text()).toBe(randoText);
      });
    });
  });

  describe('Interactivity tests', function () {
    describe('When notice is enabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          showNotice: true,
          noticeMessage: randoText,
        });
        _setChildWrappers();
      });

      it('should fire notice-close event when closed', async () => {
        expect(errorNoticeEl.exists()).toBe(true);
        await errorNoticeEl.find('button').trigger('click');
        expect(wrapper.emitted('notice-close')[0][0]).toBe(true);
      });
    });

    describe('When send button is clicked', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          modelValue: randoText,
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
