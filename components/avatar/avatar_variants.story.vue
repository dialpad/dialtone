<template>
  <div class="d-stack16">
    <div>
      <h2>Image</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in avatarSizes"
          :key="`image-${size}`"
          :seed="seed"
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
          :key="`initials-${size}`"
          :seed="seed"
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
          :seed="seed"
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
          v-for="size in avatarSizes"
          :key="`presence-${size}`"
          :seed="seed"
          :size="size"
          full-name="Person avatar"
          presence="busy"
          image-src="/common/assets/person.png"
        />
      </div>
    </div>
    <div>
      <h2>Overlay</h2>
      <div class="d-flow16 d-d-flex">
        <dt-avatar
          :seed="seed"
          size="xl"
          full-name="Person avatar"
          image-src="/common/assets/person.png"
          overlay-icon="hear"
        />
        <dt-avatar
          :seed="seed"
          size="xl"
          full-name="Person avatar"
          image-src="/common/assets/person.png"
          overlay-text="+3"
        />
      </div>
    </div>
    <div>
      <h2>Clickable</h2>
      <div class="d-flow16 d-d-flex">
        <dt-avatar
          :seed="seed"
          full-name="Person avatar"
          image-src="/common/assets/person.png"
          clickable
          @click="onClick"
        />
        <dt-avatar
          :seed="seed"
          full-name="Person avatar"
          clickable
          @click="onClick"
        />
        <dt-avatar
          :seed="seed"
          icon-name="user"
          aria-label="user icon avatar"
          clickable
          @click="onClick"
        />
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
