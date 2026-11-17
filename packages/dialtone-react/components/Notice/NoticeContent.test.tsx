import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DtNoticeContent, type DtNoticeContentProps } from './NoticeContent';

// Constants
const baseProps = {
  headerText: 'this is the title',
  headerId: 'headerId555',
  contentId: 'contentId888',
} satisfies DtNoticeContentProps;

const baseSlotsData = {
  children: 'this is the content',
};

describe('DtNoticeContent tests', () => {
  let result: RenderResult;
  let props: DtNoticeContentProps;
  let slotsData: Pick<DtNoticeContentProps, 'children' | 'header'>;

  let header: HTMLElement | null;
  let content: HTMLElement | null;

  const _setWrappers = () => {
    cleanup();
    props = baseProps;
    result = render(<DtNoticeContent {...props} {...slotsData} />);
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    header = result.container.querySelector('#headerId555');
    content = result.container.querySelector('#contentId888');
  };

  beforeEach(function () {
    slotsData = { ...baseSlotsData };
    _setWrappers();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice content component', () => {
        expect(result.container.querySelector('[data-qa="notice-content"]')).toBeInTheDocument();
      });

      it('Should display header text correctly', () => {
        expect(header?.textContent).toBe(props.headerText);
      });

      it('Should display the content correctly', () => {
        expect(content?.textContent).toBe(baseSlotsData.children);
      });
    });

    describe('When header slot is provided', () => {
      beforeEach(() => {
        slotsData.header = 'this is a slot header';
        _setWrappers();
      });

      it('displays the correct text', () => {
        expect(header?.textContent).toBe(slotsData.header);
      });
    });

    describe('When no message content is provided', () => {
      beforeEach(() => {
        cleanup();
        props = baseProps;
        slotsData = {};
        result = render(<DtNoticeContent {...props} {...slotsData} />);
        _setChildWrappers();
      });

      it('does not render the message element', () => {
        expect(content).toBeNull();
      });
    });

    describe('When the slots are Fragments', () => {
      const renderWith = (extra: Partial<DtNoticeContentProps>) => {
        cleanup();
        result = render(<DtNoticeContent {...baseProps} message="Saved" {...extra} />);
        _setChildWrappers();
      };

      it('falls back to the message for an empty Fragment', () => {
        renderWith({ children: <>{false}</> });
        expect(content?.textContent).toBe('Saved');
      });

      it('falls back to the header text for an empty Fragment', () => {
        renderWith({ header: <>{null}</> });
        expect(header?.textContent).toBe(baseProps.headerText);
      });

      it('renders a populated Fragment', () => {
        renderWith({ children: <>populated</> });
        expect(content?.textContent).toBe('populated');
      });

      it('renders a Fragment holding numeric zero', () => {
        renderWith({ children: <>{0}</> });
        expect(content?.textContent).toBe('0');
      });

      it('does not render the message element for an empty Fragment without a message', () => {
        cleanup();
        result = render(<DtNoticeContent {...baseProps} children={<>{false}</>} />);
        _setChildWrappers();
        expect(content).toBeNull();
      });
    });
  });
});
