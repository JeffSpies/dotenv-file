# dotenv-file

This package is intended to be a drop-in replacement for `dotenv`, but adds the following features:

- Variable expansion with the `.env` file (e.g., `MESSAGE=Hello, ${NAME}`)
- Loading default variables from defaults file (e.g., `.env.defaults`)
- Schema
- CLI

## Install

```js
npm install dotenv-file --save-dev
```

or

```js
yarn add dotenv-file -D
```