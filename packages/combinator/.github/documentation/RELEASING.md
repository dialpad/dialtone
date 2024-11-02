# Releasing

A release is required to update the npm package and provide an update for package users.

## Access

You must have the access token to write to the npm package.
Make sure this is sourced before publishing the package.

```
source TOKEN_PATH
```

## Publish

The package can be published by running the 'release.sh' script.
This will increment the version and publish it to the npm registry.

```
npm run release
```

OR

```
./release.sh
```

It will prompt for the release version [major, minor, patch] and
then build the package locally as well as publish it to the npm package 
`@dialpad/dialtone-combinator`.
