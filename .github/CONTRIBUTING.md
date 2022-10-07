# Contributing

Thanks for your interest in contributing to Dialtone Tokens! Please take a moment to review this document before submitting a pull request.

## What are Design Tokens?

Design tokens are key-value pairs which represent all values that make up the design system. Colors, sizing, spacing and typography are valid design tokens.

## What is the purpose of this repo?

This repo's `base.json` file is the source of truth for all design tokens in Dialtone. The tokens in this repo are always kept in sync with Figma using the Figma Tokens plugin. These base design tokens are then transformed and published for multiple different platforms in their expected formats. This makes it easy to keep our design system values in sync between web and mobile devices.

## What libraries are used to do this?

 - [Token Transformer](https://www.npmjs.com/package/token-transformer): To convert figma token format to style dictionary token format
 - [Style Dictionary](https://amzn.github.io/style-dictionary/#/README): To read our base tokens and output them in different formats
 - [NPM](https://www.npmjs.com/): To install dependencies needed for this repo and deploy our NPM package
 - [Maven](https://maven.apache.org/guides/getting-started/index.html): To package android tokens for deployment
 - [Swift Package Manager](https://www.swift.org/package-manager): To package iOS tokens for deployment

## Token build process

Because base.json comes from Figma, it contains some syntax specific to Figma. This syntax must be translated into a format that Style Dictionary expects. We use [token-transformer](https://www.npmjs.com/package/token-transformer) to do this. This can be ran individually via `npm run transform`. It can also be run as part of `npm run build` which will build and output all different formats. Token Transformer outputs the new json file to `tokens/tokens.json` which is the standard directory Style Dictionary will read from on build.

Next in the process is running Style Dictionary which will output tokens to a variety of different formats. We currently output the following:

- Flat JSON
- Android XML
- Android Compose
- iOS Swift
- LESS
- CSS

All of these are output to the dist folder when you do `npm run build`

## Style Dictionary Configuration

Style Dictionary is configured in `config.js`. Here you can see the different formats and transforms applied for each output. Note we have a number of custom transformers, which are all prefixed with "dt/". You will find them in `build.js`. Note that some of our custom transformers are nearly identical to the built in ones, but have a different filter. This is because we do not use the exact [CTI Structure](https://amzn.github.io/style-dictionary/#/tokens?id=category-type-item) that Style Dictionary expects.

For more details on the above, please read the [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/#/architecture)

## Deployment

Because our design tokens are consumed on a variety of different platforms, we output multiple packages.

### Web

Our web package is output via npm. Even though it is meant for web we contain the files for all platforms in the package (android, ios) for maximum flexibility. Everything in the `dist` folder after you run `npm run build` is included in the NPM package. You can access the NPM package here: [@dialpad/dialtone-tokens](https://www.npmjs.com/package/@dialpad/dialtone-tokens)

### Android

Our Android package is built via Maven. It contains a compiled JAR file which includes the `colors.xml` and `dimens.xml` resources, as well as the Kotlin tokens file `tokens.kt` for Compose UI. Everything in the `dist_android` folder after you run `npm run build` is included in the Android package. The Android package is served through Github Packages and can be found here: [design.dialpad.tokens.dialtone-tokens](https://github.com/dialpad/dialtone-tokens/packages/1646082)

### iOS

Our iOS package is built via Swift Package Manager. It contains a Swift file including all the design system tokens. The contents of the Swift package are included in `dist_ios`. Swift packages are hosted directly from github repositories so we have a separate repository we deploy to to serve this package. This can be found here: [dialtone-tokens-swift](https://github.com/dialpad/dialtone-tokens-swift)

The deploy process is performed by the github actions workflow `.github/workflows/release.yml` and is triggered whenever we push the production branch. For more info on how to release, see [RELEASING.md](RELEASING.md)
