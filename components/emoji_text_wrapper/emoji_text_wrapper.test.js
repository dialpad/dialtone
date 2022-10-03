import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtEmojiTextWrapper from './emoji_text_wrapper.vue';
import { setCustomEmojiJson, setCustomEmojiUrl, setEmojiAssetUrlLarge } from '@/common/emoji.js';
import { flushPromises } from '@/common/utils.js';
import customEmojiJson from '@/common/custom-emoji.json';

setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

// Constants
const basePropsData = {};

describe('DtEmojiTextWrapper Tests', function () {
  // Wrappers
  let wrapper;
  let emoji;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Expected
  const expectedSmileSrc = 'https://mockstorage.com/emojis/1f604.svg';
  const expectedOctocatSrc = 'https://mockstorage.com/emojis/octocat.png';

  // Helpers
  const _setChildWrappers = async () => {
    emoji = await wrapper.find('img');
  };

  const _setWrappers = async () => {
    wrapper = mount(DtEmojiTextWrapper, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: this.localVue,
    });
    await flushPromises();
    await _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('When default slot is provided', function () {
      describe('When default slot does not contains shortcode or unicode emoji', function () {
        beforeEach(async function () {
          slots = { default: 'Content without emoji.' };
          await _setWrappers();
        });

        it('Renders the text correctly', function () {
          assert.strictEqual(wrapper.text(), slots.default);
        });

        it('Does not contain emoji component', function () {
          assert.strictEqual(emoji.exists(), false);
        });
      });
      describe('When default slot contains shortcodes', function () {
        describe('When default slot contains valid shortcode', function () {
          beforeEach(async function () {
            slots = { default: 'Content with :smile: emoji.' };
            await _setWrappers();
          });

          it('Contains emoji component', function () {
            assert.strictEqual(emoji.exists(), true);
          });

          it('Renders the correct emoji', function () {
            assert.strictEqual(emoji.attributes('src'), expectedSmileSrc);
          });
        });
        describe('When default slot contains valid custom shortcode', function () {
          beforeEach(async function () {
            setCustomEmojiJson(customEmojiJson);
            slots = { default: 'Content with :octocat: emoji.' };
            await _setWrappers();
          });
          after(function () {
            setCustomEmojiJson('');
          });

          it('Contains emoji component', function () {
            assert.strictEqual(emoji.exists(), true);
          });

          it('Renders the correct emoji', function () {
            assert.strictEqual(emoji.attributes('src'), expectedOctocatSrc);
          });
        });
        describe('When default slot contains text with a colon and a valid emoji', function () {
          beforeEach(async function () {
            slots = { default: 'This is a smile emoji: :smile:' };
            await _setWrappers();
          });

          it('Contains emoji component', function () {
            assert.strictEqual(emoji.exists(), true);
          });

          it('Renders the correct emoji', function () {
            assert.strictEqual(emoji.attributes('src'), expectedSmileSrc);
          });
        });
        describe('When default slot contains invalid shortcode', function () {
          beforeEach(async function () {
            slots = { default: 'Content with :invalid: emoji.' };
            await _setWrappers();
          });

          it('Renders text only', function () {
            assert.strictEqual(wrapper.text(), slots.default);
          });

          it('Does not contain emoji component', function () {
            assert.strictEqual(emoji.exists(), false);
          });
        });
      });
      describe('When default slot contains unicode emoji', function () {
        describe('When default slot contains valid unicode emoji', function () {
          beforeEach(async function () {
            slots = { default: 'Content with valid 😄 emoji.' };
            await _setWrappers();
          });

          it('Contains emoji component', function () {
            assert.strictEqual(emoji.exists(), true);
          });

          it('Renders the correct emoji', function () {
            assert.strictEqual(emoji.attributes('src'), expectedSmileSrc);
          });
        });
        describe('When default slot contains invalid unicode emoji', function () {
          beforeEach(async function () {
            slots = { default: 'Content with invalid 🫡 emoji.' };
            await _setWrappers();
          });

          it('Contains emoji component', function () {
            assert.strictEqual(emoji.exists(), true);
          });

          it('Renders the invalid emoji image', function () {
            assert.strictEqual(emoji.attributes('src'), 'invalid');
          });
        });
      });
    });
    describe('When default slot is not provided', function () {
      beforeEach(async function () {
        await _setWrappers();
      });

      it('Is empty', function () {
        assert.strictEqual(wrapper.text(), '');
      });
    });
  });
});
