import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ToastLayoutDefault } from './ToastLayoutDefault';
import type { ToastLayoutProps } from './ToastLayoutProps';

// Vue checks the prop validators, which only warn: the layout renders an invalid value as it is. The port checks
// what each value renders, and the types reject the invalid ones.
describe('Toast Default Layout Tests', () => {
  let result: RenderResult;

  const updateWrapper = (props: ToastLayoutProps) => {
    result = render(<ToastLayoutDefault isShown {...props} />);
  };

  const qa = (name: string) => result.container.querySelector<HTMLElement>(`[data-qa="${name}"]`)!;

  afterEach(() => {
    cleanup();
  });

  describe('Validation Tests', () => {
    describe('Role Validator', () => {
      describe('When provided role is in TOAST_ROLES', () => {
        it('passes custom prop validation', () => {
          updateWrapper({});

          expect(qa('notice-content')).toHaveAttribute('role', 'status');
        });
      });

      describe('When provided role is not in TOAST_ROLES', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error INVALID_ROLE isn't a toast role
          updateWrapper({ role: 'INVALID_ROLE' });

          expect(qa('notice-content')).toHaveAttribute('role', 'INVALID_ROLE');
        });
      });
    });

    describe('Kind Validator', () => {
      describe('When provided kind is in NOTICE_KINDS', () => {
        it('passes custom prop validation', () => {
          updateWrapper({});

          expect(qa('dt-toast')).toHaveClass('d-toast--base');
        });
      });

      describe('When provided kind is not in NOTICE_KINDS', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error INVALID_KIND isn't a toast kind
          updateWrapper({ kind: 'INVALID_KIND' });

          expect([...qa('dt-toast').classList]).toEqual(['d-toast']);
        });
      });
    });
  });
});
