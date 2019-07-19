import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input, Picker } from './common';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  onCreateCommerce,
  onCommerceValueChange,
  onAreasRead,
  onProvincesRead
} from '../actions';

class RegisterCommerceTwo extends Component {
  state = {
    areaLoaded: false,
    provincesLoaded: false,
    pickerPlaceholder: { value: null, label: 'Seleccionar...' },
    addressError: '',
    cityError: '',
    provinceError: '',
    areaError: ''
  };

  componentWillMount() {
    this.props.onProvincesRead();
    this.props.onAreasRead();
  }

  onButtonPressHandler() {
    if (this.validateMinimumData()) {
      var {
        name,
        cuit,
        email,
        phone,
        description,
        address,
        city,
        province,
        area
      } = this.props;
      this.props.onCreateCommerce(
        {
          name,
          cuit,
          email,
          phone,
          description,
          address,
          city,
          province,
          area
        },
        this.props.navigation
      );
    }
  }

  onProvincePickerChange = async index => {
    if (index > 0) {
      var { value, label } = this.props.provincesList[index - 1];
    } else {
      var { value, label } = this.state.pickerPlaceholder;
    }

    await this.props.onCommerceValueChange({
      prop: 'province',
      value: { provinceId: value, name: label }
    });
    if (!provincesLoaded) {
      return this.setState({ provincesLoaded: true });
    }
    this.renderProvinceError();
  };

  onAreaPickerChange = async index => {
    if (index > 0) {
      var { value, label } = this.props.areasList[index - 1];
    } else {
      var { value, label } = this.state.pickerPlaceholder;
    }

    await this.props.onCommerceValueChange({
      prop: 'area',
      value: { areaId: value, name: label }
    });
    if (!areaLoaded) {
      return this.setState({ areaLoaded: true });
    }
    this.renderAreaError();
  };

  renderAddressError = () => {
    if (this.props.address === '') {
      this.setState({ addressError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ addressError: '' });
      return true;
    }
  };

  renderCityError = () => {
    if (this.props.city === '') {
      this.setState({ cityError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ cityError: '' });
      return true;
    }
  };

  renderProvinceError = () => {
    if (this.props.province.provinceId === null) {
      this.setState({ provinceError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ provinceError: '' });
      return true;
    }
  };

  renderAreaError = () => {
    if (this.props.area.areaId === null) {
      this.setState({ areaError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ areaError: '' });
      return true;
    }
  };

  validateMinimumData = () => {
    return (
      this.renderAreaError() &&
      this.renderProvinceError() &&
      this.renderCityError() &&
      this.renderAddressError()
    );
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <View style={{ padding: 15, alignSelf: 'stretch' }}>
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
            <Picker
              title="Provincia:"
              placeholder={this.state.pickerPlaceholder}
              items={this.props.provincesList}
              value={this.props.province.provinceId}
              onValueChange={(value, index) =>
                this.onProvincePickerChange(index)
              }
              errorMessage={this.state.provinceError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Ciudad:"
              value={this.props.city}
              onChangeText={value =>
                this.props.onCommerceValueChange({ prop: 'city', value })
              }
              errorMessage={this.state.cityError}
              onFocus={() => this.setState({ cityError: '' })}
              onBlur={this.renderCityError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Dirección"
              onChangeText={value =>
                this.props.onCommerceValueChange({
                  prop: 'address',
                  value
                })
              }
              errorMessage={this.state.addressError}
              onFocus={() => this.setState({ addressError: '' })}
              onBlur={this.renderAddressError}
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
    cuit,
    email,
    phone,
    description,
    address,
    city,
    province,
    provincesList,
    area,
    areasList,
    loading,
    error
  } = state.commerceProfile;

  return {
    name,
    description,
    error,
    loading,
    cuit,
    email,
    phone,
    address,
    city,
    province,
    area,
    areasList,
    provincesList
  };
};
export default connect(
  mapStateToProps,
  { onCommerceValueChange, onCreateCommerce, onAreasRead, onProvincesRead }
)(RegisterCommerceTwo);
