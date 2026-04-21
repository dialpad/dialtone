<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    ref="proseRef"
    :class="proseClasses"
    data-qa="dt-prose"
  >
    <!-- @slot Default slot for raw HTML content -->
    <slot />
  </div>
</template>

<script setup>
defineOptions({ name: 'DtProse' });

import { computed, ref, onMounted, onUpdated } from 'vue';
import {
  PROSE_DISALLOWED_ELEMENTS,
  PROSE_ALLOWED_ATTRIBUTES,
  PROSE_ALLOWED_ATTRIBUTE_PREFIXES,
  PROSE_URL_ATTRIBUTES,
  PROSE_SIZE_MODIFIERS,
  PROSE_DENSITY_MODIFIERS,
  isSafeProseUrl,
} from './prose_constants.js';

const props = defineProps({
  /**
   * The size of the prose typography scale.
   * @values 100, 200, 300
   */
  size: {
    type: [String, Number],
    default: 300,
    validator: (s) => Object.keys(PROSE_SIZE_MODIFIERS).includes(String(s)),
  },

  /**
   * The density (line-height) of prose content.
   * @values 100, 200, 300
   */
  density: {
    type: [String, Number],
    default: 200,
    validator: (s) => Object.keys(PROSE_DENSITY_MODIFIERS).includes(String(s)),
  },
});

const proseClasses = computed(() => [
  'd-prose',
  PROSE_SIZE_MODIFIERS[String(props.size)],
  PROSE_DENSITY_MODIFIERS[String(props.density)],
].filter(Boolean));

const proseRef = ref(null);

function isCustomElement (tagName) {
  return tagName.includes('-');
}

function isDisallowedElement (node, tagName) {
  if (!PROSE_DISALLOWED_ELEMENTS.includes(tagName)) return false;

  // Exception: <input type="checkbox"> inside <li> (task list pattern)
  return !(
    tagName === 'input' &&
    node.getAttribute('type') === 'checkbox' &&
    node.parentElement?.tagName.toLowerCase() === 'li'
  );
}

function stripDisallowedAttributes (node, tagName) {
  const allowedGlobal = PROSE_ALLOWED_ATTRIBUTES._global || [];
  const allowedForTag = PROSE_ALLOWED_ATTRIBUTES[tagName] || [];
  const allowed = [...allowedGlobal, ...allowedForTag];

  const attrsToRemove = [];
  for (const attr of node.attributes) {
    if (PROSE_URL_ATTRIBUTES.includes(attr.name) && !isSafeProseUrl(attr.value)) {
      attrsToRemove.push(attr.name);
      continue;
    }
    if (allowed.includes(attr.name)) continue;
    if (PROSE_ALLOWED_ATTRIBUTE_PREFIXES.some(prefix => attr.name.startsWith(prefix))) continue;
    attrsToRemove.push(attr.name);
  }
  for (const attrName of attrsToRemove) {
    node.removeAttribute(attrName);
  }
}

function sanitizeContent () {
  if (!proseRef.value) return;

  const walker = document.createTreeWalker(
    proseRef.value,
    NodeFilter.SHOW_ELEMENT,
  );

  let node = walker.nextNode();
  while (node) {
    const tagName = node.tagName.toLowerCase();
    stripDisallowedAttributes(node, tagName);

    node = walker.nextNode();
  }
}

function validateContent () {
  if (!proseRef.value) return;

  const walker = document.createTreeWalker(
    proseRef.value,
    NodeFilter.SHOW_ELEMENT,
  );

  let node = walker.nextNode();
  while (node) {
    const tagName = node.tagName.toLowerCase();

    if (isCustomElement(tagName)) {
      console.error(
        `DtProse: Custom element <${tagName}> is not allowed inside prose content. ` +
        'Only plain HTML elements are permitted.',
      );
    } else if (isDisallowedElement(node, tagName)) {
      console.error(
        `DtProse: <${tagName}> is not allowed inside prose content. ` +
        'Form elements and interactive controls should not be used in prose blocks.',
      );
    }

    node = walker.nextNode();
  }
}

onMounted(sanitizeContent);
onUpdated(sanitizeContent);

if (process.env.NODE_ENV !== 'production') {
  onMounted(validateContent);
  onUpdated(validateContent);
}
</script>
