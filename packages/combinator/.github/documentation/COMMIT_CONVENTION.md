# Git commit message convention

Dialtone Combinator follows the root Dialtone commit convention in
`.github/COMMIT_CONVENTION.md`.

Use this header shape:

```txt
<type>(<scope>): <jira> <subject>
```

Example:

```txt
docs(combinator): DLT-3139 update maintainer documentation
```

## Types

Use the root convention's allowed types:

- `build`
- `chore`
- `ci`
- `docs`
- `feat`
- `fix`
- `perf`
- `refactor`
- `revert`
- `style`
- `test`

## Scope

Use `combinator` for package-wide Combinator changes. For small internal areas,
a narrower scope can be useful:

```txt
fix(option-bar): DLT-0000 hide invalid prop combinations
test(renderer): DLT-0000 cover slot render errors
```

## Jira key

Include the Jira key after the colon. Use `NO-JIRA` only when the team has
explicitly approved the work without a Jira ticket.

## Subject

- use imperative, present-tense wording;
- do not capitalize the first word unless it is a proper noun;
- do not end with a period.

## Release impact

The release config uses Conventional Commit types to decide version bumps.
For this package, the release config treats `refactor` commits as patch releases.
