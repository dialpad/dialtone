import dialtoneChangelog from '@projectRoot/node_modules/@dialpad/dialtone/CHANGELOG.json';
import dialtoneVueChangelog from '@projectRoot/node_modules/@dialpad/dialtone-vue/CHANGELOG.json';

export const DIALTONE_CHANGELOGS = {
  Dialtone: {
    json_file: dialtoneChangelog,
    url_handler: 'dialtone',
  },
  DialtoneVue: {
    json_file: dialtoneVueChangelog,
    url_handler: 'dialtone-vue',
  },
};

export default {
  DIALTONE_CHANGELOGS,
};
