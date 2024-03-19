const ActivityDefault = () => import('./src/activity-default.json');
const ActivityLight = () => import('./src/activity-light.json');
const ActivityMediumLight = () => import('./src/activity-medium-light.json');
const ActivityMedium = () => import('./src/activity-medium.json');
const ActivityMediumDark = () => import('./src/activity-medium-dark.json');
const ActivityDark = () => import('./src/activity-dark.json');
const Flags = () => import('./src/flags.json');
const Food = () => import('./src/food.json');
const Nature = () => import('./src/nature.json');
const ObjectsDefault = () => import('./src/objects-default.json');
const ObjectsLight = () => import('./src/objects-light.json');
const ObjectsMediumLight = () => import('./src/objects-medium-light.json');
const ObjectsMedium = () => import('./src/objects-medium.json');
const ObjectsMediumDark = () => import('./src/objects-medium-dark.json');
const ObjectsDark = () => import('./src/objects-dark.json');
const PeopleDefault = () => import('./src/people-default.json');
const PeopleLight = () => import('./src/people-light.json');
const PeopleMediumLight = () => import('./src/people-medium-light.json');
const PeopleMedium = () => import('./src/people-medium.json');
const PeopleMediumDark = () => import('./src/people-medium-dark.json');
const PeopleDark = () => import('./src/people-dark.json');
const Symbols = () => import('./src/symbols.json');
const Travel = () => import('./src/travel.json');

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
