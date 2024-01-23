import { mount } from '@vue/test-utils';
import DtRecipeEditor from './editor.vue';

// Wrappers
let wrapper;
let editor;

let editorEl;
let linkInputEl;

let boldFormatBtn;
let italicsFormatBtn;
let underlineFormatBtn;
let strikeFormatBtn;
let listItemsFormatBtn;
let addLinkBtn;
let confirmAddLinkBtn;
let cancelAddLinkBtn;

const testText = 'In the beginning, it was a nice day.';

// Constants
const baseProps = {
  value: testText,
  inputAriaLabel: 'aria-label text',
  inputClass: 'qa-editor',
  autoFocus: 'all',
};

// Test Environment
let propsData = baseProps;
let slots;
let listeners;
const getClientRectsMock = vi.fn(() => [{}]);
const getBoundingClientRectMock = vi.fn(() => [{}]);
const scrollByMock = vi.fn();

const testContext = {};

const _setChildWrappers = () => {
  editor = wrapper.find('[data-qa="dt-rich-text-editor"]').find('div[contenteditable]');

  // buttons
  boldFormatBtn = wrapper.find('[data-qa="dt-editor-bold-btn"]');
  italicsFormatBtn = wrapper.find('[data-qa="dt-editor-italics-btn"]');
  underlineFormatBtn = wrapper.find('[data-qa="dt-editor-underline-btn"]');
  strikeFormatBtn = wrapper.find('[data-qa="dt-editor-strike-btn"]');
  listItemsFormatBtn = wrapper.find('[data-qa="dt-editor-list-items-btn"]');
  addLinkBtn = wrapper.find('[data-qa="dt-editor-add-link-btn"]');

  // Els
  editorEl = wrapper.find('[data-qa="dt-editor"]');
};

const _mountWrapper = () => {
  wrapper = mount(DtRecipeEditor, {
    propsData,
    listeners,
    slots,
    localVue: testContext.localVue,
    attachTo: document.body,
  });
};

describe('DtRecipeEditor tests', () => {
  // Test Setup
  beforeAll(() => {
    global.Range.prototype.getClientRects = getClientRectsMock;
    global.Range.prototype.getBoundingClientRect = getBoundingClientRectMock;
    global.scrollBy = scrollByMock;
  });

  beforeEach(async () => {
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(function () {
    propsData = baseProps;
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () {
      expect(wrapper.exists()).toBe(true);
    });

    it('should contain the initial value', function () {
      expect(editor.text()).toBe(testText);
    });

    it('should contain bold format button', function () {
      expect(boldFormatBtn.exists()).toBe(true);
    });

    it('should contain italics format btn', function () {
      expect(italicsFormatBtn.exists()).toBe(true);
    });

    it('should contain underline button', function () {
      expect(underlineFormatBtn.exists()).toBe(true);
    });

    it('should contain strike button', function () {
      expect(strikeFormatBtn.exists()).toBe(true);
    });

    it('should contain list items button', function () {
      expect(listItemsFormatBtn.exists()).toBe(true);
    });

    it('should contain add link button', function () {
      expect(addLinkBtn.exists()).toBe(true);
    });

    it('should not have border applied on message-input when not focused', () => {
      expect(editorEl.classes('d-bc-default')).toBe(true);
      expect(editorEl.classes('d-bc-black-500')).toBe(false);
    });

    describe('When we focus anywhere on the editor', () => {
      it('should focus and add the border for the editor', async () => {
        await editor.trigger('focus');
        expect(editorEl.classes('d-bc-black-500')).toBe(true);
      });

      it('should programmatically focus to input', async () => {
        wrapper.vm.onFocus();
        await wrapper.vm.$nextTick();
        expect(editorEl.classes('d-bc-black-500')).toBe(true);
      });
    });

    describe('When rounded edges is disabled', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          roundedEdges: false,
          value: testText,
        });
      });

      it('the editor edges should not be round', async () => {
        expect(editor.text()).toBe(testText);
        expect(editorEl.classes('d-bar0')).toBe(true);
      });
    });

    describe('When bold button is disabled', () => {
      beforeEach(async () => {
        _mountWrapper();
        await wrapper.setProps({ showBoldButton: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });

      it('should not appear in the formatting options', () => {
        expect(wrapper
          .find('[data-qa="dt-editor-bold-btn"]')
          .exists()).toBe(false);

        expect(wrapper
          .find('[data-qa="dt-editor-italics-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-underline-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-strike-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-list-items-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-add-link-btn"]')
          .exists()).toBe(true);
      });
    });

    describe('When italics button is disabled', () => {
      beforeEach(async () => {
        _mountWrapper();
        await wrapper.setProps({ showItalicsButton: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });

      it('should not appear in the formatting options', () => {
        expect(wrapper
          .find('[data-qa="dt-editor-bold-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-italics-btn"]')
          .exists()).toBe(false);

        expect(wrapper
          .find('[data-qa="dt-editor-underline-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-strike-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-list-items-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-add-link-btn"]')
          .exists()).toBe(true);
      });
    });

    describe('When underline button is disabled', () => {
      beforeEach(async () => {
        _mountWrapper();
        await wrapper.setProps({ showUnderlineButton: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });

      it('should not appear in the formatting options', () => {
        expect(wrapper
          .find('[data-qa="dt-editor-bold-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-italics-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-underline-btn"]')
          .exists()).toBe(false);

        expect(wrapper
          .find('[data-qa="dt-editor-strike-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-list-items-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-add-link-btn"]')
          .exists()).toBe(true);
      });
    });

    describe('When strike button is disabled', () => {
      beforeEach(async () => {
        _mountWrapper();
        await wrapper.setProps({ showStrikeButton: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });

      it('should not appear in the formatting options', () => {
        expect(wrapper
          .find('[data-qa="dt-editor-bold-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-italics-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-underline-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-strike-btn"]')
          .exists()).toBe(false);

        expect(wrapper
          .find('[data-qa="dt-editor-list-items-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-add-link-btn"]')
          .exists()).toBe(true);
      });
    });

    describe('When list items button is disabled', () => {
      beforeEach(async () => {
        _mountWrapper();
        await wrapper.setProps({ showListItemsButton: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });

      it('should not appear in the formatting options', () => {
        expect(wrapper
          .find('[data-qa="dt-editor-bold-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-italics-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-underline-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-strike-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-list-items-btn"]')
          .exists()).toBe(false);

        expect(wrapper
          .find('[data-qa="dt-editor-add-link-btn"]')
          .exists()).toBe(true);
      });
    });

    describe('When add link button is disabled', () => {
      beforeEach(async () => {
        _mountWrapper();
        await wrapper.setProps({ showAddLink: { showAddLinkButton: false } });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });

      it('should not appear in the formatting options', () => {
        expect(wrapper
          .find('[data-qa="dt-editor-bold-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-italics-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-underline-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-strike-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-list-items-btn"]')
          .exists()).toBe(true);

        expect(wrapper
          .find('[data-qa="dt-editor-add-link-btn"]')
          .exists()).toBe(false);
      });
    });
  });

  describe('Interactivity tests', function () {
    beforeEach(async () => {
      _mountWrapper();
      await wrapper.vm.$nextTick();
      _setChildWrappers();
    });

    describe('When bold font button is clicked', () => {
      it('editor output should be enclosed in bold html tags', async () => {
        await boldFormatBtn.trigger('click');
        await wrapper.vm.$nextTick();
        expect(editor.html()).toContain('<strong>In the beginning, it was a nice day.</strong>');
      });
    });

    describe('When italics font button is clicked', () => {
      it('editor output should be enclosed in italics html tags', async () => {
        await italicsFormatBtn.trigger('click');
        await wrapper.vm.$nextTick();
        expect(editor.html()).toContain('<em>In the beginning, it was a nice day.</em>');
      });
    });

    describe('When underline text button is clicked', () => {
      it('editor output should be enclosed in underline html tags', async () => {
        await underlineFormatBtn.trigger('click');
        await wrapper.vm.$nextTick();
        expect(editor.html()).toContain('<u>In the beginning, it was a nice day.</u>');
      });
    });

    describe('When strike button is clicked', () => {
      it('editor output should be enclosed in strike html tags', async () => {
        await strikeFormatBtn.trigger('click');
        await wrapper.vm.$nextTick();
        expect(editor.html()).toContain('<s>In the beginning, it was a nice day.</s>');
      });
    });

    describe('When list items button is clicked', () => {
      it('editor output should be enclosed in list item html tags', async () => {
        const expectedHtmlOutput = '<ul><li><p>In the beginning, it was a nice day.</p></li></ul>';
        await listItemsFormatBtn.trigger('click');
        await wrapper.vm.$nextTick();

        // Editor adds spaces and linebreaks for this. So remove them to compare
        const editorHtmlOutput = editor.html().replaceAll(/[\n\r]/g, '').replaceAll(' ', '');
        expect(editorHtmlOutput)
          .toContain(expectedHtmlOutput.replaceAll(' ', ''));
      });
    });

    describe('When add link button is clicked', () => {
      // eslint-disable-next-line vitest/expect-expect
      it('link input modal should be opened and closed when confirm button is closed', async () => {
        await addLinkBtn.trigger('click');

        linkInputEl = await wrapper.find('[data-qa="dt-editor-link-input"]');

        expect(linkInputEl.exists()).toBe(true);
        expect(linkInputEl.isVisible()).toBe(true);

        confirmAddLinkBtn = await wrapper.find('[data-qa="dt-editor-set-link-confirm-btn"]');

        await confirmAddLinkBtn.trigger('click');
        await wrapper.vm.$nextTick();

        expect(linkInputEl.exists()).toBe(true);
        expect(linkInputEl.isVisible()).toBe(false);
      });

      it('link input modal should be opened and closed when cancel button is closed', async () => {
        await addLinkBtn.trigger('click');

        linkInputEl = await wrapper.find('[data-qa="dt-editor-link-input"]');

        expect(linkInputEl.exists()).toBe(true);
        expect(linkInputEl.isVisible()).toBe(true);

        cancelAddLinkBtn = await wrapper.find('[data-qa="dt-editor-set-link-cancel-btn"]');

        await cancelAddLinkBtn.trigger('click');
        await wrapper.vm.$nextTick();

        expect(linkInputEl.isVisible()).toBe(false);
      });
    });
  });
});
