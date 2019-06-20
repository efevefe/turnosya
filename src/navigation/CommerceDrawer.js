import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import {
    createAppContainer,
    createDrawerNavigator,
    SafeAreaView,
} from 'react-navigation';
import CommerceNavigation from './CommerceNavigation';
import DrawerListOptions from '../components/DrawerListOptions';

const CustomDrawerContentComponent = props => (
    <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ top: 'always', horizontal: 'never' }}
    >
        <View
            style={{
                height: 150,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text style={{ fontSize: 30 }}>TURNOSYA</Text>
        </View>
        <ScrollView>
            <DrawerListOptions />
        </ScrollView>
    </SafeAreaView>
);

const drawerOptions = {
    drawerType: 'slide',
    drawerWidth: 200,
    contentComponent: CustomDrawerContentComponent,
};

const commerceScreenDrawer = createDrawerNavigator(
    {
        home: CommerceNavigation,
    },
    drawerOptions
);

const CommerceDrawer = createAppContainer(commerceScreenDrawer);

export default CommerceDrawer;
