# dotenv-file

This package is intended to be a drop-in replacement for `dotenv`, but adds the following features:

- Variable expansion with the `.env` file (e.g., `MESSAGE=Hello, ${NAME}`)
- Loading default variables from defaults file (e.g., `.env.defaults`)
- Schema
- CLI

Future features may include
- Type conversion based upon schema.

## Install

```js
npm install dotenv-file --save-dev
```

or

```js
yarn add dotenv-file -D
```