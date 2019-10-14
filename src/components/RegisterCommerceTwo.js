import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { trimString } from '../utils';
import { MAIN_COLOR } from '../constants';
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
        area,
        address,
        city,
        province,
        latitude,
        longitude
      } = this.props;
      this.props.onCreateCommerce(
        {
          name,
          cuit,
          email,
          phone,
          description,
          area,
          address,
          city,
          province,
          latitude,
          longitude
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

    if (value === '') {
      this.setState({ addressError: 'Dato requerido' });
      return false;
    } else {
      onCommerceValueChange({ prop: 'address', value });
      this.setState({ addressError: '' });
      return true;
    }
  };

  renderCityError = () => {
    const { city, onCommerceValueChange } = this.props;
    const value = trimString(city);

    if (value === '') {
      this.setState({ cityError: 'Dato requerido' });
      return false;
    } else {
      onCommerceValueChange({ prop: 'city', value });
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
      province => province.label.toLowerCase() === name.toLowerCase()
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
              placeholder="San Martín 30"
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
              placeholder="Córdoba"
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

          <CardSection>
            <Button
              title="Buscar en el mapa"
              titleStyle={{ color: MAIN_COLOR }}
              buttonStyle={{
                borderRadius: 30,
                borderColor: MAIN_COLOR
              }}
              color="white"
              type="outline"
              iconRight={true}
              onPress={() => this.onMapPress()}
              icon={
                <Ionicons
                  style={{ marginLeft: 10 }}
                  name="md-pin"
                  size={28}
                  color={MAIN_COLOR}
                />
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

  const {
    address,
    provinceName,
    city,
    latitude,
    longitude
  } = state.locationData;

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
    provinceName,
    latitude,
    longitude
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
