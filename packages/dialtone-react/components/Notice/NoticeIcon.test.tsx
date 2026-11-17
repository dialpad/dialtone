import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DtIcon } from '../Icon';
import { DtNoticeIcon, type DtNoticeIconProps } from './NoticeIcon';

// Constants
const baseProps: DtNoticeIconProps = {
  kind: 'warning',
};

const baseSlotsData: Pick<DtNoticeIconProps, 'children'> = {};

describe('DtNoticeIcon tests', () => {
  let result: RenderResult;
  let icon: Element | null;
  let props: DtNoticeIconProps;
  let slotsData: Pick<DtNoticeIconProps, 'children'>;

  const element = () => <DtNoticeIcon {...props} {...slotsData} />;
  const root = () => result.container.firstElementChild;

  const _setWrappers = () => {
    cleanup();
    result = render(element());
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    icon = result.container.querySelector('[data-qa="dt-icon"]');
  };

  beforeEach(function () {
    props = baseProps;
    slotsData = baseSlotsData;
    _setWrappers();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice icon component', () => {
        expect(root()).toHaveClass('d-notice__icon');
      });

      it('Should render an icon', () => {
        expect(icon).toBeInTheDocument();
      });

      it('Should have aria-hidden set to true', () => {
        expect(root()).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('When kind is base', () => {
      beforeEach(() => {
        props = { ...props, kind: 'base' };
        result.rerender(element());
        _setChildWrappers();
      });

      it('Should render base icon', () => {
        expect(icon).toHaveClass('d-icon--bell');
      });
    });

    describe('When custom icon is passed into the slot', () => {
      beforeEach(() => {
        slotsData = {
          children: <DtIcon name="accessibility" />,
        };
        _setWrappers();
      });

      it('Should render correctly', async () => {
        expect(icon).toHaveClass('d-icon--accessibility');
      });
    });

    describe('When the slot is a Fragment', () => {
      it('Should render the default icon for an empty Fragment', () => {
        props = { ...props, kind: 'base' };
        slotsData = { children: <>{false}</> };
        _setWrappers();
        expect(icon).toHaveClass('d-icon--bell');
      });

      it('Should render the custom icon of a populated Fragment', () => {
        slotsData = { children: <><DtIcon name="accessibility" /></> };
        _setWrappers();
        expect(icon).toHaveClass('d-icon--accessibility');
      });

      it('Should render numeric zero in a Fragment', () => {
        props = { ...props, kind: 'base' };
        slotsData = { children: <>{0}</> };
        _setWrappers();
        expect(root()?.textContent).toBe('0');
      });
    });
  });
});
