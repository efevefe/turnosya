import React from 'react';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import CommerceNavigation from './CommerceNavigation';
import CommerceDrawerContent from './CommerceDrawerContent';

const drawerOptions = {
    drawerType: 'slide',
    drawerWidth: 200,
    contentComponent: CommerceDrawerContent,
};

const commerceScreenDrawer = createDrawerNavigator(
    {
        home: CommerceNavigation,
    },
    drawerOptions
);

const CommerceDrawer = createAppContainer(commerceScreenDrawer);

export default CommerceDrawer;
