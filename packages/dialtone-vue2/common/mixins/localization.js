import { useI18N } from '@dialpad/i18n-vue2';
const { $t, $ta, currentLocale, setI18N } = useI18N();

export default {
  methods: {
    $t,
    $ta,
    setI18N,
  },
  //
  computed: {
    currentLocale: () => currentLocale,
  },
};
