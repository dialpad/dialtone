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
    >
      <svg
        v-if="presence === 'active'"
        class="d-presence__icon"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.84043 3.46678C7.99696 3.23929 8.30825 3.18135 8.53575 3.33788C8.76322 3.49441 8.8202 3.8057 8.66368 4.03319L5.56797 8.53319C5.47468 8.66878 5.32045 8.74999 5.15586 8.74999C4.99133 8.74994 4.83702 8.66874 4.74376 8.53319L3.33653 6.48827C3.18001 6.26078 3.23795 5.94948 3.46543 5.79295C3.69291 5.63644 4.00421 5.69344 4.16075 5.92088L5.15586 7.36717L7.84043 3.46678Z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-if="presence === 'away'"
        class="d-presence__icon"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.24414 5.5C8.52028 5.5 8.74414 5.72386 8.74414 6C8.74414 6.27614 8.52028 6.5 8.24414 6.5H3.74414C3.468 6.5 3.24414 6.27614 3.24414 6C3.24414 5.72386 3.468 5.5 3.74414 5.5H8.24414Z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-if="presence === 'busy'"
        class="d-presence__icon"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.90426 3.39639C8.09948 3.20116 8.41602 3.20125 8.61129 3.39639C8.80655 3.59165 8.80655 3.90815 8.61129 4.10342L6.71188 6.00185L8.61129 7.90127C8.80625 8.09655 8.80645 8.41314 8.61129 8.6083C8.41613 8.80346 8.09955 8.80326 7.90426 8.6083L6.00485 6.70889L4.10738 8.6083C3.91224 8.80344 3.59564 8.8032 3.40035 8.6083C3.20509 8.41304 3.20509 8.09653 3.40035 7.90127L5.29781 6.00185L3.39938 4.10342C3.20411 3.90815 3.20411 3.59165 3.39938 3.39639C3.59464 3.20112 3.91115 3.20112 4.10641 3.39639L6.00485 5.29482L7.90426 3.39639Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { PRESENCE_STATES, PRESENCE_STATES_LIST } from './presence_constants';
/**
 * Presence is a user status visual indicator element.
 * @see https://dialtone.dialpad.com/components/presence.html
 */
export default {
  compatConfig: { MODE: 3 },
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
