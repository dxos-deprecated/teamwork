# Teamwork Suite

![Github Actions](https://github.com/dxos/teamwork/workflows/CI/badge.svg)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

Decentralized Collaborative Tools.

## Usage

Start the Teamwork app:

```bash
yarn && yarn build
cd apps/teamwork-app && yarn start
```

## Developing pads

First, build the pads:

```bash
yarn build
```

(Optional) Run the watch command for one of the pads that you are going to continuosly develop:

```bash
cd pads/<some>-pad
yarn build --watch
```

Then, run the storybooks:

```bash
cd storybooks
yarn storybook
```
