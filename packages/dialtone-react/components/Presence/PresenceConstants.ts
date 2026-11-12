export const PRESENCE_STATES = {
  BUSY: 'busy',
  AWAY: 'away',
  OFFLINE: 'offline',
  ACTIVE: 'active',
  DND: 'dnd',
} as const;

export type PresenceState = typeof PRESENCE_STATES[keyof typeof PRESENCE_STATES];

export const PRESENCE_STATES_LIST = [
  PRESENCE_STATES.BUSY,
  PRESENCE_STATES.AWAY,
  PRESENCE_STATES.OFFLINE,
  PRESENCE_STATES.ACTIVE,
  PRESENCE_STATES.DND,
] as const satisfies readonly PresenceState[];
