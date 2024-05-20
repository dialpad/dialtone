/* eslint-disable max-len */
export default {
  items ({ query }) {
    const CHANNEL_LIST = [
      {
        id: 'dialpad',
        name: 'dialpad',
      },
      {
        id: 'dialtone',
        name: 'dialtone',
      },
      {
        id: 'dialtone-vue',
        name: 'dialtone-vue',
      },
      {
        id: 'dialtone-internal',
        name: 'dialtone-internal',
        locked: true,
      },
    ];

    if (query.length === 0) return CHANNEL_LIST;

    return CHANNEL_LIST.filter((channel) => { return channel.name.toLowerCase().startsWith(query.toLowerCase()); });
  },
};
