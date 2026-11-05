export const VALIDATION_MESSAGE_TYPES = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  POSITIVE: 'positive',
  INFO: 'info',
} as const;

export type ValidationMessageType = typeof VALIDATION_MESSAGE_TYPES[keyof typeof VALIDATION_MESSAGE_TYPES];

export const DEFAULT_VALIDATION_MESSAGE_TYPE = VALIDATION_MESSAGE_TYPES.CRITICAL;
