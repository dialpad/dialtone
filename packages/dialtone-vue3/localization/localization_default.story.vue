<script>
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';
import { DialtoneLocalization } from '@/localization';

export default {
  name: 'LocalizationDefault',
  components: {
    DtButton,
    DtStack,
  },

  data () {
    return {
      i18n: new DialtoneLocalization(),
    };
  },
};
</script>

<template>
  <dt-stack
    direction="row"
    gap="300"
  >
    <span>{{ i18n.$t('STORYBOOK_SET_LANGUAGE') }}: </span>
    <dt-button
      v-for="(key, name) in i18n.allowedLocales"
      :key="key"
      :active="key === i18n.currentLocale"
      size="xs"
      importance="outlined"
      @click="i18n.currentLocale = key"
    >
      {{ i18n.$t(`STORYBOOK_LANGUAGE_${name}`) }}
    </dt-button>
  </dt-stack>
</template>
