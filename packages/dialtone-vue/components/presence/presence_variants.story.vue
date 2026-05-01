<template>
  <div>
    <div>
      <h2>
        Active
      </h2>
      <div>
        <h3>
          With icon
        </h3>
        <dt-presence
          presence="active"
        />
      </div>
      <div>
        <h3>
          Without icon
        </h3>
        <dt-presence
          presence="active"
          :show-icon="false"
        />
      </div>
    </div>

    <div>
      <h2>
        Away
      </h2>
      <div>
        <h3>
          With icon
        </h3>
        <dt-presence
          presence="away"
        />
      </div>
      <div>
        <h3>
          Without icon
        </h3>
        <dt-presence
          presence="away"
          :show-icon="false"
        />
      </div>
    </div>

    <div>
      <h2>
        Busy
      </h2>
      <div>
        <h3>
          With icon
        </h3>
        <dt-presence
          presence="busy"
        />
      </div>
      <div>
        <h3>
          Without icon
        </h3>
        <dt-presence
          presence="busy"
          :show-icon="false"
        />
      </div>
    </div>

    <div>
      <h2>
        Offline
      </h2>
      <div>
        <h3>
          With icon
        </h3>
        <dt-presence
          presence="offline"
        />
      </div>
      <div>
        <h3>
          Without icon
        </h3>
        <dt-presence
          presence="offline"
          :show-icon="false"
        />
      </div>
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
