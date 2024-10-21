<template>
  <dt-empty-state
    :key="getUniqueString()"
    :size="$attrs.size"
    :show-illustration="$attrs.showIllustration"
    :header-text="$attrs.headerText"
    :body-text="$attrs.bodyText"
  >
    <template
      v-if="$attrs.icon"
      #icon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.icon"
        :size="iconSize"
      />
    </template>
    <template
      v-if="$attrs.illustration"
      #illustration
    >
      <dt-illustration
        :name="$attrs.illustration"
      />
    </template>
    <template #body>
      <html-fragment
        :html="$attrs.body"
      />
    </template>
  </dt-empty-state>
</template>

<script setup>
import { DtEmptyState } from './';
import { getUniqueString, htmlFragment } from '@/common/utils';
import { DtIcon } from '@/components/icon';
import { DtIllustration } from '@/components/illustration';
</script>
