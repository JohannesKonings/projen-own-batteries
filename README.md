# projen-own-batteries

[projen](https://github.com/projen/projen) comes with batteries included, which is very helpfull to get started with a new project and benefit from the updates of projen. This is than a kind of all in especcially with the maintenance of the dependencies and the `package.json` file.

For some cases you want to start small "only" with the file generation functionality of projen. This repo is and example how to add your own components to generating files mainly for repo management (eslint, prettier, ...).
The main target is to have the decisions how the downstream repos will look like baked into this project and use as less parameters as possible.

Three repo type are targeted:

- typescript
- frontend (react)
- cdk

## components

Following components are available

### sops

Details [here](./src/components/sops/README.md)
