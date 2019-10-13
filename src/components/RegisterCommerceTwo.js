import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { trimString } from '../utils';
import { CardSection, Button, Input, Picker } from './common';
import {
  onCreateCommerce,
  onCommerceValueChange,
  onProvincesRead,
  onLocationValueChange
} from '../actions';

class RegisterCommerceTwo extends Component {
  state = {
    pickerPlaceholder: { value: '', label: 'Seleccionar...' },
    addressError: '',
    cityError: '',
    provinceError: ''
  };

  componentWillMount() {
    this.props.onProvincesRead();
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
        address
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

  validateMinimumData = () => {
    // return (
    //   this.renderProvinceError() &&
    //   this.renderCityError() &&
    //   this.renderAddressError()
    // );
    return (
      this.renderAddressError() &&
      this.renderCityError() &&
      this.renderProvinceError()
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
      params: { callback: this.onProvinceNameChangeOnMap }
    });

    this.props.navigation.navigate(navigateAction);
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
        <View style={{ padding: 15, alignSelf: 'stretch' }}>
          <CardSection>
            <Input
              label="Calle"
              value={this.props.address}
              onChangeText={value =>
                this.props.onLocationValueChange({
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

  const { address, provinceName, city } = state.locationData;

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
    address,
    city,
    provinceName
  };
};
export default connect(
  mapStateToProps,
  {
    onCommerceValueChange,
    onCreateCommerce,
    onProvincesRead,
    onLocationValueChange
  }
)(RegisterCommerceTwo);
