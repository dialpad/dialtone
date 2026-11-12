import { render, screen } from '@testing-library/react';
import { DtStack, type DtStackProps } from './Stack';

const baseSlots = {
  default: (
    <>
      <div data-qa="default-content">Test 1</div> <div>Test 2</div>
    </>
  ),
};

// The tests render a div, and a section for `as`.
type StackProps = DtStackProps<'div' | 'section'>;

let mockProps: StackProps = {};

describe('DtStack Tests', () => {
  let rerenderStack: (props: StackProps) => void;

  const updateWrapper = () => {
    const { rerender } = render(<DtStack {...mockProps}>{baseSlots.default}</DtStack>);
    rerenderStack = props => rerender(<DtStack {...props}>{baseSlots.default}</DtStack>);
  };

  // Vue's setProps: re-render the mounted stack with new props.
  const setProps = (props: StackProps) => {
    rerenderStack({ ...mockProps, ...props });
  };

  const stack = () => screen.getByTestId('dt-stack');
  const defaultContent = () => screen.queryByTestId('default-content');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    describe('When stack renders', () => {
      it('stack exist', () => {
        expect(stack()).toBeInTheDocument();
      });

      it('content should exist', () => {
        expect(defaultContent()).toBeInTheDocument();
      });
    });
  });

  describe('Wrapping', () => {
    it('should only apply the wrap modifier while wrapping is enabled', () => {
      expect(stack()).not.toHaveClass('d-stack--wrap');

      setProps({ wrap: true });
      expect(stack()).toHaveClass('d-stack--wrap');

      setProps({ wrap: false });
      expect(stack()).not.toHaveClass('d-stack--wrap');
    });
  });

  describe('When `direction` prop is provided with', () => {
    describe('expected string value', () => {
      it('should set the proper class and override the default value', () => {
        setProps({ direction: 'row' });

        expect(stack()).toHaveClass('d-stack', 'd-stack--row');
        expect(stack()).not.toHaveClass('d-stack--column');
      });
    });

    describe('non expected string value', () => {
      it('should not add non-existent class', () => {
        // @ts-expect-error 'invalid' isn't a direction: Vue's validator rejects it, and the class is still left out.
        setProps({ direction: 'invalid' });

        expect(stack()).not.toHaveClass('d-stack--invalid');
      });
    });

    describe('expected object value', () => {
      it('should set proper responsive classes', () => {
        setProps({
          direction: {
            sm: 'column',
            lg: 'column-reverse',
            md: 'row-reverse',
            xl: 'row',
          },
        });

        expect(stack()).toHaveClass(
          'd-stack--sm-column',
          'd-stack--md-row-reverse',
          'd-stack--lg-column-reverse',
          'd-stack--xl-row',
        );
      });

      describe('When `default` is provided', () => {
        it('should override the default value', () => {
          setProps({ direction: { default: 'row-reverse' } });

          expect(stack()).toHaveClass('d-stack', 'd-stack--row-reverse');
          expect(stack()).not.toHaveClass('d-stack--column');
        });
      });
    });

    describe('non expected object value', () => {
      describe('When provided with non expected breakpoint value', () => {
        it('should not add non-existent breakpoint class', () => {
          // @ts-expect-error 'invalid' isn't a breakpoint.
          setProps({ direction: { invalid: 'column' } });

          expect(stack()).not.toHaveClass('d-stack--invalid-column');
        });
      });

      describe('When `default` is provided with non expected direction value', () => {
        it('should not add non-existent direction class', () => {
          // @ts-expect-error 'roww' isn't a direction.
          setProps({ direction: { default: 'roww' } });

          expect(stack()).not.toHaveClass('d-stack--roww');
        });
      });
    });
  });

  describe('When `as` prop is provided', () => {
    it('should use it as the HTML element of stack', () => {
      setProps({ as: 'section' });

      expect(stack().tagName).toBe('SECTION');
    });
  });

  describe('When `gap` prop is provided with', () => {
    describe('valid string value', () => {
      it('should set proper gap class', () => {
        setProps({ gap: '50' });

        expect(stack()).toHaveClass('d-stack--gap-50');
      });
    });

    describe('non valid string value', () => {
      it('should not set gap class', () => {
        // @ts-expect-error '123' isn't a gap.
        setProps({ gap: '123' });

        expect(stack()).not.toHaveClass('d-stack--gap-123');
      });
    });

    describe('expected object value', () => {
      it('should set proper responsive classes', () => {
        setProps({
          gap: {
            sm: '200',
            md: '400',
            lg: '500',
            xl: '600',
          },
        });

        expect(stack()).toHaveClass(
          'd-stack--sm-gap-200',
          'd-stack--md-gap-400',
          'd-stack--lg-gap-500',
          'd-stack--xl-gap-600',
        );
      });

      describe('When `default` is provided', () => {
        it('should override the default value', () => {
          setProps({ gap: { default: '500' } });

          expect(stack()).toHaveClass('d-stack', 'd-stack--gap-500');
          expect(stack()).not.toHaveClass('d-stack--gap-0');
        });
      });
    });

    describe('non expected object value', () => {
      describe('When provided with non expected breakpoint value', () => {
        it('should not add non-existent breakpoint class', () => {
          // @ts-expect-error 'invalid' isn't a breakpoint.
          setProps({ gap: { invalid: '400' } });

          expect(stack()).not.toHaveClass('d-stack--invalid-gap-400');
        });
      });

      describe('When `default` is provided with non expected gap value', () => {
        it('should not add non-existent gap class', () => {
          // @ts-expect-error '900' isn't a gap.
          setProps({ gap: { default: '900' } });

          expect(stack()).not.toHaveClass('d-stack--gap-900');
        });
      });
    });
  });

  describe('When `align` prop is provided with', () => {
    describe('valid string value', () => {
      it('should set proper align class', () => {
        setProps({ align: 'center' });

        expect(stack()).toHaveClass('d-stack--align-center');
      });
    });

    describe('non valid string value', () => {
      it('should not set align class', () => {
        // @ts-expect-error 'invalid' isn't an align value.
        setProps({ align: 'invalid' });

        expect(stack()).not.toHaveClass('d-stack--align-invalid');
      });
    });

    describe('expected object value', () => {
      it('should set proper responsive classes', () => {
        setProps({
          align: {
            sm: 'center',
            md: 'end',
            lg: 'stretch',
            xl: 'baseline',
          },
        });

        expect(stack()).toHaveClass(
          'd-stack--sm-align-center',
          'd-stack--md-align-end',
          'd-stack--lg-align-stretch',
          'd-stack--xl-align-baseline',
        );
      });

      describe('When `default` is provided', () => {
        it('should override the default value', () => {
          setProps({ align: { default: 'end' } });

          expect(stack()).toHaveClass('d-stack', 'd-stack--align-end');
        });
      });
    });

    describe('non expected object value', () => {
      describe('When provided with non expected breakpoint value', () => {
        it('should not add non-existent breakpoint class', () => {
          // @ts-expect-error 'invalid' isn't a breakpoint.
          setProps({ align: { invalid: 'center' } });

          expect(stack()).not.toHaveClass('d-stack--invalid-align-center');
        });
      });

      describe('When `default` is provided with non expected align value', () => {
        it('should not add non-existent align class', () => {
          // @ts-expect-error 'invalid' isn't an align value.
          setProps({ align: { default: 'invalid' } });

          expect(stack()).not.toHaveClass('d-stack--align-invalid');
        });
      });
    });
  });

  describe('When `justify` prop is provided with', () => {
    describe('valid string value', () => {
      it('should set proper justify class', () => {
        setProps({ justify: 'center' });

        expect(stack()).toHaveClass('d-stack--justify-center');
      });
    });

    describe('non valid string value', () => {
      it('should not set justify class', () => {
        // @ts-expect-error 'invalid' isn't a justify value.
        setProps({ justify: 'invalid' });

        expect(stack()).not.toHaveClass('d-stack--justify-invalid');
      });
    });

    describe('expected object value', () => {
      it('should set proper responsive classes', () => {
        setProps({
          justify: {
            sm: 'center',
            md: 'end',
            lg: 'space-between',
            xl: 'space-around',
          },
        });

        expect(stack()).toHaveClass(
          'd-stack--sm-justify-center',
          'd-stack--md-justify-end',
          'd-stack--lg-justify-between',
          'd-stack--xl-justify-around',
        );
      });

      describe('When `default` is provided', () => {
        it('should override the default value', () => {
          setProps({ justify: { default: 'space-between' } });

          expect(stack()).toHaveClass('d-stack', 'd-stack--justify-between');
          expect(stack()).not.toHaveClass('d-stack--justify-start');
        });
      });

      describe('When legacy alias values are used', () => {
        it('should support legacy alias values for backwards compatibility', () => {
          setProps({ justify: 'between' });
          expect(stack()).toHaveClass('d-stack--justify-between');

          setProps({ justify: 'around' });
          expect(stack()).toHaveClass('d-stack--justify-around');

          setProps({ justify: 'evenly' });
          expect(stack()).toHaveClass('d-stack--justify-evenly');
        });
      });
    });

    describe('non expected object value', () => {
      describe('When provided with non expected breakpoint value', () => {
        it('should not add non-existent breakpoint class', () => {
          // @ts-expect-error 'invalid' isn't a breakpoint.
          setProps({ justify: { invalid: 'center' } });

          expect(stack()).not.toHaveClass('d-stack--invalid-justify-center');
        });
      });

      describe('When `default` is provided with non expected justify value', () => {
        it('should not add non-existent justify class', () => {
          // @ts-expect-error 'invalid' isn't a justify value.
          setProps({ justify: { default: 'invalid' } });

          expect(stack()).not.toHaveClass('d-stack--justify-invalid');
        });
      });
    });
  });

  // React-only: Vue binds $attrs to the root, so the class and other attributes land there.
  describe('Attributes', () => {
    it('should merge className with its own classes and pass other attributes to the root', () => {
      setProps({ className: 'd-p-400', id: 'my-stack', 'aria-label': 'Items' });

      expect(stack()).toHaveClass('d-stack', 'd-stack--gap-0', 'd-stack--justify-start', 'd-p-400');
      expect(stack()).toHaveAttribute('id', 'my-stack');
      expect(stack()).toHaveAttribute('aria-label', 'Items');
    });
  });
});
