import { useId, type SVGProps } from 'react';
import { cx } from '../common/cx';

export const ICON_SIZE_MODIFIERS = {
  100: 'd-icon--size-100',
  200: 'd-icon--size-200',
  300: 'd-icon--size-300',
  400: 'd-icon--size-400',
  500: 'd-icon--size-500',
  600: 'd-icon--size-600',
  700: 'd-icon--size-700',
  800: 'd-icon--size-800',
} as const;

export type IconSize = keyof typeof ICON_SIZE_MODIFIERS | `${keyof typeof ICON_SIZE_MODIFIERS}`;

export interface DtIconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** The size of the icon. */
  size?: IconSize;
  /** The label read out by screen readers. Leave it unset if the icon is purely presentational. */
  ariaLabel?: string;
  'data-qa'?: string;
}

// SVG attributes from the file → React props: presentation attributes are camelCase in React.
const reactName = (name: string) => (/^(data|aria)-/.test(name) || name === 'xmlns'
  ? name
  : name.replace(/[-:]([a-z])/g, (_, ch: string) => ch.toUpperCase()));

/** A Dialtone icon component; scripts/build-icons.mjs generates one per SVG. */
export function createIcon (displayName: string, attrs: Record<string, string>, inner: string, scoped: boolean) {
  const rootProps = Object.fromEntries(Object.entries(attrs)
    .filter(([name]) => name !== 'class' && name !== 'aria-hidden')
    .map(([name, value]) => [reactName(name), value]));

  function Icon ({ size = 500, ariaLabel, 'aria-label': ariaLabelAttr, className, 'data-qa': dataQa, ...rest }: DtIconProps) {
    // Vue maps an `aria-label` attribute onto the ariaLabel prop, so either one labels the icon and exposes it.
    const label = ariaLabel ?? ariaLabelAttr;
    const uid = useId();
    // The icon's own SVG body, generated at build time from dialtone-icons: no consumer input reaches the
    // dangerouslySetInnerHTML below. Gradient and clip-path ids are scoped per instance, as the Vue icons do,
    // so icons on one page don't clash.
    const html = scoped
      ? inner.replace(/(clip-path|fill)="url\(#([^)]+)\)"/g, `$1="url(#${uid}$2)"`)
        .replace(/(clipPath|linearGradient|radialGradient) id="([^"]+)"/g, `$1 id="${uid}$2"`)
      : inner;
    return (
      <svg
        {...rootProps}
        aria-label={label}
        aria-hidden={label ? 'false' : 'true'}
        className={cx(attrs.class, ICON_SIZE_MODIFIERS[size], className)}
        data-qa={dataQa ?? 'dt-icon'}
        {...rest}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
