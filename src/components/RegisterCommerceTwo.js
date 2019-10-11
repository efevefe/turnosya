import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { CardSection, Button, Input, Picker } from './common';
import { Ionicons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  onCreateCommerce,
  onCommerceValueChange,
  onAreasRead,
  onProvincesRead,
  onLocationValueChange
} from '../actions';
import { Divider } from 'react-native-elements';
import { trimString } from '../utils';

class RegisterCommerceTwo extends Component {
  state = {
    pickerPlaceholder: { value: '', label: 'Seleccionar...' },
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
        city,
        province,
        area,
        street
      } = this.props;
      this.props.onCreateCommerce(
        {
          name,
          cuit,
          email,
          phone,
          description,
          address: street,
          city,
          province,
          area
        },
        this.props.navigation
      );
    }
  }

  onProvincePickerChange = async index => {
    var { value, label } =
      index > 0
        ? this.props.provincesList[index - 1]
        : this.state.pickerPlaceholder;

    await this.props.onCommerceValueChange({
      prop: 'province',
      value: { provinceId: value, name: label }
    });

    this.props.onLocationValueChange({
      prop: 'provinceName',
      value: index > 0 ? label : ''
    });

    this.renderProvinceError();
  };

  onAreaPickerChange = async index => {
    var { value, label } =
      index > 0
        ? this.props.areasList[index - 1]
        : this.state.pickerPlaceholder;

    await this.props.onCommerceValueChange({
      prop: 'area',
      value: { areaId: value, name: label }
    });

    this.renderAreaError();
  };

  renderAddressError = () => {
    const { address, onCommerceValueChange } = this.props;
    const value = trimString(address);
    onCommerceValueChange({ prop: 'address', value });

    if (value === '') {
      this.setState({ addressError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ addressError: '' });
      return true;
    }
  };

  renderCityError = () => {
    const { city, onCommerceValueChange } = this.props;
    const value = trimString(city);
    onCommerceValueChange({ prop: 'city', value });

    if (value === '') {
      this.setState({ cityError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ cityError: '' });
      return true;
    }
  };

  renderProvinceError = () => {
    if (this.props.province.provinceId === '') {
      this.setState({ provinceError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ provinceError: '' });
      return true;
    }
  };

  renderAreaError = () => {
    if (this.props.area.areaId === '') {
      this.setState({ areaError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ areaError: '' });
      return true;
    }
  };

  validateMinimumData = () => {
    // return (
    //   this.renderAreaError() &&
    //   this.renderProvinceError() &&
    //   this.renderCityError() &&
    //   this.renderAddressError()
    // );
    return (
      this.renderAreaError() &&
      this.renderProvinceError() &&
      this.renderCityError()
    );
  };

  onProvinceNameChangeOnMap = newProvinceName => {
    this.matchProvinceByValue(newProvinceName);
  };

  matchProvinceByValue = name => {
    const province = this.props.provincesList.find(
      province => province.label === name
    );

    if (province) {
      this.props.onCommerceValueChange({
        prop: 'province',
        value: { provinceId: province.value, name }
      });
    } else {
      this.props.onCommerceValueChange({
        prop: 'province',
        value: { provinceId: '', name: '' }
      });
    }
  };

  onMapPress = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'commerceRegisterMap',
      params: {
        callback: this.onProvinceNameChangeOnMap,
        title: 'Localizar mi Negocio'
      }
    });

    this.props.navigation.navigate(navigateAction);
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
          <Divider style={{ backgroundColor: 'grey', margin: 30 }} />

          <CardSection>
            <Input
              label="Calle"
              value={this.props.street}
              onChangeText={value =>
                this.props.onLocationValueChange({
                  prop: 'street',
                  value
                })
              }
              // errorMessage={this.state.addressError}
              // onFocus={() => this.setState({ addressError: '' })}
              // onBlur={this.renderAddressError}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Ciudad:"
              value={this.props.city}
              onChangeText={value =>
                this.props.onLocationValueChange({ prop: 'city', value })
              }
              errorMessage={this.state.cityError}
              onFocus={() => this.setState({ cityError: '' })}
              onBlur={this.renderCityError}
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
          <Ionicons
            name="md-locate"
            size={28}
            color="black"
            onPress={() => this.onMapPress()}
          />
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
    province,
    provincesList,
    area,
    areasList,
    loading,
    error
  } = state.commerceData;

  const { street, provinceName, city } = state.locationData;

  return {
    name,
    description,
    error,
    loading,
    cuit,
    email,
    phone,
    province,
    area,
    areasList,
    provincesList,
    street,
    city,
    provinceName
  };
};
export default connect(
  mapStateToProps,
  {
    onCommerceValueChange,
    onCreateCommerce,
    onAreasRead,
    onProvincesRead,
    onLocationValueChange
  }
)(RegisterCommerceTwo);
