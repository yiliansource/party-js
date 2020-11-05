<h1 align="center" style="position: relative;">
    <img width="200" src="./site/static/img/logo.svg"/><br>
    party.js
</h1>

<h4 align="center">
    A JavaScript library to brighten up your user's site experience with visual effects!
</h4>

<p align="center">
    <img alt="npm" src="https://img.shields.io/npm/v/party-js"/>
    <img alt="GitHub" src="https://img.shields.io/github/license/yiliansource/party-js">
    <a href="https://deepscan.io/dashboard#view=project&tid=11458&pid=14332&bid=265225"><img src="https://deepscan.io/api/teams/11458/projects/14332/branches/265225/badge/grade.svg" alt="DeepScan grade"></a>
    <img alt="GitHub file size in bytes" src="https://img.shields.io/github/size/yiliansource/party-js/party.min.js?label=minified%20size">
</p>

<p align="center">
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
</p>

## Installation

You can download the latest minified version at https://partyjs.yiliansource.dev/.

You can also install the package via `npm`:

```sh
npm install party-js
```

## Usage

**Check out the [Quick Start](https://partyjs.yiliansource.dev/docs) guide!**

User-interactable functionality is contained in the global `party` variable. To, for example, let confetti rain down the screen, simply call:

```js
party.screen();
```

Configuring the effects is possible aswell, by passing in a set of options. For a complete overview of the options, refer to the [documentation](https://partyjs.yiliansource.dev/docs/customization).

```js
party.element(document.querySelector("#my-element"), {
    count: party.variation(50, 0.5),
    angleSpan: party.minmax(60, 120)
});
```

## Contributing

Pull requests are welcome! For larger changes, especially structural ones, please open an issue first to discuss what you would like to change.

If you have a feature request, feel free to [open an issue](https://github.com/YilianSource/party-js/issues)!

## License

This project is licensed under a [MIT](./LICENSE.md) license.