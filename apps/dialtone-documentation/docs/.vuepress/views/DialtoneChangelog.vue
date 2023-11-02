<template>
  <div
    v-for="(n, i) in 5"
    :key="i"
    class="dialtone-release-notes"
  >
    <a
      :href="getGithubReleaseUrl(i)"
      class="d-link"
    >
      <h3 class="d-docsite--header-3">v{{ getVersion(i) }}</h3>
    </a>
    <ul class="d-docsite--unordered-list">
      <li
        v-for="(item, index) in changelogJson.versions[i].parsed._"
        :key="index"
        class="d-docsite--list-element"
      >
        <markdown-render :markdown="formatReleaseNote(item)" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MarkdownRender from '@baseComponents/MarkdownRender.vue';
import { DIALTONE_CHANGELOGS } from '../common/constants.js';
import { ReleaseNoteFormatter } from '../common/utilities.js';

const props = defineProps({
  project: {
    type: String,
    default: 'Dialtone',
    validator (value) {
      return Object.keys(DIALTONE_CHANGELOGS).includes(value);
    },
  },
});

const changelogJson = computed(() => DIALTONE_CHANGELOGS[props.project].json_file);

const getVersion = (item) => changelogJson.value.versions[item].version;

const getUrlHandler = () => DIALTONE_CHANGELOGS[props.project].url_handler;

const getGithubReleaseUrl = (item) => `https://github.com/dialpad/${getUrlHandler()}/releases/tag/v${getVersion(item)}`;

const formatReleaseNote = (note) => {
  const formatter = Object.create(ReleaseNoteFormatter);
  formatter.note = note;
  formatter.project_url_handler = getUrlHandler();
  return formatter.format();
};
</script>
