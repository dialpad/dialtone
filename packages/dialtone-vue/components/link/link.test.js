import { mount } from '@vue/test-utils';
import DtLink from './link.vue';
import {
  LINK_KIND_MODIFIERS,
  CRITICAL,
  POSITIVE,
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
let mockAttrs = {};
let mockGlobal = {};

describe('DtLink tests', () => {
  let wrapper;
  let nativeLink;

  const updateWrapper = () => {
    wrapper = mount(DtLink, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      attrs: { ...mockAttrs },
      global: { ...mockGlobal },
    });

    nativeLink = wrapper.find('[data-qa="dt-link"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    mockGlobal = {};
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

    describe('When tone is critical', () => {
      it('should have correct class', () => {
        mockProps = { tone: CRITICAL };

        updateWrapper();

        expect(nativeLink.classes('d-link--critical')).toBe(true);
      });
    });

    describe('When tone is positive', () => {
      it('should have correct class', () => {
        mockProps = { tone: POSITIVE };

        updateWrapper();

        expect(nativeLink.classes('d-link--positive')).toBe(true);
      });
    });

    describe('When tone is warning', () => {
      it('should have correct class', async () => {
        mockProps = { tone: WARNING };

        updateWrapper();

        expect(nativeLink.classes(LINK_KIND_MODIFIERS[WARNING])).toBe(true);
      });
    });

    describe('When tone is muted', () => {
      it('should have correct class', async () => {
        mockProps = { tone: MUTED };

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

    describe('When tone is critical and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { tone: CRITICAL, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(CRITICAL, true))).toBe(true);
      });
    });

    describe('When tone is positive and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { tone: POSITIVE, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(POSITIVE, true))).toBe(true);
      });
    });

    describe('When tone is warning and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { tone: WARNING, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(WARNING, true))).toBe(true);
      });
    });

    describe('When tone is muted and inverted is true', () => {
      it('should have correct class', async () => {
        mockProps = { tone: MUTED, inverted: true };

        updateWrapper();

        expect(nativeLink.classes(getLinkKindModifier(MUTED, true))).toBe(true);
      });
    });

    describe('When underline is false', () => {
      it('should have no-underline class', async () => {
        mockProps = { underline: false };

        updateWrapper();

        expect(nativeLink.classes('d-link--no-underline')).toBe(true);
      });
    });

    describe('When underline is true (default)', () => {
      it('should not have no-underline class', () => {
        expect(nativeLink.classes('d-link--no-underline')).toBe(false);
      });
    });
  });

  describe('Navigation Tests', () => {
    describe('When href is provided', () => {
      it('should render an anchor element', () => {
        mockProps = { href: 'https://example.com' };

        updateWrapper();

        expect(nativeLink.element.tagName).toBe('A');
        expect(nativeLink.attributes('href')).toBe('https://example.com');
      });
    });

    describe('When neither href nor to is provided', () => {
      it('should render an anchor with javascript:void(0) fallback', () => {
        mockProps = { href: null };

        updateWrapper();

        expect(nativeLink.element.tagName).toBe('A');
        expect(nativeLink.attributes('href')).toBe('javascript:void(0)');
      });
    });

    describe('When to is provided', () => {
      const RouterLinkStub = {
        name: 'RouterLink',
        template: '<a data-qa="dt-link" :href="to"><slot /></a>',
        props: ['to', 'replace'],
      };

      it('should render a router-link', () => {
        mockProps = { to: '/components/' };
        mockGlobal = {
          stubs: { RouterLink: RouterLinkStub },
        };

        updateWrapper();

        const routerLink = wrapper.findComponent(RouterLinkStub);
        expect(routerLink.exists()).toBe(true);
        expect(routerLink.props('to')).toBe('/components/');
      });

      it('should pass replace prop to router-link', () => {
        mockProps = { to: '/components/', replace: true };
        mockGlobal = {
          stubs: { RouterLink: RouterLinkStub },
        };

        updateWrapper();

        const routerLink = wrapper.findComponent(RouterLinkStub);
        expect(routerLink.props('replace')).toBe(true);
      });

      it('should default replace to false', () => {
        mockProps = { to: '/components/' };
        mockGlobal = {
          stubs: { RouterLink: RouterLinkStub },
        };

        updateWrapper();

        const routerLink = wrapper.findComponent(RouterLinkStub);
        expect(routerLink.props('replace')).toBe(false);
      });

      it('should support object routes', () => {
        const route = { name: 'components', params: { id: 1 } };
        mockProps = { to: route };
        mockGlobal = {
          stubs: { RouterLink: RouterLinkStub },
        };

        updateWrapper();

        const routerLink = wrapper.findComponent(RouterLinkStub);
        expect(routerLink.props('to')).toEqual(route);
      });
    });

    describe('When both to and href are provided', () => {
      const RouterLinkStub = {
        name: 'RouterLink',
        template: '<a data-qa="dt-link"><slot /></a>',
        props: ['to', 'replace'],
      };

      it('should render router-link (to takes precedence)', () => {
        mockProps = { to: '/components/', href: 'https://example.com' };
        mockGlobal = {
          stubs: { RouterLink: RouterLinkStub },
        };

        updateWrapper();

        const routerLink = wrapper.findComponent(RouterLinkStub);
        expect(routerLink.exists()).toBe(true);
        expect(routerLink.props('to')).toBe('/components/');
      });
    });

    describe('When to is provided with tone', () => {
      const RouterLinkStub = {
        name: 'RouterLink',
        template: '<a data-qa="dt-link" :class="$attrs.class"><slot /></a>',
        props: ['to', 'replace'],
      };

      it('should apply link classes to the router-link', () => {
        mockProps = { to: '/components/', tone: MUTED };
        mockGlobal = {
          stubs: { RouterLink: RouterLinkStub },
        };

        updateWrapper();

        const routerLink = wrapper.findComponent(RouterLinkStub);
        expect(routerLink.exists()).toBe(true);
        expect(wrapper.find('[data-qa="dt-link"]').classes()).toContain('d-link');
        expect(wrapper.find('[data-qa="dt-link"]').classes()).toContain(LINK_KIND_MODIFIERS[MUTED]);
      });
    });
  });
});
