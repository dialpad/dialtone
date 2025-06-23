<script setup>
import { DtButton } from '@/components/button/index.js';
import { DtStack } from '@/components/stack/index.js';
import { allowedLocales } from '@/localization/index.js';
import { useI18N } from '@dialpad/i18n-vue2';
import { onMounted, ref } from 'vue';
const { $t, setI18N, currentLocale } = useI18N();

const locale = ref(currentLocale);

async function setLocale (_locale) {
  await setI18N({ preferredLocale: _locale });
  locale.value = _locale;
}

onMounted(async () => {
  await setLocale('en-US');
});
</script>

<template>
  <dt-stack
    direction="row"
    gap="300"
  >
    <span>{{ $t('SET_LANGUAGE') }}: </span>
    <dt-button
      v-for="(key, name) in allowedLocales"
      :key="key"
      :active="key === locale"
      size="xs"
      importance="outlined"
      @click="setLocale(key)"
    >
      {{ $t(name) }}
    </dt-button>
  </dt-stack>
</template>
