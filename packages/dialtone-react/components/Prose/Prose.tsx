import { useLayoutEffect, useMemo, useRef, type ComponentPropsWithRef, type Ref } from 'react';
import { cx } from '../../common/cx';
import { isDevelopment } from '../../common/dev';
import {
  PROSE_DISALLOWED_ELEMENTS,
  PROSE_ALLOWED_ATTRIBUTES,
  PROSE_SIZE_MODIFIERS,
  PROSE_DENSITY_MODIFIERS,
  _PROSE_ALLOWED_ATTRIBUTE_PREFIXES,
  _PROSE_URL_ATTRIBUTES,
  _isSafeProseUrl,
  type ProseDensity,
  type ProseSize,
} from './ProseConstants';

export interface DtProseProps extends ComponentPropsWithRef<'div'> {
  /**
   * The size of the prose typography scale.
   * @values 100, 200, 300
   */
  size?: ProseSize;

  /**
   * The density (line-height) of prose content.
   * @values 100, 200, 300
   */
  density?: ProseDensity;
}

type ModifierMap = Readonly<Record<string, string>>;

/** A modifier map's class for a value. Object keys are strings, so 300 and '300' find the same entry. */
function modifierOf (modifiers: ModifierMap, value: string | number): string | undefined {
  const key = String(value);
  return Object.hasOwn(modifiers, key) ? modifiers[key] : undefined;
}

function isCustomElement (tagName: string): boolean {
  return tagName.includes('-');
}

function isDisallowedElement (node: Element, tagName: string): boolean {
  if (!PROSE_DISALLOWED_ELEMENTS.includes(tagName)) return false;

  // Exception: <input type="checkbox"> inside <li> (task list pattern)
  return !(
    tagName === 'input' &&
    node.getAttribute('type') === 'checkbox' &&
    node.parentElement?.tagName.toLowerCase() === 'li'
  );
}

function allowedAttributesFor (tagName: string): readonly string[] {
  const allowedGlobal = PROSE_ALLOWED_ATTRIBUTES._global ?? [];
  const allowedForTag = (Object.hasOwn(PROSE_ALLOWED_ATTRIBUTES, tagName) && PROSE_ALLOWED_ATTRIBUTES[tagName]) || [];
  return [...allowedGlobal, ...allowedForTag];
}

function stripDisallowedAttributes (node: Element, tagName: string): void {
  const allowed = allowedAttributesFor(tagName);

  const attrsToRemove: string[] = [];
  for (const attr of node.attributes) {
    if (_PROSE_URL_ATTRIBUTES.includes(attr.name) && !_isSafeProseUrl(attr.value)) {
      attrsToRemove.push(attr.name);
      continue;
    }
    if (allowed.includes(attr.name)) continue;
    if (_PROSE_ALLOWED_ATTRIBUTE_PREFIXES.some(prefix => attr.name.startsWith(prefix))) continue;
    attrsToRemove.push(attr.name);
  }
  for (const attrName of attrsToRemove) {
    node.removeAttribute(attrName);
  }
}

/** Visits every element inside `root` (not `root` itself) in document order. */
function forEachDescendantElement (root: Element, visit: (node: Element, tagName: string) => void): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

  let node = walker.nextNode() as Element | null;
  while (node) {
    visit(node, node.tagName.toLowerCase());
    node = walker.nextNode() as Element | null;
  }
}

function sanitizeContent (root: Element): void {
  forEachDescendantElement(root, stripDisallowedAttributes);
}

function validateContent (root: Element): void {
  forEachDescendantElement(root, (node, tagName) => {
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
  });
}

// React 19 calls a ref callback's returned cleanup on detach instead of calling it with null, so the merged callback
// returns one: each ref gets its own cleanup if it returned one, and null otherwise, as React would do itself.
function mergeRefs<T> (...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
      return undefined;
    });
    return () => {
      refs.forEach((ref, i) => {
        const cleanup = cleanups[i];
        if (typeof cleanup === 'function') cleanup();
        else if (typeof ref === 'function') ref(null);
        else if (ref) ref.current = null;
      });
    };
  };
}

/**
 * Typography wrapper for raw HTML content. After every client commit it strips attributes prose content may not carry
 * (classes, styles, data-*, event handlers, unsafe URLs) and logs an error for form controls and custom elements.
 * This is client-side presentation cleanup: layout effects don't run on the server, so server-rendered content keeps
 * its attributes until a client commit, and callers must sanitize untrusted HTML before rendering it.
 * @see https://dialtone.dialpad.com/components/prose.html
 */
export function DtProse ({
  size = 300,
  density = 200,
  className,
  ref,
  children,
  ...rest
}: DtProseProps) {
  const proseClasses = cx(
    'd-prose',
    modifierOf(PROSE_SIZE_MODIFIERS, size),
    modifierOf(PROSE_DENSITY_MODIFIERS, density),
  );

  const rootEl = useRef<HTMLDivElement | null>(null);
  const rootRef = useMemo(() => mergeRefs<HTMLDivElement>(rootEl, ref), [ref]);

  // A fresh token per render, and the one validated last (written only in the effect): StrictMode re-runs effects
  // with the same closure, so the same token, and Vue's onMounted/onUpdated hooks only ran once per patch, so a
  // re-run of the same commit doesn't log again. A discarded render never reaches the effect.
  const renderToken = {};
  const validatedToken = useRef<object | null>(null);

  // No dependency list: like onMounted and onUpdated, this runs after every render, since the content is the
  // children, which can change without any prop changing. It's a layout effect so unsafe attributes are gone before
  // the browser paints them.
  useLayoutEffect(() => {
    const root = rootEl.current;
    if (!root) return;

    sanitizeContent(root);

    // Vue validates in development only; sanitizing above runs in every build.
    if (isDevelopment() && validatedToken.current !== renderToken) {
      validatedToken.current = renderToken;
      validateContent(root);
    }
  });

  return (
    <div
      data-qa="dt-prose"
      {...rest}
      ref={rootRef}
      className={cx(proseClasses, className)}
    >
      {children}
    </div>
  );
}
