'use strict';

const ActivityDefault = require('./src/activity-default.json');
const ActivityLight = require('./src/activity-light.json');
const ActivityMediumLight = require('./src/activity-medium-light.json');
const ActivityMedium = require('./src/activity-medium.json');
const ActivityMediumDark = require('./src/activity-medium-dark.json');
const ActivityDark = require('./src/activity-dark.json');
const Flags = require('./src/flags.json');
const Food = require('./src/food.json');
const Nature = require('./src/nature.json');
const ObjectsDefault = require('./src/objects-default.json');
const ObjectsLight = require('./src/objects-light.json');
const ObjectsMediumLight = require('./src/objects-medium-light.json');
const ObjectsMedium = require('./src/objects-medium.json');
const ObjectsMediumDark = require('./src/objects-medium-dark.json');
const ObjectsDark = require('./src/objects-dark.json');
const PeopleDefault = require('./src/people-default.json');
const PeopleLight = require('./src/people-light.json');
const PeopleMediumLight = require('./src/people-medium-light.json');
const PeopleMedium = require('./src/people-medium.json');
const PeopleMediumDark = require('./src/people-medium-dark.json');
const PeopleDark = require('./src/people-dark.json');
const Symbols = require('./src/symbols.json');
const Travel = require('./src/travel.json');

const emojisGrouped = {
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

const emojisIndexed = [].concat(...Object.values(emojisGrouped)).reduce((accumulator, item) => {
  accumulator[item.unicode_character] = item;
  return accumulator;
}, {});

module.exports = {
  emojisGrouped,
  emojisIndexed
}
