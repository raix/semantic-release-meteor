const {callbackify} = require('util');
const verifyMeteor = require('./lib/verify');
const publishMeteor = require('./lib/publish');
const getLastReleaseMeteor = require('./lib/get-last-release');

let verified;

async function verifyConditions (pluginConfig, {pkg, logger}) {
  await verifyMeteor(pkg, logger);
  verified = true;
}

async function getLastRelease (pluginConfig, {pkg, logger}) {
  if (!verified) {
    await verifyMeteor(pkg, logger);
    verified = true;
  }
  return getLastReleaseMeteor(pkg, logger);
}

async function publish (pluginConfig, {pkg, nextRelease: {version}, logger}) {
  if (!verified) {
    await verifyMeteor(pkg, logger);
    verified = true;
  }
  await publishMeteor(version, logger);
}

module.exports = {
  verifyConditions: callbackify(verifyConditions),
  getLastRelease: callbackify(getLastRelease),
  publish: callbackify(publish)
};
