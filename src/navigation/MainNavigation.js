import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import ClientDrawer from './ClientDrawer';
import { SportsDrawer, HairdressersDrawer } from './CommerceDrawer';
import GuestNavigation from './GuestNavigation';
import LoadingScreen from '../components/LoadingScreen';

const mainNavigation = createSwitchNavigator(
  {
    loading: LoadingScreen,
    login: GuestNavigation,
    client: ClientDrawer,
    sports: SportsDrawer,
    hairdressers: HairdressersDrawer
  },
  {
    initialRouteName: 'loading'
  }
);

const MainNavigation = createAppContainer(mainNavigation);

export default MainNavigation;
