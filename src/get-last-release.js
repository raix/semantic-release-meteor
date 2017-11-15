const execa = require('execa');
const semver = require('semver');

const flags = ['--show-all', '--ejson'];
const meteorRegistry = 'atmosphere';

module.exports = async ({publishConfig, name}, logger) => {
  // Load package.js info
  const pkgInfo = JSON.parse(await execa('meteor show', flags));
  logger.log('Loaded package.js for package %s', pkgInfo.name);

  // Load released package info
  // xxx: use pkgInfo.name - "name" is from package.json (these might not be the same)
  const { versions = [] } = JSON.parse(await execa('meteor show', [pkgInfo.name, ...flags]));
  logger.log('Loaded metadata for package %s from %s', pkgInfo.name, meteorRegistry);

  // Create sorted array of sematic versions
  const versionList = versions
    .filter(({name}) => name === pkgInfo.name) // Ensure we are looking at same package
    .map(({ version }) => version) // Only use "version"
    .filter(version => !!semver.valid(version)) // Ensure version is semver
    .sort(semver.compare); // Sort versions

  const [ version ] = versionList; // Extract latest version

  if (!version) {
    logger.log('No version found of package %s found on %s', pkgInfo.name, meteorRegistry);
    return {};
  }

  logger.log('Found version %s of package %s', version, pkgInfo.name);
  return {
    // gitHead: '', // xxx: info not available, let's fallback
    version
  };
};
