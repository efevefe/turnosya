import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { trimString } from '../../utils';
import { MAIN_COLOR } from '../../constants';
import { CardSection, Button, Input, Picker } from '../common';
import { onCommerceCreate, onCommerceValueChange, onProvincesIdRead, onLocationValueChange } from '../../actions';

class RegisterCommerceTwo extends Component {
  state = {
    pickerPlaceholder: { value: '', label: 'Seleccionar...' },
    addressError: '',
    cityError: '',
    provinceError: ''
  };

  componentDidMount() {
    this.props.onProvincesIdRead();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.province.provinceId !== this.props.province.provinceId) {
      this.renderProvinceError();
      this.renderAddressError();
      this.renderCityError();
    }
  }

  onRegisterButtonPress() {
    if (this.validateMinimumData()) {
      const { name, cuit, email, phone, description, area, address, city, province, latitude, longitude } = this.props;
      this.props.onCommerceCreate(
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

  onProvincePickerChange = index => {
    const { value, label } = index > 0 ? this.props.provincesList[index - 1] : this.state.pickerPlaceholder;

    this.props.onCommerceValueChange({
      province: { provinceId: value, name: label }
    });

    this.props.onLocationValueChange({ provinceName: index > 0 ? label : '' });
  };

  renderAddressError = () => {
    const address = trimString(this.props.address);

    if (address === '') {
      this.setState({ addressError: 'Dato requerido' });
      return false;
    } else {
      this.props.onCommerceValueChange({ address });
      this.setState({ addressError: '' });
      return true;
    }
  };

  renderCityError = () => {
    const city = trimString(this.props.city);

    if (city === '') {
      this.setState({ cityError: 'Dato requerido' });
      return false;
    } else {
      this.props.onCommerceValueChange({ city });
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
    return this.renderAddressError() && this.renderCityError() && this.renderProvinceError();
  };

  onProvinceNameChangeOnMap = name => {
    const province = this.props.provincesList.find(province => province.label.toLowerCase() === name.toLowerCase());

    if (province) {
      this.props.onCommerceValueChange({
        province: { provinceId: province.value, name }
      });
    } else {
      this.props.onCommerceValueChange({
        province: { provinceId: '', name: '' }
      });
    }
  };

  onMapPress = () => {
    this.props.navigation.navigate('commerceRegisterMap', {
      onProvinceNameChange: this.onProvinceNameChangeOnMap
    });
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
              onChangeText={address => this.props.onLocationValueChange({ address })}
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
              onChangeText={city => this.props.onLocationValueChange({ city })}
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
              onValueChange={(value, index) => this.onProvincePickerChange(index)}
              errorMessage={this.state.provinceError}
            />
          </CardSection>

          <CardSection>
            <Button
              title="Buscar en el mapa"
              titleStyle={{ color: MAIN_COLOR }}
              buttonStyle={{ borderColor: MAIN_COLOR }}
              color="white"
              type="outline"
              iconRight={true}
              onPress={() => this.onMapPress()}
              icon={<Ionicons style={{ marginLeft: 10 }} name="md-pin" size={28} color={MAIN_COLOR} />}
            />
          </CardSection>

          <CardSection style={{ paddingTop: 0 }}>
            <Button title="Registrar" loading={this.props.loading} onPress={this.onRegisterButtonPress.bind(this)} />
          </CardSection>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { name, cuit, email, phone, description, province, area, loading, error } = state.commerceData;

  const { provincesList } = state.provinceData;

  const { address, provinceName, city, latitude, longitude } = state.locationData;

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
    provincesList,
    address,
    city,
    provinceName,
    latitude,
    longitude
  };
};
export default connect(mapStateToProps, {
  onCommerceValueChange,
  onCommerceCreate,
  onProvincesIdRead,
  onLocationValueChange
})(RegisterCommerceTwo);
