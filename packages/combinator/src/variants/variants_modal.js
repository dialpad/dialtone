/* eslint-disable max-len */

export default {
  default: {
    props: {
      headerText: {
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
  critical: {
    props: {
      headerText: {
        initialValue: 'Example title',
      },
      copy: {
        initialValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      kind: {
        initialValue: 'critical',
      },
    },
    slots: {
      footer: {
        initialValue: '<dt-button importance="clear">Cancel</dt-button><dt-button kind="critical" importance="primary" class="d-mis-75">Confirm</dt-button>',
      },
    },
  },
};
