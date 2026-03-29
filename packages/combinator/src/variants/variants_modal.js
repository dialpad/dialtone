 
export default {
  default: {
    props: {
      title: {
        initialValue: 'Example title',
      },
      copy: {
        initialValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    },
    slots: {
      footer: {
        initialValue: '<dt-button importance="clear">Cancel</dt-button><dt-button importance="primary" class="d-mis-75">Confirm</dt-button>',
      },
    },
  },
  danger: {
    props: {
      title: {
        initialValue: 'Example title',
      },
      copy: {
        initialValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      kind: {
        initialValue: 'danger',
      },
    },
    slots: {
      footer: {
        initialValue: '<dt-button importance="clear">Cancel</dt-button><dt-button kind="danger" importance="primary" class="d-mis-75">Confirm</dt-button>',
      },
    },
  },
};
