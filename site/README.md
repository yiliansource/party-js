# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

## Installation

```console
yarn install
```

## Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Library Linking

To ensure that the library version is up-to-date, create a hard link from the library (contained in the root) to the static JS version.

Unix:

```console
sudo mkdir site/static/js && sudo ln site/static/js/party.min.js party.min.js
```

Windows:

```console
mkdir site/static/js & mklink /h site/static/js/party.min.js party.min.js
```

## Build

```console
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
