import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input, IconButton } from './common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  onCommerceValueChange,
  onCommerceFormOpen,
  validateCuit
} from '../actions';
import { validateValueType, trimString } from '../utils';
import { Ionicons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';

class RegisterCommerce extends Component {
  state = {
    phoneError: '',
    nameError: '',
    emailError: '',
    cuitError: '',
    street: '',
    streetNumber: '',
    region: '',
    city: ''
  };

  componentDidMount() {
    this.props.onCommerceFormOpen();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cuitExists !== this.props.cuitExists) {
      this.renderCuitError();
    }
  }

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      this.props.navigation.navigate('commerceRegisterProfile1');
    }
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
    const { name, onCommerceValueChange } = this.props;

    onCommerceValueChange({ prop: 'name', value: trimString(name) });
    if (trimString(name) === '') {
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
    } else if (!validateValueType('phone', this.props.phone)) {
      this.setState({ phoneError: 'Debe ingresar un valor numérico' });
      return false;
    } else {
      this.setState({ phoneError: '' });
      return true;
    }
  };

  renderCuitError = () => {
    this.props.validateCuit(this.props.cuit);

    if (this.props.cuit === '') {
      this.setState({ cuitError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('cuit', this.props.cuit)) {
      this.setState({ cuitError: 'CUIT incorrecto' });
      return false;
    } else if (this.props.cuitExists) {
      this.setState({ cuitError: 'CUIT ya registrado' });
      return false;
    } else {
      this.setState({ cuitError: '' });
      return true;
    }
  };

  onMapPress = () => {
    const { street, streetNumber, region, city } = this.state;
    const navigateAction = NavigationActions.navigate({
      routeName: 'commerceRegisterMap',
      params: {
        address: { street, streetNumber, region, city },
        title: 'Localizar mi Negocio'
      }
    });

    this.props.navigation.navigate(navigateAction);
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <View style={{ padding: 15, alignSelf: 'stretch' }}>
          {/* <CardSection>
            <Input
              label="Razón Social"
              placeholder="Razón Social"
              value={this.props.name}
              errorMessage={this.state.nameError}
              onChangeText={value =>
                this.props.onCommerceValueChange({
                  prop: 'name',
                  value
                })
              }
              onFocus={() => this.setState({ nameError: '' })}
              onBlur={this.renderNameError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Cuit"
              placeholder="Cuit"
              keyboardType="numeric"
              errorMessage={this.state.cuitError}
              onChangeText={value =>
                this.props.onCommerceValueChange({
                  prop: 'cuit',
                  value
                })
              }
              onFocus={() => this.setState({ cuitError: '' })}
              onBlur={this.renderCuitError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Teléfono"
              placeholder="Teléfono"
              keyboardType="phone-pad"
              errorMessage={this.state.phoneError}
              onChangeText={value =>
                this.props.onCommerceValueChange({
                  prop: 'phone',
                  value
                })
              }
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.renderPhoneError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="E-mail"
              placeholder="E-mail"
              value={this.props.email}
              autoCapitalize="none"
              keyboardType="email-address"
              errorMessage={this.state.emailError}
              onChangeText={value =>
                this.props.onCommerceValueChange({
                  prop: 'email',
                  value: value.trim()
                })
              }
              onFocus={() => this.setState({ emailError: '' })}
              onBlur={this.renderEmailError}
            />
          </CardSection> 

          <CardSection>
            <Input
              label="Descripción"
              placeholder="Descripción"
              value={this.props.description}
              multiline={true}
              maxLength={250}
              maxHeight={180}
              onChangeText={value =>
                this.props.onCommerceValueChange({
                  prop: 'description',
                  value
                })
              }
              onBlur={() =>
                this.props.onCommerceValueChange({
                  prop: 'description',
                  value: trimString(this.props.description)
                })
              }
            />
          </CardSection> */}

          <CardSection>
            <Input
              label="calle"
              placeholder="calle"
              value={this.state.street}
              onChangeText={street => this.setState({ street })}
            />
          </CardSection>
          <CardSection>
            <Input
              label="numero"
              placeholder="numero"
              value={this.state.streetNumber}
              onChangeText={streetNumber => this.setState({ streetNumber })}
            />
          </CardSection>
          <CardSection>
            <Input
              label="barrio"
              placeholder="barrio"
              value={this.state.region}
              onChangeText={region => this.setState({ region })}
            />
          </CardSection>
          <CardSection>
            <Input
              label="ciudad"
              placeholder="ciudad"
              value={this.state.city}
              onChangeText={city => this.setState({ city })}
            />
          </CardSection>
          <Ionicons
            name="md-locate"
            size={28}
            color="black"
            onPress={() => this.onMapPress()}
          />
          <CardSection>
            <Button
              title="Continuar"
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
    cuit,
    email,
    phone,
    error,
    cuitExists
  } = state.commerceData;

  return {
    name,
    description,
    error,
    cuit,
    email,
    phone,
    cuitExists
  };
};

export default connect(
  mapStateToProps,
  { onCommerceValueChange, onCommerceFormOpen, validateCuit }
)(RegisterCommerce);
