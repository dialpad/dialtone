<template>
  <aside :class="['d-toast-wrapper', { 'd-ps-fixed': fixed }]">
    <dt-toast
      :title="title"
      :show="show"
      :important="important"
      :duration="duration"
      :kind="kind"
      @close="$emit('close')"
      @update:show="$emit('update:show', $event)"
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
    </dt-toast>
  </aside>
</template>

<script>
export default {
  name: 'ExampleToast',
  props: {
    title: {
      type: String,
      default: '',
    },

    show: {
      type: Boolean,
      default: false,
    },

    important: {
      type: Boolean,
      default: false,
    },

    kind: {
      type: String,
      default: 'base',
    },

    duration: {
      type: Number,
      default: null,
    },

    fixed: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['close', 'update:show'],
  computed: {
    linkClass () {
      if (this.kind === 'warning' && this.important) return 'd-fc-neutral-black';
      return this.important ? 'd-fc-primary-inverted' : 'd-fc-primary';
    },
  },
};
</script>
