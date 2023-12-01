import { mount } from '@vue/test-utils';
import DtRecipeCallbox from './callbox.vue';
import { CALLBOX_BADGE_COLORS, CALLBOX_BORDER_COLORS } from '@/recipes/leftbar/callbox/callbox_constants.js';

const MOCK_CALLBOX_STUB = vi.fn();
const MOCK_AVATAR_IMAGE_SOURCE = 'image.png';
const MOCK_AVATAR_FULL_NAME = 'Jaqueline Nackos';
const MOCK_AVATAR_INITIALS = 'J';
const MOCK_TITLE = '1 Participant';
const MOCK_BADGE_TEXT = 'Some_call_center';
const MOCK_BADGE_COLOR = 'warning';
const MOCK_BORDER_COLOR = 'default';
const MOCK_BADGE_SLOT_CONTENT = 'Badge slot content';
const MOCK_VIDEO_SLOT_CONTENT = 'Video slot content';
const MOCK_SUBTITLE_SLOT_CONTENT = 'Subtitle slot content';
const MOCK_RIGHT_SLOT_CONTENT = 'Right slot content';
const MOCK_BOTTOM_SLOT_CONTENT = 'Bottom slot content';

const baseProps = {
  badgeColor: MOCK_BADGE_COLOR,
  badgeText: MOCK_BADGE_TEXT,
  borderColor: MOCK_BORDER_COLOR,
  title: MOCK_TITLE,
};
const baseAttrs = {};
const baseSlots = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtRecipeCallbox Tests', () => {
  let avatar;
  let avatarImage;
  let badge;
  let badgeSlot;
  let bottomSlot;
  let rightSlot;
  let subtitleSlot;
  let title;
  let videoSlot;
  let mainContent;
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtRecipeCallbox, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
    });

    avatar = wrapper.find('[data-qa="dt-avatar"]');
    avatarImage = wrapper.find('[data-qa="dt-avatar-image"]');
    badge = wrapper.find('[data-qa="dt-badge"]');
    badgeSlot = wrapper.find('[data-qa="dt-recipe-callbox--badge-wrapper"]');
    bottomSlot = wrapper.find('[data-qa="dt-recipe-callbox--bottom-wrapper"]');
    mainContent = wrapper.find('[data-qa="dt-recipe-callbox--main-content"]');
    rightSlot = wrapper.find('[data-qa="dt-recipe-callbox--right-wrapper"]');
    subtitleSlot = wrapper.find('[data-qa="dt-recipe-callbox--subtitle-wrapper"]');
    title = wrapper.find('[data-qa="dt-recipe-callbox--title"]');
    videoSlot = wrapper.find('[data-qa="dt-recipe-callbox--video-wrapper"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    vi.resetAllMocks();
  });

  describe('Presentation Tests', () => {
    describe('When the callbox renders', () => {
      it('Should exist', () => {
        expect(wrapper.exists()).toBeTruthy();
      });
    });

    describe('When props are provided', () => {
      describe('When badgeText is provided', () => {
        it('Should display badge text', () => {
          expect(badge.text()).toBe(MOCK_BADGE_TEXT);
        });
      });

      describe('When badgeColor is provided', () => {
        it('Should display correct badge color', () => {
          expect(badge.classes(CALLBOX_BADGE_COLORS[MOCK_BADGE_COLOR])).toBe(true);
        });
      });

      describe('When avatarSrc and avatarFullName are provided', () => {
        it('Should render the image', () => {
          mockProps = {
            avatarSrc: MOCK_AVATAR_IMAGE_SOURCE,
            avatarFullName: MOCK_AVATAR_FULL_NAME,
          };

          updateWrapper();

          expect(avatar.exists()).toBeTruthy();
          expect(avatarImage.attributes('src')).toBe(MOCK_AVATAR_IMAGE_SOURCE);
        });
      });

      describe('When avatarFullName is provided', () => {
        it('Should render the avatar initials', () => {
          mockProps = { avatarFullName: MOCK_AVATAR_FULL_NAME };

          updateWrapper();

          expect(avatar.exists()).toBeTruthy();
          expect(avatar.text()).toBe(MOCK_AVATAR_INITIALS);
        });
      });

      describe('When title is provided', () => {
        it('Should display title text', () => {
          expect(title.text()).toBe(MOCK_TITLE);
        });
      });

      describe('When borderColor is provided', () => {
        it('Should display correct border color', () => {
          expect(mainContent.classes(CALLBOX_BORDER_COLORS[MOCK_BORDER_COLOR])).toBe(true);
        });
      });
    });

    describe('When props are not provided', () => {
      describe('When neither avatarSrc or avatarFullName are provided', () => {
        it('Should not display the avatar', () => {
          expect(avatar.exists()).toBeFalsy();
        });
      });
    });

    describe('When slots are provided', () => {
      describe('When badge slot is provided', () => {
        it('Renders badge slot content', () => {
          mockSlots = { badge: MOCK_BADGE_SLOT_CONTENT };

          updateWrapper();

          expect(badgeSlot.text()).toBe(MOCK_BADGE_SLOT_CONTENT);
        });
      });

      describe('When bottom slot is provided', () => {
        it('Renders bottom slot content', () => {
          mockSlots = { bottom: MOCK_BOTTOM_SLOT_CONTENT };

          updateWrapper();

          expect(bottomSlot.text()).toBe(MOCK_BOTTOM_SLOT_CONTENT);
        });
      });

      describe('When right slot is provided', () => {
        it('Renders right slot content', () => {
          mockSlots = { right: MOCK_RIGHT_SLOT_CONTENT };

          updateWrapper();

          expect(rightSlot.text()).toBe(MOCK_RIGHT_SLOT_CONTENT);
        });
      });

      describe('When subtitle slot is provided', () => {
        it('Renders subtitle slot content', () => {
          mockSlots = { subtitle: MOCK_SUBTITLE_SLOT_CONTENT };

          updateWrapper();

          expect(subtitleSlot.text()).toBe(MOCK_SUBTITLE_SLOT_CONTENT);
        });
      });

      describe('When video slot is provided', () => {
        it('Renders video slot content', () => {
          mockSlots = { video: MOCK_VIDEO_SLOT_CONTENT };

          updateWrapper();

          expect(videoSlot.text()).toBe(MOCK_VIDEO_SLOT_CONTENT);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When clickable is false (default)', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          mockProps = {
            avatarSrc: MOCK_AVATAR_IMAGE_SOURCE,
            avatarFullName: MOCK_AVATAR_FULL_NAME,
          };
          mockAttrs = { onClick: MOCK_CALLBOX_STUB };

          updateWrapper();

          await avatar.trigger('click');
        });

        it('Should not call listener', async () => {
          expect(MOCK_CALLBOX_STUB).toHaveBeenCalledTimes(0);
        });

        it('Should not emit click event', () => {
          expect(wrapper.emitted()).not.toHaveProperty('click');
        });
      });

      describe('When title is clicked', () => {
        beforeEach(async () => {
          mockAttrs = { onClick: MOCK_CALLBOX_STUB };

          updateWrapper();

          await title.trigger('click');
        });

        it('Should not call listener', async () => {
          expect(MOCK_CALLBOX_STUB).toHaveBeenCalledTimes(0);
        });

        it('Should not emit click event', () => {
          expect(wrapper.emitted()).not.toHaveProperty('click');
        });
      });
    });
    describe('When clickable is true', () => {
      describe('When avatar is clicked', () => {
        beforeEach(async () => {
          mockProps = {
            avatarSrc: MOCK_AVATAR_IMAGE_SOURCE,
            avatarFullName: MOCK_AVATAR_FULL_NAME,
            clickable: true,
          };
          mockAttrs = { onClick: MOCK_CALLBOX_STUB };

          updateWrapper();

          await avatar.trigger('click');
        });

        it('Should call listener', async () => {
          expect(MOCK_CALLBOX_STUB).toBeCalledTimes(1);
        });

        it('Should emit click event', () => {
          expect(wrapper.emitted()).toHaveProperty('click');
        });
      });

      describe('When title is clicked', () => {
        beforeEach(async () => {
          mockProps = { clickable: true };
          mockAttrs = { onClick: MOCK_CALLBOX_STUB };

          updateWrapper();

          await title.trigger('click');
        });

        it('Should call listener', async () => {
          expect(MOCK_CALLBOX_STUB).toBeCalledTimes(1);
        });

        it('Should emit click event', () => {
          expect(wrapper.emitted()).toHaveProperty('click');
        });
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Badge color validation', () => {
      describe('When badgeColor is not provided', () => {
        it('passes custom prop validation', () => {
          expect(DtRecipeCallbox.props.badgeColor.validator(null)).toBe(true);
        });
      });

      describe('When provided badgeColor is in CALLBOX_BADGE_COLORS', () => {
        it('passes custom prop validation', () => {
          expect(DtRecipeCallbox.props.badgeColor.validator(MOCK_BADGE_COLOR)).toBe(true);
        });
      });

      describe('When provided badgeColor is not in CALLBOX_BADGE_COLORS', () => {
        it('passes custom prop validation', () => {
          expect(DtRecipeCallbox.props.badgeColor.validator('INVALID_COLOR')).toBe(false);
        });
      });
    });

    describe('Border color validation', () => {
      describe('When provided borderColor is in CALLBOX_BORDER_COLORS', () => {
        it('passes custom prop validation', () => {
          expect(DtRecipeCallbox.props.borderColor.validator(DtRecipeCallbox.props.borderColor.default)).toBe(true);
        });
      });

      describe('When provided borderColor is not in CALLBOX_BORDER_COLORS', () => {
        it('passes custom prop validation', () => {
          expect(DtRecipeCallbox.props.borderColor.validator('INVALID_COLOR')).toBe(false);
        });
      });
    });
  });
});
