import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CardSection } from './common';
import { MAIN_COLOR } from '../constants';

class RegisterForm extends Component {
    state = { email: '', password: '', repeatPassword: '' }

    renderIcon(name) {
        return (
            <Icon
                name={name}
                color='#bbb'
                size={20}
                style={{ marginRight: 5 }}
            />
        );
    }

    labelRender() {
        const { email } = this.state;

        email ? this.setState({ email: '' }) : this.setState({ email: 'E-Mail:' });
    }

    render() {
        const { inputContainerStyle, inputStyle, buttonStyle } = styles;

        return (
            <View style={{ padding: 15, alignSelf: 'stretch' }}>
                <CardSection>
                    <Input
                        placeholder='Nombre'
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={inputStyle}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        placeholder='Apellido'
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={inputStyle}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        placeholder='Telefono'
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={inputStyle}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        placeholder='E-Mail'
                        autoCapitalize='none'
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={inputStyle}
                        keyboardType='email-address'
                    />
                </CardSection>
                <CardSection>
                    <Input
                        placeholder='Contraseña'
                        autoCapitalize='none'
                        secureTextEntry
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={inputStyle}
                    />
                </CardSection>
                <CardSection>
                    <Input
                        placeholder='Repetir Contraseña'
                        autoCapitalize='none'
                        secureTextEntry
                        inputContainerStyle={inputContainerStyle}
                        inputStyle={inputStyle}
                    />
                </CardSection>
                <CardSection>
                    <Button
                        title="Continuar"
                        buttonStyle={buttonStyle}
                    />
                </CardSection>
            </View>
        );
    }
}

const styles = {
    inputContainerStyle: {
        borderBottomWidth: 1.5,
        borderColor: MAIN_COLOR,
    },
    inputStyle: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
    },
    buttonStyle: {
        borderRadius: 10,
        padding: 10,
        margin: 10,
        backgroundColor: MAIN_COLOR,
    }
}

export default RegisterForm;