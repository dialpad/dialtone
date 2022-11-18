## Git Commit Message Convention

Dialtone Vue uses [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for the commit messages in the release branches: `production`, `staging`, `vue3`, `staging-vue3`, `alpha` and `beta`. Make sure every commit you want to include in the [semantic release process](RELEASING.md) is meeting this specification. When opening a PR, ensure the PR's title also complies with the Conventional Commits specification. This way, if your PR is merged using squash strategy, the PR's title will be used as the commit message except when your PR contains a single commit, in this case Github will use this commit for the commit message when your PR is merged, so in this case to meet the convention on the single commit of your PR is required.

Consult [the rules](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules) that are considered problems in the commit message.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body - optional>
<BLANK LINE>
<footer - optional>
```

The `header` is mandatory and has a **type**, **scope** (optional) and **subject**:

```
<type>(<scope - optional>): <subject>
```

### Type:

Must be one of the following:

* **build**: changes that affect the build system.
* **chore**: general changes that don't fit in other types (code formatting, version changes).
* **ci**: changes to the CI configuration, files and scripts.
* **docs**: documentation changes.
* **feat**: a new feature (corresponding with `MINOR` in SemVer).
* **fix**: a bug fix (corresponding with `PATCH` in SemVer).
* **perf**: performance improvements (corresponding with `PATCH` in SemVer).
* **refactor**: changes that neither fix a bug nor add a feature (corresponding with `PATCH` in SemVer).
* **revert**: changes that revert a commit.
* **style**: not relevant changes (whitespace, code formatting, semicolons, etc).
* **test**: changes that add or modify tests.

> Only `feat`, `fix`, `perf` and `refactor` types trigger a new release. Commits with `BREAKING CHANGE:` in the footer of the commit message, regardless of type, will generate a `MAJOR` release.

### Scope:

The optional scope allows to specify the place of the change.
For instance, if the commit affects a specific component, use the component's name as scope:

Note: use lowercase and kebab-case syntax for the scope, that means all in lowercase and separate the words with dash.

```
feat(select-menu): add leftIcon prop
```

In case of multiple scopes, separate them with comma.

```
fix(combobox, combobox-with-popover): fix keyboard navigation
```

### Subject:

The subject contains a short description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end of the sentence

### Examples

#### Commit message with only header

```
feat: add danger style to Modal component
```

#### Commit message with scope

```
feat(modal): add danger style
```

#### Commit message with BREAKING CHANGE footer

```
feat: remove "Mark Pro" font family

BREAKING CHANGE: remove "Mark Pro" font family used in Dialtone 5.
```
