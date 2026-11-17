import { cleanup, render, screen } from '@testing-library/react';
import { DtCodeblock, type DtCodeblockProps } from './Codeblock';

const baseProps: DtCodeblockProps = {
  text: '',
};

let mockProps: Partial<DtCodeblockProps> = {};

describe('DtCodeblock Tests', () => {
  let setProps: (props: Partial<DtCodeblockProps>) => void;
  let root: HTMLElement;

  const updateWrapper = () => {
    // A fresh mount, as Vue's mount() is: the previous render goes first.
    cleanup();
    const result = render(<DtCodeblock {...baseProps} {...mockProps} />);
    setProps = props => result.rerender(<DtCodeblock {...baseProps} {...mockProps} {...props} />);
    root = result.container;
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should exist', () => {
      expect(root.firstElementChild).toBeInTheDocument();
    });

    it('should render preformatted code block', () => {
      const preElement = screen.getByTestId('dt-codeblock');

      expect(preElement).toBeInTheDocument();
      expect(preElement.tagName).toBe('PRE');

      const codeElement = screen.getByTestId('dt-codeblock-code');

      expect(preElement).toContainElement(codeElement);
      expect(codeElement.tagName).toBe('CODE');
    });

    describe('When text prop is set', () => {
      it('should render preformatted text in codeblock', () => {
        const text = ' \nfunction someFunction() {\n  return 1;\n}\n ';

        setProps({ text });

        const preElement = screen.getByTestId('dt-codeblock');
        const codeElement = screen.getByTestId('dt-codeblock-code');

        expect(codeElement.textContent).toBe(text);
        expect(preElement.textContent).toBe(text);
      });
    });

    describe('When bordered prop is true', () => {
      it('should add the bordered class to the pre element', () => {
        setProps({ bordered: true });
        expect(screen.getByTestId('dt-codeblock')).toHaveClass('d-codeblock--bordered');
      });
    });

    describe('When size prop is set', () => {
      it('should apply the size modifier class to the code element', () => {
        setProps({ size: 'lg' });
        expect(screen.getByTestId('dt-codeblock-code')).toHaveClass('d-codeblock__code--lg');
      });
    });

    describe('When size prop is numeric', () => {
      it('should apply the correct size modifier class', () => {
        setProps({ size: 400 });
        expect(screen.getByTestId('dt-codeblock-code')).toHaveClass('d-codeblock__code--lg');
      });
    });
  });
});
