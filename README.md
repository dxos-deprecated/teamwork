# Teamwork Suite

![Github Actions](https://github.com/dxos/teamwork/workflows/Build%20and%20Publish%20to%20WNS/badge.svg)

Decentralized Collaborative Tools.


## Usage

NOTE: Requires Node version 12.

```bash
yarn
yarn build
yarn test
```


### Publishing to npm

We are using `beta` channel for publishing.
To publish new versions of all public packages:

```bash
yarn build
yarn test
yarn lerna publish prerelease --dist-tag="beta" --force-publish
```
