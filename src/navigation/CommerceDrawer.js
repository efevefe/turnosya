import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import CommerceNavigation from './CommerceNavigation';
import CommerceDrawerContent from './CommerceDrawerContent';
import CommerceSettings from '../components/CommerceSettings';
import { stackNavigationOptions, drawerNavigationOptions } from './NavigationOptions';

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

const commerceDrawer = createDrawerNavigator(
    {
        tabs: CommerceNavigation,
        commerceSettings: CommerceSettingsStack
    },
    {
      ...drawerNavigationOptions,
      contentComponent: CommerceDrawerContent
    }
);

const CommerceDrawer = createAppContainer(commerceDrawer);

export default CommerceDrawer;
