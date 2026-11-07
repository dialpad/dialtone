<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <dt-stack gap="100">
    <div>
      <h4>With start icon</h4>
      <dt-chip>
        <template #startIcon>
          <dt-icon
            name="lock-filled"
            size="200"
          />
        </template>
        <template #default>
          Chip
        </template>
      </dt-chip>
    </div>
    <div>
      <h4>With Avatar</h4>
      <dt-chip variant="people">
        <template #startAvatar>
          <dt-avatar
            size="200"
            full-name="Jaqueline Nackos"
            :seed="$attrs.avatarSeed"
          />
        </template>
        <template #default>
          Chip
        </template>
      </dt-chip>
    </div>
    <div>
      <h4>Interactive with remove</h4>
      <dt-chip
        interactive
        show-close
      >
        <template #default>
          Chip
        </template>
      </dt-chip>
    </div>
    <div>
      <h4>With end icon</h4>
      <dt-chip>
        <template #endIcon>
          <dt-icon
            name="chevron-down"
            size="200"
          />
        </template>
        <template #default>
          Chip
        </template>
      </dt-chip>
    </div>
    <div>
      <h4>With leading and trailing</h4>
      <dt-chip>
        <template #leading>
          <dt-badge
            kind="status"
            variant="info"
            label="New"
            :size="100"
          />
        </template>
        <template #default>
          Inbox
        </template>
        <template #trailing>
          <dt-badge
            kind="counter"
            variant="count"
            emphasis="strong"
            label="4"
            :size="100"
          />
        </template>
      </dt-chip>
    </div>
    <div>
      <h4>Emphasis</h4>
      <dt-stack
        gap="100"
        direction="row"
      >
        <dt-chip emphasis="subtle">
          Subtle
        </dt-chip>
        <dt-chip emphasis="base">
          Base
        </dt-chip>
        <dt-chip emphasis="strong">
          Strong
        </dt-chip>
        <dt-chip
          variant="people"
          emphasis="strong"
        >
          People strong
        </dt-chip>
      </dt-stack>
    </div>
    <div>
      <h4>Sizes</h4>
      <dt-stack
        gap="100"
        direction="row"
        align="center"
      >
        <dt-chip size="100">
          Chip 100
        </dt-chip>
        <dt-chip size="200">
          Chip 200
        </dt-chip>
        <dt-chip size="300">
          Chip 300 (default)
        </dt-chip>
        <dt-chip size="400">
          Chip 400
        </dt-chip>
        <dt-chip size="500">
          Chip 500
        </dt-chip>
        <dt-chip size="600">
          Chip 600
        </dt-chip>
        <dt-chip size="700">
          Chip 700
        </dt-chip>
      </dt-stack>
    </div>
  </dt-stack>
</template>

<script>
import DtChip from './Chip.vue';
import { DtBadge } from '@/components/Badge';
import { DtIcon } from '@/components/Icon';
import { DtAvatar } from '@/components/Avatar';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtChipVariants',
  components: { DtAvatar, DtBadge, DtChip, DtIcon, DtStack },
};
</script>
