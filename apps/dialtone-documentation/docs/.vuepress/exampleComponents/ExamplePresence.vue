<template>
  <div class="d-recipe-leftbar-row d-recipe-leftbar-row__primary">
    <div
      class="d-presence"
    >
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
  </div>
</template>

<script>
export default {
  name: 'ExamplePresence',
  props: {
    presence: {
      type: String,
      required: true,
    },
  },
};
</script>
