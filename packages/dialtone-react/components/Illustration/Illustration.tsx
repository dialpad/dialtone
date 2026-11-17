import { useId, type SVGProps } from 'react';
import { cx } from '../../common/cx';
import type { IllustrationName } from './IllustrationConstants';

export interface DtIllustrationProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** The illustration name in kebab-case. */
  name: IllustrationName;
  /** The label of the illustration as read out by a screen-reader. Leave this unset if it is purely presentational. */
  ariaLabel?: string;
  'data-qa'?: string;
}

interface ParsedIllustration {
  attrs: Record<string, string>;
  inner: string;
  /** Whether the SVG has ids to scope per instance, as Vue's generated illustrations do. */
  scoped: boolean;
}

// dialtone-icons' built SVGs, the same files its build turns into the Vue illustrations. Vue looks the component up
// by name in the same set; the glob is static, so the bundler includes exactly these files.
const svgSources = import.meta.glob<string>('../../node_modules/@dialpad/dialtone-icons/dist/svg/illustrations/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// SVG attributes from the file → React props: presentation attributes are camelCase in React.
const reactName = (name: string) => (/^(data|aria)-/.test(name) || name === 'xmlns'
  ? name
  : name.replace(/[-:]([a-z])/g, (_, ch: string) => ch.toUpperCase()));

const parseSvg = (svg: string): ParsedIllustration | undefined => {
  const match = svg.trim().match(/^<svg([^>]*)>([\s\S]*)<\/svg>$/);
  if (!match) return undefined;
  const attrs = Object.fromEntries([...match[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
  const inner = match[2];
  // The ids Vue's generator scopes (transformSVGtoVue.cjs).
  const scoped = /(clip-path|fill)="url\(#/.test(inner) || /(clipPath|linearGradient|radialGradient) id="/.test(inner);
  return { attrs, inner, scoped };
};

// Keyed by illustration name, which is the file's name.
const illustrations = new Map<string, ParsedIllustration>();
for (const [file, svg] of Object.entries(svgSources)) {
  const name = file.slice(file.lastIndexOf('/') + 1, -'.svg'.length);
  const parsed = parseSvg(svg);
  if (parsed) illustrations.set(name, parsed);
}

/**
 * The Illustration component renders one of Dialtone's spot illustrations by name.
 * @see https://dialtone.dialpad.com/components/illustration.html
 */
export function DtIllustration ({
  name,
  ariaLabel,
  'aria-label': ariaLabelAttr,
  className,
  'data-qa': dataQa,
  ...rest
}: DtIllustrationProps) {
  const uid = useId();
  // Vue renders nothing for a name with no illustration.
  const illustration = illustrations.get(name);
  if (!illustration) return null;

  const { attrs, inner, scoped } = illustration;
  // Vue maps an `aria-label` attribute onto the ariaLabel prop, so either one labels the illustration.
  const label = ariaLabel ?? ariaLabelAttr;
  const rootProps = Object.fromEntries(Object.entries(attrs)
    .filter(([attr]) => attr !== 'class' && attr !== 'aria-hidden')
    .map(([attr, value]) => [reactName(attr), value]));
  // The illustration's own SVG body, generated at build time from dialtone-icons: no consumer input reaches the
  // dangerouslySetInnerHTML below. Gradient and clip-path ids are scoped per instance, as Vue's are, so
  // illustrations on one page don't clash.
  const html = scoped
    ? inner.replace(/(clip-path|fill)="url\(#([^)]+)\)"/g, `$1="url(#${uid}$2)"`)
      .replace(/(clipPath|linearGradient|radialGradient) id="([^"]+)"/g, `$1 id="${uid}$2"`)
    : inner;

  return (
    <svg
      {...rootProps}
      aria-label={label}
      aria-hidden={label ? 'false' : 'true'}
      className={cx(attrs.class, className)}
      data-qa={dataQa ?? 'dt-illustration'}
      {...rest}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
