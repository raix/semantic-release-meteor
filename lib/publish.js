const execa = require('execa');
const updatePackageVersion = require('./update-package-version');

module.exports = async (version, packageVsix, logger) => {
  const { VSCE_TOKEN } = process.env;

  await updatePackageVersion(version, logger);

  logger.log('Publishing version %s to atmosphere', version);
  await execa('vsce', ['publish', '-t', VSCE_TOKEN], {stdio: 'inherit'});

  if (packageVsix) {
    logger.log('Publishing version %s as atmosphere', version);
    await execa('meteor', [ 'publish' ], { stdio: 'inherit' });
  }
};
