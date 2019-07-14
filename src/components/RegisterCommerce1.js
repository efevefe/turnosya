import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input } from './common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { onCreateProfile, onComemrceValueChange } from '../actions';
import { validateValueType } from '../utils';

class RegisterCommerce1 extends Component {
    state = { phoneError: '', nameError: '', emailError: '', cuitError: '' };

    onButtonPressHandler() {
            this.props.onCreateProfile(
                {
                    name: this.props.name,
                    description: this.props.description,
                    avatar: this.props.avatar,
                    cuit: this.props.cuit,
                    address: this.props.address,
                    email: this.props.email,
                    phone: this.props.phone,
                    sector: this.props.sector,
                    province: this.props.province,
                    address: this.props.address,
                    city: this.props.city
                },

                this.props.navigation
            );
        
    }
    validateMinimumData = () => {
        return (
            this.renderNameError() &&
            this.renderCuitError() &&
            this.renderPhoneError() &&
            this.renderEmailError()
        );
    };
    renderEmailError = () => {
        if (this.props.email == '') {
            this.setState({ emailError: 'Dato requerido' });
            return false;
        } else if (!validateValueType('email', this.props.email)) {
            this.setState({ emailError: 'Formato de email incorrecto' });
            return false;
        } else {
            this.setState({ emailError: '' });
            return true;
        }
    };
    renderNameError = () => {
        if (this.props.name === '') {
            this.setState({ nameError: 'Dato requerido' });
            return false;
        } else {
            this.setState({ nameError: '' });
            return true;
        }
    };
    renderPhoneError = () => {
        if (this.props.phone === '') {
            this.setState({ phoneError: 'Dato requerido' });
            return false;
        } else if (!validateValueType('int', this.props.phone)) {
            this.setState({ phoneError: 'Debe ingresar un valor numerico' });
            return false;
        } else {
            this.setState({ phoneError: '' });
            return true;
        }
    };
    renderCuitError = () => {
        if (this.props.cuit === '') {
            this.setState({ cuitError: 'Dato requerido' });
            return false;
        } else if (!validateValueType('int', this.props.cuit)) {
            this.setState({ cuitError: 'Debe ingresar un valor numerico' });
            return false;
        } else {
            this.setState({ cuitError: '' });
            return true;
        }
    };
    render() {
        return (
            <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
                <View style={{ padding: 15, alignSelf: 'stretch' }}>
                    <CardSection>
                        <Input
                            label="Dirección"
                            placeholder="9 de Julio 456"
                            onChangeText={value =>
                                this.props.onComemrceValueChange({
                                    prop: 'address',
                                    value
                                })
                            }
                        />
                    </CardSection>
                    <CardSection>
                        <Button
                            title="Registrar"
                            loading={this.props.loading}
                            onPress={this.onButtonPressHandler.bind(this)}
                        />
                    </CardSection>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const mapStateToProps = state => {
    const {
        name,
        description,
        avatar,
        cuit,
        email,
        phone,
        city,
        province,
        sector,
        address,
        error,
        loading
    } = state.commerceProfile;

    return {
        name,
        avatar,
        description,
        error,
        loading,
        cuit,
        email,
        phone,
        address,
        city,
        province,
        sector
    };
};
export default connect(
    mapStateToProps,
    { onComemrceValueChange, onCreateProfile }
)(RegisterCommerce1);
