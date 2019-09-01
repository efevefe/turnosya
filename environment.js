import { Constants } from 'expo';
import { Platform } from 'react-native';

const localhost = Platform.OS === 'ios' ? 'localhost:8080' : '10.0.2.2:8080';

const keys = {
  apiUrl: localhost,
  //Facebook
  facebookApiKey: '308666633372616',
  facebookPermissions: ['public_profile', 'email'],
  //Google
  iosClientId:
    '425889819253-ojktt4qkb3809old6sfverggu8g0ofh2.apps.googleusercontent.com',
  androidClientId:
    '425889819253-sb80h20d5etvpisi036ugvb6g7o6jkkl.apps.googleusercontent.com',
  googleScopes: ['profile', 'email']
};

const ENV = {
  dev: keys,
  staging: keys,
  prod: keys
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  if (__DEV__ || !env) {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'prod') {
    return ENV.prod;
  }
};

export default getEnvVars;
