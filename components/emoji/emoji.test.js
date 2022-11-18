import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtEmoji from './emoji.vue';
import { setEmojiAssetUrlSmall, setEmojiAssetUrlLarge, setCustomEmojiUrl, setCustomEmojiJson } from '@/common/emoji.js';
import { flushPromises } from '@/common/utils.js';
import customEmojiJson from '@/common/custom-emoji.json';

setEmojiAssetUrlSmall('https://mockstorage.com/emojis/', '.png');
setEmojiAssetUrlLarge('https://mockstorage.com/emojis/', '.svg');
setCustomEmojiUrl('https://mockstorage.com/emojis/');

// Constants
const basePropsData = {};

describe('DtEmoji Tests', function () {
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
  const expectedSmileSrcSmall = 'https://mockstorage.com/emojis/1f604.png';
  const expectedLaughingSrc = 'https://mockstorage.com/emojis/1f606.svg';
  const expectedPointUpLight = 'https://mockstorage.com/emojis/261d-1f3fb.svg';
  const expectedShipIt = 'https://mockstorage.com/emojis/shipit.png';

  // Helpers
  const _setChildWrappers = async () => {
    emoji = await wrapper.find('img');
  };

  const _setWrappers = async () => {
    wrapper = mount(DtEmoji, {
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
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    describe('When a code string is passed in', function () {
      beforeEach(async function () {
        propsData = {
          code: ':smile:',
        };
        await _setWrappers();
      });

      it('renders the correct emoji', async function () {
        assert.strictEqual(emoji.attributes('src'), expectedSmileSrc);
      });
      describe('When a prop changes to a new code', function () {
        beforeEach(async function () {
          await wrapper.setProps({ code: ':laughing:' });
          await flushPromises();
          await _setChildWrappers();
        });
        it('should display the correct emoji with the new code', function () {
          assert.strictEqual(emoji.attributes('src'), expectedLaughingSrc);
        });
      });

      describe('When a prop changes to a new custom emoji code', function () {
        beforeEach(async function () {
          setCustomEmojiJson(customEmojiJson);
          await wrapper.setProps({ code: ':shipit:' });
          await flushPromises();
          await _setChildWrappers();
        });
        after(function () {
          setCustomEmojiJson('');
        });
        it('should display the correct emoji with the new custom code', function () {
          assert.strictEqual(emoji.attributes('src'), expectedShipIt);
        });
      });

      describe('When a prop changes to an invalid code', function () {
        beforeEach(async function () {
          await wrapper.setProps({ code: ':invalidcode:' });
          await flushPromises();
          await _setChildWrappers();
        });
        it('should display a "not found" image', function () {
          assert.strictEqual(emoji.attributes('title'), 'Invalid Emoji');
        });
      });

      describe('When the size changes to 800', function () {
        beforeEach(async function () {
          await wrapper.setProps({ size: '800' });
        });
        it('the correct class is set on the element', function () {
          assert.isTrue(emoji.classes('d-icon--size-800'));
        });
      });

      describe('When the size changes to 200', function () {
        beforeEach(async function () {
          await wrapper.setProps({ size: '200' });
          await flushPromises();
        });
        it('the emoji is rendered using the "small emoji" url', function () {
          assert.strictEqual(emoji.attributes('src'), expectedSmileSrcSmall);
        });
      });
    });

    describe('When a skin tone emoji is passed in', function () {
      beforeEach(async function () {
        propsData = {
          code: ':point_up_tone1:',
        };
        await _setWrappers();
      });
      it('renders the correct emoji', function () {
        assert.strictEqual(emoji.attributes('src'), expectedPointUpLight);
      });
    });

    describe('When an emoji unicode is passed in', function () {
      beforeEach(async function () {
        propsData = {
          code: '☝🏻',
        };
        await _setWrappers();
      });
      it('renders the correct emoji', function () {
        assert.strictEqual(emoji.attributes('src'), expectedPointUpLight);
      });
    });
  });

  describe('Accessibility Tests', function () {
    /*
     * Test(s) to ensure that the component is accessible
     */

    describe('When an emoji is rendered', function () {
      beforeEach(async function () {
        propsData = {
          code: ':smile:',
        };
        await _setWrappers();
      });
      it('should have aria-label describing the emoji', function () {
        assert.strictEqual(emoji.attributes('aria-label'), 'grinning face with smiling eyes');
      });
    });
  });
});
