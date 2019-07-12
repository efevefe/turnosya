import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator
} from 'react-navigation';
import ClientNavigation from './ClientNavigation';
import ClientDrawerContent from './ClientDrawerContent';
import Welcome from '../components/Welcome';
import RegisterCommerceProfile from '../components/RegisterCommerceProfile';
import { MAIN_COLOR } from '../constants';

const drawerNavigationOptions = {
  drawerType: 'slide',
  drawerWidth: 200,
  contentComponent: ClientDrawerContent
};

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

const navigationOptions = { header: null };

const CommerceRegisterStack = createStackNavigator(
  {
    welcome: {
      screen: Welcome,
      navigationOptions
    },
    commerceRegisterProfile: {
      screen: RegisterCommerceProfile,
      title: 'Registrar'
    }
  },
  stackNavigationOptions
);

const clientDrawer = createDrawerNavigator(
  {
    tabs: ClientNavigation,
    commerceRegister: CommerceRegisterStack
  },
  drawerNavigationOptions
);

const ClientDrawer = createAppContainer(clientDrawer);

export default ClientDrawer;
