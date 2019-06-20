import React, { Component } from 'react';
import { View } from 'react-native';

import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

import { DrawerItem } from './common';

class DrawerListOptions extends Component {
    leftIcon = name => (
        <Icon name={name} size={20} color="black" style={{ marginRight: 8 }} />
    );

    render() {
        return (
            <View>
                <DrawerItem
                    title="Cerrar Sesion"
                    icon={this.leftIcon('sign-out')}
                    onPress={() => firebase.auth().signOut()}
                />
            </View>
        );
    }
}

export default DrawerListOptions;
