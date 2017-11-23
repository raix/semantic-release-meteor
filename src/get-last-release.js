const { execSync } = require('child_process');
const semver = require('semver');

const meteorRegistry = 'atmosphere';

module.exports = async (options, logger) => {
  // Load package.js info
  const pkgInfo = JSON.parse(execSync('meteor show --show-all --ejson').toString('utf-8'));
  logger.log('Loaded package.js for package %s', pkgInfo.name);

  // Load released package info
  // xxx: use pkgInfo.name - "name" is from package.json (these might not be the same)
  const { versions = [] } = JSON.parse(execSync(`meteor show ${pkgInfo.name} --show-all --ejson`).toString('utf-8'));
  logger.log('Loaded metadata for package %s from %s', pkgInfo.name, meteorRegistry);

  // Create sorted array of sematic versions
  const versionList = versions
    .filter(({name}) => name === pkgInfo.name) // Ensure we are looking at same package
    .map(({ version }) => version) // Only use "version"
    .filter(version => !!semver.valid(version)) // Ensure version is semver
    .sort(semver.compare)
    .reverse(); // Sort versions

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
