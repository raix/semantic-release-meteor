const fs = require('fs');
const path = require('path');
const {readJson, writeJson, pathExists} = require('fs-extra');
const execa = require('execa');
const debug = require('debug')('semantic-release:publish-meteor');
const {debugShell} = require('semantic-release/src/lib/debug');
const logger = require('semantic-release/src/lib/logger');

module.exports = async (pkg, {conf, registry, auth}, {version}) => {
  const pkgFile = await readJson('./package.json');

  if (await pathExists('./npm-shrinkwrap.json')) {
    const shrinkwrap = await readJson('./npm-shrinkwrap.json');
    shrinkwrap.version = version;
    await writeJson('./npm-shrinkwrap.json', shrinkwrap);
    logger.log('Wrote version %s to npm-shrinkwrap.json', version);
  }

  // Update the package.js file...
  const packageJs = path.join('.', 'package.js');
  if (fs.existsSync(packageJs)) {
    logger.log('Replace "0.0.0-semantic-release" tag with version %s', version);
    const existingFile = fs.readFileSync(packageJs, 'utf-8');
    fs.writeFileSync(packageJs, existingFile.replace(/0\.0\.0-semantic-release/g, version), 'utf-8');
    logger.log('Wrote version %s to package.js', version);
  } else {
    logger.log('Could not find "package.js"');
  }

  await writeJson('./package.json', Object.assign(pkgFile, {version}));
  logger.log('Wrote version %s to package.json', version);

  logger.log('Publishing version %s to atmosphere', version);
  const shell = await execa('meteor', [ 'publish' ]);
  console.log(shell.stdout);
  debugShell('Publishing on atmosphere', shell, debug);
};
