import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import CommerceNavigation from './CommerceNavigation';
import CommerceDrawerContent from './CommerceDrawerContent';

const drawerNavigationOptions = {
    drawerType: 'slide',
    drawerWidth: 200,
    contentComponent: CommerceDrawerContent,
};

const commerceDrawer = createDrawerNavigator(
    {
        tabs: CommerceNavigation,
    },
    drawerNavigationOptions
);

const CommerceDrawer = createAppContainer(commerceDrawer);

export default CommerceDrawer;
