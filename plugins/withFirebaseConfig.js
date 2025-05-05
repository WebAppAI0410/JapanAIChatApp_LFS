const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withFirebaseConfig(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // Add Firebase initialization metadata
    if (!mainApplication.$) {
      mainApplication.$ = {};
    }
    
    // Ensure Firebase initializes properly with Hermes
    mainApplication.$['android:name'] = '.MainApplication';
    
    return config;
  });
};
