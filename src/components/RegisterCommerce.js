import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input } from './common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  onCommerceValueChange,
  onCommerceFormOpen,
  validateCuit,
  onCommerceRead
} from '../actions';
import { validateValueType, trimString } from '../utils';

class RegisterCommerce extends Component {
  state = { phoneError: '', nameError: '', emailError: '', cuitError: '' };

  componentDidMount() {
    this.props.onCommerceFormOpen();
  }

  onButtonPressHandler() {
    this.renderCuitErrorAsync();
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
  renderCuitErrorAsync = async () => {
    await this.props.validateCuit(this.props.cuit);
    this.renderCuitError();
  };
  renderCuitError = () => {
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

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <View style={{ padding: 15, alignSelf: 'stretch' }}>
          <CardSection>
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
              onBlur={this.renderCuitErrorAsync}
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
          </CardSection>

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
