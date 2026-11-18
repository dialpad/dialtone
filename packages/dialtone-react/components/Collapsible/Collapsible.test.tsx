import { cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtCollapsible, type DtCollapsibleAnchorSlotScope, type DtCollapsibleProps } from './Collapsible';

const MOCK_CONTENT_SLOT = <div data-qa="content-element"> Test Text </div>;

const baseProps: DtCollapsibleProps = {
  anchorText: 'anchor text',
};
const baseSlots: { content?: ReactNode; anchor?: DtCollapsibleProps['anchor'] } = {
  content: MOCK_CONTENT_SLOT,
};

let mockProps: DtCollapsibleProps = {};
let mockSlots: { content?: ReactNode; anchor?: DtCollapsibleProps['anchor'] } = {};

describe('DtCollapsible Tests', () => {
  let result: RenderResult;
  let props: DtCollapsibleProps;

  const anchorElement = () => screen.getByTestId('dt-button');
  const contentElement = () => screen.getByTestId('content-element');
  const contentWrapperElement = () => screen.getByTestId('dt-collapsible--content');

  const element = (p: DtCollapsibleProps) => <DtCollapsible {...p} />;

  const updateWrapper = () => {
    cleanup();
    props = { ...baseProps, ...mockProps, ...baseSlots, ...mockSlots };
    result = render(element(props));
  };

  const setProps = async (next: DtCollapsibleProps) => {
    props = { ...props, ...next };
    result.rerender(element(props));
    await finishTransitions();
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    mockProps = {};
    mockSlots = {};
  });

  describe('Test default rendering', () => {
    it('should render the component', () => {
      expect(result.container.firstElementChild).toBeInTheDocument();
    });

    it('should render the anchor', () => {
      expect(anchorElement()).toBeInTheDocument();
    });

    it('should render the content', () => {
      expect(contentElement()).toBeInTheDocument();
    });
  });

  describe('When scoped slot is provided', () => {
    // Vue's test checks the default anchor here; this one passes a scoped anchor slot, so it can fail.
    it('should render the scoped slot', () => {
      mockSlots = {
        anchor: ({ attrs }: DtCollapsibleAnchorSlotScope) => <div data-qa="custom-anchor" {...attrs}>Toggle</div>,
      };
      mockProps = { id: 'contentId' };
      updateWrapper();

      const anchor = screen.getByTestId('custom-anchor');

      expect(anchor).toHaveAttribute('aria-controls', 'contentId');
      expect(anchor).toHaveAttribute('aria-expanded', 'true');
      expect(anchor).toHaveAttribute('role', 'button');
      expect(screen.queryByTestId('dt-button')).toBeNull();
    });
  });

  describe('Test open prop undefined', () => {
    it('content should be expanded by default', () => {
      expect(contentElement()).toBeVisible();
    });

    it('should toggle the content when clicked', async () => {
      await userEvent.click(anchorElement());
      await finishTransitions();

      expect(contentElement()).not.toBeVisible();
    });
  });

  describe('Test open prop defined', () => {
    describe('Test open prop set to true', () => {
      beforeEach(async () => {
        await setProps({ open: true });
      });

      it('content is expanded', () => {
        expect(contentElement()).toBeVisible();
      });

      it('clicking does not collapse content', async () => {
        await userEvent.click(anchorElement());
        await finishTransitions();

        expect(contentElement()).toBeVisible();
      });

      it('updating open prop does collapse content', async () => {
        await setProps({ open: false });

        expect(contentElement()).not.toBeVisible();
      });
    });

    describe('Test open prop set to false', () => {
      beforeEach(async () => {
        await setProps({ open: false });
      });

      it('content starts collapsed', () => {
        expect(contentElement()).not.toBeVisible();
      });

      it('clicking does not expand content', async () => {
        await userEvent.click(anchorElement());
        await finishTransitions();

        expect(contentElement()).not.toBeVisible();
      });

      it('updating open prop does collapse content', async () => {
        await setProps({ open: true });

        expect(contentElement()).toBeVisible();
      });
    });
  });

  describe('If anchor text and anchor slot content are falsy', () => {
    it('should output error message', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockProps = { anchorText: undefined };

      updateWrapper();

      expect(consoleErrorSpy).toHaveBeenCalledWith('anchor text and anchor slot content cannot both be falsy');

      consoleErrorSpy.mockRestore();
    });
  });

  // Vue's tests set `_isUnmounting` and call the handlers. Here the component unmounts mid-transition, and the
  // transition ending afterwards must not call back into it.
  describe('When component is unmounting', () => {
    const onOpened = vi.fn();
    const onOpenChange = vi.fn();

    beforeEach(() => {
      onOpened.mockClear();
      onOpenChange.mockClear();
      cleanup();
    });

    it('does not emit "opened" when leave transition completes', async () => {
      result = render(element({ ...baseProps, ...baseSlots, onOpened }));
      fireEvent.click(anchorElement());
      result.unmount();
      await finishTransitions();

      expect(onOpened).not.toHaveBeenCalled();
    });

    it('does not emit "opened" when enter transition completes', async () => {
      result = render(element({ ...baseProps, ...baseSlots, onOpened }));
      result.unmount();
      await finishTransitions();

      expect(onOpened).not.toHaveBeenCalled();
    });

    describe('in controlled mode (open !== null)', () => {
      it('does not emit "opened" or "update:open" when leave transition completes', async () => {
        props = { ...baseProps, ...baseSlots, open: true, onOpened, onOpenChange };
        result = render(element(props));
        result.rerender(element({ ...props, open: false }));
        result.unmount();
        await finishTransitions();

        expect(onOpened).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalled();
      });

      it('does not emit "opened" or "update:open" when enter transition completes', async () => {
        props = { ...baseProps, ...baseSlots, open: false, onOpened, onOpenChange };
        result = render(element(props));
        result.rerender(element({ ...props, open: true }));
        result.unmount();
        await finishTransitions();

        expect(onOpened).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('Content is expanded', () => {
      beforeEach(async () => {
        await setProps({ open: true, id: 'contentId' });
      });

      it('aria-controls on anchor should be set to the id of the contentWrapper', () => {
        expect(anchorElement()).toHaveAttribute('aria-controls', 'contentId');
        expect(contentWrapperElement()).toHaveAttribute('id', 'contentId');
      });

      it('aria-expanded should be true', () => {
        expect(anchorElement()).toHaveAttribute('aria-expanded', 'true');
      });
    });

    describe('Content is collapsed', () => {
      beforeEach(async () => {
        await setProps({ open: false });
      });

      it('aria-expanded should be "false"', () => {
        expect(anchorElement()).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('React-only', () => {
    it('calls onOpened once the transition ends, and onOpenChange only while controlled', async () => {
      const onOpened = vi.fn();
      const onOpenChange = vi.fn();
      mockProps = { onOpened, onOpenChange };
      updateWrapper();
      await finishTransitions();

      // The content appears on mount.
      expect(onOpened.mock.calls).toEqual([[true]]);

      await userEvent.click(anchorElement());
      await finishTransitions();

      expect(onOpened.mock.calls).toEqual([[true], [false]]);
      expect(onOpenChange).not.toHaveBeenCalled();

      await setProps({ open: true });

      expect(onOpened.mock.calls).toEqual([[true], [false], [true]]);
      expect(onOpenChange.mock.calls).toEqual([[true]]);
    });

    it('mounts collapsed with open false, without rendering its content', () => {
      mockProps = { open: false };
      updateWrapper();

      expect(contentWrapperElement()).not.toBeVisible();
      expect(anchorElement()).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('content-element')).toBeNull();
    });

    it('renders the default anchor when the anchor slot returns only empty fragments', () => {
      mockSlots = { anchor: () => <><></></> };
      updateWrapper();

      expect(anchorElement()).toBeInTheDocument();
    });

    it('keeps a custom anchor inside a fragment', () => {
      mockSlots = { anchor: ({ attrs }: DtCollapsibleAnchorSlotScope) => <><button data-qa="custom" {...attrs} /></> };
      updateWrapper();

      expect(screen.getByTestId('custom')).toBeInTheDocument();
      expect(screen.queryByTestId('dt-button')).toBeNull();
    });

    it('starts collapsed with defaultOpen false and keeps its content unrendered until first expanded', async () => {
      mockProps = { defaultOpen: false };
      updateWrapper();

      expect(contentWrapperElement()).not.toBeVisible();
      expect(screen.queryByTestId('content-element')).toBeNull();

      await userEvent.click(anchorElement());
      await finishTransitions();

      expect(contentElement()).toBeVisible();
    });

    it('keeps the last controlled state when open goes back to null', async () => {
      await setProps({ open: false });
      await setProps({ open: null });

      expect(contentElement()).not.toBeVisible();

      await userEvent.click(anchorElement());
      await finishTransitions();

      expect(contentElement()).toBeVisible();
    });

    it('labels the content with the anchor wrapper by default', () => {
      const labelledBy = contentWrapperElement().getAttribute('aria-labelledby');

      expect(labelledBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)).toContainElement(anchorElement());
    });

    it('labels the content with ariaLabel or ariaLabelledBy when given', async () => {
      await setProps({ ariaLabel: 'Details' });

      expect(contentWrapperElement()).toHaveAttribute('aria-label', 'Details');

      await setProps({ ariaLabel: null, ariaLabelledBy: 'external-label' });

      expect(contentWrapperElement()).toHaveAttribute('aria-labelledby', 'external-label');
      expect(contentWrapperElement()).not.toHaveAttribute('aria-label');
    });

    it('applies the element types, classes and sizes', async () => {
      await setProps({
        elementType: 'section',
        contentElementType: 'aside',
        anchorClass: 'my-anchor',
        contentClass: 'my-content',
        maxWidth: '200px',
        maxHeight: '100px',
        className: 'my-root',
      });

      const root = result.container.firstElementChild as HTMLElement;
      const wrapper = contentWrapperElement();

      expect(root.tagName).toBe('SECTION');
      expect(root).toHaveClass('my-root');
      expect(anchorElement().parentElement).toHaveClass('my-anchor');
      expect(anchorElement()).toHaveStyle({ width: '200px' });
      expect(wrapper.tagName).toBe('ASIDE');
      expect(wrapper).toHaveClass('my-content');
      expect(wrapper).toHaveStyle({ maxWidth: '200px', maxHeight: '100px' });
    });
  });
});
