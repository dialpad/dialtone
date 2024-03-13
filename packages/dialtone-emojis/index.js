import ActivityDefault from './src/activity-default.json';
import ActivityLight from './src/activity-light.json';
import ActivityMediumLight from './src/activity-medium-light.json';
import ActivityMedium from './src/activity-medium.json';
import ActivityMediumDark from './src/activity-medium-dark.json';
import ActivityDark from './src/activity-dark.json';
import Flags from './src/flags.json';
import Food from './src/food.json';
import Nature from './src/nature.json';
import ObjectsDefault from './src/objects-default.json';
import ObjectsLight from './src/objects-light.json';
import ObjectsMediumLight from './src/objects-medium-light.json';
import ObjectsMedium from './src/objects-medium.json';
import ObjectsMediumDark from './src/objects-medium-dark.json';
import ObjectsDark from './src/objects-dark.json';
import PeopleDefault from './src/people-default.json';
import PeopleLight from './src/people-light.json';
import PeopleMediumLight from './src/people-medium-light.json';
import PeopleMedium from './src/people-medium.json';
import PeopleMediumDark from './src/people-medium-dark.json';
import PeopleDark from './src/people-dark.json';
import Symbols from './src/symbols.json';
import Travel from './src/travel.json';

export const emojisGrouped = {
  ActivityDefault,
  ActivityLight,
  ActivityMediumLight,
  ActivityMedium,
  ActivityMediumDark,
  ActivityDark,
  Flags,
  Food,
  Nature,
  ObjectsDefault,
  ObjectsLight,
  ObjectsMediumLight,
  ObjectsMedium,
  ObjectsMediumDark,
  ObjectsDark,
  PeopleDefault,
  PeopleLight,
  PeopleMediumLight,
  PeopleMedium,
  PeopleMediumDark,
  PeopleDark,
  Symbols,
  Travel,
};

export const emojisIndexed = [].concat(...Object.values(emojisGrouped)).reduce((accumulator, item) => {
  accumulator[item.unicode_character] = item;
  return accumulator;
}, {});
