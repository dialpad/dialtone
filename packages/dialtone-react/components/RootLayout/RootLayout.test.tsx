import { createRef } from 'react';
import { render, screen, type RenderResult } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { DtRootLayout, type DtRootLayoutProps } from './RootLayout';
import { ROOT_LAYOUT_SIDEBAR_POSITIONS } from './RootLayoutConstants';

const baseProps: DtRootLayoutProps = {};

const baseSlots = {
  header: 'header slot content',
  footer: 'footer slot content',
  sidebar: 'sidebar slot content',
  default: 'content slot content',
};

describe('DtRootLayout Tests', () => {
  let result: RenderResult;
  let wrapper: HTMLElement;
  let header: HTMLElement;
  let footer: HTMLElement;
  let sidebar: HTMLElement;
  let content: HTMLElement;

  const layout = (props: DtRootLayoutProps) => (
    <DtRootLayout
      {...baseProps}
      {...props}
      header={baseSlots.header}
      footer={baseSlots.footer}
      sidebar={baseSlots.sidebar}
    >
      {baseSlots.default}
    </DtRootLayout>
  );

  // Vue's wrapper.setProps
  const setProps = (props: DtRootLayoutProps) => result.rerender(layout(props));

  const updateWrapper = () => {
    result = render(layout({}));
    wrapper = screen.getByTestId('dt-root-layout');
    header = screen.getByTestId('dt-root-layout-header');
    footer = screen.getByTestId('dt-root-layout-footer');
    sidebar = screen.getByTestId('dt-root-layout-sidebar');
    content = screen.getByTestId('dt-root-layout-content');
  };

  beforeEach(() => {
    updateWrapper();
  });

  describe('Presentation Tests', () => {
    describe('When root layout renders', () => {
      it('root should exist', () => {
        expect(wrapper).toBeInTheDocument();
      });

      it('header should exist', () => {
        expect(header).toBeInTheDocument();
      });

      it('footer should exist', () => {
        expect(footer).toBeInTheDocument();
      });

      it('sidebar should exist', () => {
        expect(sidebar).toBeInTheDocument();
      });

      it('content should exist', () => {
        expect(content).toBeInTheDocument();
      });
    });

    describe('When slot content renders', () => {
      it('header slot is passed down correctly', () => {
        expect(header.textContent).toBe(baseSlots.header);
      });

      it('footer slot is passed down correctly', () => {
        expect(footer.textContent).toBe(baseSlots.footer);
      });

      it('sidebar slot is passed down correctly', () => {
        expect(sidebar.textContent).toBe(baseSlots.sidebar);
      });

      it('content slot is passed down correctly', () => {
        expect(content.textContent).toBe(baseSlots.default);
      });
    });

    describe('When headerSticky is set to default', () => {
      it('Has correct class', () => {
        expect(header).not.toHaveClass('d-root-layout__header--sticky');
      });
    });

    describe('When headerSticky is set to true', () => {
      it('Has correct class', () => {
        setProps({ headerSticky: true });

        expect(header).toHaveClass('d-root-layout__header--sticky');
      });
    });

    describe('When sidebarPosition is default (start)', () => {
      it('should not apply inverted class', () => {
        expect(wrapper).not.toHaveClass('d-root-layout--inverted');
      });
    });

    describe('When sidebarPosition is set to start', () => {
      it('should not apply inverted class', () => {
        setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.START });

        expect(wrapper).not.toHaveClass('d-root-layout--inverted');
      });
    });

    describe('When sidebarPosition is set to end', () => {
      it('should apply inverted class', () => {
        setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.END });

        expect(wrapper).toHaveClass('d-root-layout--inverted');
      });
    });

    describe('When sidebarPosition is set to left (deprecated)', () => {
      it('should not apply inverted class', () => {
        setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.LEFT });

        expect(wrapper).not.toHaveClass('d-root-layout--inverted');
      });
    });

    describe('When sidebarPosition is set to right (deprecated)', () => {
      it('should apply inverted class', () => {
        setProps({ sidebarPosition: ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT });

        expect(wrapper).toHaveClass('d-root-layout--inverted');
      });
    });
  });

  describe('React root props', () => {
    it('forwards ref, data-qa, className and DOM props to the same root', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DtRootLayout ref={ref} data-qa="custom-root" className="extra" id="my-root" />);
      const root = screen.getByTestId('custom-root');

      expect(ref.current).toBe(root);
      expect(root).toHaveAttribute('id', 'my-root');
      expect(root).toHaveClass('extra', 'root-layout', 'd-root-layout');
    });

    it('ignores dangerouslySetInnerHTML passed at runtime instead of throwing', () => {
      const props = { 'data-qa': 'html-root', dangerouslySetInnerHTML: { __html: '<b>x</b>' } };
      render(<DtRootLayout {...props}>content</DtRootLayout>);
      const root = screen.getByTestId('html-root');

      expect(root.querySelector('b')).toBeNull();
      expect(root.querySelector('main')).toHaveTextContent('content');
    });

    it('updates the fixed and responsive classes when the props change', () => {
      const { rerender } = render(<DtRootLayout data-qa="rerender-root" />);
      const root = screen.getByTestId('rerender-root');

      expect(root).toHaveClass('d-root-layout--fixed', 'd-root-layout__responsive--default');

      rerender(<DtRootLayout data-qa="rerender-root" fixed={false} responsiveBreakpoint="sm" />);

      expect(root).not.toHaveClass('d-root-layout--fixed');
      expect(root).not.toHaveClass('d-root-layout__responsive--default');
      expect(root).toHaveClass('d-root-layout__responsive--sm');
    });
  });

  describe('Accessibility Tests', () => {
    describe('When header is rendered', () => {
      it('Uses `header` tag', () => {
        expect(header.tagName).toBe('HEADER');
      });
    });

    describe('When footer is rendered', () => {
      it('Uses `footer` tag', () => {
        expect(footer.tagName).toBe('FOOTER');
      });
    });

    describe('When sidebar is rendered', () => {
      it('Uses `aside` tag', () => {
        expect(sidebar.tagName).toBe('ASIDE');
      });
    });

    describe('When content is rendered', () => {
      it('Uses `main` tag', () => {
        expect(content.tagName).toBe('MAIN');
      });
    });
  });
});
