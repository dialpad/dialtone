<template>
  <aside class="d-toast-wrapper">
    <dt-toast
      :title="title"
      :show="show"
      :important="important"
      :kind="kind"
      :close-button-props="{ ariaLabel: 'Close button' }"
      @close="$emit('close')"
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
  },

  emits: ['close'],
  computed: {
    linkClass () {
      if (this.kind === 'warning' && this.important) return 'd-fc-neutral-black';
      return this.important ? 'd-fc-primary-inverted' : 'd-fc-primary';
    },
  },
};
</script>
