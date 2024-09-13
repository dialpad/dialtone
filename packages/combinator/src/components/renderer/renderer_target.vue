<template>
  <div ref="wrapper" />
</template>

<script setup>
import { capitalize, computed, h, onMounted, onUpdated, ref, render, useSlots } from 'vue';
import { DtNotice } from '@dialpad/dialtone-vue';

const ERROR_MESSAGE = 'Error rendering component';

const props = defineProps({
  /**
   * Component to render.
   */
  component: {
    type: Object,
    required: true,
  },
  /**
   * Members to bind to the target component.
   */
  bindings: {
    type: undefined,
    required: true,
  },
  /**
   * Events to bind to the target component.
   */
  events: {
    type: undefined,
    required: true,
  },
});

const emit = defineEmits([
  'event',
]);

const slots = useSlots();

/**
 * Map object containing events and their respective handlers.
 *
 * @returns {ComputedRef<object>} Event map.
 */
const events = computed(() => {
  if (!props.events) { return {}; }
  return Object.fromEntries(
    props.events.map(({ name }) => {
      return [
        `on${capitalize(name)}`,
        e => emit('event', name, e),
      ];
    }),
  );
});

onMounted(renderTarget);
onUpdated(renderTarget);

const wrapper = ref();

/**
 * Destroys any old containers in the wrapper and appends a new one.
 * Not completely sure why this has to be done, but it is buggy
 * if this method is not used.
 *
 * @returns {HTMLDivElement} Instantiated container for rendering.
 */
function nextContainer () {
  wrapper.value.replaceChildren();
  return wrapper.value.appendChild(document.createElement('div'));
}

/**
 * Need to render manually to catch DOM exception errors.
 *
 * Attempts to render the target component, if there is
 * an error a warning will be logged and a 'notice' component
 * will be rendered to inform the user.
 */
function renderTarget () {
  const container = nextContainer();

  try {
    render(h(props.component, {
      ...props.bindings,
      ...events.value,
    }, slots), container);
  } catch (e) {
    console.warn('Rendering warning: \n', e);
    renderError(e, container);
  }
}

/**
 * Renders the error 'notice' component.
 *
 * @param exception - The exception.
 * @param container - The container to render in.
 */
function renderError (exception, container) {
  render(h(DtNotice, {
    kind: 'error',
    hideClose: true,
    title: ERROR_MESSAGE,
  }, {
    default: () => exception.toString(),
  }), container);
}
</script>

<script>
/**
 * The renderer is responsible for displaying the target component in its current state.
 */
export default {
  name: 'DtcRendererTarget',
};
</script>
