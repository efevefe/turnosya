import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import ClientNavigation from './ClientNavigation';
import ClientDrawerContent from './ClientDrawerContent';
import Welcome from '../components/client/Welcome';
import RegisterCommerce from '../components/client/RegisterCommerce';
import RegisterCommerceTwo from '../components/client/RegisterCommerceTwo';
import LocationMap from '../components/LocationMap';
import ClientSettings from '../components/client/ClientSettings';
import ChangeUserPassword from '../components/client/ChangeUserPassword';
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
      screen: LocationMap,
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
      navigationOptions: ({ navigation }) => ({
        title: 'Configuración',
        headerLeft: (
          <HeaderBackButton
            onPress={() => navigation.goBack(null)}
            tintColor="white"
            title='Back'
          />
        )
      })
    },
    changeUserPassword: {
      screen: ChangeUserPassword,
      navigationOptions: {
        title: 'Cambiar contraseña'
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
