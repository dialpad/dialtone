<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <div class="d-d-flex d-fd-column d-stack8">
    <div>
      <h4>With Icon</h4>
      <dt-chip :close-button-props="closeButtonProps">
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
      <dt-chip :close-button-props="closeButtonProps">
        <template #avatar>
          <dt-avatar
            full-name="Jaqueline Nackos"
            :seed="avatarSeed"
          />
        </template>
        <template #default>
          Chip
        </template>
      </dt-chip>
    </div>
    <div>
      <h4>Non interactive</h4>
      <dt-chip
        :interactive="false"
        :hide-close="true"
        :close-button-props="closeButtonProps"
      >
        <template #default>
          Chip
        </template>
      </dt-chip>
    </div>
  </div>
</template>

<script>
import DtChip from './chip.vue';
import { DtIcon } from '@/components/icon';
import DtAvatar from '@/components/avatar/avatar.vue';

export default {
  name: 'DtChipVariants',
  components: { DtAvatar, DtChip, DtIcon },
};
</script>
