read -p "Enter version type [patch, major, minor]: " type
npm version $type
npm run distribute
npm publish
