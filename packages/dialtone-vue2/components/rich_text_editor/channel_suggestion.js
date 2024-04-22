/* eslint-disable max-len */
export default {
  items ({ query }) {
    const CHANNEL_LIST = [
      {
        id: '1',
        name: 'dialpad',
      },
      {
        id: '2',
        name: 'dialtone',
      },
      {
        id: '3',
        name: 'dialtone-vue',
      },
      {
        id: '4',
        name: 'dialtone-internal',
        locked: true,
      },
    ];

    if (query.length === 0) return CHANNEL_LIST;

    return CHANNEL_LIST.filter((channel) => { return channel.name.toLowerCase().startsWith(query.toLowerCase()); });
  },
};
