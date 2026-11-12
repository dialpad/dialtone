import { createPortal } from 'react-dom';
import { render, screen } from '@testing-library/react';
import { hasContent } from './slots';
import { DtItemLayout } from '../components/ItemLayout/ItemLayout';

describe('hasContent', () => {
  it('treats null, undefined, booleans and blank strings as empty', () => {
    expect(hasContent(null)).toBe(false);
    expect(hasContent(undefined)).toBe(false);
    expect(hasContent(false)).toBe(false);
    expect(hasContent(' ')).toBe(false);
  });

  it('treats strings, numbers, bigints, elements and portals as content', () => {
    expect(hasContent('a')).toBe(true);
    expect(hasContent(0)).toBe(true);
    expect(hasContent(42n as unknown as number)).toBe(true);
    expect(hasContent(<span />)).toBe(true);
    expect(hasContent(createPortal(<span />, document.body))).toBe(true);
  });

  it('renders bigint children and named slots in DtItemLayout', () => {
    render(<DtItemLayout subtitle={7n as unknown as number} data-qa="il">{42n as unknown as number}</DtItemLayout>);
    expect(screen.getByTestId('il').textContent).toContain('42');
    expect(screen.getByTestId('il').textContent).toContain('7');
  });
});
