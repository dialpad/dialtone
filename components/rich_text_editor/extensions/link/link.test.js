import { mount, createLocalVue } from '@vue/test-utils';
import DtRichTextEditor from '../../rich_text_editor.vue';
import { EditorContent } from '@tiptap/vue-2';

// Wrappers
let wrapper;
let editorEl;

// Test Environment
let propsData;
let attrs;
let slots;
let listeners;
const localVue = createLocalVue();

// Constants
const baseProps = {
  value: 'initial value',
  inputAriaLabel: 'aria-label text',
  link: true,
  inputClass: 'qa-editor',
};

// These are not all prefixes and suffixes, but some common ones
const allowedPrefixes = `~!$%^&*()+>?:"{}|[]\\;',./`.split('').map(a => [a]);
const allowedSuffixes = `~!@#$%^&*()+<>?:"{}|[]\\',.`.split('').map(a => [a]);
const punctuationMarks = `!?.,:;'"`.split('').map(a => [a]);
// these are reserved for mentions and channel hashtags
const disallowedPrefixes = ['@', '#'];

// Helpers
const _setChildWrappers = () => {
  editorEl = document.getElementsByClassName('qa-editor')[0];
};

const _setValue = async (value) => {
  editorEl.innerHTML = value;
  await wrapper.vm.$nextTick();
};

const _getLinksFromJSON = () => {
  const json = wrapper.vm.editor.getJSON();
  const links = [];

  for (const paragraph of json.content) {
    for (const textNode of paragraph.content) {
      if (!textNode.marks?.some(mark => mark.type === 'Link')) {
        continue;
      }
      links.push(textNode);
    }
  }

  return links;
};

const _filterCharacters = (array, characters) => {
  return array.filter(c => !characters.split('').includes(c[0]));
};

const _mountWrapper = () => {
  // remove the previous element if it exists or otherwise we'll end up with
  // multiple elements when re-mounting.
  editorEl?.remove();
  wrapper = mount(DtRichTextEditor, {
    propsData,
    components: { EditorContent },
    listeners,
    attrs,
    slots,
    localVue,
    attachTo: document.body,
  });
};

expect.extend({
  toHaveLinksWithTexts (received, expected) {
    const isSameLength = received.length === expected.length;
    const hasSameTexts = !expected.some((t, i) => received[i]?.text !== t);
    return {
      pass: isSameLength && hasSameTexts,
      message: () => `Expected ${expected.length} link(s): [${expected.join(', ')}] ` +
        `and received ${received.length} link(s): [${received.map(a => a.text).join(', ')}]`,
    };
  },
});

describe('DtRichTextEditor Link Extension tests', () => {
  // Test Setup
  beforeAll(() => {
    global.Range.prototype.getClientRects = vi.fn(() => [{}]);
    global.Range.prototype.getBoundingClientRect = vi.fn(() => [{}]);
    global.scrollBy = vi.fn();
  });

  beforeEach(async () => {
    propsData = baseProps;
    _mountWrapper();
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  });

  // Test Teardown
  afterEach(() => {
    propsData = baseProps;
    slots = {};
  });

  describe('Functionality Tests', () => {
    describe('URLs', () => {
      describe('without a protocol', () => {
        it.each([
          ['check out dialpad,com it is cool'],
          ['check out dialpad com it is cool'],
          ['check out dialpadcom it is cool'],
          ['check out dialpad..com it is cool'],
          ['check out dialpad.comm it is cool'],
        ])('should not linkify invalid URL "%s"', async (input) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
        });

        it.each([
          ['check out dialpad.com it is cool', ['dialpad.com']],
          ['check out dialpad.com, and fspot.us!', ['dialpad.com', 'fspot.us']],
        ])('should linkify with valid content "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        describe('with a prefix', () => {
          it.each(allowedPrefixes)('should linkify despite "%s" prefix', async (input) => {
            await _setValue(`check out ${input}dialpad.com it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts(['dialpad.com']);
          });

          it.each(disallowedPrefixes)('should not linkify with "%s" prefix', async (input) => {
            await _setValue(`check out ${input}dialpad.com it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
          });
        });

        describe('with a suffix', () => {
          it.each(allowedSuffixes)('should linkify despite "%s" suffix', async (input) => {
            await _setValue(`check out dialpad.com${input} it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts(['dialpad.com']);
          });
        });
      });

      describe('with a protocol', () => {
        // the hostname is still a valid link, so expect it without the
        // invalid protocol part
        it.each([
          ['check out https:://dialpad.com it is cool', ['dialpad.com']],
          ['check out https:/dialpad.com it is cool', ['dialpad.com']],
          ['check out https//dialpad.com it is cool', ['dialpad.com']],
          ['check out ://dialpad.com it is cool', ['dialpad.com']],
        ])('should not linkify invalid URL "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        it.each([
          ['check out https://dialpad.com it is cool', ['https://dialpad.com']],
          ['check out https://dialpad.com, and http://fspot.us!', ['https://dialpad.com', 'http://fspot.us']],
          ['check out our web socket ws://dialpad.com!', ['ws://dialpad.com']],
        ])('should linkify with valid content "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        describe('with a prefix', () => {
          it.each(allowedPrefixes)('should linkify despite "%s" prefix', async (input) => {
            await _setValue(`check out ${input}https://dialpad.com it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts(['https://dialpad.com']);
          });

          it.each(disallowedPrefixes)('should not linkify with "%s" prefix', async (input) => {
            await _setValue(`check out ${input}https://dialpad.com it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
          });
        });

        describe('with a punctuation mark suffix', () => {
          // this regex includes most suffix characters as a part of the match,
          // but it shouldn't do so for punctuation marks
          it.each(punctuationMarks)('should linkify despite "%s" suffix', async (input) => {
            await _setValue(`check out https://dialpad.com${input} it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts(['https://dialpad.com']);
          });
        });
      });
    });

    describe('IPv4 Addresses', () => {
      it.each([
        ['I live at 192.158.1.999 how about you?'],
        ['I live at 192.1581.38 how about you?'],
        ['I live at 192.158.1.38a how about you?'],
        ['I live at 2001:db8:3333:4444:5555:6666:7777:8888 how about you?'],
      ])('should not linkify invalid IP address "%s"', async (input) => {
        await _setValue(input);
        expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
      });

      it.each([
        ['I live at 192.158.1.38 how about you?', ['192.158.1.38']],
        ['I live at 192.158.1.38 and 127.0.0.1 how about you?', ['192.158.1.38', '127.0.0.1']],
      ])('should linkify with valid ID address "%s"', async (input, expected) => {
        await _setValue(input);
        expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
      });

      describe('with a prefix', () => {
        it.each(allowedPrefixes)('should linkify despite "%s" prefix', async (input) => {
          await _setValue(`I live at ${input}192.158.1.38 how about you?`);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(['192.158.1.38']);
        });

        it.each(disallowedPrefixes)('should not linkify with "%s" prefix', async (input) => {
          await _setValue(`I live at ${input}192.158.1.38 how about you?`);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
        });
      });

      describe('with a suffix', () => {
        it.each(allowedSuffixes)('should linkify despite "%s" suffix', async (input) => {
          await _setValue(`I live at 192.158.1.38${input} how about you?`);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(['192.158.1.38']);
        });
      });
    });

    describe('Email Addresses', () => {
      it.each([
        ['message me at noreply@dialpad,com!'],
        ['message me at noreply@dialpad com!'],
        ['message me at noreply@dialpadcom!'],
        ['message me at noreply@dialpad..com!'],
        ['message me at noreply@dialpad.comm!'],
        ['message me at mailto:noreply@dialpad.comm!'],
      ])('should not linkify invalid email address "%s"', async (input) => {
        await _setValue(input);
        expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
      });

      it.each([
        ['message me at noreply@dialpad.com!', ['noreply@dialpad.com']],
        [
          'message me at noreply@dialpad.com or mailto:no.reply@fspot.us!',
          ['noreply@dialpad.com', 'mailto:no.reply@fspot.us'],
        ],
        // linkifies just the valid hostname part of the email address
        ['message me at noreply(at)dialpad.com!', ['dialpad.com']],
      ])('should linkify with valid content "%s"', async (input, expected) => {
        await _setValue(input);
        expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
      });

      it.each([
        [
          'message me at noreply@dialpad.com?subject=Hey&body=Hi!',
          ['noreply@dialpad.com?subject=Hey&body=Hi'],
        ],
        [
          'message me at mailto:noreply@dialpad.com?subject=Hey&body=Hi!',
          ['mailto:noreply@dialpad.com?subject=Hey&body=Hi'],
        ],
      ])('should linkify with URL params "%s"', async (input, expected) => {
        await _setValue(input);
        expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
      });

      describe('with a prefix', () => {
        // remove a few characters that can be a part of an email address
        const emailPrefixes = _filterCharacters(allowedPrefixes, `~!$%^&*+?{}|'/`);
        it.each(emailPrefixes)('should linkify despite "%s" prefix', async (input) => {
          await _setValue(`check out ${input}noreply@dialpad.com it is cool`);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(['noreply@dialpad.com']);
        });

        it.each(disallowedPrefixes)('should not linkify with "%s" prefix', async (input) => {
          await _setValue(`check out ${input}noreply@dialpad.com it is cool`);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
        });
      });

      describe('Phone Numbers', () => {
        it.each([
          ['call me at 714,410,7035 any time!'],
          ['call me at 410703 any time!'],
          ['call me at 714 any time!'],
          ['call me at 714:410:7035 any time!'],
          ['call me at +1714410703514521 any time!'],
          // this is normally a valid format, but not for us...
          ['call me at 714.410.7035 any time!'],
        ])('should not linkify invalid phone number "%s"', async (input) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
        });

        it.each([
          ['call me at (714) 410-7035 any time!', ['(714) 410-7035']],
          ['call me at +17144107035 any time!', ['+17144107035']],
          ['call me at 714-410-7035 any time!', ['714-410-7035']],
          ['call me at 714 410 7035 any time!', ['714 410 7035']],
        ])('should linkify with valid content "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        describe('with a prefix', () => {
          // remove a few characters that can be a part of a phone number
          const phonePrefixes = _filterCharacters(allowedPrefixes, '()+');
          it.each(phonePrefixes)('should linkify despite "%s" prefix', async (input) => {
            await _setValue(`check out ${input}(714) 410-7035 it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts(['(714) 410-7035']);
          });

          it.each(disallowedPrefixes)('should not linkify with "%s" prefix', async (input) => {
            await _setValue(`should not linkify with ${input} prefix`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts([]);
          });
        });

        describe('with a suffix', () => {
          it.each(allowedSuffixes)('should linkify despite "%s" suffix', async (input) => {
            await _setValue(`check out (714) 410-7035${input} it is cool`);
            expect(_getLinksFromJSON()).toHaveLinksWithTexts(['(714) 410-7035']);
          });
        });
      });
    });
  });

  describe('Reactivity Tests', () => {
    describe('User Input Tests', () => {
      describe('When user inputs a value', () => {
        it.each([
          ['check out dialpad.c', []],
          // match .co TLD
          ['check out dialpad.co', ['dialpad.co']],
          // when typing it into a .com TLD the match should update since it's still valid
          ['check out dialpad.com', ['dialpad.com']],
        ])('should add link when typing "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        it.each([
          // valid link with .co TLD
          ['check out dialpad.co', ['dialpad.co']],
          // when typing it into an invalid .co8 TLD should remove link
          ['check out dialpad.co8', []],
        ])('should remove the link when typing "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        it.each([
          ['check out', []],
          ['check out dialpad.com it is cool', ['dialpad.com']],
        ])('should linkify when copy-pasting a link "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        it.each([
          ['check out dialpad.com, and fspot.us!', ['dialpad.com', 'fspot.us']],
          // "select" and remove ".com, and fspot" from the middle
          ['check out dialpad.us!', ['dialpad.us']],
          // add whitespace in the middle of the link
          ['check out dial pad.us!', ['pad.us']],
        ])('updates links when mutating the content so that a new link forms "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });

        // this is an edge case and there is special code in place to handle it,
        // changing a whitespace separated phone number from invalid to valid
        it.each([
          ['call me at 714 4.0 7035 any time!', []],
          ['call me at 714 410 7035 any time!', ['714 410 7035']],
        ])('adds links when mutating a whitespace separated phone number "%s"', async (input, expected) => {
          await _setValue(input);
          expect(_getLinksFromJSON()).toHaveLinksWithTexts(expected);
        });
      });
    });
  });
});
