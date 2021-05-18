# Contributing

Before contributing a new component to Dialtone Vue, please check the [Github Project][project] board to see if there is already an issue for it and if not, add it.

## Pull Requests

Changes to the Dialtone Vue library should ideally be separate from any other changes to other project code. All pull requests should be assigned to the `@dialpad/dialtone-vue` team and require at least one approval to merge.

## Requirements

Any new components or updates to existing components require at least:

- Unit tests covering the entire change
- Storybook documentation
- Unit tests are passing locally
  - `npm run test`
- Linters are passing locally
  - `npm run lint`
- Library builds locally
  - `npm run build`
- Documentation builds locally
  - `npm run storybook:build`

[project]: https://github.com/dialpad/firespotter/projects/1
