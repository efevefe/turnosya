import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Divider } from 'react-native-elements';
import { MAIN_COLOR } from '../constants';

class ClientProfile extends Component {
    render() {
        const { containerStyle, avatarContainerStyle, avatarStyle, infoContainerStyle } = styles;

        return (
            <View style={containerStyle} >
                <View style={avatarContainerStyle} >
                    <Avatar
                        rounded
                        source={require('../../assets/avatar-placeholder.png')}
                        size='xlarge'
                        containerStyle={avatarStyle}
                    />
                    <Text h4>Nicolas Lazzos</Text>
                    <Text>Unquillo, Cordoba</Text>
                </View>
                <Divider
                    style={{
                        backgroundColor: 'grey',
                        margin: 5,
                        marginLeft: 10,
                        marginRight: 10
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        alignSelf: 'stretch'
    },
    avatarContainerStyle: {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 20
    },
    avatarStyle: {
        borderWidth: 4,
        borderColor: MAIN_COLOR,
        margin: 10
    },
    infoContainerStyle: {
        alignSelf: 'stretch'
    }
});

export default ClientProfile;