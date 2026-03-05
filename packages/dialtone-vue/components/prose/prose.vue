<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div
    ref="proseRef"
    class="d-prose"
    data-qa="dt-prose"
  >
    <!-- @slot Default slot for raw HTML content -->
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import {
  PROSE_DISALLOWED_ELEMENTS,
  PROSE_ALLOWED_ATTRIBUTES,
} from './prose_constants.js';

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
    if (!allowed.includes(attr.name)) {
      attrsToRemove.push(attr.name);
    }
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

    if (!isCustomElement(tagName)) {
      stripDisallowedAttributes(node, tagName);
    }

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
