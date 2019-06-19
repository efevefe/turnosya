import React from 'react';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import LoginForm from '../components/LoginForm';
import Ionicons from '@expo/vector-icons';
import { MAIN_COLOR } from '../constants';

/*
const drawerOptions = {
    drawerType: 'slide',
    drawerWidth: 200
};

const renderIcon = (icon, focused) => <Ionicons
    name={icon}
    style={{ marginRight: 15 }}
    size={30}
    color={focused ? MAIN_COLOR : 'black'}
/>

const commerceScreenDrawer = createDrawerNavigator({
    signOut: {
        screen: ServicesList,
        navigationOptions: ({ focused }) => ({
            drawerLabel: 'Cerrar Sesion',
            drawerIcon: renderIcon('log-out', focused)
        })
    }
},
    drawerOptions
);
*/

const drawerOptions = {
    drawerType: 'slide',
    drawerWidth: 200
};

const renderIcon = (icon, focused) => <Ionicons
    name={icon}
    style={{ marginRight: 15 }}
    size={30}
    color={focused ? MAIN_COLOR : 'black'}
/>

const commerceScreenDrawer = createDrawerNavigator({
    signOut: {
        screen: LoginForm
    }
},
    drawerOptions
);

const CommerceDrawer = createAppContainer(commerceScreenDrawer);

export default CommerceDrawer;