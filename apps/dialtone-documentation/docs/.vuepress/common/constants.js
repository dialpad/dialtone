import dialtoneChangelog from '@dialpad/dialtone-css/CHANGELOG.json';
import dialtoneVueChangelog from '@dialpad/dialtone-vue/CHANGELOG.json';

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
