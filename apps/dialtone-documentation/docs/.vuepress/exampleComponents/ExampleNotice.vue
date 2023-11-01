<template>
  <dt-notice
    :important="important"
    :kind="kind"
    :title="title"
  >
    Message body with
    <dt-link
      :class="linkClass"
    >
      a link
    </dt-link>
    <template #action>
      <dt-button
        size="sm"
        importance="outlined"
        :kind="important ? 'inverted' : 'muted'"
        :class="{ 'd-bc-neutral-black': important && kind === 'warning' }"
      >
        Action
      </dt-button>
    </template>
  </dt-notice>
</template>

<script>
export default {
  name: 'ExampleNotice',
  props: {
    important: {
      type: Boolean,
      default: false,
    },

    kind: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: '',
    },
  },

  computed: {
    linkClass () {
      if (this.kind === 'warning' && this.important) return 'd-fc-neutral-black';
      return this.important ? 'd-fc-primary-inverted' : 'd-fc-primary';
    },
  },
};
</script>
