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
  });
});
