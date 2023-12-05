<template>
  <div class="d-stack16">
    <div>
      <h2>Image</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in avatarSizes"
          :key="`image-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Avatar Image"
          :image-src="$attrs.imageSrc"
        />
      </div>
    </div>
    <div>
      <h2>Initials</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in avatarSizes"
          :key="`initials-${size}`"
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
          :key="`icon-${size}`"
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
        <dt-avatar
          v-for="state in AVATAR_PRESENCE_STATES"
          :key="`presence-${state}`"
          :seed="$attrs.seed"
          size="md"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          :presence="state"
        />
      </div>
    </div>
    <div>
      <h2>Overlay</h2>
      <div class="d-flow16 d-d-flex">
        <dt-avatar
          :seed="$attrs.seed"
          size="xl"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          overlay-icon="hear"
        />
        <dt-avatar
          :seed="$attrs.seed"
          size="xl"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          overlay-text="+3"
        />
      </div>
    </div>
    <div>
      <h2>Clickable</h2>
      <div class="d-flow16 d-d-flex">
        <dt-avatar
          :seed="$attrs.seed"
          full-name="Person avatar"
          clickable
        />
        <dt-avatar
          :seed="$attrs.seed"
          icon-name="user"
          aria-label="user icon avatar"
          clickable
        />
        <dt-avatar
          :seed="$attrs.seed"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          clickable
        />
      </div>
    </div>
    <div>
      <h2>Group</h2>
      <div class="d-flow16 d-d-flex">
        <dt-avatar
          :seed="$attrs.seed"
          full-name="Person avatar"
          :group="3"
        />
        <dt-avatar
          :seed="$attrs.seed"
          icon-name="user"
          :group="10"
        />
        <dt-avatar
          :seed="$attrs.seed"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          :group="100"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DtAvatar from './avatar.vue';
import { AVATAR_PRESENCE_STATES, AVATAR_SIZE_MODIFIERS } from './avatar_constants.js';

export default {
  name: 'DtAvatarVariants',
  components: { DtAvatar },
  data () {
    return {
      avatarSizes: Object.keys(AVATAR_SIZE_MODIFIERS),
    };
  },

  computed: {
    AVATAR_PRESENCE_STATES () {
      return AVATAR_PRESENCE_STATES;
    },
  },
};
</script>
