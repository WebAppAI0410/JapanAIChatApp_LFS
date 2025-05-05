const { withAndroidManifest, withAppDelegate, createRunOncePlugin } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to configure Firebase for Android and iOS
 * This plugin ensures proper setup of Firebase in both platforms
 */
const withFirebaseConfig = (config) => {
  config = withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    if (!mainApplication['meta-data']) {
      mainApplication['meta-data'] = [];
    }

    const firebaseInitProvider = mainApplication['meta-data'].find(
      (item) => item.$['android:name'] === 'firebase_performance_logcat_enabled'
    );

    if (!firebaseInitProvider) {
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'firebase_performance_logcat_enabled',
          'android:value': 'true',
        },
      });
    }

    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    return config;
  });

  config = withAppDelegate(config, (config) => {
    if (config.modResults.language === 'objc') {
      const didFinishLaunchingWithOptions = config.modResults.contents.match(
        /(didFinishLaunchingWithOptions(?:.|\n)*?\{(?:.|\n)*?(?:return YES|return \[super application))/
      );
      
      if (didFinishLaunchingWithOptions) {
        const newContents = config.modResults.contents.replace(
          didFinishLaunchingWithOptions[0],
          `${didFinishLaunchingWithOptions[0]}\n  [FIRApp configure];`
        );
        config.modResults.contents = newContents;
      }
    } else {
      const firebaseImport = `import FirebaseCore`;
      const firebaseConfigure = `FirebaseApp.configure()`;
      
      if (!config.modResults.contents.includes(firebaseImport)) {
        const importMatches = config.modResults.contents.match(/import.*?$/m);
        if (importMatches) {
          const newContents = config.modResults.contents.replace(
            importMatches[0],
            `${importMatches[0]}\n${firebaseImport}`
          );
          config.modResults.contents = newContents;
        }
      }
      
      if (!config.modResults.contents.includes(firebaseConfigure)) {
        const methodInvocationLineMatcher = 
          /(?:self\.moduleName\s*=\s*"([^"]*)")|(?:reactNativeFactory\?\.\s*startReactNative)/;
        
        const matches = config.modResults.contents.match(methodInvocationLineMatcher);
        if (matches) {
          const newContents = config.modResults.contents.replace(
            matches[0],
            `${matches[0]}\n    ${firebaseConfigure}`
          );
          config.modResults.contents = newContents;
        }
      }
    }
    
    return config;
  });

  return config;
};

module.exports = createRunOncePlugin(
  withFirebaseConfig,
  'withFirebaseConfig',
  '1.0.0'
);
