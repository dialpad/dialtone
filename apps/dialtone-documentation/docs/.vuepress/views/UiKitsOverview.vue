<template>
  <DtBox class="d-box d-box--bc-default d-d-grid d-g-300 md:d-g-cols3 d-mbe-400">
    <DtLink to="/ui-kits/what-are-ui-kits/" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
      <DtStack direction="row" gap="150">
        <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
          <DtStack>
            <dt-icon name="file-text" :size="viewport.pick({ default: '300', md: '500' })" />
          </DtStack>
        </DtBox>
        <DtStack>
          <dt-text as="h3" kind="headline" size="200">
            What are UI Kits?
          </dt-text>
          <dt-text as="p" kind="body" size="200">
            Domain-specific components built with Dialtone.
          </dt-text>
        </DtStack>
      </DtStack>
    </DtLink>
    <DtLink to="/ui-kits/where-to-start/" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
      <DtStack direction="row" gap="150">
        <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
          <DtStack>
            <dt-icon name="file-text" :size="viewport.pick({ default: '300', md: '500' })" />
          </DtStack>
        </DtBox>
        <DtStack>
          <dt-text as="h3" kind="headline" size="200">
            Where to Start
          </dt-text>
          <dt-text as="p" kind="body" size="200">
            Adding a UI Kit component to your project.
          </dt-text>
        </DtStack>
      </DtStack>
    </DtLink>
    <DtLink to="/ui-kits/how-to-contribute/" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
      <DtStack direction="row" gap="150">
        <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
          <DtStack>
            <dt-icon name="file-text" :size="viewport.pick({ default: '300', md: '500' })" />
          </DtStack>
        </DtBox>
        <DtStack>
          <dt-text as="h3" kind="headline" size="200">
            How to Contribute
          </dt-text>
          <dt-text as="p" kind="body" size="200">
            How to propose, build, and contribute Dialpad UI Kits.
          </dt-text>
        </DtStack>
      </DtStack>
    </DtLink>
  </DtBox>

  <div class="dialtone-wall dialtone-wall--ui-kits">
    <template v-for="kit in kits" :key="kit.text">
      <a
        v-if="kit.status !== 'planned'"
        :href="kit.link"
        target="_blank"
        rel="noopener noreferrer"
        class="dialtone-wall__item"
      >
        <dt-stack direction="column" justify="between" class="dialtone-wall__details d-h100p">
          <dt-stack direction="column" gap="100">
            <div class="dialtone-wall__title">
              <span class="dialtone-wall__title-text">{{ kit.text }}</span>
              <span
                v-if="kit.status"
                class="d-badge d-tt-capitalize"
                :class="badgeKindClass(kit.status)"
              >
                {{ kit.status }}
              </span>
            </div>
            <div class="dialtone-wall__description">
              {{ kit.description }}
            </div>
          </dt-stack>
          <dt-stack direction="row" gap="50" class="d-ai-center">
            <dt-icon name="storybook-color" size="200" />
            <dt-text kind="label" size="200" strength="medium" tone="secondary">Storybook</dt-text>
          </dt-stack>
        </dt-stack>
      </a>
      <div v-else class="dialtone-wall__item">
        <dt-stack direction="column" class="dialtone-wall__details">
          <dt-stack direction="column" gap="100">
            <div class="dialtone-wall__title">
              <span class="dialtone-wall__title-text">{{ kit.text }}</span>
              <span class="d-badge d-tt-capitalize">
                {{ kit.status }}
              </span>
            </div>
            <div class="dialtone-wall__description">
              {{ kit.description }}
            </div>
          </dt-stack>
        </dt-stack>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { computed } from 'vue';
import { useViewportBreakpoints } from '../theme/composables/useViewportBreakpoints.js';

const themeData = useThemeLocaleData();

const viewport = useViewportBreakpoints();

const kits = computed(() => {
  // 'UI Kits' (top level) and its 'Meet the Kits' child both link to /ui-kits/;
  // the kit entries are the children of 'Meet the Kits'.
  const nav = themeData.value.sidebar?.nav || [];
  const uiKits = nav.find(item => item.link === '/ui-kits/');
  const meetTheKits = uiKits?.children?.find(child => child.link === '/ui-kits/');
  return meetTheKits?.children || [];
});

const badgeKindClass = (status) => {
  switch (status) {
    case 'new':
      return 'd-badge--bulletin';
    case 'ready':
      return 'd-badge--success';
    case 'beta':
      return 'd-badge--info';
    default:
      return '';
  }
};
</script>
