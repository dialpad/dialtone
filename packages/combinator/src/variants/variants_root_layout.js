/* eslint-disable max-len */
export default {
  default: {
    props: {
      fixed: {
        initialValue: false,
      },
    },
    slots: {
      header: {
        initialValue: '<div class="d-h64 d-bgc-purple-100">Header</div>',
      },
      sidebar: {
        initialValue: '<div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div></div>',
      },
      default: {
        initialValue: '<div class="d-bgc-green-100 d-w100p d-h100p">Content</div>',
      },
      footer: {
        initialValue: '<div class="d-h64 d-bgc-gold-100">Footer</div>',
      },
    },
  },
};
