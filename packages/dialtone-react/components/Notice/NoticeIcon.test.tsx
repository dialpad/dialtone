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
  });
});
