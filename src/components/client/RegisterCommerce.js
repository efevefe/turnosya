import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { onCommerceValueChange, onCommerceFormOpen, onAreasReadForPicker, onCuitValidate } from '../../actions';
import { validateValueType, trimString } from '../../utils';
import { CardSection, Button, Input, Picker } from '../common';

class RegisterCommerce extends Component {
  state = {
    pickerPlaceholder: { value: '', label: 'Seleccionar...' },
    phoneError: '',
    nameError: '',
    emailError: '',
    cuitError: '',
    areaError: ''
  };

  componentDidMount() {
    this.props.onCommerceFormOpen();
    this.props.onAreasReadForPicker();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cuitExists !== this.props.cuitExists) {
      this.renderCuitError();
    }

    if (prevProps.area.areaId !== this.props.area.areaId) {
      this.renderAreaError();
    }
  }

  onContinueButtonPress() {
    if (this.validateMinimumData()) {
      this.props.navigation.navigate('commerceRegisterProfile1');
    }
  }

  onAreaPickerChange = index => {
    const { value, label } = index > 0 ? this.props.areasList[index - 1] : this.state.pickerPlaceholder;

    this.props.onCommerceValueChange({ area: { areaId: value, name: label } });
  };

  validateMinimumData = () => {
    return (
      this.renderNameError() &&
      this.renderCuitError() &&
      this.renderPhoneError() &&
      this.renderEmailError() &&
      this.renderAreaError()
    );
  };

  renderEmailError = () => {
    if (!this.props.email) {
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
    const name = trimString(this.props.name);

    this.props.onCommerceValueChange({ name });
    if (!name) {
      this.setState({ nameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ nameError: '' });
      return true;
    }
  };

  renderPhoneError = () => {
    if (!this.props.phone) {
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
    this.props.onCuitValidate(this.props.cuit);

    if (!this.props.cuit) {
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

  renderAreaError = () => {
    if (!this.props.area.areaId) {
      this.setState({ areaError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ areaError: '' });
      return true;
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <View style={{ padding: 15, alignSelf: 'stretch' }}>
          <CardSection>
            <Input
              label="Razón Social:"
              placeholder="Razón Social"
              autoCapitalize="words"
              value={this.props.name}
              errorMessage={this.state.nameError}
              onChangeText={name => this.props.onCommerceValueChange({ name })}
              onFocus={() => this.setState({ nameError: '' })}
              onBlur={this.renderNameError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="CUIT/CUIL:"
              placeholder="CUIT/CUIL"
              keyboardType="numeric"
              errorMessage={this.state.cuitError}
              value={this.props.cuit}
              onChangeText={cuit => this.props.onCommerceValueChange({ cuit: cuit.trim() })}
              onFocus={() => this.setState({ cuitError: '' })}
              onBlur={this.renderCuitError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Teléfono:"
              placeholder="Teléfono"
              keyboardType="phone-pad"
              value={this.props.phone}
              errorMessage={this.state.phoneError}
              onChangeText={phone => this.props.onCommerceValueChange({ phone: phone.trim() })}
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.renderPhoneError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="E-mail:"
              placeholder="E-mail"
              value={this.props.email}
              autoCapitalize="none"
              keyboardType="email-address"
              errorMessage={this.state.emailError}
              onChangeText={email => this.props.onCommerceValueChange({ email: email.trim() })}
              onFocus={() => this.setState({ emailError: '' })}
              onBlur={this.renderEmailError}
            />
          </CardSection>

          <CardSection>
            <Picker
              title="Rubro:"
              placeholder={this.state.pickerPlaceholder}
              items={this.props.areasList}
              value={this.props.area.areaId}
              onValueChange={(value, index) => this.onAreaPickerChange(index)}
              errorMessage={this.state.areaError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Descripción:"
              placeholder="Descripción"
              value={this.props.description}
              multiline={true}
              maxLength={250}
              maxHeight={180}
              onChangeText={description => this.props.onCommerceValueChange({ description })}
              onBlur={() =>
                this.props.onCommerceValueChange({
                  description: trimString(this.props.description)
                })
              }
            />
          </CardSection>

          <CardSection>
            <Button title="Continuar" onPress={this.onContinueButtonPress.bind(this)} />
          </CardSection>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { name, description, cuit, email, phone, area, areasList, error, cuitExists } = state.commerceData;

  return {
    name,
    description,
    cuit,
    email,
    phone,
    area,
    areasList,
    error,
    cuitExists
  };
};

export default connect(mapStateToProps, {
  onCommerceValueChange,
  onCommerceFormOpen,
  onAreasReadForPicker,
  onCuitValidate
})(RegisterCommerce);
