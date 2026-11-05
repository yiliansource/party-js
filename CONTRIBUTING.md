# Contributing to party.js

Thanks for wanting to help! Bug reports, ideas, docs fixes and pull requests are all welcome.

- **Found a bug or have an idea?** [Open an issue](https://github.com/yiliansource/party-js/issues/new/choose). The forms ask for what's needed to reproduce or discuss it.
- **Small fix** (a typo, a broken link, an obvious bug)? Open a pull request directly.
- **Anything larger** (a new effect, an API change, a refactor)? Please open an issue first, so we can agree on the approach before you spend time on it.

## Setup

The repository uses [bun](https://bun.sh) for everything: installing, testing, building and running the docs.

```sh
git clone https://github.com/yiliansource/party-js.git
cd party-js
bun install
```

`bun install` also installs the git hooks (see [Git hooks](#git-hooks)).

To work on the docs, install their dependencies too and start the dev server:

```sh
cd docs
bun install
bun run dev
```

The docs import party.js straight from `src/`, so changes to the library show up in the docs without a build.

## Repository layout

| Path       | Description                                                                              |
| ---------- | ---------------------------------------------------------------------------------------- |
| `src/`     | The library. `src/index.ts` is the only entry point.                                     |
| `tests/`   | The test suite, mirroring the folder structure in `src/`.                                |
| `docs/`    | The docs site at [party.js.org](https://party.js.org), built with Astro and Starlight.   |
| `api/`     | `party.js.d.ts`, a generated snapshot of the public API. CI checks it against the build. |
| `scripts/` | The bundle size and API report checks.                                                   |

## Scripts

Run these from the repository root.

| Command             | What it does                                                                        |
| ------------------- | ----------------------------------------------------------------------------------- |
| `bun run test`      | Runs the test suite.                                                                |
| `bun run typecheck` | Type-checks without emitting.                                                       |
| `bun run lint`      | Lints and checks formatting with Biome. `bun run lint:fix` fixes what it can.       |
| `bun run build`     | Builds `dist/` (ES module and types) and `bundle/` (the minified script-tag build). |
| `bun run size`      | Checks the gzipped size of `bundle/party.min.js`. **Needs a build.**                |
| `bun run api`       | Checks the public API against `api/party.js.d.ts`. **Needs a build.**               |

For the docs, `bun run --cwd docs test` runs the docs tests and `bun run --cwd docs check` type-checks the site.

## Git hooks

[Lefthook](https://lefthook.dev) runs a few checks for you, so problems show up before CI:

- **Before each commit:** Biome checks the staged files.
- **Before each push:** typecheck, tests and, if the docs or library changed, `astro check`.

## Working on the library

A few things the library is careful about, which pull requests should keep that way:

- **It must work without a browser.** Importing party.js on a server (SSR) must not fail, so don't touch `window`, `document` or other browser globals at the top level of a module, only inside functions that run in the browser. `tests/ssr.test.ts` imports the library in a plain process to check this.
- **It stays small.** The minified bundle has a budget of 12 KiB gzipped, and CI fails above it. party.js has no runtime dependencies, so please don't add any. If a feature adds a lot of code, it's worth discussing in an issue first. Run `bun run build && bun run size` to see where you stand.
- **The public API is tracked.** `api/party.js.d.ts` lists every export. If your change affects the public API **on purpose**, run `bun run build && bun run api --update` and commit the updated report together with your change.
- **Options:** only `undefined` falls back to an option's default. `null` is most often an invalid value, not "use the default".
- **Invalid input throws a `PartyJSError`** with a message that says what was expected and what was given. Use the helpers in `src/errors.ts` to build these messages consistently.
- **Reduced motion is respected by default.** `createEffect` takes care of it, so a new built-in effect should build on `createEffect` and pass its `reducedMotion` option through, like `confetti` and `sparkles` do.

### Doc comments

The [API reference](https://party.js.org/api/) is generated from the doc comments in `src/`, so every export needs one. Give it:

- a short `@summary`, which is shown in overviews,
- a `@group`: one of `Effects`, `Custom effects`, `Particles`, `Behaviors`, `Samplers` or `Utilities`,
- an `@example` where it helps.

### Tests

Tests use `bun test` and live in `tests/`, in the same folder structure as `src/`. Effects need a browser to run, so `tests/browser.ts` provides a minimal fake one: a canvas that records nothing, a `requestAnimationFrame` that only fires when a test calls `runFrame()`, and a switch for the reduced motion preference. `tests/helpers.ts` has helpers for testing samplers statistically.

## Working on the docs

Pages live in `docs/src/content/docs/` as MDX files. The API reference is generated, so fix mistakes there in the doc comments in `src/`, not in the docs folder.

### Live demos

Demos are the small "click me" examples on the docs pages. Each one is a file in `docs/src/demos/`, named `<name>.demo.js` or `<name>.demo.ts`, that exports a `run` function. It gets the clicked element as `target` and the click as `event`:

```ts
// #region import
import { confetti } from "party-js";
// #endregion
import type { Demo } from "./types";

export const run: Demo = ({ target: button }) => {
	// #region demo
	confetti(button);
	// #endregion
};
```

`#region` comments choose which code is shown on the page:

- `import`: the imports, shown first.
- `demo`: the code that's shown.
- `collapse`: code inside `import` or `demo` that's shown as `// ...`.
- `omit`: code inside `import` or `demo` that's left out entirely.

The code shown on the docs is plain JavaScript, so keep TypeScript syntax (type annotations, `as`, generics) outside the regions. Use a demo on a page with `<LiveDemo demo="<name>" />`.

## Commit messages and pull requests

Pull requests are squash-merged, so the **pull request title becomes the commit message** on `main`. Commits on your branch can be named however you like, but the title should follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<optional scope>): <short summary in lowercase>
```

| Type       | Use it for                                                 |
| ---------- | ---------------------------------------------------------- |
| `feat`     | A new feature in the library.                              |
| `fix`      | A bug fix in the library.                                  |
| `perf`     | A performance improvement.                                 |
| `refactor` | A code change that doesn't change behavior.                |
| `docs`     | Anything in `docs/`, the README or other documentation.    |
| `test`     | Adding or fixing tests.                                    |
| `ci`       | GitHub Actions workflows.                                  |
| `chore`    | Everything else: dependencies, tooling, repository config. |

`feat` and `fix` are for the library only. Changes to the docs site, including the playgrounds, are `docs`, even when they add something new, for example `docs(playground): add code playground`. For a breaking change, add a `!` after the type (`feat!: …`) and explain the change in the pull request.

Before you open a pull request, make sure `bun run lint`, `bun run typecheck` and `bun run test` pass. CI runs them too, along with the bundle size and API checks.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).