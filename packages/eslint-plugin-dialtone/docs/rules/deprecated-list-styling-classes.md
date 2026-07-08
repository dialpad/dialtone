# deprecated-list-styling-classes

Flags `d-ls-*` and `d-lst-*` list styling utility classes and recommends [`<dt-text-list>`](https://dialtone.dialpad.com/components/text-list.html) with [`<dt-text-list-item>`](https://dialtone.dialpad.com/components/text-list.html#text-list-item).

## Rule Details

`d-ls-reset`, `d-ls-none`, and `d-lst-*` require authors to split list behavior across container classes, per-item marker classes, indentation utilities, and sometimes inline marker content. `DtTextList` keeps the native list structure while moving list type, marker, icon marker, marker tone, and spacing into component props.

### Examples of incorrect code

```vue
<ul class="d-ls-reset">
  <li class="d-lst-disc">One</li>
  <li class="d-lst-disc">Two</li>
</ul>

<ol>
  <li class="d-lst-decimal">First</li>
  <li class="d-lst-decimal">Second</li>
</ol>

<ul>
  <li class="d-pis-100 d-lst-content" style="--ls-content: '+'">Included</li>
</ul>

<li :class="{ 'd-lst-disc': isBulleted }">One</li>
```

### Examples of correct code

```vue
<dt-text-list>
  <dt-text-list-item>One</dt-text-list-item>
  <dt-text-list-item>Two</dt-text-list-item>
</dt-text-list>

<dt-text-list type="ordered">
  <dt-text-list-item>First</dt-text-list-item>
  <dt-text-list-item>Second</dt-text-list-item>
</dt-text-list>

<dt-text-list icon="plus">
  <dt-text-list-item>Included</dt-text-list-item>
</dt-text-list>
```

## Dynamic Bindings

The rule flags deprecated list utility string literals inside `:class` bindings. These require manual migration because the surrounding condition usually needs to move to `type`, `marker`, `icon`, or `gap` props.

```vue
<!-- Before -->
<li :class="{ 'd-lst-disc': isBulleted, 'd-lst-decimal': isNumbered }">One</li>

<!-- After -->
<dt-text-list :type="isNumbered ? 'ordered' : 'unordered'">
  <dt-text-list-item>One</dt-text-list-item>
</dt-text-list>
```

## When Not To Use

This rule only walks Vue template bodies. It does not flag raw HTML, generated markdown, or framework boundaries where Dialtone Vue components are unavailable.

If a specific occurrence cannot be migrated yet, disable the rule on that line:

```vue
<!-- eslint-disable-next-line dialtone/deprecated-list-styling-classes -- legacy non-Dialtone list -->
<ul class="d-ls-reset">
```
