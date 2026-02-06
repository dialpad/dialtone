
export default {
  items ({ query }) {
    const CHANNEL_LIST = [
      {
        id: 'dialpad',
        name: 'dialpad',
        channelKey: 'ch-001',
      },
      {
        id: 'dialtone',
        name: 'dialtone',
        channelKey: 'ch-002',
      },
      {
        id: 'dialtone-vue',
        name: 'dialtone-vue',
        channelKey: 'ch-003',
      },
      {
        id: 'dialtone-internal',
        name: 'dialtone-internal',
        locked: true,
        channelKey: 'ch-004',
      },
    ];

    if (query.length === 0) return CHANNEL_LIST;

    return CHANNEL_LIST.filter((channel) => { return channel.name.toLowerCase().startsWith(query.toLowerCase()); });
  },
};
