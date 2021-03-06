import { Platform, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const LocationStatus = {
  permissionsAllowed: 'permissionsAllowed',
  permissionsDenied: 'permissionsDenied',
  permissionsAllowedWithGPSOff: 'permissionsAllowedWithGPSOff'
};

export const getPermissionLocationStatus = async () => {
  try {
    const { status } = await getPermissionLocation();

    return Platform.OS === 'ios' ? getLocationIos(status) : getLocationAndroid(status);
  } catch (error) {
    console.error(error);
  }
};

const getLocationAndroid = async status => {
  try {
    if (status === 'denied' || status === 'undetermined') {
      return LocationStatus.permissionsDenied;
    }

    return (await Location.hasServicesEnabledAsync())
      ? LocationStatus.permissionsAllowed
      : LocationStatus.permissionsAllowedWithGPSOff;
  } catch (error) {
    console.error(error);
  }
};

const getLocationIos = async status => {
  try {
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
  } catch (error) {
    console.error(error);
  }
};

export const getCurrentPosition = async () => {
  try {
    let result = await Location.getLastKnownPositionAsync();
    result = result ? result : await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    return result;
  } catch (error) {
    if (error.message.includes('Location services are disabled')) {
      return { coords: { latitude: null, longitude: null } };
    }
    console.error(error);
  }
};

export const getAddressFromLatAndLong = async ({ latitude, longitude }) => {
  try {
    return await Location.reverseGeocodeAsync({ latitude, longitude });
  } catch (error) {
    console.error(error);
  }
};

export const getLatitudeAndLongitudeFromString = async string => {
  try {
    return await Location.geocodeAsync(string);
  } catch (error) {
    console.error(error);
  }
};

export const openGPSAndroid = () => {
  try {
    IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS).then(async () => {
      if (await Location.hasServicesEnabledAsync()) {
        return LocationStatus.permissionsAllowed;
      }

      return LocationStatus.permissionsAllowedWithGPSOff;
    });
  } catch (error) {
    console.error(error);
  }
};

export const openSettingIos = () => {
  Linking.openURL('app-settings:');
};

const getPermissionLocation = async () => {
  try {
    return await Permissions.getAsync(Permissions.LOCATION);
  } catch (error) {
    console.error(error);
  }
};

export const askPermissionLocation = async () => {
  try {
    return await Permissions.askAsync(Permissions.LOCATION);
  } catch (error) {
    console.error(error);
  }
};
