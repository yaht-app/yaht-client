# yaht-client

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Notarize
see https://github.com/electron/electron-notarize
```
export APPLEID=<your-apple-id>
```
```
security add-generic-password -a "AC_USERNAME" -w "<your-app-password>" -s "AC_PASSWORD"
```