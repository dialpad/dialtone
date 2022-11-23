<template>
  <div class="d-d-flex">
    <div class="d-p8 d-d-flex d-ai-center">
      <dt-avatar
        color="purple-200"
        presence="busy"
        size="sm"
      >
        <img
          data-qa="dt-avatar-image"
          src="./person.png"
          alt="Person Avatar"
        >
      </dt-avatar>
    </div>

    <div class="d-p8 d-d-flex d-ai-center">
      <dt-avatar
        color="purple-200"
        presence="busy"
      >
        <img
          data-qa="dt-avatar-image"
          src="./person.png"
          alt="Person Avatar"
        >
      </dt-avatar>
    </div>

    <div class="d-p8 d-d-flex d-ai-center">
      <dt-avatar
        color="purple-200"
        presence="busy"
        size="lg"
      >
        <img
          data-qa="dt-avatar-image"
          src="./person.png"
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
