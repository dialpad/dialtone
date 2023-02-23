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
      :class="{
        'd-presence__inner--active': presence === 'active',
        'd-presence__inner--away': presence === 'away',
        'd-presence__inner--busy': presence === 'busy',
        'd-presence__inner--offline': presence === 'offline',
      }"
    />
  </div>
</template>

<script>
import { PRESENCE_STATES, PRESENCE_STATES_LIST } from './presence_constants';
/**
 * Presence is a user status visual indicator element.
 * @see https://dialpad.design/components/presence.html
 */
export default {
  name: 'DtPresence',
  props: {

    /**
     * Determines the color of the inner presence circle, indicating status.
     * Accepts one of 4 values: 'busy', 'away', 'active', 'offline'
     * @values busy, away, active, offline
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
  },
};
</script>
