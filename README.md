# Teamwork Suite

![Github Actions](https://github.com/dxos/teamwork/workflows/CI/badge.svg)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

Decentralized Collaborative Tools.

## Usage

Start the Teamwork app:

```bash
yarn start
```

### Publishing to npm

We are using `beta` channel for publishing.
To publish new versions of all public packages:

```bash
yarn build
yarn test
yarn lerna publish prerelease --dist-tag="beta" --force-publish
```
