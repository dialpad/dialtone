/* eslint-disable max-len */
export default {
  default: {
    props: {
      show: {
        initialValue: true,
      },
      title: {
        initialValue: 'Example title',
      },
      copy: {
        initialValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    },
    slots: {
      footer: {
        initialValue: '<dt-button importance="clear">Cancel</dt-button><dt-button importance="primary" class="d-ml6">Confirm</dt-button>',
      },
    },
  },
  danger: {
    props: {
      show: {
        initialValue: true,
      },
      title: {
        initialValue: 'Example title',
      },
      copy: {
        initialValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      kind: {
        initialValue: 'danger',
        lockControl: true,
      },
    },
    slots: {
      footer: {
        initialValue: '<dt-button importance="clear">Cancel</dt-button><dt-button kind="danger" importance="primary" class="d-ml6">Confirm</dt-button>',
      },
    },
  },
};
