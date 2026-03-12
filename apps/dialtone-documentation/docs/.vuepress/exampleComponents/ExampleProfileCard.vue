<template>
  <dt-stack gap="500">
    <dt-stack gap="400" justify="between">
      <dt-stack>
        <dt-text as="h2" kind="headline" size="xl" strength="medium" density="200" class="d-fs-400">
          Katie Rodriguez
        </dt-text>
        <dt-stack direction="row" gap="350">
          <dt-text tone="success">
            Available
          </dt-text>
          <dt-text>&bull;</dt-text>
          <dt-text tone="tertiary">
            Working from coffee shop
          </dt-text>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="200">
        <dt-text kind="body" size="md" density="200" strength="semibold" tone="tertiary">
          Chief Customer Success Officer
        </dt-text>
        <dt-text kind="body" size="sm" density="200">
          <dt-text strength="medium">
            6:19 am
          </dt-text> local time
        </dt-text>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="400" direction="row" justify="between">
      <dt-button class="d-fl1" kind="muted" importance="outlined">
        <template #startIcon="{ iconSize }">
          <dt-icon-phone :size="iconSize" />
        </template>
        Call
      </dt-button>
      <dt-button class="d-fl1" kind="muted" importance="outlined">
        <template #startIcon="{ iconSize }">
          <dt-icon-quick-reply :size="iconSize" />
        </template>
        Message
      </dt-button>
      <dt-button class="d-fl1" kind="muted" importance="outlined">
        <template #startIcon="{ iconSize }">
          <dt-icon-video :size="iconSize" />
        </template>
        Meet
      </dt-button>
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import { DtIconPhone, DtIconQuickReply, DtIconVideo } from '@dialpad/dialtone-icons/vue';
</script>
