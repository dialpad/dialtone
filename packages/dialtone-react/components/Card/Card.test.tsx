import { cleanup, render, type RenderResult } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { DtCard, type DtCardProps } from './Card';

const baseSlots = {
  content: <div data-qa="content-element"> card content </div>,
  header: <div data-qa="header-element"> card header </div>,
  footer: <div data-qa="footer-element"> card footer </div>,
} satisfies DtCardProps;

describe('DtCard Tests', () => {
  let result: RenderResult;
  let contentElement: HTMLElement | null;
  let headerElement: HTMLElement | null;
  let footerElement: HTMLElement | null;

  const updateWrapper = () => {
    cleanup();
    result = render(<DtCard {...baseSlots} />);

    contentElement = result.container.querySelector('[data-qa="content-element"]');
    headerElement = result.container.querySelector('[data-qa="header-element"]');
    footerElement = result.container.querySelector('[data-qa="footer-element"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  describe('Test default rendering', () => {
    it('should render the component', () => {
      expect(result.container.querySelector('[data-qa="dt-card"]')).not.toBeNull();
    });

    it('should render the header', () => {
      expect(headerElement).toBeTruthy();
    });

    it('should render the content', () => {
      expect(contentElement).toBeTruthy();
    });

    it('should render the footer', () => {
      expect(footerElement).toBeTruthy();
    });
  });
});
