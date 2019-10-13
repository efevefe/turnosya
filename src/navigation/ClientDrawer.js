import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import ClientNavigation from './ClientNavigation';
import ClientDrawerContent from './ClientDrawerContent';
import Welcome from '../components/Welcome';
import RegisterCommerce from '../components/RegisterCommerce';
import RegisterCommerceTwo from '../components/RegisterCommerceTwo';
import GeocodingScreen from '../components/GeocodingScreen';
import ClientSettings from '../components/ClientSettings';
import {
  stackNavigationOptions,
  drawerNavigationOptions
} from './NavigationOptions';

const CommerceRegisterStack = createStackNavigator(
  {
    welcome: {
      screen: Welcome,
      navigationOptions: {
        header: null
      }
    },
    commerceRegisterProfile: {
      screen: RegisterCommerce,
      navigationOptions: {
        title: 'Registrarse'
      }
    },
    commerceRegisterProfile1: {
      screen: RegisterCommerceTwo,
      navigationOptions: {
        title: 'Registrarse'
      }
    },
    commerceRegisterMap: {
      screen: GeocodingScreen,
      navigationOptions: {
        title: 'Localizar mi negocio'
      }
    }
  },
  stackNavigationOptions
);

const ClientSettingsStack = createStackNavigator(
  {
    settings: {
      screen: ClientSettings,
      navigationOptions: {
        title: 'Configuración'
      }
    }
  },
  stackNavigationOptions
);

const clientDrawer = createDrawerNavigator(
  {
    tabs: ClientNavigation,
    commerceRegister: CommerceRegisterStack,
    clientSettings: ClientSettingsStack
  },
  {
    ...drawerNavigationOptions,
    contentComponent: ClientDrawerContent
  }
);

const ClientDrawer = createAppContainer(clientDrawer);

export default ClientDrawer;
