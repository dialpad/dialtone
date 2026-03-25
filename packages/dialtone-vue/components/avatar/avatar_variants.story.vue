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
          :image-alt="$attrs.imageAlt"
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
        >
          <template #icon>
            <dt-icon-user />
          </template>
        </dt-avatar>
      </div>
    </div>
    <div>
      <h2>Icon Only (Transparent Background)</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          icon-only
          size="300"
        >
          <template #icon>
            <dt-icon-hash />
          </template>
        </dt-avatar>
        <dt-avatar
          icon-only
          size="300"
        >
          <template #icon>
            <dt-icon-hash-bold />
          </template>
        </dt-avatar>
        <dt-avatar
          icon-only
          size="300"
        >
          <template #icon>
            <dt-icon-lock />
          </template>
        </dt-avatar>
        <dt-avatar
          icon-only
          size="300"
        >
          <template #icon>
            <dt-icon-lock-filled />
          </template>
        </dt-avatar>
        <dt-avatar
          icon-only
          size="300"
        >
          <template #icon>
            <dt-icon-inbox />
          </template>
        </dt-avatar>
        <dt-avatar
          icon-only
          size="300"
        >
          <template #icon>
            <dt-icon-contacts />
          </template>
        </dt-avatar>
      </div>
    </div>
    <div>
      <h2>Deactivated</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          :seed="$attrs.seed"
          size="300"
          full-name="Deactivated User"
          :image-src="$attrs.imageSrc"
          :image-alt="$attrs.imageAlt"
          deactivated
        />
        <dt-avatar
          :seed="$attrs.seed"
          size="300"
          full-name="Deactivated User"
          deactivated
        />
        <dt-avatar
          :seed="$attrs.seed"
          size="300"
          deactivated
        >
          <template #icon>
            <dt-icon-user />
          </template>
        </dt-avatar>
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
          :image-alt="$attrs.imageAlt"
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
          :image-alt="$attrs.imageAlt"
          overlay-icon="hear"
        >
          <template #overlayIcon>
            <dt-icon-hear />
          </template>
        </dt-avatar>
        <dt-avatar
          :seed="$attrs.seed"
          size="xl"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          :image-alt="$attrs.imageAlt"
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
          icon-aria-label="user icon"
          clickable
        >
          <template #icon>
            <dt-icon-user />
          </template>
        </dt-avatar>
        <dt-avatar
          :seed="$attrs.seed"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          :image-alt="$attrs.imageAlt"
          clickable
        />
      </div>
    </div>
    <div>
      <h2>Group (Single Digit)</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in groupSizes"
          :key="`group-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          :image-alt="$attrs.imageAlt"
          :group="3"
        />
      </div>
      <div class="d-flow16 d-d-flex d-ai-center d-mbs-100">
        <dt-avatar
          v-for="size in groupSizes"
          :key="`group-initials-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Person avatar"
          :group="5"
        />
      </div>
    </div>
    <div>
      <h2>Group (Double Digit)</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in groupSizes"
          :key="`group-double-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          :image-alt="$attrs.imageAlt"
          :group="12"
        />
      </div>
      <div class="d-flow16 d-d-flex d-ai-center d-mbs-100">
        <dt-avatar
          v-for="size in groupSizes"
          :key="`group-double-initials-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Person avatar"
          :group="12"
        />
      </div>
    </div>
    <div>
      <h2>Group (Triple Digit)</h2>
      <div class="d-flow16 d-d-flex d-ai-center">
        <dt-avatar
          v-for="size in groupSizes"
          :key="`group-triple-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Person avatar"
          :image-src="$attrs.imageSrc"
          :image-alt="$attrs.imageAlt"
          :group="120"
        />
      </div>
      <div class="d-flow16 d-d-flex d-ai-center d-mbs-100">
        <dt-avatar
          v-for="size in groupSizes"
          :key="`group-triple-initials-${size}`"
          :seed="$attrs.seed"
          :size="size"
          full-name="Person avatar"
          :group="120"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  DtIconUser,
  DtIconHear,
  DtIconHash,
  DtIconHashBold,
  DtIconLock,
  DtIconLockFilled,
  DtIconInbox,
  DtIconContacts,
} from '@dialpad/dialtone-icons/vue';
import DtAvatar from './avatar.vue';
import { AVATAR_PRESENCE_STATES, AVATAR_SIZE_MODIFIERS } from './avatar_constants.js';

export default {
  name: 'DtAvatarVariants',
  components: {
    DtAvatar,
    DtIconUser,
    DtIconHear,
    DtIconHash,
    DtIconHashBold,
    DtIconLock,
    DtIconLockFilled,
    DtIconInbox,
    DtIconContacts,
  },

  data () {
    return {
      avatarSizes: Object.keys(AVATAR_SIZE_MODIFIERS),
      groupSizes: ['100', '150', '200', '250', '300', '400', '500'],
    };
  },

  computed: {
    AVATAR_PRESENCE_STATES () {
      return AVATAR_PRESENCE_STATES;
    },
  },
};
</script>
