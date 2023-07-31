<template>
  <div class="d-stack16">
    <div>
      <h2>Image</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in avatarSizes"
          :key="`default-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Avatar Image"
          image-src="/common/assets/person.png"
        />
      </div>
    </div>
    <div>
      <h2>Initials</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in avatarSizes"
          :key="`default-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Avatar Icon"
        />
      </div>
    </div>
    <div>
      <h2>Icon</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in avatarSizes"
          :key="`default-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Avatar Icon"
          icon-name="user"
        />
      </div>
    </div>
    <div>
      <h2>Presence</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <div
          v-for="size in avatarSizes"
          :key="`default-${size}`"
          class="d-d-inline-flex"
        >
          <dt-avatar
            :seed="$attrs.seed"
            :size="size"
            full-name="Person avatar"
            presence="busy"
            image-src="/common/assets/person.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DtAvatar from './avatar.vue';
import { AVATAR_SIZE_MODIFIERS } from './avatar_constants.js';

export default {
  name: 'DtAvatarVariants',
  components: { DtAvatar },
  data () {
    return {
      avatarSizes: Object.keys(AVATAR_SIZE_MODIFIERS),
    };
  },
};
</script>
