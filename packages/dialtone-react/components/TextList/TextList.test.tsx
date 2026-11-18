import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { render, type RenderResult } from '@testing-library/react';
import { vi } from 'vitest';
import { DtTextList, type DtTextListProps } from './TextList';
import { DtTextListItem } from './TextListItem';
import {
  DT_TEXT_LIST_MARKER_TONES,
  DT_TEXT_LIST_MARKERS,
  DT_TEXT_LIST_ORDERED_MARKERS,
  DT_TEXT_LIST_TYPES,
  DT_TEXT_LIST_UNORDERED_MARKERS,
} from './TextListConstants';

const ITEM_ONE = 'Item one';
const ITEM_TWO = 'Item two';

const defaultChildren = (
  <>
    <DtTextListItem>{ITEM_ONE}</DtTextListItem>
    <DtTextListItem>{ITEM_TWO}</DtTextListItem>
  </>
);

// Vue's test stubs the icons the same way: a marker slot takes any element.
function StubIconClose ({ size }: { size: string }) {
  return <svg data-qa="dt-icon-close" data-size={size} />;
}

function StubIcon ({ name, size }: { name: string; size: string }) {
  return <svg data-qa="dt-icon" data-name={name} data-size={size} />;
}

describe('DtTextList', () => {
  let result: RenderResult;

  // Vue's `mockProps` and `mockSlots`: the list's props and its default slot.
  const updateWrapper = (props: DtTextListProps = {}, children: ReactNode = defaultChildren) => {
    result?.unmount();
    result = render(<DtTextList {...props}>{children}</DtTextList>);
  };

  const list = () => document.querySelector<HTMLElement>('[data-qa="dt-text-list"]')!;
  const textListItems = () => Array.from(document.querySelectorAll<HTMLElement>('[data-qa="dt-text-list-item"]'));
  const markerWrappers = () => (
    Array.from(document.querySelectorAll<HTMLElement>('[data-qa="dt-text-list-item-marker"]'))
  );

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    result?.unmount();
    vi.restoreAllMocks();
  });

  describe('Presentation Tests', () => {
    it('renders an unordered list by default', () => {
      expect(list().tagName).toBe('UL');
      expect(list()).toHaveClass('d-text-list');
      expect(Array.from(list().classList).some(className => className.startsWith('d-text-list--gap-'))).toBe(false);
      expect(list()).toHaveAttribute('data-qa', 'dt-text-list');
    });

    it('passes class through to the list root', () => {
      updateWrapper({ className: 'my-list-root' });

      expect(list()).toHaveClass('my-list-root');
    });

    it('passes class through to the item root', () => {
      updateWrapper({}, <DtTextListItem className="my-item-root">Classed item</DtTextListItem>);

      expect(textListItems()[0]).toHaveClass('my-item-root');
    });

    it('renders an ordered list when type is ordered', () => {
      updateWrapper({ type: 'ordered' });

      expect(list().tagName).toBe('OL');
      expect(list()).toHaveClass('d-text-list--ordered');
    });

    it('applies a gap class when gap is explicitly set to 0', () => {
      updateWrapper({ gap: '0' });

      expect(list()).toHaveClass('d-text-list--gap-0');
    });

    it('applies marker, markerTone, and gap classes', () => {
      updateWrapper({ marker: 'square', markerTone: 'critical', gap: '200' });

      expect(list()).toHaveClass('d-text-list--marker-square');
      expect(list()).toHaveClass('d-text-list--marker-tone-critical');
      expect(list()).toHaveClass('d-text-list--gap-200');
    });

    it('applies markerTone to individual items as an override', () => {
      updateWrapper(
        { markerTone: 'critical' },
        <>
          <DtTextListItem markerTone="positive">{ITEM_ONE}</DtTextListItem>
          <DtTextListItem>{ITEM_TWO}</DtTextListItem>
        </>,
      );

      expect(list()).toHaveClass('d-text-list--marker-tone-critical');
      expect(textListItems()[0]).toHaveClass('d-text-list__item--marker-tone-positive');
      expect(textListItems()[1]).not.toHaveClass('d-text-list__item--marker-tone-positive');
    });
  });

  describe('Accessibility Tests', () => {
    it('applies role="list" when markers are hidden', () => {
      updateWrapper({ marker: 'none' });

      expect(list()).toHaveAttribute('role', 'list');
    });

    it('marks custom marker wrappers as decorative', () => {
      updateWrapper(
        {},
        <>
          <DtTextListItem marker={<span>+</span>}>{ITEM_ONE}</DtTextListItem>
          <DtTextListItem marker={<span>-</span>}>{ITEM_TWO}</DtTextListItem>
        </>,
      );

      expect(markerWrappers()).toHaveLength(2);
      markerWrappers().forEach((markerWrapper) => {
        expect(markerWrapper).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('renders DtTextListItem children as list items', () => {
      const items = textListItems();

      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent(new RegExp(`^${ITEM_ONE}$`));
      expect(items[1]).toHaveTextContent(new RegExp(`^${ITEM_TWO}$`));
    });

    it('wraps native-marker item content', () => {
      expect(document.querySelectorAll('[data-qa="dt-text-list-item-content"]')).toHaveLength(2);
    });

    it('passes ordered-list start and reversed attributes only to ordered lists', () => {
      updateWrapper({ type: 'ordered', start: 4, reversed: true });

      expect(list()).toHaveAttribute('start', '4');
      expect(list()).toHaveAttribute('reversed', '');
    });

    it('does not pass ordered-list attributes to unordered lists', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper({ start: 4, reversed: true });

      expect(list()).not.toHaveAttribute('start');
      expect(list()).not.toHaveAttribute('reversed');
    });

    it('passes item value inside an ordered list', () => {
      updateWrapper({ type: 'ordered' }, <DtTextListItem value={5}>Fifth item</DtTextListItem>);

      expect(textListItems()[0]).toHaveAttribute('value', '5');
    });

    it('does not pass item value inside an unordered list', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper({}, <DtTextListItem value={5}>Fifth item</DtTextListItem>);

      expect(textListItems()[0]).not.toHaveAttribute('value');
    });
  });

  describe('Validation Tests', () => {
    // Vue's validators reject a value with a dev warning and still render it. In React the literal unions are the
    // validators: the invalid value is a type error, and it renders as Vue does.
    // Each row: the prop, a valid value, an invalid one, and the class each renders (null: none).
    const validationCases: [string, DtTextListProps, DtTextListProps, string | null, string | null][] = [
      [
        'type',
        { type: DT_TEXT_LIST_TYPES[0] },
        // @ts-expect-error 'invalid' is outside TextListType, which is what rejects it in React
        { type: 'invalid' },
        null,
        null,
      ],
      [
        'marker',
        { marker: DT_TEXT_LIST_MARKERS[0] },
        // @ts-expect-error 'invalid' is outside TextListMarker, which is what rejects it in React
        { marker: 'invalid' },
        'd-text-list--marker-disc',
        'd-text-list--marker-invalid',
      ],
      [
        'markerTone',
        { markerTone: DT_TEXT_LIST_MARKER_TONES[0] },
        // @ts-expect-error 'invalid' is outside TextListMarkerTone, which is what rejects it in React
        { markerTone: 'invalid' },
        'd-text-list--marker-tone-primary',
        'd-text-list--marker-tone-invalid',
      ],
      [
        'gap',
        { gap: '400' },
        // @ts-expect-error '450' is outside TextListGap (at most 400), which is what rejects it in React
        { gap: '450' },
        'd-text-list--gap-400',
        'd-text-list--gap-450',
      ],
    ];

    it.each(validationCases)('validates %s values', (_name, valid, invalid, validClass, invalidClass) => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper(valid);
      expect(list().tagName).toBe('UL');
      if (validClass) expect(list()).toHaveClass(validClass);

      updateWrapper(invalid);
      expect(list().tagName).toBe('UL');
      if (invalidClass) expect(list()).toHaveClass(invalidClass);
    });

    it('warns when ordered-list props are used on unordered lists', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper({ start: 2, reversed: true });

      expect(warn).toHaveBeenCalledWith('[DtTextList] The start prop only applies when type="ordered".');
      expect(warn).toHaveBeenCalledWith('[DtTextList] The reversed prop only applies when type="ordered".');
    });

    it.each([
      ['ordered', DT_TEXT_LIST_UNORDERED_MARKERS[0], 'unordered'],
      ['unordered', DT_TEXT_LIST_ORDERED_MARKERS[0], 'ordered'],
    ] as const)('warns when %s list uses a %s-family marker', (type, marker, expectedFamily) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper({ type, marker });

      expect(warn).toHaveBeenCalledWith(
        `[DtTextList] The marker="${marker}" value is usually used with type="${expectedFamily}".`,
      );
    });

    it('supports native list item children', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper({}, <li>Raw list item</li>);

      expect(warn).not.toHaveBeenCalled();
      expect(list().querySelector('li')).toHaveTextContent('Raw list item');
    });

    it('warns when direct children do not render list items', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper({}, <div>Raw item</div>);

      expect(warn).toHaveBeenCalledWith(
        '[DtTextList] Use DtTextListItem or a native li as the direct child of DtTextList.',
      );
    });

    it('warns when DtTextListItem value is used outside an ordered list', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      updateWrapper({}, <DtTextListItem value={2}>Second item</DtTextListItem>);

      expect(warn).toHaveBeenCalledWith(
        '[DtTextListItem] The value prop only applies inside a DtTextList with type="ordered".',
      );
    });

    it('warns when DtTextListItem is mounted without DtTextList', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<DtTextListItem>Orphan item</DtTextListItem>);

      expect(warn).toHaveBeenCalledWith('[DtTextListItem] DtTextListItem must be used inside DtTextList.');
    });
  });

  describe('Extendability Tests', () => {
    it('supports the marker slot', () => {
      updateWrapper({}, <DtTextListItem marker={<span data-qa="custom-marker">*</span>}>Slotted marker</DtTextListItem>);

      expect(document.querySelector('[data-qa="custom-marker"]')).toBeInTheDocument();
    });

    it('supports Dialtone icons through the marker slot', () => {
      updateWrapper(
        {},
        <>
          <DtTextListItem marker={<StubIconClose size="200" />}>Tree-shakable icon marker</DtTextListItem>
          <DtTextListItem marker={<StubIcon name="close" size="200" />}>Generic icon marker</DtTextListItem>
        </>,
      );

      expect(document.querySelector('[data-qa="dt-icon-close"]')).toHaveAttribute('data-size', '200');
      expect(document.querySelector('[data-qa="dt-icon"]')).toHaveAttribute('data-name', 'close');
    });

    it('applies contentClass to native-marker item content', () => {
      updateWrapper({}, <DtTextListItem contentClass="my-content">Styled item</DtTextListItem>);

      expect(document.querySelector('[data-qa="dt-text-list-item-content"]')).toHaveClass('my-content');
      expect(document.querySelector('[data-qa="dt-text-list-item-marker"]')).not.toBeInTheDocument();
    });

    it('applies markerClass and contentClass to custom-marker item wrappers', () => {
      updateWrapper(
        {},
        <DtTextListItem markerClass="my-marker" contentClass="my-content" marker={<span>*</span>}>
          Styled item
        </DtTextListItem>,
      );

      expect(document.querySelector('[data-qa="dt-text-list-item-marker"]')).toHaveClass('my-marker');
      expect(document.querySelector('[data-qa="dt-text-list-item-content"]')).toHaveClass('my-content');
    });

    it('supports nested mixed list types', () => {
      updateWrapper(
        {},
        <DtTextListItem>
          Parent
          <DtTextList type="ordered">
            <DtTextListItem value={5}>Nested ordered item</DtTextListItem>
          </DtTextList>
        </DtTextListItem>,
      );

      const lists = Array.from(document.querySelectorAll<HTMLElement>('[data-qa="dt-text-list"]'));
      const orderedList = lists.find(item => item.tagName === 'OL');

      expect(lists.some(item => item.tagName === 'UL')).toBe(true);
      expect(orderedList).toBeInTheDocument();
      expect(orderedList!.querySelectorAll('[data-qa="dt-text-list-item"]')).toHaveLength(1);
      // The nested item reads the nearest (ordered) provider, not the outer unordered one.
      expect(orderedList!.querySelector('li')).toHaveAttribute('value', '5');
    });

    it('keeps the list role fallback when role is undefined, and lets an explicit role win', () => {
      updateWrapper({ marker: 'none', role: undefined });
      expect(list()).toHaveAttribute('role', 'list');

      updateWrapper({ marker: 'none', role: 'presentation' });
      expect(list()).toHaveAttribute('role', 'presentation');
    });

    it('treats an empty fragment marker as no custom marker', () => {
      updateWrapper({}, <DtTextListItem marker={<></>}>Empty marker</DtTextListItem>);

      expect(document.querySelector('[data-qa="dt-text-list-item-marker"]')).not.toBeInTheDocument();
      expect(textListItems()[0]).not.toHaveClass('d-text-list__item--custom-marker');
    });

    it('keeps the native marker and mounts a portal marker at its target', () => {
      const target = document.createElement('div');
      document.body.appendChild(target);
      updateWrapper({}, <DtTextListItem marker={createPortal(<b data-qa="portal-marker">*</b>, target)}>Portal</DtTextListItem>);

      expect(document.querySelector('[data-qa="dt-text-list-item-marker"]')).not.toBeInTheDocument();
      expect(textListItems()[0]).not.toHaveClass('d-text-list__item--custom-marker');
      expect(target.querySelector('[data-qa="portal-marker"]')).toBeInTheDocument();
      target.remove();
    });

    it('keeps portal content mounted when a local marker is added beside it', () => {
      const target = document.createElement('div');
      document.body.appendChild(target);
      const portal = createPortal(<input data-qa="portal-input" />, target);
      const view = render(<DtTextList><DtTextListItem marker={<>{portal}</>}>Portal</DtTextListItem></DtTextList>);
      const input = target.querySelector('input') as HTMLInputElement;
      input.value = 'typed';

      view.rerender(
        <DtTextList><DtTextListItem marker={<>{portal}<i data-qa="local-icon" /></>}>Portal</DtTextListItem></DtTextList>,
      );

      expect(target.querySelector('input')).toBe(input);
      expect(input.value).toBe('typed');
      expect(document.querySelector('[data-qa="dt-text-list-item-marker"] [data-qa="local-icon"]')).toBeInTheDocument();
      view.unmount();
      target.remove();
    });
  });
});
