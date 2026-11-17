import { categories } from '@dialpad/dialtone-icons/keywords-icons.json';
import { ICON_SIZE_MODIFIERS } from '../../icons';

export { ICON_SIZE_MODIFIERS };

type IconCategories = typeof categories;

/** An icon name in kebab-case, e.g. `accessibility` or `arrow-left`. */
export type IconName = { [C in keyof IconCategories]: keyof IconCategories[C] }[keyof IconCategories] & string;

// Vue reads @dialpad/dialtone-icons/icons.js, which has no types. dialtone-icons' build writes that list and
// keywords-icons.json from the same icons, sorted, so this is the same list, typed.
export const ICON_NAMES = (Object.values(categories) as Record<IconName, string[]>[])
  .flatMap(category => Object.keys(category) as IconName[])
  .sort();

export default {
  ICON_SIZE_MODIFIERS,
  ICON_NAMES,
};
