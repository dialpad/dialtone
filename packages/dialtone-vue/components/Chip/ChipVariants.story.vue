<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <dt-stack gap="100">
    <div>
      <h4>With Icon</h4>
      <dt-chip>
        <template #icon>
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
      <dt-chip>
        <template #avatar>
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
      <h4>Interactive</h4>
      <dt-chip
        :interactive="true"
        :show-close="false"
      >
        <template #default>
          Chip
        </template>
      </dt-chip>
    </div>
    <div>
      <h4>Sizes</h4>
      <dt-stack
        gap="100"
        direction="row"
      >
        <dt-chip
          size="100"
          :interactive="true"
          :show-close="false"
        >
          <template #default>
            Chip 100
          </template>
        </dt-chip>
        <dt-chip
          size="200"
          :interactive="true"
          :show-close="false"
        >
          <template #default>
            Chip 200
          </template>
        </dt-chip>
        <dt-chip
          size="300"
          :interactive="true"
          :show-close="false"
        >
          <template #default>
            Chip 300 (default)
          </template>
        </dt-chip>
      </dt-stack>
    </div>
  </dt-stack>
</template>

<script>
import DtChip from './Chip.vue';
import { DtIcon } from '@/components/Icon';
import { DtAvatar } from '@/components/Avatar';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtChipVariants',
  components: { DtAvatar, DtChip, DtIcon, DtStack },
};
</script>
