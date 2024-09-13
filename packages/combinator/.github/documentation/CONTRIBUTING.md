# Contributing

Before contributing to Dialtone Combinator, please check the [Jira backlog](https://switchcomm.atlassian.net/jira/software/projects/DT/boards/187/backlog) to see if there is already an issue for it and if not, add it.

## Overview

### What Is a Contribution?

A contribution is any proposal, design, code, or documentation completed by someone not on the core Dialtone team, and released through Dialtone Combinator for other people to use. It can be created by anyone who'd like to help make Dialtone Combinator better.

Types of contributions:

- **Fix:** Fixes a technical or documentation defect.
- **Enhancement:** Extends an existing component without changing the underlying architecture or behavior.
- **New feature:** Adds something new, like a component.

### Roles

- **Contributor:** Has the ability to create PRs and merge their change into staging after at least one approving review.
- **Maintainer:** A trusted contributor with the ability to release Dialtone.
- **Admin:** Has the ability to change any configuration on the Dialtone repository and release Dialtone. Usually for members of the Dialtone team.

## Making a Pull Request

### Before Submitting

Before submitting a pull request, make sure to communicate what you wish to change to the Dialtone team. The easiest way to do this is via the [#dialtone](https://dialpad.slack.com/messages/dialtone/) Slack channel. It's possible your change is already being worked on, has already been fixed, or maybe we just need to discuss the best solution to the problem. This prevents you from having to re-write your entire change, or even having to scrap it entirely.

Any new components or updates to existing components require the following:

- Unit tests covering the entire change.
- Unit tests are passing locally.
  - `npm run test`
- Linters are passing locally.
  - `npm run lint`
- Library builds locally.
  - `npm run build`
- Preview builds locally.
  - `npm run build:preview`

### How to Submit

After you have discussed your change with the Dialtone team, follow these steps to submit it:

1. See [README.md](/README.md) for instructions on how to initially clone and run the project.
2. First make sure you are on the `staging` branch with `git checkout staging`,
   and that it is up to date with `git pull`.
3. Create a personal branch to make your change off of `staging` with `git checkout -b my-change-branch`.
   We use kebab-case for branch names.
4. Make and commit your changes. Note our [commit message conventions](COMMIT_CONVENTION.md).
5. Push your branch to remote. `git push -u origin my-change-branch`.
8. Create a pull request into the `staging` branch, reviewers will be automatically added and notified of your PR.

Once your change is in `staging` it will deploy and go live immediately.

## Coding Guidelines

### Accessibility in Mind

Keep accessibility in mind for every new feature, improvement or bug fix you make.
Always test your change with a screen reader and keyboard navigation if applicable.

### Unit Testing
*Unit testing is not implemented yet

### Dialtone Usage
We should attempt to use Dialtone utility classes and Dialtone vue components where applicable.

### Breaking Changes

Dialtone Combinator is a dependency of other projects so you must always be aware of making a breaking change.
It is possible to make breaking changes, however if you do so you will need to update / verify all
instances of usage of the component in reliant projects before updating.

### Folder Structure
See [OVERVIEW](OVERVIEW.md#folder-structure).

## Commit Message Convention
See [COMMIT_CONVENTION](COMMIT_CONVENTION.md).

## Tooling

### ESLint

We use ESLint to promote best practices throughout our codebase.
ESLint will check any of our javascript or vue code for styling or syntax errors.
The configuration can be found in [.eslintrc.js](/.eslintrc.js).
Any changes code changes you make will be automatically linted upon commit.
You can manually run ESLint via `npm run lint`.

### GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is what we use for our CI/CD solution.
All GHA workflows are in the `.github/workflows` directory. Currently, we use GitHub Actions for the following:

- Deploying a preview `.github/workflows/deploy.yml`, `.github/workflows/deploy-preview.yml`
- Linting our files on pull request `.github/workflows/lint-pr.yml`.
