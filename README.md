# semantic-release-meteor

[![Build Status](https://travis-ci.org/raix/semantic-release-meteor.svg?branch=master)](https://travis-ci.org/raix/semantic-release-meteor)
[![Greenkeeper badge](https://badges.greenkeeper.io/raix/semantic-release-meteor.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Semantic release plugin for Meteor packages

NOTE: This package is still experimental - `semantic-release` multi plugins are not released

*Note: Semantic release cannot do the initial release of the package*

#### Setup package.js

Modify your `package.js`:
```js
Package.describe({
  version: '0.0.0-semantic-release',
  // ...
```
*All `0.0.0-semantic-release` strings are replaced on publish*

#### Add config to package.json

```json
{
  "scripts": {
    "semantic-release": "semantic-release"
  },
  "release": {
    "verifyConditions": ["semantic-release-meteor", "@semantic-release/github"],
    "getLastRelease": "semantic-release-meteor",
    "publish": ["semantic-release-meteor", "@semantic-release/github"]
  },
  "devDependencies": {
    "semantic-release": "^10.0.1"
  }
}
```

#### Travis example

Environment variables:
```bash
  METEOR_TOKEN=""
  # Optionally set METEOR_KEY
```
*Create token using `$ npx meteor-ci create-token`*

Example:
```yaml
# .travis.yml
language: node_js
cache:
  directories:
    - ~/.npm
node_js:
  - '8'
install:
  - npm install
  - curl https://install.meteor.com/ | sh
  - export PATH=$HOME/.meteor:$PATH
stages:
  - test
  - name: publish
    if: brance = master
script:
  - npm test
jobs:
  include:
    - stage: publish
      language: node_js
      node_js: '8'
    - script: npm run semantic-release
branches:
  except:
    - /^v\d+\.\d+\.\d+$/
```
