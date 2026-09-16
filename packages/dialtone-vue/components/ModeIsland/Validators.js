import { DT_MODE_ISLAND_TYPES } from './ModeIslandConstants';

export function modeValidator (mode) {
  return Object.values(DT_MODE_ISLAND_TYPES).includes(mode);
}

export default {
  modeValidator,
};