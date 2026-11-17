import type { ComponentType } from 'react';
import * as icons from '../../icons/generated';
import type { DtIconProps as IconComponentProps } from '../../icons';
import type { IconName } from './IconConstants';

export interface DtIconProps extends Omit<IconComponentProps, 'ariaLabel'> {
  /** The icon name in kebab-case. */
  name: IconName;
  /** The label of the icon as read out by a screen-reader. Leave this unset if your icon is purely presentational. */
  ariaLabel?: string;
}

const iconComponents: Record<string, ComponentType<IconComponentProps> | undefined> = icons;

// The export name scripts/build-icons.mjs gives the icon from its file name, which is the icon's name.
const componentName = (name: string) => `dt-icon-${name}`.toLowerCase().split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * Looking an icon up by `name` pulls the whole icon catalog into the consumer's bundle. To ship only the icons an
 * app uses, import them by name from `@dialpad/dialtone-react/icons` instead.
 * @see https://dialtone.dialpad.com/components/icon.html
 */
export function DtIcon ({ name, size = 500, ariaLabel, 'data-qa': dataQa, ...rest }: DtIconProps) {
  // Vue renders nothing for a name with no icon.
  const iconName = componentName(name);
  const Icon = Object.hasOwn(iconComponents, iconName) ? iconComponents[iconName] : undefined;
  if (!Icon) return null;
  return <Icon size={size} ariaLabel={ariaLabel} data-qa={dataQa ?? 'dt-icon'} {...rest} />;
}
