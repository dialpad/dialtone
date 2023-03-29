/*
* Tippy directions - https://atomiks.github.io/tippyjs/v6/all-props/#placement
* */
import { BASE_TIPPY_DIRECTIONS, TIPPY_STICKY_VALUES } from '../popover/tippy_utils';

export const TOOLTIP_DIRECTIONS = [
  ...BASE_TIPPY_DIRECTIONS,
];

export const TOOLTIP_DELAY_MS = 300;

export const TOOLTIP_KIND_MODIFIERS = {
  hover: `d-tooltip--hover`,
  show: `d-tooltip--show`,
  inverted: `d-tooltip--inverted`,
  hide: `d-tooltip--hide`,
};

export const TOOLTIP_STICKY_VALUES = [
  ...TIPPY_STICKY_VALUES,
];

export const TOOLTIP_HIDE_ON_CLICK_VARIANTS = [true, false, 'toggle'];
