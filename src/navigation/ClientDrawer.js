import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import ClientNavigation from './ClientNavigation';
import ClientDrawerContent from './ClientDrawerContent';

const drawerNavigationOptions = {
    drawerType: 'slide',
    drawerWidth: 200,
    contentComponent: ClientDrawerContent,
};

const clientDrawer = createDrawerNavigator(
    {
        tabs: ClientNavigation,
    },
    drawerNavigationOptions
);

const ClientDrawer = createAppContainer(clientDrawer);

export default ClientDrawer;