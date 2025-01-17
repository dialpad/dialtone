# Dialtone VSCode Extension

Enhances the Dialtone development experience by providing Visual Studio Code users with autocomplete features.

## Features

### Autocomplete

> **TIP**: If no completion is provided automatically (depends on your VSCode config), press `Ctrl + Space` or `Cmd + I` to trigger the completions.

#### Intelligent completion suggestion for [Dialtone components](https://dialtone.dialpad.com/components/)

- type: `<dt-|` to get a list of components.
![Dialtone components completion example](media/completion/components.png)

- type: `<dt-button |` to get a list of component props, (the list will show up at the bottom of the list) so click the arrow up, to quickly go to the dialtone component props.
![Dialtone component properties completion example](media/completion/properties.png)

- type: `<dt-button size="|"` to get a list of prop values.
![Dialtone component property values completion example](media/completion/values.png)

#### Intelligent completion suggestion for [Design tokens](https://dialtone.dialpad.com/tokens/)

- type: `var(--dt-|)` to get a list of CSS variables.
![Dialtone tokens completion example](media/completion/tokens.png)

#### Intelligent completion suggestion for [CSS utility classes](https://dialtone.dialpad.com/utilities/)

- type: `class="|"` to get a list of CSS variables.
![CSS utility classes completion example](media/completion/class.gif)

### Hover Preview

Hover over a dialtone component, prop, utility class or token to see documentation.

#### Component

![Dialtone component hover example](media/hover/components.gif)

#### Prop

![Dialtone property hover example](media/hover/properties.gif)

#### Utility class

![Dialtone utility class hover example](media/hover/class.gif)

#### Token

![Dialtone token hover example](media/hover/tokens.gif)

## Extension Commands

### Dialtone: Show Output

Reveal the language server log panel. This command is only available when there is an active language server instance.

## Troubleshooting

If you’re having issues getting the Dialtone Extension features to activate:

- Take a look at the language server output by running the `Dialtone: Show Output` command from the command palette.
This may show errors that are preventing the extension from activating.
