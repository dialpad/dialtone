# @dialpad/dialtone-react

Dialtone's React components, ported from `dialtone-vue`. Private for now.

## Commands

Run these from the repo root. Each builds what it needs first (dialtone-icons, dialtone-tokens).

| Command | What it does |
| --- | --- |
| `pnpm nx run dialtone-react:lint` | ESLint (`eslint.config.js`): typescript-eslint and the Rules of Hooks for `.ts`/`.tsx`, the repo's style rules for everything. Human commits also lint their staged files (husky, `.lintstagedrc.cjs`). The migration loop's workers skip husky, since the loop points `core.hooksPath` at its own hooks; the gate's Lint row and CI's `check` job catch their lint errors. |
| `pnpm nx run dialtone-react:typecheck` | `tsc` over the whole package. |
| `pnpm nx run dialtone-react:test` | Vitest, every `*.test.ts(x)`. |
| `pnpm nx run dialtone-react:build` | The library: ES modules and type declarations in `dist/`. Entry points: `@dialpad/dialtone-react`, `@dialpad/dialtone-react/components/<Name>` and `@dialpad/dialtone-react/icons`. React, React DOM and every runtime dependency stay external. |
| `pnpm nx run dialtone-react:gate -- <unit>` | The parity gate for one unit (e.g. `-- validation-messages`). |
| `node --test 'packages/dialtone-react/parity/*.test.mjs'` | The harness's own tests: which units CI gates for a change (`parity/changed-units.mjs`), which Vue tests a unit has (`parity/vue-sources.mjs`), and how DOM parity serializes select options (`parity/normalize.mjs`). |

Generated, gitignored files: `index.ts` (the barrel, `scripts/build-index.mjs`, from every `components/*/index.ts` and `common/*/index.ts` plus Vue's public common modules) and `icons/generated/` (`scripts/build-icons.mjs`). Build, typecheck, test and gate regenerate both; run `pnpm --filter @dialpad/dialtone-react generate` after adding a component if your editor needs the barrel.

Shared test helpers ported from dialtone-vue are in `tests/helpers/`: `validation_messages`, `clipboard` (`simulatePaste`; `tests/setup.ts` installs the same `ClipboardEvent` and `DataTransfer` stand-ins Vue's setup does), `fixtures` (`EmptyComponentFixture`) and `node_traversal`. Two more stand in for what Vue Test Utils does by itself: `transition` (`finishTransitions`, as VTU stubs `<transition>`) and `link` (`RouterLinkStub`, `withRouterLink`).

Foundations every port shares, in `common/`: `localization` (`DialtoneLocalization`, `useI18n`, `DtLocalizationProvider`, on `@fluent/bundle` over dialtone-vue's `.ftl` files), `link` (`DtLinkProvider`, `useLinkComponent`, `DtRouterLink`, for `to`) and `transition` (`DtTransition`, Vue's `<Transition>`; its tests replay Vue's recorded traces in `parity/transition-traces.json`).

## Storybook

Run these from the repo root.

| Command | Serves | What it is |
| --- | --- | --- |
| `pnpm nx run dialtone-react:storybook:all` | 9011, 9012, 9013 | Starts Vue's, React's and the comparison Storybook together. Open http://localhost:9013. |
| `pnpm nx run dialtone-react:storybook` | http://localhost:9012 | React's Storybook alone. It mirrors Vue's: same themes, toolbars, addons and sidebar order. |
| `pnpm nx run dialtone-react:storybook:compare` | http://localhost:9013 | The comparison alone. It needs Vue's Storybook (`pnpm nx run dialtone-vue:start`) and, for the React side, React's. |
| `pnpm nx run dialtone-react:typecheck` | | Typechecks the package, both Storybook configs included. |

`storybook:all` first checks that ports 9011, 9012 and 9013 are free, and exits with a message naming the taken ones if not (e.g. another checkout's Storybook is running). It builds dialtone-css, dialtone-icons, dialtone-tokens and Vue's `build-functions`, then runs Vue's own `start` target, which rebuilds those packages when they change. The React Storybook generates the React icons (`scripts/build-icons.mjs`) before it starts, and its own target rebuilds dialtone-css and dialtone-tokens when they change. The comparison starts once Vue's story index answers (it waits up to 10 minutes), which takes a minute or two on a cold start.

**Stopping.** Press Ctrl-C in the terminal that runs the command: it stops every Storybook and watcher it started. Killing only the parent process (e.g. `kill <pid>` on the top `nx`) leaves the nested `nx watch` and `nx run dialtone-vue:start` processes running, still holding their ports; find them with `lsof -nP -iTCP:9011-9013 -sTCP:LISTEN` and `pgrep -fl "nx watch"`, and kill them by PID.

### The comparison

- **Sidebar.** `compare/generate-stories.mjs` reads Vue's `index.json` and writes one story per Vue story into `compare/generated/` (gitignored), with the same title and export name, so the sidebar and every generated story's id match Vue's. It skips any Vue story it can't reproduce (no export name, an export name that isn't a plain identifier, or one that doesn't give Vue's id) and lists those in its output. It runs each time the comparison starts. Restart the comparison to pick up stories added to Vue since.
- **Frames.** Each story shows Vue's and React's preview of the same story id side by side. The React side says "Not ported yet" when React's Storybook has no story with that id. If React has stories under the same component id, title or story file name, it lists them ("React has: …"): a ported story with a wrong title or export name shows up there. The generator also logs every React story id Vue doesn't have, when React's Storybook is up by then.
- **Hidden stories.** A Vue story hidden from the dev sidebar (`tags: ['!dev']`) is hidden in the comparison too.
- **Theme.** The Theme and Contrast toolbars go into both frames' URLs. The dark-mode toggle is sent to each frame when it renders.
- **Args.** The controls under the frames are the Vue story's (its argTypes and initial args, as Vue's preview reports them). A change reloads both frames with the same URL args.

### Limits

- **What a URL can carry.** Storybook only accepts URL args that are numbers, booleans, colours, `undefined`, or strings of letters, digits, spaces, `_` and `-`. So a text value with punctuation (e.g. "Hello, world.") can't be set from the comparison; the control says so and keeps the frames as they are. Select options that a URL can't carry (e.g. Popover's `initialFocusElement` `#content-close`) are disabled and labelled. Object, array and function args aren't editable here at all; both frames keep the story's own value.
- **Args a frame drops.** After each reload, the controls list any changed arg a frame didn't apply. Storybook drops a URL arg the story doesn't declare (e.g. a slot arg renamed in React), or one whose type it can't map: a React prop typed `X | null` is a `union` to Storybook, so a URL value for it is dropped unless the story's argTypes give it a plain type. A story can also ignore an arg it gets (Vue's Text Default ignores `default` from the URL).
- **No live sync.** Every change reloads both frames, so story state (an open tooltip, typed text) resets. Dark mode reaches a frame just after it renders, so a dark frame may flash light first.
- **Ports.** They are fixed in `compare/ports.json` and in the Nx targets. React's and the comparison Storybook exit if their port is taken (`--exact-port`). Vue's own `start` target would move to another port instead, which is why `storybook:all` checks all three ports before it starts anything. Run on its own, `storybook:compare` frames whatever answers on 9011 and 9012.
- **Vue's watcher loops.** Vue's `start` target (which `storybook:all` runs as is) watches dialtone-icons, whose `pre-build` rewrites `src/keywords-*.json`, which the watcher sees as a change. So under `storybook:all` it rebuilds dialtone-icons and dialtone-icons-vue over and over. The Storybooks keep working, but the log scrolls with builds. React's `storybook` target doesn't watch dialtone-icons (React's icons come from `scripts/build-icons.mjs`, not its build output), so it doesn't loop; restart it to pick up changed icons.
