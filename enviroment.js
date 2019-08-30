/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import { Constants } from 'expo';
import { Platform } from 'react-native';

const localhost = Platform.OS === 'ios' ? 'localhost:8080' : '10.0.2.2:8080';
//chanel: default

const ENV = {
  dev: {
    apiUrl: localhost,
    // Facebook
    facebookApiKey: '308666633372616',
    facebookPermissions: ['public_profile', 'email'],
    // Google
    iosClientId:
      '425889819253-ojktt4qkb3809old6sfverggu8g0ofh2.apps.googleusercontent.com',
    androidClientId:
      '425889819253-sb80h20d5etvpisi036ugvb6g7o6jkkl.apps.googleusercontent.com',
    googleScopes: ['profile', 'email']
  },
  staging: {},
  prod: {}
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  // con la parte comentada es como deberian ir el codigo

  // if (__DEV__) {
  return ENV.dev;
  // } else if (env === 'staging') {
  //   console.log('stagin');
  //   return ENV.staging;
  // } else if (env === 'prod') {
  //   console.log('prod');
  //   return ENV.prod;
  // }
};

export default getEnvVars;
