<template>
  <dt-stack gap="200">
    <dt-stack gap="100" justify="between">
      <dt-stack>
        <dt-text as="h2" kind="headline" :size="500" strength="medium" density="200" class="d-fs-400">
          Katie Rodriguez
        </dt-text>
        <dt-stack direction="row" gap="75">
          <dt-text tone="success">
            Available
          </dt-text>
          <dt-text>&bull;</dt-text>
          <dt-text tone="tertiary">
            Working from coffee shop
          </dt-text>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="25">
        <dt-text kind="body" :size="300" density="200" strength="semibold" tone="tertiary">
          Chief Customer Success Officer
        </dt-text>
        <dt-text kind="body" :size="200" density="200">
          <dt-text strength="medium">
            6:19 am
          </dt-text> local time
        </dt-text>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="100" direction="row" justify="between">
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
