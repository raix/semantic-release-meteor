const fs = require('fs');
const path = require('path');
const {readJson, writeJson, pathExists} = require('fs-extra');

module.exports = async (version, logger) => {
  const pkg = await readJson('./package.json');

  await writeJson('./package.json', Object.assign(pkg, {version}));
  logger.log('Wrote version %s to package.json', version);

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
};
