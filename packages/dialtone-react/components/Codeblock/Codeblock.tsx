import type { ComponentPropsWithRef } from 'react';
import { cx } from '../../common/cx';
import { CODEBLOCK_SIZE_DEFAULT, CODEBLOCK_SIZE_MAP, type CodeblockSize } from './CodeblockConstants';

interface DtCodeblockOwnProps {
  /**
   * The text to display in the codeblock.
   */
  text: string;

  /**
   * Whether to render as a styled container block.
   */
  bordered?: boolean;

  /**
   * Font size of the code block.
   * @values 100, 200, 300, 400
   */
  size?: CodeblockSize;
}

export type DtCodeblockProps = DtCodeblockOwnProps &
  Omit<ComponentPropsWithRef<'pre'>, keyof DtCodeblockOwnProps | 'children'>;

/**
 * A codeblock displays preformatted text, such as source code, in a monospaced block.
 * @see https://dialtone.dialpad.com/components/codeblock.html
 */
export function DtCodeblock ({
  text,
  bordered = false,
  size = CODEBLOCK_SIZE_DEFAULT,
  className,
  ...attrs
}: DtCodeblockProps) {
  const sizeClass = CODEBLOCK_SIZE_MAP[String(size)] || String(size);

  // Vue's template is a single line so that no whitespace is added inside the <pre>; JSX adds none either.
  return (
    <pre
      data-qa="dt-codeblock"
      {...attrs}
      className={cx('d-codeblock', { 'd-codeblock--bordered': bordered }, className)}
    ><code
      className={cx('d-codeblock__code', `d-codeblock__code--${sizeClass}`)}
      data-qa="dt-codeblock-code"
    >{text}</code></pre>
  );
}
