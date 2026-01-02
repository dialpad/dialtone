<template>
  <div>
    <label
      class="d-label d-mb8"
      for="languages-multiselect"
    >
      Language Selection
    </label>
    <dt-recipe-combobox-multi-select
      id="languages-multiselect"
      label=""
      :show-label="false"
      :selected-items="selectedLanguagesLabels"
      :value="languageInput"
      @remove="onLanguageRemove"
      @input="onLanguageInput"
    >
      <template #list="{ listProps }">
        <ol
          v-bind="listProps"
          class="d-d-flex d-fd-column d-gg4"
        >
          <dt-list-item
            v-for="{ label, value } in languagesOptionsFiltered"
            :key="value"
            role="option"
          >
            <dt-checkbox
              :label="label"
              :value="value"
              :model-value="isLanguageSelected(value)"
              :disabled="isLanguageSelected('global') && value !== 'global'"
              @update:model-value="(isChecked) => toggleLanguageSelection(isChecked, value)"
            />
          </dt-list-item>
        </ol>
      </template>
    </dt-recipe-combobox-multi-select>

    <div class="d-mt16">
      <strong>Selected Languages:</strong> {{ selectedLanguages.join(', ') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DtRecipeComboboxMultiSelect from './combobox_multi_select.vue';
import DtListItem from '@/components/list_item/list_item.vue';
import DtCheckbox from '@/components/checkbox/checkbox.vue';

const languageInput = ref('');
const selectedLanguages = ref(['en']);

const languagesOptions = [
  { label: 'Global - All languages', value: 'global' },
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'Italian', value: 'it' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Korean', value: 'ko' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Dutch', value: 'nl' },
];

const languagesOptionsFiltered = computed(() => {
  if (!languageInput.value) {
    return languagesOptions;
  }
  const searchTerm = languageInput.value.toLowerCase();
  return languagesOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm),
  );
});

const selectedLanguagesLabels = computed(() => {
  const isGlobalSelected = selectedLanguages.value.includes('global');
  if (isGlobalSelected) {
    return ['Global'];
  }
  return selectedLanguages.value.map((value) => {
    const language = languagesOptions.find(
      (option) => option.value === value,
    );
    return language ? language.label : value;
  });
});

const isLanguageSelected = (value) => {
  return selectedLanguages.value.includes(value);
};

const toggleLanguageSelection = (isChecked, value) => {
  if (isChecked) {
    if (value === 'global') {
      selectedLanguages.value = languagesOptions.map((lang) => lang.value);
    } else {
      selectedLanguages.value.push(value);
    }
  } else {
    selectedLanguages.value = selectedLanguages.value.filter(
      (item) => item !== value,
    );
  }
};

const onLanguageRemove = (removedLabel) => {
  const isGlobalRemoved = removedLabel === 'Global';
  const removedValue = isGlobalRemoved
    ? 'global'
    : languagesOptions.find((option) => option.label === removedLabel)?.value || removedLabel;
  toggleLanguageSelection(false, removedValue);
};

const onLanguageInput = (value) => {
  languageInput.value = value;
};
</script>
