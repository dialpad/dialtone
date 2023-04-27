<template>
  <div class="d-d-flex">
    <div class="d-p8 d-d-flex d-ai-center">
      <dt-avatar
        presence="busy"
        seed="seed"
        size="sm"
      >
        <img
          data-qa="dt-avatar-image"
          src="@/common/assets/person.png"
          alt="Person Avatar"
        >
      </dt-avatar>
    </div>

    <div class="d-p8 d-d-flex d-ai-center">
      <dt-avatar
        presence="busy"
        seed="seed"
      >
        <img
          data-qa="dt-avatar-image"
          src="@/common/assets/person.png"
          alt="Person Avatar"
        >
      </dt-avatar>
    </div>

    <div class="d-p8 d-d-flex d-ai-center">
      <dt-avatar
        presence="busy"
        seed="seed"
        size="lg"
      >
        <img
          data-qa="dt-avatar-image"
          src="@/common/assets/person.png"
          alt="Person Avatar"
        >
      </dt-avatar>
    </div>
  </div>
</template>

<script>
import DtAvatar from './avatar';

export default {
  name: 'DtAvatarWithPresence',
  components: { DtAvatar },
};
</script>
