/* eslint-disable max-len */
export default {
  default: {
    props: {
      heading: {
        initialValue: 'Example Heading',
      },
    },
    slots: {
      default: {
        initialValue: '<div class="d-py8 d-px12">item1</div><div class="d-py8 d-px12">item2</div><div class="d-py8 d-px12">item3</div>',
      },
    },
  },

  'bold heading': {
    props: {
      heading: { initialValue: 'Example Heading' },
      headingClass: { initialValue: 'd-fw-bold' },
    },
    slots: {
      default: { initialValue: '<dt-list-item navigation-type="tab">item1</dt-list-item><dt-list-item navigation-type="tab">item2</dt-list-item><dt-list-item navigation-type="tab">item3</dt-list-item>' },
    },
  },
};
