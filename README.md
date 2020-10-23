# party.js 🎉 [![DeepScan grade](https://deepscan.io/api/teams/11458/projects/14332/branches/265225/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11458&pid=14332&bid=265225)

A JavaScript library to brighten up your user's site experience with visual effects!

## Installation

You can download the latest minified version from https://partyjs.yiliansource.dev/.

## Usage

~~The quick start guide is also available at https://partyjs.yiliansource.dev/#quick-start~~. (soon!)

To use the library, simple include the library in your HTML document.

```html
<script src="js/lib/party.min.js"></script>
```

User-interactable functionality is contained in the global `party` variable. To, for example, let confetti rain down the screen, simply call:

```js
party.screen();
```

Configuring the effects is possible aswell, by passing in a set of options. A complete list of options ~~is available in the [documention]()~~ is coming soon!

```js
document.getElementById("my-button").addEventListener("click", function(e) {
    e.preventDefault();
    party.cursor({ count: 200, angleSpan: 100 });
});
```

## Contributing

Pull requests are welcome! For larger changes, especially structural ones, please open an issue first to discuss what you would like to change.

If you have a feature request, feel free to open an issue!

## License

This project is licensed under an [MIT](./LICENSE.md) license.