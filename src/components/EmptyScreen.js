import React, { Component } from 'react';
import { View, Text } from 'react-native';

class EmptyScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }} >
                <Text style={{ padding: 20 }} >
                    Estas pantallas se van a ir reemplazando a medida que vayamos agregando las que faltan
                </Text>
            </View>
        );
    }
}

export default EmptyScreen;