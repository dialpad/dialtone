# Codemods

Run when a codemod or migration script is in the diff.

- Check the diff against the codemod rules in `.agents/skills/migration-work/SKILL.md` (Codemod behaviour): owned markup only, authored values kept, unsafe input left intact with a diagnostic, spreads skipped, a no-op second run, a fixture per case.
- Also check what the rules do not cover: an unsafe decision is carried through later passes, edits do not overlap, and stage order, dry-run behavior and the supported entry points match the migration guide.
