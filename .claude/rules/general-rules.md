# General Review Rules

Cross-cutting rules that apply to every changed file regardless of package. Always loaded by the `/review` skill.

## Reuse & Duplication

- Is the component too similar to another component already in the system?
- Can any existing code or functions in the system be reused here?
- Is there repeated code that should be extracted into a shared function?

## Code Quality & Readability

- Is the code written in a way that is easily human readable?
- Is the code maintainable — easy to extend or change without rewriting?
- Does complex code have a comment explaining the WHY, not the what?

## Contributor reference lookup

For repository authoring or maintenance questions, read the [shared Contributor tasks table](../../.agents/resources/rule-map.md#contributor-tasks), then its selected reference and owning requirements. Keep this as a route to the shared table; a Markdown link does not automatically load its contents.
