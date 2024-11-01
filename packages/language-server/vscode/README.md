# Dialtone VSCode Extension

Enhances the Dialtone development experience by providing Visual Studio Code users with autocomplete features.

## Features

### Autocomplete

Inteligent suggestion for [Dialtone components](https://dialtone.dialpad.com/components/)

- type: `<dt-|` to get a list of components.
- type: `<dt-button |` to get a list of component props.
- type: `<dt-button size="|"` to get a list of prop values.

As well as [Design Tokens](https://dialtone.dialpad.com/tokens/)

- type: `var(--dt-|)` to get a list of CSS variables.

### Hover Preview

Coming soon.

## Extension Commands

### Dialtone: Show Output

Reveal the language server log panel. This command is only available when there is an active language server instance.

## Troubleshooting

If you’re having issues getting the Dialtone Extension features to activate:

- Take a look at the language server output by running the `Dialtone: Show Output` command from the command palette. This may show errors that are preventing the extension from activating.
