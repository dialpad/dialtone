export default {
  name: 'hideOnEsc',
  defaultValue: true,
  fn ({ hide }) {
    function onKeyDown (event) {
      if (event.keyCode === 27) {
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
