# Contributing

Thanks for your interest in contributing to Dialtone Tokens! Please take a moment to review this document before submitting a pull request.

## What are Design Tokens?

Design tokens are key-value pairs which represent all values that make up the design system. Colors, sizing, spacing and typography are valid design tokens.

## What is the purpose of this repo?

This repo's `tokens` folder contains multiple json files which are the source of truth for all design tokens in Dialtone. The tokens in this repo are always kept in sync with Figma using the Figma Tokens plugin. These base design tokens are then transformed and published for multiple different platforms in their expected formats. This makes it easy to keep our design system values in sync between web and mobile devices.

## What libraries are used to do this?

- [Token Transformer](https://www.npmjs.com/package/token-transformer): To convert Figma Tokens to style dictionary token format, we use this for Android and iOS. We use sd-transforms for web.
- [sd-transforms](https://github.com/tokens-studio/sd-transforms): The simplest way to convert tokens from Figma Tokens to style dictionary format. Unfortunately only works for web right now.
- [Style Dictionary](https://amzn.github.io/style-dictionary/#/README): To read our base tokens and output them in different formats.
- [NPM](https://www.npmjs.com/): To install dependencies needed for this repo and deploy our NPM package.
- [Gradle](https://gradle.org/): To package and deploy our Android tokens.
- [Swift Package Manager](https://www.swift.org/package-manager): To package iOS tokens for deployment.

## Token build process

Because our tokens come from figma, it contains some syntax specific to Figma. This syntax must be translated into a format that Style Dictionary expects. To do this we use [token-transformer](https://www.npmjs.com/package/token-transformer) for Android / iOS, and [sd-transforms](https://github.com/tokens-studio/sd-transforms) for web. token-transformer can be run individually via `pnpm nx build:token-transformer dialtone-tokens`. It can also be run as part of `pnpm nx build dialtone-tokens` which will build and output all different formats. Token Transformer outputs the new json file to the `token_transformer` directory.

Next in the process is running Style Dictionary which will output tokens to a variety of different formats. We currently output the following:

- Flat JSON
- Android XML
- Android Compose
- iOS Swift
- LESS
- CSS

All of these are output to the dist folder when you do `pnpm run build`

## Style Dictionary Configuration

sd-transforms and token-transformer each have their own style dictionary configuration. You can find this in `build-sd-transforms.js` and `build-token-transformer.js` respectively. sd-transforms has it's own built in transform group `custom/css/tokens-studio` which we add some custom transforms to. token-transformer's configuration is more manual. See style dictionary's documentation for more info. <https://amzn.github.io/style-dictionary>

We have to use some custom transformers to get the desired output we want. These are stored in `dialtone-transforms.js` and can be used in both sd-transforms and token-transformer as needed.

For more details on the above, please read the [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/#/architecture)

## Deployment

Because our design tokens are consumed on a variety of different platforms, we output multiple packages.

### Web

Our web package is output via npm. Even though it is meant for web we contain the files for all platforms in the package (android, ios) for maximum flexibility. Everything in the `dist` folder after you run `pnpm run build` is included in the NPM package. You can access the NPM package here: [@dialpad/dialtone-tokens](https://www.npmjs.com/package/@dialpad/dialtone-tokens)

### Android

Upon build, the Android source code is output to `dist/android` folder. If we are looking to publish the package, this source must be compiled into an Android package. This is done via Gradle by running `publish:android-package`. The compiled package will contain kotlin as well as resource files for Dialtone's tokens. The Android package is served through Github Packages and can be found here: [design.dialpad.tokens.dialtone-tokens](https://github.com/dialpad/dialtone-tokens/packages/1646082). You do not have to run this command locally unless you are looking to debug something related to the Android package. The android package will be built and released on CI via our regular release process.

If you would like to build the Android package locally for debugging purposes you will need to:

1. Install the Android SDK
2. Create a file called `local.properties` in the root of dialtone-tokens
3. Add the following to the local.properties file:

```properties
sdk.dir=PATH_TO_YOUR_ANDROID_SDK_GOES_HERE
```

### iOS

Upon build the iOS swift source code is output to the `dist/ios` folder. The contents of the Swift package are included in `dist_ios` when running `publish:ios-package`. Swift packages are hosted directly from github repositories so we have a separate repository we deploy to to serve this package. This can be found here: [dialtone-tokens-swift](https://github.com/dialpad/dialtone-tokens-swift)

The deploy process is performed by the github actions workflow `.github/workflows/release.yml` and is triggered whenever we push the production branch. For more info on how to release, see [RELEASING.md](RELEASING.md)
