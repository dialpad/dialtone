/*
* Tippy directions - https://atomiks.github.io/tippyjs/v6/all-props/#placement
* */
import { BASE_TIPPY_DIRECTIONS, TIPPY_STICKY_VALUES } from '../Popover/TippyUtils';

export const TOOLTIP_DIRECTIONS = [
  ...BASE_TIPPY_DIRECTIONS,
] as const;

export type TooltipDirection = typeof TOOLTIP_DIRECTIONS[number];

export const TOOLTIP_DELAY_MS = 300;

export const TOOLTIP_KIND_MODIFIERS = {
  hover: 'd-tooltip--hover',
  show: 'd-tooltip--show',
  inverted: 'd-tooltip--inverted',
  hide: 'd-tooltip--hide',
} as const;

export const TOOLTIP_STICKY_VALUES = [
  ...TIPPY_STICKY_VALUES,
] as const;

export type TooltipSticky = typeof TOOLTIP_STICKY_VALUES[number];

export const TOOLTIP_HIDE_ON_CLICK_VARIANTS = [true, false, 'toggle'] as const;

export default {
  TOOLTIP_DIRECTIONS,
  TOOLTIP_DELAY_MS,
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_STICKY_VALUES,
  TOOLTIP_HIDE_ON_CLICK_VARIANTS,
};
