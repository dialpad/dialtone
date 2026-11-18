import { createRef, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DtProse, type DtProseProps } from './Prose';

const PROSE_TEST_ID = 'dt-prose';

// The Vue tests pass slot content as HTML strings. React would parse JSX instead and warn about things like an
// uncontrolled `checked`, so the HTML goes in as a string, inside one wrapper div.
const html = (markup: string) => <div dangerouslySetInnerHTML={{ __html: markup }} />;

const setWrapper = (props: DtProseProps = {}, children?: ReactNode) => {
  const view = render(<DtProse {...props}>{children}</DtProse>);
  return { ...view, prose: () => screen.getByTestId(PROSE_TEST_ID) };
};

const queryIn = <T extends Element>(selector: string) => {
  const found = screen.getByTestId(PROSE_TEST_ID).querySelector<T>(selector);
  if (!found) throw new Error(`No element matches ${selector}`);
  return found;
};

const classesOf = (element: Element) => [...element.classList];

describe('DtProse Tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Presentation Tests', () => {
    it('Should render the dt-prose wrapper', () => {
      const { prose } = setWrapper();

      expect(prose()).toBeInTheDocument();
      expect(prose().tagName).toBe('DIV');
      expect(classesOf(prose())).toContain('d-prose');
    });

    it('Should forward root props and the caller ref to the same div', () => {
      const ref = createRef<HTMLDivElement>();

      setWrapper({ id: 'my-prose', ref });

      expect(screen.getByTestId(PROSE_TEST_ID).id).toBe('my-prose');
      expect(ref.current).toBe(screen.getByTestId(PROSE_TEST_ID));
    });

    it('Should run a callback ref cleanup once on unmount, without calling the ref with null', () => {
      const cleanup = vi.fn();
      const ref = vi.fn(() => cleanup);

      const { unmount } = setWrapper({ ref });

      expect(ref).toHaveBeenCalledTimes(1);
      expect(cleanup).not.toHaveBeenCalled();

      unmount();

      expect(cleanup).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledTimes(1);
    });

    it('Should render slot content inside the wrapper', () => {
      const { prose } = setWrapper({}, <p>Hello world</p>);

      expect(prose().querySelector('p')?.textContent).toBe('Hello world');
    });
  });

  describe('Validation — Disallowed Elements', () => {
    it.each([
      ['Should console.error when slot contains <form>', '<form><div>form content</div></form>', 'form'],
      ['Should console.error when slot contains <input>', '<div><input type="text"></div>', 'input'],
      ['Should console.error when slot contains <select>', '<div><select><option>A</option></select></div>', 'select'],
      ['Should console.error when slot contains <textarea>', '<div><textarea></textarea></div>', 'textarea'],
      ['Should console.error when slot contains <button>', '<div><button>Click</button></div>', 'button'],
      [
        'Should console.error when slot contains a custom element',
        '<div><my-component>content</my-component></div>',
        'my-component',
      ],
    ])('%s', (_title, markup, tag) => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      setWrapper({}, html(markup));

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining(`<${tag}> is not allowed`),
      );
    });

    it('Should not error for <input type="checkbox"> inside <li> (task list)', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      setWrapper({}, html('<ul><li><input type="checkbox" checked> Task item</li></ul>'));

      expect(consoleError).not.toHaveBeenCalled();
    });

    it('Should re-validate when content changes after mount', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { rerender } = render(<DtProse>{html('<p>Clean</p>')}</DtProse>);
      expect(consoleError).not.toHaveBeenCalled();

      rerender(<DtProse>{html('<form class="late">injected</form>')}</DtProse>);

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('<form> is not allowed'),
      );
      expect(queryIn('form').hasAttribute('class')).toBe(false);
    });
  });

  describe('Validation — Attribute Stripping', () => {
    it('Should strip class and style from inner elements', () => {
      setWrapper({}, html('<p class="foo" style="color: red;">text</p>'));

      const p = queryIn('p');

      expect(p.hasAttribute('class')).toBe(false);
      expect(p.hasAttribute('style')).toBe(false);
    });

    it('Should preserve href on <a>', () => {
      setWrapper({}, html('<a href="https://example.com" class="link">link</a>'));

      const a = queryIn('a');

      expect(a.getAttribute('href')).toBe('https://example.com');
      expect(a.hasAttribute('class')).toBe(false);
    });

    it('Should preserve src and alt on <img>', () => {
      setWrapper({}, html('<img src="image.png" alt="desc" class="img-class">'));

      const img = queryIn('img');

      expect(img.getAttribute('src')).toBe('image.png');
      expect(img.getAttribute('alt')).toBe('desc');
      expect(img.hasAttribute('class')).toBe(false);
    });

    it('Should preserve scope on <th>', () => {
      setWrapper({}, html('<table><thead><tr><th scope="col" class="header">Name</th></tr></thead></table>'));

      const th = queryIn('th');

      expect(th.getAttribute('scope')).toBe('col');
      expect(th.hasAttribute('class')).toBe(false);
    });

    it('Should strip data-* attributes', () => {
      setWrapper({}, html('<p data-testid="test" data-custom="val">text</p>'));

      const p = queryIn('p');

      expect(p.hasAttribute('data-testid')).toBe(false);
      expect(p.hasAttribute('data-custom')).toBe(false);
    });

    it('Should preserve aria-* attributes', () => {
      setWrapper({}, html('<a href="#" aria-label="home" aria-describedby="hint">link</a>'));

      const a = queryIn('a');

      expect(a.getAttribute('aria-label')).toBe('home');
      expect(a.getAttribute('aria-describedby')).toBe('hint');
    });

    it('Should preserve role attribute', () => {
      setWrapper({}, html('<div role="note">text</div>'));

      const div = queryIn('div[role="note"]');

      expect(div.getAttribute('role')).toBe('note');
    });

    it.each([
      ['javascript:alert(1)'],
      ['  javascript:alert(1)'],
      ['JavaScript:alert(1)'],
      ['vbscript:msg'],
      ['data:text/html,<script>x</script>'],
    ])('Should strip unsafe url scheme %s from href', (badHref) => {
      setWrapper({}, html(`<a href="${badHref}">link</a>`));

      const a = queryIn('a');

      expect(a.hasAttribute('href')).toBe(false);
    });

    it.each([
      ['a tab', 'java&#x09;script:alert(1)'],
      ['a line feed', 'java&#x0A;script:alert(1)'],
      ['a carriage return', 'java&#x0D;script:alert(1)'],
    ])('Should strip an unsafe scheme hidden by %s in href', (_name, badHref) => {
      setWrapper({}, html(`<a href="${badHref}">link</a>`));

      const a = queryIn('a');

      expect(a.hasAttribute('href')).toBe(false);
    });

    it('Should preserve a relative href with a space before a colon', () => {
      setWrapper({}, html('<a href="data :notes.html">link</a>'));

      expect(queryIn('a').getAttribute('href')).toBe('data :notes.html');
    });

    it('Should preserve safe https href', () => {
      setWrapper({}, html('<a href="https://example.com/path">link</a>'));

      const a = queryIn('a');

      expect(a.getAttribute('href')).toBe('https://example.com/path');
    });

    it('Should sanitize attrs on custom elements', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      setWrapper({}, html('<my-widget onclick="evil()" aria-label="ok">x</my-widget>'));

      const el = queryIn('my-widget');

      expect(el.hasAttribute('onclick')).toBe(false);
      expect(el.getAttribute('aria-label')).toBe('ok');
    });
  });

  describe('Accessibility Tests', () => {
    it('Should render as a div with no implicit role', () => {
      const { prose } = setWrapper();

      expect(prose().tagName).toBe('DIV');
      expect(prose().hasAttribute('role')).toBe(false);
    });
  });

  describe('Size Prop', () => {
    it.each([
      [100, 'd-prose--size-100'],
      ['100', 'd-prose--size-100'],
      [200, 'd-prose--size-200'],
    ] as const)('Should apply correct class when size is %s', (size, expectedClass) => {
      const { prose } = setWrapper({ size });

      expect(classesOf(prose()).filter(c => c.startsWith('d-prose--size-'))).toEqual([expectedClass]);
    });

    it('Should not render a size modifier class when size is not set', () => {
      const { prose } = setWrapper();

      expect(classesOf(prose())).toContain('d-prose');
      expect(classesOf(prose()).some(c => c.includes('--size-'))).toBe(false);
    });
  });

  describe('Density Prop', () => {
    it.each([
      [100, 'd-prose--density-100'],
      [300, 'd-prose--density-300'],
    ] as const)('Should apply correct class when density is %s', (density, expectedClass) => {
      const { prose } = setWrapper({ density });

      expect(classesOf(prose()).filter(c => c.startsWith('d-prose--density-'))).toEqual([expectedClass]);
    });

    it('Should not render a density modifier class when density is not set', () => {
      const { prose } = setWrapper();

      expect(classesOf(prose())).toContain('d-prose');
      expect(classesOf(prose()).some(c => c.includes('--density-'))).toBe(false);
    });
  });

  describe('Combined Size and Density Props', () => {
    it('Should apply both size and density modifier classes', () => {
      const { prose } = setWrapper({ size: 100, density: 300 });

      expect(classesOf(prose()).sort()).toEqual(['d-prose', 'd-prose--density-300', 'd-prose--size-100']);
    });
  });
});
