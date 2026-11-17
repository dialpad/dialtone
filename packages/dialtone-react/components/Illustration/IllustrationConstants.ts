import { categories } from '@dialpad/dialtone-icons/keywords-illustrations.json';

type IllustrationCategories = typeof categories;

/** An illustration name in kebab-case, e.g. `mind` or `access-denied`. */
export type IllustrationName = {
  [C in keyof IllustrationCategories]: keyof IllustrationCategories[C]
}[keyof IllustrationCategories] & string;

// Vue reads @dialpad/dialtone-icons/illustrations.js, which has no types. dialtone-icons' build writes that list and
// keywords-illustrations.json from the same illustrations, sorted, so this is the same list, typed.
export const ILLUSTRATION_NAMES: IllustrationName[] = (
  Object.values(categories) as Record<IllustrationName, string[]>[]
)
  .flatMap(category => Object.keys(category) as IllustrationName[])
  .sort();

export default {
  ILLUSTRATION_NAMES,
};
