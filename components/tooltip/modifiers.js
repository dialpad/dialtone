export const getArrowDetected = fn => ({
  name: 'arrowDetected',
  enabled: true,
  phase: 'main',
  fn,
  requiresIfExists: ['offset'],
});
