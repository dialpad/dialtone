Create or open a `.vue` or a `.css` file to start testing the extension.

- On a `.vue` file:
  - Inside `<template>` tag
    - Type `<dt-|` to trigger Component completion.
    - Type `<dt-avatar | />` to trigger property completion.
    - Type `<dt-avatar size="|" />` to trigger values completion.
  - Inside `<style>` tag and withtin a class
    - Type `var(--dt-|)` to trigger token completion

- On a `.css` file, within a class:
  - Type `var(--dt-|)` to trigger token completion

- If no completion is provided automatically (depends on your VSCode config), press `Ctrl + Space` to trigger the completions.
