import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import CommerceNavigation from './CommerceNavigation';
import CommerceDrawerContent from './CommerceDrawerContent';
import CommerceSettings from '../components/CommerceSettings';
import { MAIN_COLOR } from '../constants';

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

const CommerceSettingsStack = createStackNavigator(
    {
        settings: {
            screen: CommerceSettings,
            navigationOptions: {
                title: 'Configuración'
            }
        }
    },
    stackNavigationOptions
);

const drawerNavigationOptions = {
    drawerType: 'slide',
    drawerWidth: 230,
    contentComponent: CommerceDrawerContent,
};

const commerceDrawer = createDrawerNavigator(
    {
        tabs: CommerceNavigation,
        commerceSettings: CommerceSettingsStack
    },
    drawerNavigationOptions
);

const CommerceDrawer = createAppContainer(commerceDrawer);

export default CommerceDrawer;
