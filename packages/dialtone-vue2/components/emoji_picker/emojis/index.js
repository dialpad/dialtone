import ActivityDefault from './activity-default.json';
import ActivityLight from './activity-light.json';
import ActivityMediumLight from './activity-medium-light.json';
import ActivityMedium from './activity-medium.json';
import ActivityMediumDark from './activity-medium-dark.json';
import ActivityDark from './activity-dark.json';
import Flags from './flags.json';
import Food from './food.json';
import Nature from './nature.json';
import ObjectsDefault from './objects-default.json';
import ObjectsLight from './objects-light.json';
import ObjectsMediumLight from './objects-medium-light.json';
import ObjectsMedium from './objects-medium.json';
import ObjectsMediumDark from './objects-medium-dark.json';
import ObjectsDark from './objects-dark.json';
import PeopleDefault from './people-default.json';
import PeopleLight from './people-light.json';
import PeopleMediumLight from './people-medium-light.json';
import PeopleMedium from './people-medium.json';
import PeopleMediumDark from './people-medium-dark.json';
import PeopleDark from './people-dark.json';
import Symbols from './symbols.json';
import Travel from './travel.json';

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
