# Codemods

Run when a codemod or migration script is in the diff.

- Renames only what belongs to the target component. Leaves slots of nested children and text inside quoted attribute values alone, using the codemod's attribute tokenizer.
- Keeps explicit values, static or bound. Infers a value only when it is absent.
- Adds a value only when sure; otherwise it warns. It skips `v-bind` spreads.
- A second run changes nothing. Every case has a fixture.
- What the migration guide promises, the codemod does.
