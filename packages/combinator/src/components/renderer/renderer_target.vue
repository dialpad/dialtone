<template>
  <div
    ref="wrapper"
  />
</template>

<script setup>
import {
  capitalize,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  render,
  useSlots,
} from 'vue';
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
  previewIdentity: {
    type: Function,
    default: undefined,
  },
  beforePreviewRemount: {
    type: Function,
    default: undefined,
  },
  resetGeneration: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  'event',
]);

const slots = useSlots();

// Standalone render() creates an app-less context; attaching appContext here
// lets the target component and all its children (including DtcNode slots)
// resolve globally registered components, directives, and provides.
const { appContext } = getCurrentInstance();

let currentContainer = null;
let currentVNode = null;
let currentBeforeRemount;
let pendingRemount = null;
let disposed = false;
const referenceKeys = new WeakMap();
let nextReferenceKey = 0;

function identityKey (value) {
  if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
    if (!referenceKeys.has(value)) referenceKeys.set(value, ++nextReferenceKey);
    return ['reference', referenceKeys.get(value)];
  }
  return [typeof value, value];
}

onMounted(() => {
  currentContainer = freshContainer();
  renderTarget();
  nextTick(renderTarget);
});
onUpdated(renderTarget);

// Tear down the manually-rendered subtree on unmount so the target component's
// own teardown (effects, observers, listeners) runs instead of leaking. The
// render() tree lives in a detached container, so Vue removing our wrapper does
// not unmount it; only render(null, ...) does. The spec sheet mounts one target
// per cell and toggles via v-if, so without this each view switch orphans N
// still-reactive component trees.
onBeforeUnmount(() => {
  disposed = true;
  pendingRemount?.abort();
  pendingRemount = null;
  currentVNode = null;
  if (currentContainer) {
    render(null, currentContainer);
    currentContainer = null;
  }
});

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
function renderTarget (completedVNode) {
  if (disposed || !wrapper.value || pendingRemount) return;
  if (!currentContainer) {
    currentContainer = freshContainer();
  }

  const filteredBindings = Object.fromEntries(
    Object.entries(props.bindings).filter(([name]) => !props.disabledMembers.has(name)),
  );

  const slotKey = Object.keys(slots).sort().join(',');

  try {
    const beforeRemount = props.beforePreviewRemount;
    const handlers = Object.fromEntries((props.events ?? []).map(({ name }) => [
      `on${capitalize(name)}`,
      e => {
        if (!beforeRemount || (!disposed && !pendingRemount && currentVNode === vnode)) emit('event', name, e);
      },
    ]));
    const vnode = h(props.component, {
      ...filteredBindings,
      ...handlers,
      key: props.previewIdentity
        ? JSON.stringify([slotKey, props.resetGeneration, ...props.previewIdentity(filteredBindings).map(identityKey)])
        : slotKey,
    }, { ...slots });
    vnode.appContext = appContext;

    if (currentVNode && currentVNode !== completedVNode && currentBeforeRemount &&
      (currentVNode.key !== vnode.key || currentVNode.type !== vnode.type)) {
      const outgoingVNode = currentVNode;
      const controller = new AbortController();
      pendingRemount = controller;
      const completion = currentBeforeRemount(currentVNode.component.proxy, { signal: controller.signal });
      if (completion) {
        completion.then(() => {
          if (disposed || pendingRemount !== controller) return;
          pendingRemount = null;
          // Read current props after cleanup so repeated requests coalesce to the latest one.
          renderTarget(outgoingVNode);
        });
        return;
      }
      pendingRemount = null;
    }

    currentVNode = vnode;
    currentBeforeRemount = beforeRemount;
    render(vnode, currentContainer);
  } catch (e) {
    console.warn('Rendering warning: \n', e);
    currentVNode = null;
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
