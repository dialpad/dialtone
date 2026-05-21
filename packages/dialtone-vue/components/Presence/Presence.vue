<template>
  <div
    class="d-presence"
    data-qa="dt-presence"
    role="status"
    :aria-live="$attrs.ariaLive || 'off'"
  >
    <span
      v-if="srText"
      data-qa="dt-presence-sr-text"
      class="sr-only"
    >{{ srText }} </span>
    <div
      class="d-presence__inner"
      data-qa="dt-presence-inner"
      :class="{
        'd-presence__inner--active': presence === 'active',
        'd-presence__inner--away': presence === 'away',
        'd-presence__inner--busy': presence === 'busy',
        'd-presence__inner--offline': presence === 'offline',
        'd-presence__inner--dnd': presence === 'dnd',
      }"
    >
      <template v-if="showIcon && presence !== 'offline'">
        <dt-presence-active-icon v-if="presence === 'active'" />
        <dt-presence-away-icon v-else-if="presence === 'away'" />
        <dt-presence-busy-icon v-else-if="presence === 'busy'" />
        <dt-presence-dnd-icon v-else-if="presence === 'dnd'" />
      </template>
    </div>
  </div>
</template>

<script>
import { PRESENCE_STATES, PRESENCE_STATES_LIST } from './PresenceConstants';
import DtPresenceActiveIcon from './modules/presence_active_icon.vue';
import DtPresenceAwayIcon from './modules/presence_away_icon.vue';
import DtPresenceBusyIcon from './modules/presence_busy_icon.vue';
import DtPresenceDndIcon from './modules/presence_dnd_icon.vue';

/**
 * Presence is a user status visual indicator element.
 * @see https://dialtone.dialpad.com/components/presence.html
 */
export default {
  name: 'DtPresence',
  components: {
    DtPresenceActiveIcon,
    DtPresenceAwayIcon,
    DtPresenceBusyIcon,
    DtPresenceDndIcon,
  },

  props: {

    /**
     * Determines the color of the inner presence circle, indicating status.
     * Accepts one of 5 values: 'busy', 'away', 'active', 'offline', 'dnd'
     * @values busy, away, active, offline, dnd
     */
    presence: {
      type: String,
      default: PRESENCE_STATES.ACTIVE,
      validator: (role) => {
        return PRESENCE_STATES_LIST.includes(role);
      },
    },

    /**
     * Since Presence is a visual element, we need SRs to read out any state changes
     * that occur.
     * Text entered here will be read by assistive technology. If null this component will be ignored by AT.
     */
    srText: {
      type: String,
      default: null,
    },

    /**
     * Renders a state-specific glyph inside the colored circle to reinforce meaning beyond color.
     * Active shows a checkmark; busy and dnd show a minus dash. The `away` and `offline` states do not render a glyph.
     */
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
