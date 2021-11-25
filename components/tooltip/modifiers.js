export const hideOnEsc = {
  name: 'hideOnEsc',
  defaultValue: true,
  fn ({ hide }) {
    function onKeyDown (event) {
      if (event.key === 'Escape') {
        hide();
      }
    }

    return {
      onShow () {
        document.addEventListener('keydown', onKeyDown);
      },
      onHide () {
        document.removeEventListener('keydown', onKeyDown);
      },
    };
  },
};

export const getArrowDetected = fn => ({
  name: 'arrowDetected',
  enabled: true,
  phase: 'main',
  fn,
  requiresIfExists: ['offset'],
});
