import { DT_MODE_ISLAND_TYPES } from './mode_island_constants';

export function modeValidator (mode) {
  return Object.values(DT_MODE_ISLAND_TYPES).includes(mode);
}

export default {
  modeValidator,
};