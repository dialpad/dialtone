# Codemods

Run when a codemod or migration script is in the diff.

- Preserve rendered behavior and authored values except where the migration documents an intentional change. Rewrite only markup owned by the target.
- If ownership, bindings, spreads, or competing values make a rewrite unsafe, leave the affected input intact and give a useful diagnostic. Carry that decision through later passes and avoid overlapping edits.
- Use representative fixtures for the risks the transform can hit. Check that a second run leaves the output and diagnostics unchanged. Where relevant, verify that stage order, dry-run behavior, and the supported entry points match the migration guide.
