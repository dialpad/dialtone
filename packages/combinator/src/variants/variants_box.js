/* eslint-disable max-len */



export default {
  default: {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'secondary' },
      borderColor: { initialValue: 'subtle' },
      borderWidth: { initialValue: '100' },
    },
    slots: {
      default: { initialValue: 'Box content' },
    },
  },

  'card composition': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'primary' },
      borderColor: { initialValue: 'subtle' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '300' },
      shadow: { initialValue: 'card' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="200">
  <dt-text kind="headline" size="md">Card title</dt-text>
  <dt-text kind="body" size="sm">Card body content with some descriptive text.</dt-text>
</dt-stack>` },
    },
  },

  'brand surface': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'brand-subtle' },
      borderColor: { initialValue: 'brand' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="body" size="sm">
  Brand informational content
</dt-text>` },
    },
  },

  'critical surface': {
    props: {
      padding: { initialValue: '300' },
      surface: { initialValue: 'critical-subtle' },
      borderColor: { initialValue: 'critical' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="body" size="sm">
  Critical error message
</dt-text>` },
    },
  },

  'padding cascade': {
    props: {
      padding: { initialValue: '400' },
      paddingInline: { initialValue: '100' },
      surface: { initialValue: 'moderate' },
      borderColor: { initialValue: 'subtle' },
      borderWidth: { initialValue: '100' },
    },
    slots: {
      default: { initialValue: 'Block padding 400, inline padding 100' },
    },
  },

  'semantic nav element': {
    props: {
      as: { initialValue: 'nav' },
      padding: { initialValue: '200' },
      surface: { initialValue: 'secondary' },
      borderColor: { initialValue: 'subtle' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: `<dt-stack direction="row" gap="200">
  <dt-text kind="body" size="sm">Home</dt-text>
  <dt-text kind="body" size="sm">About</dt-text>
  <dt-text kind="body" size="sm">Contact</dt-text>
</dt-stack>` },
    },
  },

  'sized with layout token': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'secondary' },
      borderColor: { initialValue: 'subtle' },
      borderWidth: { initialValue: '100' },
      inlineSize: { initialValue: '500' },
    },
    slots: {
      default: { initialValue: 'Fixed inline-size 500 (320px via layout token)' },
    },
  },

  'shadow': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'primary' },
      borderRadius: { initialValue: '200' },
      shadow: { initialValue: 'large' },
    },
    slots: {
      default: { initialValue: 'Large shadow' },
    },
  },

  'scrollbar': {
    props: {
      padding: { initialValue: '200' },
      surface: { initialValue: 'secondary' },
      borderColor: { initialValue: 'subtle' },
      borderWidth: { initialValue: '100' },
      borderRadius: { initialValue: '200' },
      scrollbar: { initialValue: 'never' },
      maxBlockSize: { initialValue: '300' },
    },
    slots: {
      default: { initialValue: `<dt-stack gap="100">
  <dt-text as="p" kind="body" size="sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi maiores dolorum sit cum nihil. Ducimus sed molestiae repellat reprehenderit harum, temporibus aliquam, voluptatibus velit, modi commodi necessitatibus id sint reiciendis.</dt-text>
  <dt-text as="p" kind="body" size="sm">Dolore quod minus quisquam, fugit eveniet earum praesentium perferendis sapiente autem ipsam eos obcaecati eaque, odit iste animi rem sed voluptate, pariatur fugiat! Distinctio voluptates ullam maxime harum non recusandae!</dt-text>
  <dt-text as="p" kind="body" size="sm">Exercitationem nisi assumenda in ullam nobis nihil quo, odit eos accusantium, ducimus maxime, ratione quas! Nesciunt inventore eum nobis modi suscipit veniam, voluptatum quo. Accusamus, praesentium. Voluptatem ipsum quisquam nobis.</dt-text>
  <dt-text as="p" kind="body" size="sm">Dolore rem unde eveniet nihil corporis doloremque vero odit voluptates iste voluptate ad sapiente cumque eaque cum architecto est amet ipsa laboriosam incidunt exercitationem, facere laborum facilis velit repellat! Nulla.</dt-text>
  <dt-text as="p" kind="body" size="sm">Maiores ratione at molestiae nihil porro, libero ex, iste, expedita dignissimos officiis eos voluptates incidunt. Iusto repellat, itaque voluptatibus ratione esse fuga harum saepe voluptates, perferendis quas accusantium fugiat natus?</dt-text>
  <dt-text as="p" kind="body" size="sm">Ab tempore accusamus officiis adipisci aut debitis dolores quae sunt eveniet provident dolorum cumque aperiam error suscipit impedit doloremque, modi nesciunt qui?</dt-text>
  <dt-text as="p" kind="body" size="sm">Nihil beatae eligendi quasi quia, laborum fuga. Adipisci iusto laboriosam ipsa reiciendis, dolor non labore odit consequatur optio mollitia quo fugiat facilis, aspernatur, aut aliquid voluptatum numquam quae minus modi.</dt-text>
  <dt-text as="p" kind="body" size="sm">Quibusdam exercitationem dolores asperiores explicabo quas, quaerat voluptatibus pariatur omnis accusantium expedita aliquid illum libero tenetur ducimus officiis odit adipisci autem magni saepe iusto eum quae reiciendis vel? Vero, cum?</dt-text>
  <dt-text as="p" kind="body" size="sm">Nostrum, impedit repellat. Laboriosam quasi corporis, placeat pariatur deserunt inventore. Architecto voluptate aperiam aliquam, ipsum dignissimos dolorum, eius recusandae quasi deserunt magnam consectetur cumque quisquam odit suscipit nulla nam excepturi.</dt-text>
  <dt-text as="p" kind="body" size="sm">Saepe, ea numquam explicabo cumque deleniti quo architecto minima. Sed facere sint iste vitae distinctio dignissimos iusto velit asperiores esse ex magni doloribus aliquam, illum officiis eos nostrum alias saepe.</dt-text>
  <dt-text as="p" kind="body" size="sm">Molestias minima blanditiis soluta eum vero laborum, ipsa ullam tempora! Excepturi quasi, omnis dolorum assumenda totam recusandae eaque inventore quae autem consectetur pariatur commodi aperiam quibusdam est, ipsam architecto esse.</dt-text>
</dt-stack>` },
    },
  },

  'pill radius': {
    props: {
      padding: { initialValue: '100' },
      paddingInline: { initialValue: '200' },
      surface: { initialValue: 'brand-subtle' },
      borderRadius: { initialValue: 'pill' },
    },
    slots: {
      default: { initialValue: `<dt-text kind="label" size="sm">
  Pill shape
</dt-text>` },
    },
  },
};
