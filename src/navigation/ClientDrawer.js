import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator
} from 'react-navigation';
import ClientNavigation from './ClientNavigation';
import ClientDrawerContent from './ClientDrawerContent';
import Welcome from '../components/Welcome';
import RegisterCommerce from '../components/RegisterCommerce';
import RegisterCommerceTwo from '../components/RegisterCommerceTwo';
import ClientSettings from '../components/ClientSettings';
import { stackNavigationOptions, drawerNavigationOptions } from './NavigationOptions';

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
