## Git Commit Message Convention

Dialtone uses [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for the commit messages in the release branches: `production`, `staging`, `alpha` and `beta`.
When opening a PR, ensure the PR's title also complies with the Conventional Commits specification.
This way, if your PR is merged using squash strategy, the PR's title will be used as the commit message.

Consult [the rules](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules) that are considered problems in the commit message.

Each commit message consists of a **header**, a **body**, and a **footer**.

```txt
<header>
<BLANK LINE>
<body - optional>
<BLANK LINE>
<footer - optional>
```

The `header` is mandatory and has a **type**, **scope** (optional) and **subject**:

```txt
<type>(<scope - optional>): <jira> <subject>
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

> Only `feat`, `fix`, `perf` and `refactor` types trigger a new release.
>
> Dialtone icons and Dialtone emojis packages trigger a patch release on `build`, `chore`, `ci`, `docs`, `style` and
> `test` also.
>
> Commits with `BREAKING CHANGE:` in the footer of the commit message, regardless of type, will generate a `MAJOR`
> release.

### Scope:

The optional scope allows to specify the place of the change.
For instance, if the commit affects a specific component, use the component's name as scope:

Note: use lowercase and kebab-case syntax for the scope, that means all in lowercase and separate the words with dash.

```txt
feat(select-menu): DLT-123 add leftIcon prop
```

In case of multiple scopes, separate them with comma.

```txt
fix(combobox, combobox-with-popover): DLT-123 fix keyboard navigation
```

### Jira:

The id of the Jira ticket associated with the PR. If there are more than one, they can be added separated by spaces.
If there is no associated Jira ticket, the word "NO-JIRA" should be used.

### Subject:

The subject contains a short description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end of the sentence

### Examples

#### Commit message with only header

```txt
feat: DLT-123 add danger style to Modal component
```

#### Commit message with scope

```txt
feat(modal): DLT-123 add danger style
```

#### Commit message with BREAKING CHANGE footer

```txt
feat: DLT-123 remove "Mark Pro" font family

BREAKING CHANGE: remove "Mark Pro" font family used in Dialtone 5.
```

#### Commit message with no associated Jira ticket

```txt
feat(modal): NO-JIRA add danger style
```

#### Commit message with several associated Jira tickets

```txt
feat(modal): DLT-123 DP-555 add danger style
```