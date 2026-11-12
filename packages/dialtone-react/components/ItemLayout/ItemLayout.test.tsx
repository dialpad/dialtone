import { render, screen } from '@testing-library/react';
import { DtItemLayout, type DtItemLayoutProps } from './ItemLayout';

let mockProps: DtItemLayoutProps = {};

describe('DtItemLayout tests', () => {
  const mountComponent = () => render(<DtItemLayout {...mockProps} />);

  const startWrapper = () => screen.queryByTestId('dt-item-layout-left-wrapper');
  const endWrapper = () => screen.queryByTestId('dt-item-layout-right-wrapper');
  const subtitleWrapper = () => screen.queryByTestId('dt-item-layout-subtitle-wrapper');
  const bottomWrapper = () => screen.queryByTestId('dt-item-layout-bottom-wrapper');
  const text = (content: string) => document.body.textContent?.includes(content);

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When none of the slot contents are provided', () => {
      beforeEach(() => {
        mountComponent();
      });

      it('should not render the start slot wrapper', () => {
        expect(startWrapper()).toBeNull();
      });

      it('should not render the end slot wrapper', () => {
        expect(endWrapper()).toBeNull();
      });

      it('should not render the subtitle slot wrapper', () => {
        expect(subtitleWrapper()).toBeNull();
      });

      it('should not render the bottom slot wrapper', () => {
        expect(bottomWrapper()).toBeNull();
      });
    });

    describe('When start content is provided', () => {
      beforeEach(() => {
        mockProps = { start: 'start content' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(startWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('start content')).toBe(true);
      });
    });

    describe('When end content is provided', () => {
      beforeEach(() => {
        mockProps = { end: 'end content' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(endWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('end content')).toBe(true);
      });
    });

    describe('When subtitle content is provided', () => {
      beforeEach(() => {
        mockProps = { subtitle: 'subtitle' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(subtitleWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('subtitle')).toBe(true);
      });
    });

    describe('When bottom content is provided', () => {
      beforeEach(() => {
        mockProps = { bottom: 'bottom' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(bottomWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('bottom')).toBe(true);
      });
    });

    describe('When blockEnd content is provided', () => {
      beforeEach(() => {
        mockProps = { blockEnd: 'block end content' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(bottomWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('block end content')).toBe(true);
      });
    });

    describe('When blockEndClass prop is provided', () => {
      beforeEach(() => {
        mockProps = { blockEnd: 'content', blockEndClass: 'custom-class' };
        mountComponent();
      });

      it('should apply the class to the bottom wrapper', () => {
        expect(bottomWrapper()).toHaveClass('custom-class');
      });
    });

    describe('When selected content is provided', () => {
      beforeEach(() => {
        mockProps = { selected: 'selected' };
        mountComponent();
      });

      it('should render the provided content', () => {
        expect(text('selected')).toBe(true);
      });
    });

    describe('When startClass prop is provided', () => {
      beforeEach(() => {
        mockProps = { start: 'start content', startClass: 'my-start-class' };
        mountComponent();
      });

      it('should apply the class to the start wrapper', () => {
        expect(startWrapper()).toHaveClass('my-start-class');
      });
    });

    describe('When endClass prop is provided', () => {
      beforeEach(() => {
        mockProps = { end: 'end content', endClass: 'my-end-class' };
        mountComponent();
      });

      it('should apply the class to the end wrapper', () => {
        expect(endWrapper()).toHaveClass('my-end-class');
      });
    });
  });

  describe('Backward Compatibility Tests', () => {
    describe('When left slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockProps = { left: 'left content' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(startWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('left content')).toBe(true);
      });
    });

    describe('When right slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockProps = { right: 'right content' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(endWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('right content')).toBe(true);
      });
    });

    // The deprecated leftClass, rightClass and bottomClass props aren't ported (see skips.json).
    describe('When leftClass prop is provided (deprecated)', () => {
      it.skip('should apply the class to the start wrapper', () => {});
    });

    describe('When rightClass prop is provided (deprecated)', () => {
      it.skip('should apply the class to the end wrapper', () => {});
    });

    describe('When leftClass overrides startClass (deprecated takes precedence)', () => {
      it.skip('should use leftClass value', () => {});
    });

    describe('When bottom slot is provided (deprecated)', () => {
      beforeEach(() => {
        mockProps = { bottom: 'bottom content' };
        mountComponent();
      });

      it('should render the slot wrapper', () => {
        expect(bottomWrapper()).toBeInTheDocument();
      });

      it('should render the provided content', () => {
        expect(text('bottom content')).toBe(true);
      });
    });

    describe('When bottomClass prop is provided (deprecated)', () => {
      it.skip('should apply the class to the bottom wrapper', () => {});
    });

    describe('When both blockEnd and bottom slots are provided', () => {
      beforeEach(() => {
        mockProps = { blockEnd: 'new content', bottom: 'old content' };
        mountComponent();
      });

      it('should render blockEnd content over bottom content', () => {
        expect(text('new content')).toBe(true);
        expect(text('old content')).toBe(false);
      });
    });

    describe('When bottomClass overrides blockEndClass (deprecated takes precedence)', () => {
      it.skip('should use bottomClass value', () => {});
    });

    describe('When rightClass overrides endClass (deprecated takes precedence)', () => {
      it.skip('should use rightClass value', () => {});
    });

    describe('When both start and left slots are provided', () => {
      it('should render the new start content and suppress the deprecated left', () => {
        mockProps = { start: 'new start', left: 'old left' };
        mountComponent();

        expect(startWrapper()).toBeInTheDocument();
        expect(startWrapper()).toHaveTextContent('new start');
        expect(startWrapper()).not.toHaveTextContent('old left');
      });
    });
  });

  // React-only: the Vue suite never checks the root element, the grid columns or the attribute routing.
  describe('Root element', () => {
    it('renders the d-item-layout class by default', () => {
      render(<DtItemLayout data-qa="root" />);
      expect(screen.getByTestId('root')).toHaveClass('d-item-layout');
    });

    it('renders the custom class and grid columns from the passed slots when unstyled', () => {
      render(<DtItemLayout data-qa="root" unstyled start="s" selected="x" />);
      const root = screen.getByTestId('root');
      expect(root).toHaveClass('d-item-layout--custom');
      expect(root).not.toHaveClass('d-item-layout');
      // An absent slot leaves its column blank, as in Vue, so the template has a double space.
      expect(root.style.gridTemplateColumns.replace(/\s+/g, ' ')).toBe('auto 1fr auto');
    });

    it('does not set grid columns when styled', () => {
      render(<DtItemLayout data-qa="root" start="s" />);
      expect(screen.getByTestId('root').style.gridTemplateColumns).toBe('');
    });

    it('renders as the given element', () => {
      render(<DtItemLayout as="li" data-qa="root" />);
      expect(screen.getByTestId('root').tagName).toBe('LI');
    });

    it('applies the title, content and subtitle classes', () => {
      render(<DtItemLayout titleClass="t" contentClass="c" subtitleClass="s" subtitle="sub">title</DtItemLayout>);
      expect(screen.getByTestId('dt-item-layout-title-wrapper')).toHaveClass('t', 'd-item-layout__title');
      expect(screen.getByTestId('dt-item-layout-content-wrapper')).toHaveClass('c', 'd-item-layout__content');
      expect(screen.getByTestId('dt-item-layout-subtitle-wrapper')).toHaveClass(
        's', 'd-item-layout--subtitle', 'd-item-layout--subtitle--with-title',
      );
    });

    it('applies the selectedClass to the selected wrapper', () => {
      render(<DtItemLayout selectedClass="sel" selected="x" />);
      expect(screen.getByTestId('dt-item-layout-selected-wrapper')).toHaveClass('sel', 'd-item-layout__selected');
    });
  });
});
