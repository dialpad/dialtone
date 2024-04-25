export default {
  items ({ query }) {
    const COMMAND_LIST = [
      {
        command: 'dpm',
        description: 'Start a Dialpad Meeting',
      },
      {
        command: 'giphy',
        parametersExample: '[text]',
        description: 'Post random animated GIF matching your text entry ',
      },
      {
        command: 'meeting',
        description: 'Start a Dialpad Meeting',
      },
    ];

    if (query.length === 0) return COMMAND_LIST;

    return COMMAND_LIST.filter((item) => item.command.toLowerCase().startsWith(query.toLowerCase()));
  },
};
