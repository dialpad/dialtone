<template>
  <div>
    <div>
      <h2>
        Active
      </h2>
      <dt-presence
        presence="active"
      />
    </div>

    <div>
      <h2>
        Away
      </h2>
      <dt-presence
        presence="away"
      />
    </div>

    <div>
      <h2>
        Busy
      </h2>
      <dt-presence
        presence="busy"
      />
    </div>

    <div>
      <h2>
        Offline
      </h2>
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
