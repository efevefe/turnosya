import React from 'react';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../constants';
import { Ionicons } from '@expo/vector-icons';

export const stackNavigationOptions = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: MAIN_COLOR,
            height: NAVIGATION_HEIGHT
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

export const drawerNavigationOptions = {
    drawerType: 'slide',
    drawerWidth: 230
};

export const tabNavigationOptions = {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;

            if (routeName === 'courts') {
                iconName = `md-football`;
            } else if (routeName === 'services') {
                iconName = `md-cut`;
            } else if (routeName === 'calendar') {
                iconName = `md-calendar`;
            } else if (routeName === 'profile') {
                iconName = `md-person`;
            } else if (routeName === 'search') {
                iconName = `md-search`;
            } else if (routeName === 'favorites') {
                iconName = `md-heart`;
            }

            return (
                <Ionicons
                    name={iconName}
                    size={30}
                    color={tintColor}
                    style={{ opacity: focused ? 1 : 0.5 }}
                />
            );
        }
    }),
    tabBarOptions: {
        showLabel: false,
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        style: {
            backgroundColor: MAIN_COLOR,
            height: NAVIGATION_HEIGHT
        }
    }
};