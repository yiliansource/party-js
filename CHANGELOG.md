# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Note that the changelog only dates back to release of [v2.0.0][2.0.0].

## [2.1.3] (2022-06-07)

**Bug Fix**

-   Removed source maps from the npm package, since they were causing some issues.

## [2.1.1] (2021-10-09)

**New Feature**

-   Exposed the `lifetime` parameter on the `sparkles` template, so you can now control the total range of the stars via `lifetime` and `speed` ([#72]).

## [2.1.0] (2021-09-26)

A lot of quality-of-life changes regarding the library and the respective documentation.

**New Feature**

-   Added support for the `respect-reduced-motion` media query. The library now doesn't activate its effects if said query is detected. This can be disabled via a flag in the settings ([#74]).
-   Added deployment workflows.
-   Added "live codeblocks" to the docs, so you can play around with live examples.

**Bug Fix**

-   Fixed a bug where the container wouldn't stretch to cover the entire DOM, so particles should no longer be cut off somewhere ([#70], [#71]).
-   Updated some development packages to fix potential security issues.

**Polish**

-   Revamped the style of the documentation site [party.js.org].
-   Improved the generation of the docs and API ([#42]).
-   Improved module exporting.

**Removed**

-   Removed stale-bot from the repository.

## [2.0.1] (2021-05-17)

**Bug Fix**

-   Fixed a bug where the dynamic source sampler would confuse `Rect`s and `HTMLElement`s ([#60]).

## [2.0.0] (2021-04-18)

The huge rewrite of the entire library. The codebase is now properly structured, typed, tested and documented.

[2.1.1]: https://github.com/yiliansource/party-js/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/yiliansource/party-js/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/yiliansource/party-js/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/yiliansource/party-js/releases/tag/v2.0.0
[#74]: https://github.com/yiliansource/party-js/issues/74
[#72]: https://github.com/yiliansource/party-js/issues/72
[#71]: https://github.com/yiliansource/party-js/issues/71
[#70]: https://github.com/yiliansource/party-js/issues/70
[#60]: https://github.com/yiliansource/party-js/issues/60
[#42]: https://github.com/yiliansource/party-js/issues/42
