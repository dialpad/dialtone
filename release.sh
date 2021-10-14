#!/bin/bash

# exit when any command fails
set -e

# get latest dialtone version number
dialtoneLatest=$(npm show @dialpad/dialtone version)

# get current dialtone version in package.json, remove the ^
dialtoneDevVersion=$(node -p "require('./package.json').devDependencies['@dialpad/dialtone']" | sed 's/\^//')
peerDialtoneVersion=$(node -p "require('./package.json').peerDependencies['@dialpad/dialtone']" | sed 's/>=//')

# check that we are using the latest version of dialtone currently available.
if [ $dialtoneLatest != $dialtoneDevVersion ]; then
  read -r -p "The dialtone version in package.json is not the latest version of dialtone vue. Would you like to continue? (y/N): " response
  response=$(echo "$response" | awk '{print tolower($0)}')
  echo $response
  if [[ "$response" =~ (no|n| ) ]] || [[ -z $response ]]; then
      exit 0
  fi
fi

# remove patch version from dialtoneDevVersion and compare to make sure it matches the peer dep version. Peer dep version should always match the major and minor of the dev version.
if [ ${dialtoneDevVersion%.*} != $peerDialtoneVersion ]; then
  read -r -p "The @dialpad/dialtone peer dependency version in package.json does not match the minor version of the one in devDependencies. It is recommended you fix this. Would you like to continue? (y/N): " response
    response=$(echo "$response" | awk '{print tolower($0)}')
  if [[ "$response" =~ (no|n| ) ]] || [[ -z $response ]]; then
      exit 0
  fi
fi

echo "Enter the name of the version segment you are incrementing (Ex/ major, minor, patch. 'npm version --help' in your cli for all possible args): "
read npmVersionArgument
branch=$(git branch --show-current)

echo "Committing new npm version and setting git tag"
npmcmd="npm version $npmVersionArgument"
echo "$npmcmd"
$npmcmd

version=$(git describe --tags --abbrev=0)

echo "Pushing new commit and tag to remote"
pushcmd="git push --atomic origin $branch $version"
echo "$pushcmd"
$pushcmd
