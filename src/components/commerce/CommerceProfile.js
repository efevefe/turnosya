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
  onAreasRead,
  onLocationValueChange,
  onLocationChange
} from '../../actions';
import {
  CardSection,
  Input,
  Spinner,
  Menu,
  MenuItem,
  Picker,
  IconButton,
  Button
} from '../common';
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
    const {
      address,
      city,
      provinceName,
      latitude,
      longitude,
      country
    } = this.props.locationData;

    const location = {
      address,
      city,
      provinceName,
      latitude,
      longitude,
      country
    };

    this.props.onLocationChange(location);
    this.props.navigation.setParams({
      leftIcon: this.renderCancelButton(),
      rightIcon: this.renderSaveButton()
    });
  }

  onRefresh = () => {
    this.props.onCommerceRead();
  };

  // renderEditButton = () => {
  //   return <IconButton icon="md-create" onPress={this.onEditPress} />;
  // };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  renderCancelButton = () => {
    return <IconButton icon="md-close" onPress={this.onCancelPress} />;
  };

  renderBackButton = () => {
    return (
      <HeaderBackButton
        onPress={() => this.props.navigation.goBack(null)}
        tintColor="white"
      />
    );
  };

  onEditPress = () => {
    this.props.onProvincesIdRead();
    this.props.onAreasRead();

    const {
      name,
      cuit,
      email,
      phone,
      description,
      province,
      area,
      profilePicture,
      headerPicture
    } = this.props;

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

    this.props.onLocationChange({ location });
  };

  onRefresh = () => {
    this.props.onCommerceRead();
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

        if (newProfilePicture)
          var profilePicture = await imageToBlob(profilePicture);

        if (newHeaderPicture)
          var headerPicture = await imageToBlob(headerPicture);

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
    } catch (e) {
      console.error(e);
    }
  };

  onCancelPress = () => {
    const { stateBeforeChanges } = this.state;

    for (prop in stateBeforeChanges) {
      if (prop === 'address' || prop === 'city') {
        this.props.onCommerceValueChange({
          prop,
          value: stateBeforeChanges[prop]
        });
        this.props.onLocationValueChange({
          prop,
          value: stateBeforeChanges[prop]
        });
      }

      if (prop === 'latitude' || prop === 'longitude') {
        this.props.onLocationValueChange({
          prop,
          value: stateBeforeChanges[prop]
        });
      }

      this.props.onCommerceValueChange({
        prop,
        value: stateBeforeChanges[prop]
      });
    }

    this.cleanErrors();
    this.props.navigation.goBack(null);
  };

  // disableEdit = () => {
  //   this.setState({
  //     editEnabled: false,
  //     newProfilePicture: false,
  //     stateBeforeChanges: null
  //   });

  //   this.props.navigation.setParams({
  //     title: 'Perfil',
  //     rightIcon: this.renderEditButton(),
  //     leftIcon: this.renderBackButton()
  //   });
  // }

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
          this.props.onCommerceValueChange({
            prop: 'profilePicture',
            value: response.uri
          });

          this.setState({ newProfilePicture: true });
        } else {
          this.props.onCommerceValueChange({
            prop: 'headerPicture',
            value: response.uri
          });

          this.setState({ newHeaderPicture: true });
        }
      }
    } catch (error) {
      console.log(error);
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
          this.props.onCommerceValueChange({
            prop: 'profilePicture',
            value: response.uri
          });

          this.setState({ newProfilePicture: true });
        } else {
          this.props.onCommerceValueChange({
            prop: 'headerPicture',
            value: response.uri
          });

          this.setState({ newHeaderPicture: true });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.onEditPicturePress();
    }
  };

  onDeletePicturePress = () => {
    if (this.state.profilePictureEdit) {
      this.props.onCommerceValueChange({ prop: 'profilePicture', value: '' });
      this.setState({ newProfilePicture: false });
    } else {
      this.props.onCommerceValueChange({ prop: 'headerPicture', value: '' });
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
          <Text
            style={{ textAlign: 'center', paddingLeft: 5 }}
          >{`${address}, ${city}, ${name}`}</Text>
        </View>
      );
    }
  };

  onProvincePickerChange = async value => {
    try {
      if (value) {
        var { value, label } = this.props.provincesList.find(
          province => province.value == value
        );
        await this.props.onCommerceValueChange({
          prop: 'province',
          value: { provinceId: value, name: label }
        });

        this.props.onLocationValueChange({
          prop: 'provinceName',
          value: label
        });
      }

      this.renderProvinceError();
    } catch (e) {
      console.error(e);
    }
  };

  onAreaPickerChange = async value => {
    try {
      if (value) {
        var { value, label } = this.props.areasList.find(
          area => area.value == value
        );
        await this.props.onCommerceValueChange({
          prop: 'area',
          value: { areaId: value, name: label }
        });

        this.renderAreaError();
      }
    } catch (e) {
      console.error(e);
    }
  };

  renderNameError = () => {
    const { name, onCommerceValueChange } = this.props;
    const value = trimString(name);
    onCommerceValueChange({ prop: 'name', value });

    if (value === '') {
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
    const { onLocationValueChange } = this.props;
    const { address } = this.props.locationData;
    const value = trimString(address);
    onLocationValueChange({ prop: 'address', value });

    if (value === '') {
      this.setState({ addressError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ addressError: '' });
      return true;
    }
  };

  renderCityError = () => {
    const { onLocationValueChange } = this.props;
    const { city } = this.props.locationData;
    const value = trimString(city);
    onLocationValueChange({ prop: 'city', value });

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

  onProvinceNameChangeOnMap = name => {
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
    this.props.navigation.navigate('changeAddressMap', {
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
            source={
              this.props.headerPicture
                ? { uri: this.props.headerPicture }
                : null
            }
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
              source={
                this.props.profilePicture
                  ? { uri: this.props.profilePicture }
                  : null
              }
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
              onChangeText={value =>
                this.props.onCommerceValueChange({ prop: 'name', value })
              }
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
              onChangeText={value =>
                this.props.onCommerceValueChange({ prop: 'cuit', value })
              }
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
              onChangeText={value =>
                this.props.onCommerceValueChange({ prop: 'phone', value })
              }
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
              onChangeText={value =>
                this.props.onCommerceValueChange({ prop: 'email', value })
              }
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
              onChangeText={value =>
                this.props.onCommerceValueChange({ prop: 'description', value })
              }
              multiline={true}
              maxLength={250}
              maxHeight={180}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Dirección:"
              value={this.props.locationData.address}
              onChangeText={value =>
                this.props.onLocationValueChange({ prop: 'address', value })
              }
              errorMessage={this.state.addressError}
              onFocus={() => this.setState({ addressError: '' })}
              onBlur={this.renderAddressError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Ciudad:"
              value={this.props.locationData.city}
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
              onValueChange={value => this.onProvincePickerChange(value)}
              errorMessage={this.state.provinceError}
            />
          </CardSection>
          <CardSection style={{ paddingTop: 0 }}>
            <Button
              title="Buscar en el Mapa"
              titleStyle={{ color: MAIN_COLOR }}
              buttonStyle={{
                marginTop: 0,
                borderRadius: 8,
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
                  size={22}
                  color={MAIN_COLOR}
                />
              }
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
          title={
            this.state.profilePictureEdit ? 'Foto de Perfil' : 'Foto de Portada'
          }
          onBackdropPress={this.onEditPicturePress}
          isVisible={this.state.pictureOptionsVisible}
        >
          <MenuItem
            title="Elegir de la galería"
            icon="md-photos"
            onPress={this.onChoosePicturePress}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Tomar Foto"
            icon="md-camera"
            onPress={this.onTakePicturePress}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Eliminar"
            icon="md-trash"
            onPress={this.onDeletePicturePress}
          />
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
  onAreasRead,
  onLocationValueChange,
  onLocationChange
})(CommerceProfile);
