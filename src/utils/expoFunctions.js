import { Platform, Linking } from 'react-native';
import { IntentLauncherAndroid } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const LocationStatus = {
  permissionsAllowed: 'permissionsAllowed',
  permissionsDenied: 'permissionsDenied',
  permissionsAllowedWithGPSOff: 'permissionsAllowedWithGPSOff'
};

export const getPermissionLocationStatus = async () => {
  const { status } = await getPermissionLocation();
  // const { status } = await Permissions.askAsync(Permissions.LOCATION);

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
  } else if (status === 'undetermined') {
    //es cuando le pregunta por primera vez en la historia
    Permissions.askAsync(Permissions.LOCATION);
    return LocationStatus.permissionsDenied;
  }

  return LocationStatus.permissionsAllowed;
};

export const getCurrentPosition = async () => {
  // ver bien el tema de cuando es por primera vez en la vida. En android da medio raro
  return await Location.getCurrentPositionAsync({});
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

const getPermissionLocation = async () => {
  return await Permissions.getAsync(Permissions.LOCATION);
};

export const askPermissionLocation = async () => {
  return await Permissions.askAsync(Permissions.LOCATION);
};
