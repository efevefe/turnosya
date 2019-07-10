import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { CardSection, Input } from '../components/common';
import { MAIN_COLOR } from '../constants';

class ClientProfile extends Component {
    state = { enabled: false };

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.getParam('rightIcon')
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ rightIcon: this.renderEditButton() });
    }

    renderEditButton = () => {
        return (
            <Ionicons
                name='md-create'
                size={28}
                color='white'
                style={{ marginRight: 15 }}
                onPress={this.onEditPress}
            />
        );
    }

    renderSaveButton = () => {
        return (
            <Ionicons
                name='md-checkmark'
                size={28}
                color='white'
                style={{ marginRight: 15 }}
                onPress={this.onSavePress}
            />
        );
    }

    onEditPress = () => {
        this.setState({ enabled: true });
        this.props.navigation.setParams({ rightIcon: this.renderSaveButton() });
    }

    onSavePress = () => {
        this.setState({ enabled: false });
        //aca deberia ir una llamada a una action de editar
        this.props.navigation.setParams({ rightIcon: this.renderEditButton() });
    }

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
                <View style={infoContainerStyle}>
                    <CardSection>
                        <Input
                            label='Nombre:'
                            value='Nicolas'
                            editable={this.state.enabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Apellido:'
                            value='Lazzos'
                            editable={this.state.enabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Telefono:'
                            value='0351-155-8259'
                            editable={this.state.enabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='E-Mail:'
                            value='nicolaslazzos14@gmail.com'
                            editable={false}
                        />
                    </CardSection>
                </View>
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
        alignSelf: 'stretch',
        padding: 10
    }
});

export default ClientProfile;