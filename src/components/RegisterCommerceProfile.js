import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input } from './common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { onCreateProfile, onComemrceValueChange } from '../actions';
import { validateValueType } from '../utils';

class RegisterCommerceProfile extends Component {
  state = { phoneError: '', nameError: '', emailError: '', cuitError: '' };

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      this.props.onCreateProfile(
        {
          name: this.props.name,
          description: this.props.description,
          avatar: this.props.avatar,
          cuit: this.props.cuit,
          location: this.props.location,
          email: this.props.email,
          phone: this.props.phone
        },

        this.props.navigation
      );
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
              label="Razon Social"
              placeholder="Razon Social"
              errorMessage={this.state.nameError}
              onChangeText={value =>
                this.props.onComemrceValueChange({
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
                this.props.onComemrceValueChange({
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
              label="Telefono"
              placeholder="Telefono"
              keyboardType="numeric"
              errorMessage={this.state.phoneError}
              onChangeText={value =>
                this.props.onComemrceValueChange({
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
              errorMessage={this.state.emailError}
              onChangeText={value =>
                this.props.onComemrceValueChange({
                  prop: 'email',
                  value
                })
              }
              onFocus={() => this.setState({ emailError: '' })}
              onBlur={this.renderEmailError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Dirección"
              placeholder="Dirección"
              onChangeText={value =>
                this.props.onComemrceValueChange({
                  prop: 'location',
                  value
                })
              }
            />
          </CardSection>
          <CardSection>
            <Input
              label="Avatar"
              placeholder="Avatar"
              onChangeText={value =>
                this.props.onComemrceValueChange({
                  prop: 'avatar',
                  value
                })
              }
            />
          </CardSection>
          <CardSection>
            <Input
              label="Descripción"
              placeholder="Descripción"
              multiline={true}
              maxLength={250}
              maxHeight={180}
              onChangeText={value =>
                this.props.onComemrceValueChange({
                  prop: 'description',
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
    location,
    email,
    phone,
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
    location,
    email,
    phone
  };
};
export default connect(
  mapStateToProps,
  { onComemrceValueChange, onCreateProfile }
)(RegisterCommerceProfile);
