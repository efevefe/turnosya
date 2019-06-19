import React from 'react';
import { ScrollView } from 'react-native';
import { createAppContainer, createDrawerNavigator, SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerItem } from '../components/common';
import CommerceNavigation from './CommerceNavigation';

const leftIcon = (name) => (
    <Icon name={name} size={20} color='black' style={{ marginRight: 8 }} />
);

const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItem {...props} title='Cerrar Sesion' icon={leftIcon('sign-out')} onPress={() => firebase.auth().signOut()} />
        </SafeAreaView>
    </ScrollView>
);

const drawerOptions = {
    drawerType: 'slide',
    drawerWidth: 200,
    contentComponent: CustomDrawerContentComponent
};

const commerceScreenDrawer = createDrawerNavigator({
    home: CommerceNavigation
},
    drawerOptions
);

const CommerceDrawer = createAppContainer(commerceScreenDrawer);

export default CommerceDrawer;