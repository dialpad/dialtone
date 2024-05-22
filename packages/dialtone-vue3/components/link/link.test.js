import { mount } from '@vue/test-utils';
import DtLink from './link.vue';
import {
  LINK_KIND_MODIFIERS,
  DANGER,
  SUCCESS,
  WARNING,
  MUTED,
  getLinkKindModifier,
} from './link_constants';

const baseProps = {
  href: '#',
};
const baseSlots = {
  default: 'Slotted Link',
};

let mockProps = {};
let mockSlots = {};

describe('DtLink tests', () => {
  let wrapper;
  let nativeLink;

  const updateWrapper = () => {
    wrapper = mount(DtLink, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    nativeLink = wrapper.find('[data-qa="dt-link"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the native anchor', () => {
      expect(nativeLink.exists()).toBe(true);
    });

    describe('When a default slot is provided', () => {
      it('should render the provided data', () => {
        expect(nativeLink.text()).toEqual(baseSlots.default);
      });
    });

    describe('When kind is danger', () => {
      it('should have correct class', async () => {
        mockProps = { kind: DANGER };

        updateWrapper();

        expect(nativeLink.classes(LINK_KIND_MODIFIERS[DANGER])).toBe(true);
      });
    });

    describe('When kind is success', () => {
      it('should have correct class', async () => {
        mockProps = { kind: SUCCESS };

        updateWrapper();

        expect(nativeLink.classes(LINK_KIND_MODIFIERS[SUCCESS])).toBe(true);
      });
    });

    describe('When kind is warning', () => {
      it('should have correct class', async () => {
        mockProps = { kind: WARNING };

        updateWrapper();

        expect(nativeLink.classes(LINK_KIND_MODIFIERS[WARNING])).toBe(true);
      });
    });

    describe('When kind is muted', () => {
      it('should have correct class', async () => {
        mockProps = { kind: MUTED };

        updateWrapper();

        expect(nativeLink.classes(LINK_KIND_MODIFIERS[MUTED])).toBe(true);
      });
    });

    describe('When inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier('', true))).toBe(true);
      });
    });

    describe('When kind is danger and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { kind: DANGER, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(DANGER, true))).toBe(true);
      });
    });

    describe('When kind is success and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { kind: SUCCESS, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(SUCCESS, true))).toBe(true);
      });
    });

    describe('When kind is warning and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { kind: WARNING, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(WARNING, true))).toBe(true);
      });
    });

    describe('When kind is muted and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { kind: MUTED, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(MUTED, true))).toBe(true);
      });
    });
  });
});
