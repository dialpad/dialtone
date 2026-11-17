import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DtNotice, type DtNoticeProps } from './Notice';

const baseProps: DtNoticeProps = {
  headerText: '',
};

const baseSlots = {
  children: 'default slot content',
  action: 'action slot content',
  icon: 'icon slot content',
};

let mockProps: DtNoticeProps = {};
let mockSlots: Partial<typeof baseSlots> = {};

describe('DtNotice tests', () => {
  let result: RenderResult;
  let rootElement: HTMLElement;
  let actionChild: HTMLElement;
  let contentChild: HTMLElement;
  let iconChild: HTMLElement;

  const qa = (name: string) => result.container.querySelector<HTMLElement>(`[data-qa="${name}"]`)!;

  const setChildren = () => {
    rootElement = result.container.querySelector('aside')!;
    actionChild = qa('notice-content-actions');
    contentChild = qa('notice-content');
    iconChild = result.container.querySelector<HTMLElement>('.d-notice__icon')!;
  };

  const updateWrapper = () => {
    result = render(<DtNotice {...baseProps} {...mockProps} {...baseSlots} {...mockSlots} />);
    setChildren();
  };

  const setProps = (props: DtNoticeProps) => {
    mockProps = { ...mockProps, ...props };
    result.rerender(<DtNotice {...baseProps} {...mockProps} {...baseSlots} {...mockSlots} />);
    setChildren();
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    cleanup();
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice component', () => {
        expect(rootElement).toBeInTheDocument();
      });

      it('action slot is passed down correctly', () => {
        expect(actionChild.textContent).toBe(baseSlots.action);
      });

      it('default slot is passed down correctly', () => {
        expect(contentChild.textContent).toBe(baseSlots.children);
      });

      it('icon slot is passed down correctly', () => {
        expect(iconChild.textContent).toBe(baseSlots.icon);
      });
    });

    describe('When important is false', () => {
      it('Has correct class', () => {
        expect(rootElement).not.toHaveClass('d-notice--important');
      });
    });

    describe('When important is true', () => {
      it('Has correct class', () => {
        setProps({ important: true });

        expect(rootElement).toHaveClass('d-notice--important');
      });
    });

    describe('When kind is not specified', () => {
      it('Does not add notice kind class', () => {
        expect(rootElement).not.toHaveClass('d-notice--');
      });

      // React-only: the Vue test above can't fail, as no kind renders a bare `d-notice--` class.
      it('Has the base kind class', () => {
        expect(rootElement).toHaveClass('d-notice--base');
      });
    });

    describe('When kind is set to critical', () => {
      it('Has correct class', () => {
        setProps({ kind: 'critical' });

        expect(rootElement).toHaveClass('d-notice--critical');
      });
    });

    describe('When kind is set to positive', () => {
      it('Has correct class', () => {
        setProps({ kind: 'positive' });

        expect(rootElement).toHaveClass('d-notice--positive');
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      it('Shows correct role', () => {
        expect(contentChild).toHaveAttribute('role', 'status');
      });
    });

    describe('When role is alert', () => {
      it('Shows correct role', () => {
        setProps({ role: 'alert' });

        expect(contentChild).toHaveAttribute('role', 'alert');
      });
    });
  });
});
