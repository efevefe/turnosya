import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { CardSection, Input, Spinner } from '../components/common';
import { MAIN_COLOR } from '../constants';
import { onUserRead, onRegisterValueChange } from '../actions/RegisterActions';

class ClientProfile extends Component {
    state = { enabled: false };

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: navigation.getParam('rightIcon')
        }
    }

    componentWillMount() {
        this.props.onUserRead();
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

    renderFullName = () => {
        const { firstName, lastName } = this.props;

        if (firstName || lastName) {
            return `${firstName} ${lastName}`;
        } else {
            return `Sin Nombre`;
        }
    }

    render() {
        const { containerStyle, avatarContainerStyle, avatarStyle, infoContainerStyle } = styles;

        if (this.props.loading) {
            return <Spinner />;
        }

        return (
            <View style={containerStyle} >
                <View style={avatarContainerStyle} >
                    <Avatar
                        rounded
                        source={require('../../assets/avatar-placeholder.png')}
                        size='xlarge'
                        containerStyle={avatarStyle}
                    />
                    <Text h4>{this.renderFullName()}</Text>
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
                            value={this.props.firstName}
                            onChangeText={value => this.props.onRegisterValueChange({ prop: 'firstName', value })}
                            editable={this.state.enabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Apellido:'
                            value={this.props.lastName}
                            onChangeText={value => this.props.onRegisterValueChange({ prop: 'lastName', value })}
                            editable={this.state.enabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Telefono:'
                            value={this.props.phone}
                            onChangeText={value => this.props.onRegisterValueChange({ prop: 'phoneName', value })}
                            keyboardType='numeric'
                            editable={this.state.enabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='E-Mail:'
                            value={this.props.email}
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

const mapStateToProps = state => {
    const { firstName, lastName, phone, email, loading } = state.registerForm;

    return { firstName, lastName, phone, email, loading };
}

export default connect(mapStateToProps, { onUserRead, onRegisterValueChange })(ClientProfile);