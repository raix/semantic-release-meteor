const meteor = require('meteor-ci');
const SemanticReleaseError = require('@semantic-release/error');

module.exports = async ({publishConfig, name}, logger) => {
  logger.log('Verify authentication for Meteor');
  const {METEOR_TOKEN, METEOR_KEY = ''} = process.env;

  if (METEOR_TOKEN) {
    try {
      meteor.login(METEOR_TOKEN, METEOR_KEY);
      logger.log('Wrote METEOR_TOKEN to ~/.meteorsession.');
    } catch (err) {
      throw new SemanticReleaseError(err.message, 'ELOGINMETEOR');
    }
  } else {
    throw new SemanticReleaseError('No meteor token specified.', 'ENOMETEORTOKEN');
  }
};
