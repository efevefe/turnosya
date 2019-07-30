import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator
} from 'react-navigation';
import ClientNavigation from './ClientNavigation';
import ClientDrawerContent from './ClientDrawerContent';
import Welcome from '../components/Welcome';
import RegisterCommerce from '../components/RegisterCommerce';
import { MAIN_COLOR } from '../constants';
import RegisterCommerceTwo from '../components/RegisterCommerceTwo';
import ClientSettings from '../components/ClientSettings';

const stackNavigationOptions = {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: MAIN_COLOR,
      height: 50
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold'
    }
  }
};

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

const drawerNavigationOptions = {
  drawerType: 'slide',
  drawerWidth: 200,
  contentComponent: ClientDrawerContent
};

const clientDrawer = createDrawerNavigator(
  {
    tabs: ClientNavigation,
    commerceRegister: CommerceRegisterStack,
    clientSettings: ClientSettingsStack
  },
  drawerNavigationOptions
);

const ClientDrawer = createAppContainer(clientDrawer);

export default ClientDrawer;
