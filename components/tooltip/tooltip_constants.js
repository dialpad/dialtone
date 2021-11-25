export const TOOLTIP_DIRECTION_MODIFIERS = [
  'top-left', 'top-center', 'top-right',
  'right-top', 'right-center', 'right-bottom',
  'bottom-left', 'bottom-center', 'bottom-right',
  'left-top', 'left-center', 'left-bottom',
];

/*
* Mapping object for Tippy and Dialtone tooltip directions
* Tippy directions - https://atomiks.github.io/tippyjs/v6/all-props/#placement
* Dialtone tooltip directions - https://dialtone.netlify.app/components/tooltip/#arrow-directions
* */
export const TOOLTIP_TIPPY_DIRECTIONS = {
  bottom: 'top-center',
  'bottom-start': 'top-left',
  'bottom-end': 'top-right',
  right: 'left-center',
  'right-start': 'left-top',
  'right-end': 'left-bottom',
  left: 'right-center',
  'left-start': 'right-top',
  'left-end': 'right-bottom',
  top: 'bottom-center',
  'top-start': 'bottom-left',
  'top-end': 'bottom-right',
};

/*
* String-keyed object which contains Dialton and Tippy tooltip directions mapping
*/
export const TOOLTIP_DIALTONE_DIRECTIONS = Object.entries(TOOLTIP_TIPPY_DIRECTIONS).reduce((acc, [key, value]) => ({
  ...acc,
  [value]: key,
}), {});

export const TOOLTIP_KIND_MODIFIERS = {
  hover: `d-tooltip--hover`,
  show: `d-tooltip--show`,
  inverted: `d-tooltip--inverted`,
  hide: `d-tooltip--hide`,
};

export const TOOLTIP_HIDE_ON_CLICK_VARIANTS = [true, false, 'toggle'];
