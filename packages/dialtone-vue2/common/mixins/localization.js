import { DialtoneLocalizationPlugin } from '@/localization';
import { useI18N } from '@dialpad/i18n-vue2';
import Vue from 'vue';

Vue.use(DialtoneLocalizationPlugin);

export default {
  computed: {
    $t: () => useI18N().$t,
    $ta: () => useI18N().$ta,
    currentLocale: () => useI18N().currentLocale,
    setI18N: () => useI18N().setI18N,
  },
};
