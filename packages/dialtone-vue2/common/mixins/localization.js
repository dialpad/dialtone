/**
 * Simple mixin to reuse the i18n instance.
 */

import { DialtoneLocalization } from '@/localization';

export default {
  data () {
    return { i18n: new DialtoneLocalization() };
  },
};
