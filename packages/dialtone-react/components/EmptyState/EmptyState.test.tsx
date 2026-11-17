import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DtIcon } from '../Icon';
import { DtIllustration } from '../Illustration';
import { DtEmptyState, type DtEmptyStateProps } from './EmptyState';

const MOCK_HEADER_TEXT = 'Nothing to see here';
const MOCK_BODY_TEXT = 'Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque.';
const MOCK_BODY_SLOT = '<h2 data-qa="empty-state-body">Custom body slot</h2>';
const MOCK_ICON_SLOT = <DtIcon name="accessibility" />;
const MOCK_ILLUSTRATION_SLOT = <DtIllustration name="mind" />;

const baseProps: DtEmptyStateProps = {
  headerText: MOCK_HEADER_TEXT,
  bodyText: MOCK_BODY_TEXT,
};

type Slots = Pick<DtEmptyStateProps, 'body' | 'icon' | 'illustration'>;

// The body slot as Vue's string slot: markup, parsed.
const bodyFromHtml = (html: string) => <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;

const baseSlots: Slots = { body: bodyFromHtml(MOCK_BODY_SLOT) };

let mockProps: Partial<DtEmptyStateProps> = {};
let mockSlots: Slots = {};

describe('DtIllustration Tests', () => {
  let result: RenderResult | null;
  let wrapper: HTMLElement;
  let illustration: HTMLElement | null;
  let icon: HTMLElement | null;
  let headerText: HTMLElement;
  let bodyText: HTMLElement;
  let bodySlot: HTMLElement | null;

  const qa = (name: string) => result!.container.querySelector<HTMLElement>(`[data-qa="${name}"]`);

  const setChildren = () => {
    wrapper = result!.container.firstElementChild as HTMLElement;
    illustration = qa('dt-illustration');
    icon = qa('dt-icon');
    [headerText, bodyText] = Array.from(result!.container.querySelectorAll<HTMLElement>('[data-qa="dt-text"]'));
    bodySlot = qa('empty-state-body');
  };

  const element = (props: Partial<DtEmptyStateProps>) => (
    <DtEmptyState {...baseProps} {...props} {...baseSlots} {...mockSlots} />
  );

  const updateWrapper = () => {
    result?.unmount();
    result = render(element(mockProps));
    setChildren();
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    result = null;
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the header text', () => {
      expect(headerText.textContent).toBe(MOCK_HEADER_TEXT);
    });

    it('Should render the body text', () => {
      expect(bodyText.textContent).toBe(MOCK_BODY_TEXT);
    });

    it('Should render the custom body slot', () => {
      expect(bodySlot!.outerHTML).toBe(MOCK_BODY_SLOT);
    });

    it('Should render size classes in wrapper', () => {
      expect(wrapper.getAttribute('data-qa')).toBe('dt-stack');
      expect(wrapper).toHaveClass('d-empty-state', 'd-empty-state--size-lg');
    });

    it('Should render correct headline classes in header text', () => {
      expect(headerText).toHaveClass('d-text-headline--2xl');
    });

    it('Should render correct body classes in body text', () => {
      expect(bodyText).toHaveClass('d-text-body--lg');
    });
  });

  describe('Numeric size', () => {
    it('Should render correct size class with numeric value', () => {
      mockProps = { size: 200 };

      updateWrapper();

      expect(wrapper).toHaveClass('d-empty-state--size-sm');
    });
  });

  describe('Interactivity Tests', () => {
    describe('On size change', () => {
      it('Should update size classes in wrapper', () => {
        result!.rerender(element({ size: 'md' }));
        setChildren();

        expect(wrapper).toHaveClass('d-empty-state', 'd-empty-state--size-md');
        expect(wrapper).not.toHaveClass('d-empty-state--size-lg');
      });

      it('Should update headline classes in header text', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        expect(headerText).toHaveClass('d-text-headline--xl');
      });

      it('Should update body classes in body text', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        expect(bodyText).toHaveClass('d-text-body--md');
      });
    });

    describe('With illustration and icon provided', () => {
      beforeEach(() => {
        mockSlots = {
          illustration: MOCK_ILLUSTRATION_SLOT,
          icon: MOCK_ICON_SLOT,
        };
      });

      it('Should render illustration component on `lg` size and not icon', () => {
        mockProps = { size: 'lg' };

        updateWrapper();

        expect(illustration).toBeInTheDocument();
        expect(icon).not.toBeInTheDocument();
      });

      it('Should render illustration component on `md` size and not icon', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        expect(illustration).toBeInTheDocument();
        expect(icon).not.toBeInTheDocument();
      });

      it('Should render icon component on `sm` size and not illustration', () => {
        mockProps = { size: 'sm' };

        updateWrapper();

        expect(illustration).not.toBeInTheDocument();
        expect(icon).toBeInTheDocument();
        expect(icon!.getAttribute('data-name')).toBe('Accessibility');
      });
    });

    describe('With icon provided but not illustration', () => {
      beforeEach(() => {
        mockSlots = {
          icon: MOCK_ICON_SLOT,
        };
      });

      it('Should render icon component on `lg` size', () => {
        mockProps = { size: 'lg' };

        updateWrapper();

        expect(illustration).not.toBeInTheDocument();
        expect(icon).toBeInTheDocument();
      });

      it('Should render icon component on `md` size', () => {
        mockProps = { size: 'md' };

        updateWrapper();

        expect(illustration).not.toBeInTheDocument();
        expect(icon).toBeInTheDocument();
      });

      it('Should render icon component on `sm` size', () => {
        mockProps = { size: 'sm' };

        updateWrapper();

        expect(illustration).not.toBeInTheDocument();
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('Pass-through class props', () => {
    it('Should apply illustrationClass to the illustration wrapper', () => {
      mockSlots = { illustration: MOCK_ILLUSTRATION_SLOT };
      mockProps = { illustrationClass: 'my-illustration-class' };

      updateWrapper();

      expect(qa('dt-empty-state-illustration')).toHaveClass('my-illustration-class');
    });

    it('Should apply iconClass to the icon wrapper', () => {
      mockSlots = { icon: MOCK_ICON_SLOT };
      mockProps = { size: 'sm', iconClass: 'my-icon-class' };

      updateWrapper();

      expect(qa('dt-empty-state-icon')).toHaveClass('my-icon-class');
    });

    it('Should apply bodyClass to the body slot wrapper', () => {
      mockProps = { bodyClass: 'my-body-class' };
      mockSlots = { body: bodyFromHtml(MOCK_BODY_SLOT) };

      updateWrapper();

      const bodyWrapper = qa('dt-empty-state-body-slot');

      expect(bodyWrapper).toBeInTheDocument();
      expect(bodyWrapper).toHaveClass('my-body-class');
      expect(bodyWrapper!.querySelector('[data-qa="empty-state-body"]')).toBeInTheDocument();
    });
  });

  describe('Validation Tests', () => {
    describe('With no bodyText or body slot provided', () => {
      it('Should console.error', () => {
        const message = `DtEmptyState: You should provide either bodyText or content on body slot.`;

        const consoleError = vi.spyOn(console, 'error').mockClear();

        mockProps = { bodyText: undefined };
        mockSlots = { body: '' };

        updateWrapper();

        expect(consoleError).toHaveBeenCalledWith(message);

        consoleError.mockRestore();
      });
    });
  });

  describe('Empty illustration fragment', () => {
    it('Should fall back to the icon when the illustration is an empty fragment', () => {
      mockProps = { size: 400 };
      mockSlots = { illustration: <></>, icon: MOCK_ICON_SLOT };

      updateWrapper();

      expect(icon).toBeInTheDocument();
    });

    it('Should keep a non-empty fragment as the illustration', () => {
      mockProps = { size: 400 };
      mockSlots = { illustration: <>{MOCK_ILLUSTRATION_SLOT}</>, icon: MOCK_ICON_SLOT };

      updateWrapper();

      expect(illustration).toBeInTheDocument();
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Icon slot scope', () => {
    it('Should pass the icon size to a function icon slot', () => {
      mockProps = { size: 'sm' };
      mockSlots = { icon: ({ iconSize }) => <DtIcon name="accessibility" size={iconSize as '800'} /> };

      updateWrapper();

      expect(icon).toHaveClass('d-icon--size-800');
    });
  });
});
