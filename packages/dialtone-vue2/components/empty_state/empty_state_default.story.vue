<template>
  <dt-empty-state
    :illustration-name="$attrs.illustrationName"
    :size="$attrs.size"
    :icon-name="$attrs.iconName"
    :show-illustration="$attrs.showIllustration"
    :header-text="$attrs.headerText"
    :body-text="$attrs.bodyText"
  >
    <template #body>
      <html-fragment
        :html="$attrs.body"
      />
    </template>
  </dt-empty-state>
</template>

<script>
import { DtEmptyState } from './';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'EmptyStateDefault',
  components: { DtEmptyState, htmlFragment },
};
</script>
