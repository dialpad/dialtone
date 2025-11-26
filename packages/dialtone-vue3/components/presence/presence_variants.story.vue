<template>
  <div>
    <dt-stack
      direction="row"
      align="center"
      class="d-p8"
      data-migrate-outline
    >
      <h1 class="d-fs-200 d-mx4">
        Active
      </h1>
      <dt-presence
        presence="active"
      />
    </dt-stack>

    <dt-stack
      direction="row"
      align="center"
      class="d-p8"
      data-migrate-outline
    >
      <h1 class="d-fs-200 d-mx4">
        Away
      </h1>
      <dt-presence
        presence="away"
      />
    </dt-stack>

    <dt-stack
      direction="row"
      align="center"
      class="d-p8"
      data-migrate-outline
    >
      <h1 class="d-fs-200 d-mx4">
        Busy
      </h1>
      <dt-presence
        presence="busy"
      />
    </dt-stack>

    <dt-stack
      direction="row"
      align="center"
      class="d-p8"
      data-migrate-outline
    >
      <h1 class="d-fs-200 d-mx4">
        Offline
      </h1>
      <dt-presence
        presence="offline"
      />
    </dt-stack>
  </div>
</template>

<script>
import DtPresence from './presence.vue';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtPresenceVariantsStory',
  components: { DtPresence, DtStack },
};
</script>
