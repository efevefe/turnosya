import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import ClientDrawer from './ClientDrawer';
import CommerceDrawer from './CommerceDrawer';

const mainNavigation = createSwitchNavigator(
  {
    client: ClientDrawer,
    commerce: CommerceDrawer
  },
  {
    initialRouteName: 'client',
  }
);

const MainNavigation = createAppContainer(mainNavigation);

export default MainNavigation;