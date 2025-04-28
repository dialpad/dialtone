<script>
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';
import { allowedLocales } from '@/localization/index.js';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'LocalizationDefault',

  components: {
    DtButton,
    DtStack,
  },

  mixins: [DtLocalizationMixin],

  data () {
    return {
      locale: this.currentLocale,
    };
  },

  computed: {
    allowedLocales () {
      return allowedLocales;
    },
  },

  async mounted () {
    await this.setLocale('en-US');
  },

  methods: {
    setLocale: async function (_locale) {
      await this.setI18N({ preferredLocale: _locale });
      this.locale = _locale;
    },
  },
};
</script>

<template>
  <dt-stack
    direction="row"
    gap="300"
  >
    <span>{{ $t('STORYBOOK_SET_LANGUAGE') }}: </span>
    <dt-button
      v-for="(key, name) in allowedLocales"
      :key="key"
      :active="key === locale"
      size="xs"
      importance="outlined"
      @click="setLocale(key)"
    >
      {{ $t(`STORYBOOK_LANGUAGE_${name}`) }}
    </dt-button>
  </dt-stack>
</template>
