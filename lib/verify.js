const verifyPkg = require('./verify-pkg');
const setMeteorAuth = require('./set-meteor-auth');
const execa = require('execa');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async (pkg, logger) => {
  verifyPkg(pkg);
  await setMeteorAuth(pkg, logger);
  try {
    await execa('meteor', ['whoami']);
  } catch (err) {
    throw new SemanticReleaseError('Invalid meteor token.', 'EINVALIDMETEORTOKEN');
  }
};
