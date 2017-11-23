const execa = require('execa');
const updatePackageVersion = require('./update-package-version');

module.exports = async (version, logger) => {
  await updatePackageVersion(version, logger);

  logger.log('Publishing version %s to atmosphere', version);
  await execa('meteor', [ 'publish' ], { stdio: 'inherit' });
};
