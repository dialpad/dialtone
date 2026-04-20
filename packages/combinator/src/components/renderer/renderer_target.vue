<template>
  <div
    ref="wrapper"
  />
</template>

<script setup>
import { capitalize, computed, h, nextTick, onMounted, onUpdated, ref, render, useSlots } from 'vue';
import { DtNotice } from '@dialpad/dialtone-vue';

const ERROR_MESSAGE = 'Invalid combination';

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

  /**
   * Set of member names that are currently disabled.
   */
  disabledMembers: {
    type: Set,
    default: () => new Set(),
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

let currentContainer = null;

onMounted(() => {
  currentContainer = freshContainer();
  renderTarget();
  nextTick(renderTarget);
});
onUpdated(renderTarget);

const wrapper = ref();

/**
 * Properly unmounts any existing component, clears the wrapper,
 * and creates a fresh container element for rendering.
 *
 * @returns {HTMLDivElement} Instantiated container for rendering.
 */
function freshContainer () {
  if (wrapper.value.firstChild) {
    render(null, wrapper.value.firstChild);
  }
  wrapper.value.replaceChildren();
  const container = document.createElement('div');
  container.className = 'dialtone-playground__component-content';
  return wrapper.value.appendChild(container);
}

/**
 * Need to render manually to catch DOM exception errors.
 *
 * Renders the target component into the current container.
 * Reuses the existing container so Vue patches the component
 * instance (preserving DOM and Floating UI state) rather than
 * unmounting and remounting on every prop change.
 */
function renderTarget () {
  if (!currentContainer) {
    currentContainer = freshContainer();
  }

  const filteredBindings = Object.fromEntries(
    Object.entries(props.bindings).filter(([name]) => !props.disabledMembers.has(name)),
  );

  const slotKey = Object.keys(slots).sort().join(',');

  try {
    render(h(props.component, {
      ...filteredBindings,
      ...events.value,
      key: slotKey,
    }, slots), currentContainer);
  } catch (e) {
    console.warn('Rendering warning: \n', e);
    currentContainer = freshContainer();
    renderError(e, currentContainer);
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
    kind: 'critical',
    showClose: false,
    headerText: ERROR_MESSAGE,
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
