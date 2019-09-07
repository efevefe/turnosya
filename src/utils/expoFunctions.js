import { Platform, Linking } from 'react-native';
import { Permissions, Location, IntentLauncherAndroid } from 'expo';

const LocationStatus = {
  permissionsAllowed: '1',
  permissionsDenied: '2',
  permissionsAllowedWithGPSOff: '3'
};

export const getPermissionLocationStatus = async () => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);

  return Platform.OS === 'ios'
    ? getLocationIos(status)
    : getLocationAndroid(status);
};

const getLocationAndroid = async status => {
  if (status !== 'denied') {
    return (await Location.hasServicesEnabledAsync())
      ? LocationStatus.permissionsAllowed
      : LocationStatus.permissionsAllowedWithGPSOff;
  }

  return LocationStatus.permissionsDenied;
};

const getLocationIos = async status => {
  if (status === 'denied') {
    return (await Location.hasServicesEnabledAsync())
      ? LocationStatus.permissionsDenied
      : LocationStatus.permissionsAllowedWithGPSOff;
  }

  return LocationStatus.permissionsAllowed;
};

export const getCurrentPosition = async () => {
  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });
};

export const openGPSAndroid = () => {
  IntentLauncherAndroid.startActivityAsync(
    IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
  ).then(async () => {
    if (await Location.hasServicesEnabledAsync()) {
      return LocationStatus.permissionsAllowed;
    }

    return LocationStatus.permissionsAllowedWithGPSOff;
  });
};

export const openSettingIos = () => {
  Linking.openURL('app-settings:');
};

// location = Es un objeto. Tiene datos como:
//     coords  {
//        accuracy --> ,
//        altitude --> ,
//        heading --> ,
//        latitude --> ,
//        longitude --> ,
//        sped -->
//      }
//    mocked -->
//    timestamp -->

// let moreData = await Location.reverseGeocodeAsync({
//   latitude: location.coords.latitude,
//   longitude: location.coords.longitude
// });
// moreData = Es un array. Agrega datos como:
//     city --> Córdoba,
//     street --> null,
//     region --> Córdoba,
//     postalCode --> null,
//     country --> Argentina,
//     isoCountryCode --> AR,
//     name --> C1662
