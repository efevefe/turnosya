import React, { Component } from 'react';
import { View, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { Avatar, Text, Divider, Icon, Image } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../../constants';
import {
  onCommerceRead,
  onCommerceUpdate,
  onCommerceValueChange,
  onProvincesIdRead,
  onAreasReadForPicker,
  onLocationValueChange
} from '../../actions';
import { CardSection, Input, Spinner, Menu, MenuItem, Picker, IconButton, Button } from '../common';
import { imageToBlob, validateValueType, trimString } from '../../utils';
import { HeaderBackButton } from 'react-navigation-stack';

const imageSizeWidth = Math.round(Dimensions.get('window').width);
const imageSizeHeight = Math.round(Dimensions.get('window').height * 0.2);
const avatarSize = Math.round(Dimensions.get('window').width * 0.4);

class CommerceProfile extends Component {
  state = {
    pictureOptionsVisible: false,
    profilePictureEdit: false,
    headerPictureEdit: false,
    newProfilePicture: false,
    newHeaderPicture: false,
    stateBeforeChanges: null,
    pickerPlaceholder: { value: '', label: 'Seleccionar...' },
    nameError: '',
    cuitError: '',
    emailError: '',
    phoneError: '',
    addressError: '',
    cityError: '',
    provinceError: '',
    areaError: ''
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title'),
      headerRight: navigation.getParam('rightIcon'),
      headerLeft: navigation.getParam('leftIcon')
    };
  };

  componentDidMount() {
    this.props.onLocationValueChange({
      address: this.props.locationData.address,
      city: this.props.locationData.city,
      provinceName: this.props.locationData.provinceName,
      latitude: this.props.locationData.latitude,
      longitude: this.props.locationData.longitude,
      country: this.props.locationData.country
    });

    this.props.navigation.setParams({
      leftIcon: this.renderCancelButton(),
      rightIcon: this.renderSaveButton()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.province.provinceId !== this.props.province.provinceId) {
      this.renderProvinceError();
    }

    if (prevProps.area.areaId !== this.props.area.areaId) {
      this.renderAreaError();
    }
  }

  onRefresh = () => {
    this.props.onCommerceRead();
  };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  renderCancelButton = () => {
    return <IconButton icon="md-close" onPress={this.onCancelPress} />;
  };

  renderBackButton = () => {
    return <HeaderBackButton onPress={() => this.props.navigation.goBack(null)} tintColor="white" title="Back" />;
  };

  onEditPress = () => {
    this.props.onProvincesIdRead();
    this.props.onAreasReadForPicker();

    const { name, cuit, email, phone, description, province, area, profilePicture, headerPicture } = this.props;

    const { address, city, latitude, longitude } = this.props.locationData;

    this.setState({
      stateBeforeChanges: {
        name,
        cuit,
        email,
        phone,
        description,
        address,
        city,
        province,
        area,
        profilePicture,
        headerPicture,
        latitude,
        longitude
      }
    });

    // this.props.onLocationChange(location); ///what? de donde sale esta variable 'location' //lo veo en la proxima user
  };

  onRefresh = () => {
    this.props.onCommerceRead(this.props.commerceId);
  };

  onSavePress = async () => {
    try {
      if (this.validateMinimumData()) {
        var {
          name,
          cuit,
          email,
          phone,
          description,
          province,
          area,
          profilePicture,
          headerPicture,
          commerceId
        } = this.props;

        const { address, city, latitude, longitude } = this.props.locationData;
        const { newProfilePicture, newHeaderPicture } = this.state;

        if (newProfilePicture) var profilePicture = await imageToBlob(profilePicture);

        if (newHeaderPicture) var headerPicture = await imageToBlob(headerPicture);

        this.props.onCommerceUpdate(
          {
            name,
            cuit,
            email,
            phone,
            description,
            address,
            city,
            province,
            area,
            profilePicture,
            headerPicture,
            commerceId,
            latitude,
            longitude
          },
          this.props.navigation
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  onCancelPress = () => {
    const { stateBeforeChanges } = this.state;
    const locationProps = ['address', 'city', 'latitude', 'longitude'];
    const location = {};

    for (prop in stateBeforeChanges) {
      if (locationProps.includes(prop)) {
        location = { ...location, prop: stateBeforeChanges[prop] };
      }
    }

    this.props.onLocationValueChange(location);
    this.props.onCommerceValueChange(stateBeforeChanges);
    this.cleanErrors();
    this.props.navigation.goBack(null);
  };

  onEditPicturePress = () => {
    this.setState({
      pictureOptionsVisible: false,
      profilePictureEdit: false,
      headerPictureEdit: false
    });
  };

  onEditProfilePicturePress = () => {
    this.setState({ profilePictureEdit: true, pictureOptionsVisible: true });
  };

  onEditHeaderPicturePress = () => {
    this.setState({ headerPictureEdit: true, pictureOptionsVisible: true });
  };

  onChoosePicturePress = async () => {
    this.setState({ pictureOptionsVisible: false });

    try {
      if (Constants.platform.ios) {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }

      const options = {
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: this.state.profilePictureEdit ? [1, 1] : [10, 5]
      };

      const response = await ImagePicker.launchImageLibraryAsync(options);

      if (!response.cancelled) {
        if (this.state.profilePictureEdit) {
          this.props.onCommerceValueChange({ profilePicture: response.uri });
          this.setState({ newProfilePicture: true });
        } else {
          this.props.onCommerceValueChange({ headerPicture: response.uri });

          this.setState({ newHeaderPicture: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.onEditPicturePress();
    }
  };

  onTakePicturePress = async () => {
    this.setState({ pictureOptionsVisible: false });

    try {
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      await Permissions.askAsync(Permissions.CAMERA);

      const options = {
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: this.state.profilePictureEdit ? [1, 1] : [10, 5]
      };

      const response = await ImagePicker.launchCameraAsync(options);

      if (!response.cancelled) {
        if (this.state.profilePictureEdit) {
          this.props.onCommerceValueChange({ profilePicture: response.uri });
          this.setState({ newProfilePicture: true });
        } else {
          this.props.onCommerceValueChange({ headerPicture: response.uri });
          this.setState({ newHeaderPicture: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.onEditPicturePress();
    }
  };

  onDeletePicturePress = () => {
    if (this.state.profilePictureEdit) {
      this.props.onCommerceValueChange({ profilePicture: '' });
      this.setState({ newProfilePicture: false });
    } else {
      this.props.onCommerceValueChange({ headerPicture: '' });
      this.setState({ newHeaderPicture: false });
    }

    this.onEditPicturePress();
  };

  renderName = () => {
    const { name } = this.props;

    if (name)
      return (
        <Text h4 style={{ textAlign: 'center', marginHorizontal: 10 }}>
          {name}
        </Text>
      );
  };

  renderLocation = () => {
    const { address, city } = this.props.locationData;
    const { name } = this.props.province;

    if (address || city || name) {
      const { locationContainerStyle } = styles;

      return (
        <View style={locationContainerStyle}>
          <Icon name="md-pin" type="ionicon" size={16} />
          <Text style={{ textAlign: 'center', paddingLeft: 5 }}>{`${address}, ${city}, ${name}`}</Text>
        </View>
      );
    }
  };

  onProvincePickerChange = value => {
    if (value) {
      var { value, label } = this.props.provincesList.find(province => province.value == value);
      this.props.onCommerceValueChange({
        province: { provinceId: value, name: label }
      });
      this.props.onLocationValueChange({ provinceName: label });
    }
  };

  onAreaPickerChange = value => {
    if (value) {
      var { value, label } = this.props.areasList.find(area => area.value == value);
      this.props.onCommerceValueChange({
        area: { areaId: value, name: label }
      });
    }
  };

  renderNameError = () => {
    const name = trimString(this.props.name);

    this.props.onCommerceValueChange({ name });
    if (name === '') {
      this.setState({ nameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ nameError: '' });
      return true;
    }
  };

  renderCuitError = () => {
    if (this.props.cuit === '') {
      this.setState({ cuitError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('cuit', this.props.cuit)) {
      this.setState({ cuitError: 'CUIT incorrecto' });
      return false;
    } else {
      this.setState({ cuitError: '' });
      return true;
    }
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

  renderPhoneError = () => {
    if (this.props.phone == '') {
      this.setState({ phoneError: 'Dato requerido' });
      return false;
    } else if (!validateValueType('phone', this.props.phone)) {
      this.setState({ phoneError: 'Formato de teléfono incorrecto' });
      return false;
    } else {
      this.setState({ phoneError: '' });
      return true;
    }
  };

  renderAddressError = () => {
    const address = trimString(this.props.locationData.address);

    this.props.onLocationValueChange({ address });
    if (address === '') {
      this.setState({ addressError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ addressError: '' });
      return true;
    }
  };

  renderCityError = () => {
    const city = trimString(this.props.locationData.city);

    this.props.onLocationValueChange({ city });
    if (city === '') {
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
    this.props.navigation.navigate('changeCommerceLocationMap', {
      onProvinceNameChange: this.onProvinceNameChangeOnMap
    });
  };

  cleanErrors = () => {
    this.setState({
      nameError: '',
      cuitError: '',
      emailError: '',
      phoneError: '',
      addressError: '',
      cityError: '',
      provinceError: ''
    });
  };

  validateMinimumData = () => {
    return (
      this.renderNameError() &&
      this.renderCuitError() &&
      this.renderEmailError() &&
      this.renderPhoneError() &&
      this.renderAddressError() &&
      this.renderCityError() &&
      this.renderProvinceError() &&
      this.renderAreaError()
    );
  };

  render() {
    const {
      containerStyle,
      headerContainerStyle,
      headerPictureStyle,
      avatarContainerStyle,
      avatarStyle,
      textContainerStyle,
      infoContainerStyle
    } = styles;

    if (this.props.loading) return <Spinner />;

    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={60}
        style={containerStyle}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.onRefresh}
            colors={[MAIN_COLOR]}
            tintColor={MAIN_COLOR}
          />
        }
      >
        <View style={headerContainerStyle}>
          <Image
            style={headerPictureStyle}
            source={this.props.headerPicture ? { uri: this.props.headerPicture } : null}
          >
            <Icon
              name="md-camera"
              color={MAIN_COLOR}
              type="ionicon"
              size={20}
              reverse
              onPress={this.onEditHeaderPicturePress}
            />
          </Image>
          <View style={avatarContainerStyle}>
            <Avatar
              rounded
              source={this.props.profilePicture ? { uri: this.props.profilePicture } : null}
              size={avatarSize}
              icon={{ name: 'store' }}
              containerStyle={avatarStyle}
            />
            <Icon
              name="md-camera"
              color={MAIN_COLOR}
              type="ionicon"
              size={20}
              reverse
              containerStyle={{ position: 'absolute' }}
              onPress={this.onEditProfilePicturePress}
            />
          </View>
        </View>
        <View style={textContainerStyle}>
          {this.renderName()}
          {this.renderLocation()}
        </View>
        <Divider
          style={{
            backgroundColor: 'grey',
            margin: 5,
            marginLeft: 10,
            marginRight: 10
          }}
        />
        <View style={infoContainerStyle}>
          <CardSection>
            <Input
              label="Razón Social:"
              value={this.props.name}
              autoCapitalize="words"
              onChangeText={name => this.props.onCommerceValueChange({ name })}
              errorMessage={this.state.nameError}
              onFocus={() => this.setState({ nameError: '' })}
              onBlur={this.renderNameError}
              maxLength={50}
            />
          </CardSection>
          <CardSection>
            <Input
              label="CUIT:"
              value={this.props.cuit}
              onChangeText={cuit => this.props.onCommerceValueChange({ cuit })}
              keyboardType="numeric"
              errorMessage={this.state.cuitError}
              onFocus={() => this.setState({ cuitError: '' })}
              onBlur={this.renderCuitError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Teléfono:"
              value={this.props.phone}
              onChangeText={phone => this.props.onCommerceValueChange({ phone })}
              keyboardType="numeric"
              errorMessage={this.state.phoneError}
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.renderPhoneError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="E-Mail:"
              value={this.props.email}
              autoCapitalize="none"
              onChangeText={email => this.props.onCommerceValueChange({ email })}
              keyboardType="email-address"
              errorMessage={this.state.emailError}
              onFocus={() => this.setState({ emailError: '' })}
              onBlur={this.renderEmailError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Descripción:"
              value={this.props.description}
              onChangeText={description => this.props.onCommerceValueChange({ description })}
              multiline={true}
              maxLength={250}
              maxHeight={180}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Dirección:"
              value={this.props.locationData.address}
              onChangeText={address => this.props.onLocationValueChange({ address })}
              errorMessage={this.state.addressError}
              onFocus={() => this.setState({ addressError: '' })}
              onBlur={this.renderAddressError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Ciudad:"
              value={this.props.locationData.city}
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
              onValueChange={value => this.onProvincePickerChange(value)}
              errorMessage={this.state.provinceError}
            />
          </CardSection>
          <CardSection>
            <Button
              title="Buscar en el Mapa"
              titleStyle={{ color: MAIN_COLOR }}
              buttonStyle={{ borderColor: MAIN_COLOR }}
              color="white"
              type="outline"
              iconRight={true}
              onPress={() => this.onMapPress()}
              icon={<Ionicons style={{ marginLeft: 10 }} name="md-pin" size={22} color={MAIN_COLOR} />}
            />
          </CardSection>
          <CardSection>
            <Picker
              title="Rubro:"
              placeholder={this.state.pickerPlaceholder}
              items={this.props.areasList}
              value={this.props.area.areaId}
              onValueChange={value => this.onAreaPickerChange(value)}
              errorMessage={this.state.areaError}
            />
          </CardSection>
        </View>

        <Menu
          title={this.state.profilePictureEdit ? 'Foto de Perfil' : 'Foto de Portada'}
          onBackdropPress={this.onEditPicturePress}
          isVisible={this.state.pictureOptionsVisible}
        >
          <MenuItem title="Elegir de la galería" icon="md-photos" onPress={this.onChoosePicturePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="Tomar Foto" icon="md-camera" onPress={this.onTakePicturePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="Eliminar" icon="md-trash" onPress={this.onDeletePicturePress} />
        </Menu>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignSelf: 'stretch'
  },
  headerContainerStyle: {
    alignSelf: 'stretch',
    alignItems: 'center',
    height: imageSizeHeight * 1.5,
    marginBottom: 15
  },
  headerPictureStyle: {
    height: imageSizeHeight,
    width: imageSizeWidth,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  avatarContainerStyle: {
    position: 'absolute',
    paddingTop: imageSizeHeight * 0.5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  avatarStyle: {
    margin: 5,
    marginTop: 0,
    borderWidth: 4,
    borderColor: MAIN_COLOR
  },
  textContainerStyle: {
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  locationContainerStyle: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
    marginLeft: 15,
    marginRight: 15
  },
  infoContainerStyle: {
    alignSelf: 'stretch',
    padding: 10,
    paddingBottom: 22
  }
});

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
    area,
    areasList,
    profilePicture,
    headerPicture,
    commerceId,
    loading,
    refreshing,
    latitude,
    longitude
  } = state.commerceData;
  const { provincesList } = state.provinceData;

  let locationData = { ...state.locationData };

  if (!locationData.country) {
    locationData = {
      ...state.locationData,
      address,
      city,
      provinceName: province.name,
      latitude,
      longitude,
      country: 'Argentina'
    };
  }

  return {
    name,
    cuit,
    email,
    phone,
    description,
    province,
    provincesList,
    area,
    areasList,
    profilePicture,
    headerPicture,
    commerceId,
    loading,
    refreshing,
    locationData
  };
};

export default connect(mapStateToProps, {
  onCommerceRead,
  onCommerceUpdate,
  onCommerceValueChange,
  onProvincesIdRead,
  onAreasReadForPicker,
  onLocationValueChange
})(CommerceProfile);
