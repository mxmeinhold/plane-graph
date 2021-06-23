## Development
Install dependencies with [nvm](https://github.com/nvm-sh/nvm) and
[yarn](https://yarnpkg.com/).

```
nvm install
nvm use
yarn
```

See [config.example.json](./config.example.json) for the default database
configurations. I recommend spinning these up with podman or docker. There's
a docker compose file for codespaces in `.devcontainer` that may be of use
as a reference.

Once you have dependencies and config set, run `yarn dev`. This will spin up
the server, and automatically rebuild and restart when files are changed.

Use `yarn lint` and `yarn test` to check your changes. Of interest may be
`yarn lint:fix` and `yarn test:watch`. Note that there is not 100% test
coverage, so you'll need to manually verify most of your changes.

## Configuration

Configuration is read from disk and from the environment.

### Env vars
- `NODE_ENV`: "production" or "development", override the node_env set by webpack
- `PORT`: Override the default port for serving the api (8080)
- `CONFIG_PATH`: Specify an alternate configfile path

### Configfile
Checked first is `CONFIG_PATH`, then `./config.json`, then
`./config.example.json` for the configuration file. Please see
[config.example.json](./config.example.json) to see the config fields.
