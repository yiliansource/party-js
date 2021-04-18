# Contributing to party.js

First of all, thank you so much for wanting to contribute to the project! ❤

Below you can find a set of resources and guidelines that you should follow for any contribution. While these are not rules per se, following them never goes unappreciated, but if you would like to propose a change to the contribution guidelines, feel free to request and discuss them!

## I don't want to read this whole thing, I just have a question!!

Since the community is still relatively small, you will probably get help fastest by [opening an issue][issues]. Later on, we might move questions to a seperate community to seperate new features or bugs from questions.

## What should I know before getting started?

The latest rewrite of the library was intended to provide a proper architectural structure, to allow a more modular, flexible and efficient approach to development. The following section will guide you through the directory structure of the project, so you know where you might want to propose changes.

### Directory Structure

<!-- prettier-ignore -->
| Path | Description |
| :--- | :--- |
| docs | The root for the documentation of the project, written using Docusaurus. This will be deployed to a website. |
| samples | Contains a sample HTML page that can also be used as a playground while testing new features. |
| tests | Contains the static tests that are required to pass before a change is permitted. |
| src | The root for the actual source code of the project. This directory already contains important scripts, like the `Scene` or the `Renderer`. |
| src/components | Contains components that the library needs to function, like Vectors or Colours. Essentially, these should be types that can exist without dependancies on other parts of the library, although they may depend on eachother. |
| src/particles | Contains the behaviour and types for emitters and particles, together with the definitions of what is configurable. |
| src/particles/modules | Contains the particle modules that can be added to emitter objects. |
| src/particles/options | Contains the option definitions for emitters, together with their defaults. |
| src/systems | Defines modular systems for the library to use, like the `math` or `random` tools. Also contains the `ParticleModifier<T>`s and `Variation<T>`s. |
| src/templates | Defines the templates (pre-made effects) that will be exposed to the user. Every template is expected to export a function that calls it, together with an (optional) object that represents the type definition for the configuration of the effect. |
| src/util | Contains smaller utilities for configuration, conversions, etc. |

## How can I contribute?

There are some pre-made issue templates, to make your contribution process easier. Make sure to fill them out carefully, as they'll make things easier in the long run for all of us!

### Reporting bugs

As we all know, bugs are annoying. I am glad about any bug you might find, as it helps to make the library for stable and safer to use.

Before submitting a report, make sure you have done the following:

-   **Has the issue already been reported?** You don't have to click through every issue that has ever been submitted to the repository, but just perform a quick keyword search through them, to avoid duplicate reports. If you do already find one, check if you can add any more information to it!
-   **Is it really a bug?** Even though it's not likely, it might be an intended feature. If in doubt, you can still feel free to report it.
-   **Gather information!** This is vital, so others can reproduce and fix the bug. When does it occur? Did you write any code yourself? Which environment do you run it in?

After you have done all that, you are more than welcome to [open an issue][issues] using the _Bug Report_ template.

### Suggesting enhancements

New features are great! But everything should be discussed beforehand, to ensure that it does not break anything and aligns with future intentions.

Before submitting an enhancement, ask yourself the following:

-   **What does it do?** Try to summarize, briefly, what the enhancement does for the library.
-   **Who is the enhancement useful for?** If something is only useful for you, try if you can implement it on your end only. If it's not a common thing, it might not be needed in the library.
-   **What will have to be changed?** Does it change the rendering, the emitting or something completely else? If you are not sure, don't worry, we'll figure it out together.
-   **Do you want to work on it yourself?** If you already have an idea on how to implement it, feel free to say so and claim the issue!

After you've thought about all of it, feel free to [release your issue into the public][issues]!

### Contributing code

It's best to discuss changes you want to make in an [issue][issues], to prevent you from writing features that might not be desired in the library and consequently would not be merged. If you see an issue that is up for grabs, feel free to chip in and say that you are working on it. If you want to open an issue yourself, check the previous two sections.

The following section will guide you through how to get the library running locally, and how to request your changes to be merged.

#### Local development

First, fork (so you have your "own" version to work on) and clone (so you get the changes to your local environment) the repository.

You can install all developmental dependancies of the library using the package manager of your choice.

```sh
npm install
```

Now you are ready to write code. If you are not sure where to look for things, take a peek at the [directory structure](#directory-structure) of the library.

#### Tests & Linting

> Check out the [style guide](#style-guide) for more information on the linting of the project.

Any change that you make will have to still pass all of the unit tests and linting rules that are set up. You can run package scripts to check if you're good to go. If neither command produces an error, you're good!

```
npm run test
npm run lint
```

#### Pull Requests

Before creating the actual Pull Request, please make sure you have done the following:

-   Successfully passed all tests and linting checks locally.
-   Followed all instructions on contributing.
-   Followed the styleguides.

If you've done all that - congratulations! Please fill in the template and wait for all the status checks to pass. Your changes will be reviewed, and unless further changes are requested, merged!

## Style Guide

### Git Commit Messages

-   Keep it short and clear. You are free to add further information in the description, but the first line should be no longer than 72 characters.
-   Reference issues and pull requests your changes affect.

### TypeScript Styleguide

There's not much to say here. The codebase is linted using Prettier, which is highly recommended during development. This ensures a consistent appearance on the source code. If you have a suggestion on a linting rule that should be added/removed, feel free to [discuss it in an issue][issues].

If you are writing code, make sure that it's properly documented, to allow later contributors to understand your changes. Avoid "magic numbers" as much as possible, but if you do need them, explain where they stem from.

[issues]: https://github.com/YilianSource/party-js/issues/new
