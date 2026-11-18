export const ROOT_LAYOUT_SIDEBAR_POSITIONS = {
  START: 'start',
  END: 'end',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export const ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS = ['sm', 'md', 'lg', null] as const;

export type RootLayoutSidebarPosition = typeof ROOT_LAYOUT_SIDEBAR_POSITIONS[keyof typeof ROOT_LAYOUT_SIDEBAR_POSITIONS];
export type RootLayoutResponsiveBreakpoint = typeof ROOT_LAYOUT_RESPONSIVE_BREAKPOINTS[number];
