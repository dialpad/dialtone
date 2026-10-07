# deprecated-class-props

Detects usage of removed structural class props (`rootClass`, `wrapperClass`, `containerClass`) on Dialtone Vue components and offers an autofix to the native `class` attribute.

## Background

In DLT-3100, several Dialtone components removed escape-hatch props that existed to work around Vue 2 class-forwarding limitations. With Vue 3's `inheritAttrs` support, applying `class` directly on a component is the correct approach. These props are gone; using them has no effect.

| Removed prop | Components |
| --- | --- |
| `rootClass` / `root-class` | `DtInput`, `DtCheckbox`, `DtRadio`, `DtSelectMenu`, `DtBreadcrumbItem`, `DtSplitButton`, `DtAvatar`, `DtFilterPill`, `DtModeIsland`, `DtMotionText` |
| `wrapperClass` / `wrapper-class` | `DtToggle`, `DtFeedItemPill` |
| `containerClass` / `container-class` | `DtCard` |

For the full migration reference see the [component props migration guide](https://dialtone.dialpad.com/guides/migration/component-props/).

## Rule Details

The rule fires on any `<dt-*>` or `<Dt*>` template tag where one of the removed props appears and the component does not currently declare that prop. It reads the consumer's installed component metadata at lint time, so changes in that metadata are reflected without a plugin update.

Components that legitimately declare `wrapperClass` (e.g., `DtListItem`) are **not** flagged.

### Component metadata resolution

Starting from the linted file's directory, the rule looks upward for a `package.json` that declares a supported Dialtone package. It stops at the repository's `.git` boundary. Source-directory stub manifests do not hide a parent declaration. For virtual input without an absolute physical filename, the search starts at ESLint's working directory.

Declarations in `dependencies`, `devDependencies`, and `peerDependencies` count. Within the consumer's manifest:

1. Declared `@dialpad/dialtone` supplies `@dialpad/dialtone/vue3/component-documentation.json`.
2. Otherwise, declared `@dialpad/dialtone-vue` supplies `@dialpad/dialtone-vue/component-documentation.json` for standalone/legacy consumers.

The umbrella takes precedence when both packages are declared. Undeclared or transitive packages, including the plugin's optional standalone peer, do not supply metadata. Packages are resolved through local `node_modules` directories and their exports maps; `NODE_PATH` is ignored.

If the selected package or its metadata is missing, unreadable, or not a JSON array, the rule emits one console warning per consumer and skips its checks. It does not substitute another package/version. Unknown components and records without valid prop arrays are also skipped. A valid empty metadata array produces no findings.

Metadata is cached separately for each consumer root for the lifetime of the ESLint process. Restart ESLint after changing dependency declarations or installed metadata.

### Upgrading consumers

Umbrella consumers no longer need `@dialpad/dialtone-vue` installed solely to provide metadata for this rule. Keep it if another application or tool dependency still needs the standalone package.

Consumers that previously relied on a transitive or hoisted, undeclared Dialtone package must declare the intended `@dialpad/dialtone` or `@dialpad/dialtone-vue` dependency. Otherwise, the rule warns and skips its checks. A declared dependency can still use a hoisted installation within the repository.

The plugin keeps its existing optional standalone peer. Consumer-root resolution reads the declared umbrella directly, so no additional umbrella peer is required.

### Examples of incorrect code

```vue
<!-- rootClass on DtInput (removed in DLT-3100) -->
<dt-input root-class="d-w332" label="Email" />

<!-- camelCase variant also detected -->
<dt-input rootClass="d-w332" label="Email" />

<!-- dynamic binding -->
<dt-input :root-class="inputClass" label="Email" />

<!-- wrapperClass on DtToggle -->
<dt-toggle wrapper-class="d-mt16" />

<!-- containerClass on DtCard -->
<dt-card container-class="d-mbs-300" />
```

### Examples of correct code

```vue
<!-- Apply class directly — Vue 3 forwards it to the component root -->
<dt-input class="d-w332" label="Email" />

<dt-toggle class="d-mt16" />

<dt-card class="d-mbs-300" />

<!-- Merging with existing class is also fine -->
<dt-input class="d-pl8 d-w332" label="Email" />
```

### When the rule does NOT fire

```vue
<!-- DtListItem legitimately declares wrapperClass -->
<dt-list-item wrapper-class="d-pt8" />

<!-- Native class attribute -->
<dt-input class="d-w332" />

<!-- Non-Dialtone tags are ignored -->
<div root-class="x" />
```

## Auto-fix

Running `eslint --fix` rewrites the offending attribute automatically.

| Scenario | Before | After |
| --- | --- | --- |
| Static, no existing `class` | `<dt-input root-class="d-w332" />` | `<dt-input class="d-w332" />` |
| Static, with existing `class` | `<dt-input class="d-pl8" root-class="d-w332" />` | `<dt-input class="d-pl8 d-w332" />` |
| Dynamic, no existing `:class` | `<dt-input :root-class="cls" />` | `<dt-input :class="cls" />` |
| Dynamic, with existing `:class` | `<dt-input :root-class="cls" :class="other" />` | No autofix — merge manually |

When both `:root-class="expr"` and `:class="..."` appear on the same tag, the rule reports a warning but does not modify the file. The two dynamic bindings cannot be safely merged automatically; combine them by hand: `:class="[expr, other]"`.

## Setup

In your ESLint config:

```js
// eslint.config.js (flat config)
import dialtonePlugin from '@dialpad/eslint-plugin-dialtone';

export default [
  {
    plugins: { '@dialpad/dialtone': dialtonePlugin },
    rules: {
      '@dialpad/dialtone/deprecated-class-props': 'warn',
    },
  },
];
```

The rule requires `vue-eslint-parser` as the template parser. If you already use `eslint-plugin-vue`, the parser is already configured and no additional setup is needed.

## References

- [Component props migration guide](https://dialtone.dialpad.com/guides/migration/component-props/) — full list of changes and the `dialtone-migrate-props` codemod
- [Dialtone Vue components](https://dialtone.dialpad.com/components/)
