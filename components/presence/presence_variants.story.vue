<template>
  <div>
    <div class="d-p8 d-d-flex d-ai-center">
      <h1 class="d-fs-200 d-mx4">
        Active
      </h1>
      <dt-presence
        presence="active"
      />
    </div>

    <div class="d-p8 d-d-flex d-ai-center">
      <h1 class="d-fs-200 d-mx4">
        Away
      </h1>
      <dt-presence
        presence="away"
      />
    </div>

    <div class="d-p8 d-d-flex d-ai-center">
      <h1 class="d-fs-200 d-mx4">
        Busy
      </h1>
      <dt-presence
        presence="busy"
      />
    </div>

    <div class="d-p8 d-d-flex d-ai-center">
      <h1 class="d-fs-200 d-mx4">
        Offline
      </h1>
      <dt-presence
        presence="offline"
      />
    </div>
  </div>
</template>

<script>
import DtPresence from './presence.vue';

export default {
  name: 'DtPresenceVariantsStory',
  components: { DtPresence },
};
</script>
