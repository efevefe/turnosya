import React, { Component } from 'react';
import { View, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Avatar, Text, Divider, Icon, Rating } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Input, Spinner, Menu, MenuItem, IconButton, Toast, Picker } from '../common';
import { MAIN_COLOR } from '../../constants';
import { imageToBlob, validateValueType, trimString } from '../../utils';
import { onUserRead, onUserUpdate, onClientDataValueChange, onProvincesIdRead } from '../../actions';

class ClientProfile extends Component {
  state = {
    editEnabled: false,
    pictureOptionsVisible: false,
    newProfilePicture: false,
    stateBeforeChanges: null,
    firstNameError: '',
    lastNameError: '',
    phoneError: '',
    pickerPlaceholder: { value: '', label: 'Seleccionar...' }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title'),
      headerRight: navigation.getParam('rightIcon'),
      headerLeft: navigation.getParam('leftIcon')
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ rightIcon: this.renderEditButton() });
    this.props.onProvincesIdRead();
  }

  renderEditButton = () => {
    return <IconButton icon="md-create" onPress={this.onEditPress} />;
  };

  renderSaveButton = () => {
    return <IconButton icon="md-checkmark" onPress={this.onSavePress} />;
  };

  renderCancelButton = () => {
    return <IconButton icon="md-close" onPress={this.onCancelPress} />;
  };

  onEditPress = () => {
    const { firstName, lastName, phone, profilePicture } = this.props;

    this.setState({ editEnabled: true, stateBeforeChanges: { firstName, lastName, phone, profilePicture } });

    this.props.navigation.setParams({
      title: 'Modificar Datos',
      rightIcon: this.renderSaveButton(),
      leftIcon: this.renderCancelButton()
    });
  };

  onSavePress = async () => {
    try {
      if (this.validateMinimumData()) {
        let { firstName, lastName, phone, profilePicture, province } = this.props;

        if (this.state.newProfilePicture) profilePicture = await imageToBlob(profilePicture);

        this.props.onUserUpdate({ firstName, lastName, phone, province, profilePicture });
        this.disableEdit();
      }
    } catch (error) {
      console.error(error);
    }
  };

  onCancelPress = () => {
    this.props.onClientDataValueChange(this.state.stateBeforeChanges);
    this.cleanErrors();
    this.disableEdit();
  };

  disableEdit = () => {
    this.setState({ editEnabled: false, newProfilePicture: false, stateBeforeChanges: null });

    this.props.navigation.setParams({
      title: 'Perfil',
      rightIcon: this.renderEditButton(),
      leftIcon: null
    });
  };

  renderEditPictureButton = () => {
    if (this.state.editEnabled) {
      return (
        <Icon
          name="md-camera"
          color={MAIN_COLOR}
          type="ionicon"
          size={20}
          reverse
          containerStyle={{ padding: 5, position: 'absolute' }}
          onPress={this.onEditPicturePress}
        />
      );
    }
  };

  onEditPicturePress = () => {
    this.setState({ pictureOptionsVisible: !this.state.pictureOptionsVisible });
  };

  onChoosePicturePress = async () => {
    try {
      if (Constants.platform.ios) {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
      const options = { mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1] };

      const response = await ImagePicker.launchImageLibraryAsync(options);

      if (!response.cancelled) {
        this.props.onClientDataValueChange({ profilePicture: response.uri });
        this.setState({ newProfilePicture: true });
      }
    } catch (error) {
      if (error.message.includes('Missing camera roll permission')) {
        return Toast.show({ text: 'Debe dar permisos primero' });
      }
      console.log(error);
    } finally {
      this.onEditPicturePress();
    }
  };

  onTakePicturePress = async () => {
    try {
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      await Permissions.askAsync(Permissions.CAMERA);

      const options = { mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1] };

      let response = await ImagePicker.launchCameraAsync(options);

      if (!response.cancelled) {
        this.props.onClientDataValueChange({ profilePicture: response.uri });
        this.setState({ newProfilePicture: true });
      }
    } catch (error) {
      if (error.message.includes('Camera not available on simulator')) {
        return Toast.show({ text: 'Debe usar un dispositivo físico para el uso de la cámara' });
      }

      if (error.message.includes('User rejected permissions')) {
        return console.warn('User reject permissions');
      }

      console.error(error);
    } finally {
      this.onEditPicturePress();
    }
  };

  onDeletePicturePress = () => {
    this.props.onClientDataValueChange({ profilePicture: '' });
    this.onEditPicturePress();
  };

  getRatingValue = () => {
    const { total, count } = this.props.rating;

    return total ? total / count : 0;
  };

  renderFullName = () => {
    if (this.props.firstName || this.props.lastName) {
      return <Text h4>{`${this.props.firstName} ${this.props.lastName}`}</Text>;
    }
  };

  renderLocation = () => {
    if (this.props.city && this.props.provinceName) {
      return (
        <View style={locationContainerStyle}>
          <Icon name="md-pin" type="ionicon" size={16} containerStyle={{ marginRight: 5 }} />
          <Text>{`${this.props.city}, ${this.props.provinceName}`}</Text>
        </View>
      );
    }
  };

  renderFirstNameError = () => {
    const firstName = trimString(this.props.firstName);

    this.props.onClientDataValueChange({ firstName });
    if (!firstName) {
      this.setState({ firstNameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ firstNameError: '' });
      return true;
    }
  };

  renderLastNameError = () => {
    const lastName = trimString(this.props.lastName);

    this.props.onClientDataValueChange({ lastName });
    if (!lastName) {
      this.setState({ lastNameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ lastNameError: '' });
      return true;
    }
  };

  renderPhoneError = () => {
    if (this.props.phone && !validateValueType('phone', this.props.phone)) {
      this.setState({ phoneError: 'Formato de teléfono incorrecto' });
      return false;
    } else {
      this.setState({ phoneError: '' });
      return true;
    }
  };

  cleanErrors = () => {
    this.setState({ firstNameError: '', lastNameError: '', phoneError: '' });
  };

  validateMinimumData = () => {
    return this.renderFirstNameError() && this.renderLastNameError() && this.renderPhoneError();
  };

  onProvincePickerChange = value => {
    if (value) {
      var { value, label } = this.props.provincesList.find(province => province.value === value);
      this.props.onClientDataValueChange({ province: { provinceId: value, name: label } });
    }
  };

  render() {
    if (this.props.loading) return <Spinner />;

    return (
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={60}
        style={containerStyle}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={() => this.props.onUserRead()}
            colors={[MAIN_COLOR]}
            tintColor={MAIN_COLOR}
          />
        }
      >
        <View style={headerContainerStyle}>
          <View style={avatarContainerStyle}>
            <Avatar
              rounded
              source={this.props.profilePicture ? { uri: this.props.profilePicture } : null}
              size="xlarge"
              icon={{ name: 'person' }}
              containerStyle={avatarStyle}
            />

            {this.renderEditPictureButton()}
          </View>
          {this.renderFullName()}
          {this.renderLocation()}
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('clientReviewsList', {
                clientId: this.props.clientId
              })
            }
          >
            <Rating style={ratingStyle} readonly imageSize={24} startingValue={this.getRatingValue()} />
          </TouchableOpacity>
        </View>
        <Divider style={{ backgroundColor: 'grey', margin: 5, marginLeft: 10, marginRight: 10 }} />
        <View style={infoContainerStyle}>
          <CardSection>
            <Input
              label="Nombre:"
              value={this.props.firstName}
              autoCapitalize="words"
              onChangeText={firstName => this.props.onClientDataValueChange({ firstName })}
              editable={this.state.editEnabled}
              errorMessage={this.state.firstNameError}
              onFocus={() => this.setState({ firstNameError: '' })}
              onBlur={this.renderFirstNameError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Apellido:"
              value={this.props.lastName}
              autoCapitalize="words"
              onChangeText={lastName => this.props.onClientDataValueChange({ lastName })}
              editable={this.state.editEnabled}
              errorMessage={this.state.lastNameError}
              onFocus={() => this.setState({ lastNameError: '' })}
              onBlur={this.renderLastNameError}
            />
          </CardSection>
          <CardSection>
            <Input
              label="Teléfono:"
              value={this.props.phone}
              onChangeText={phone => this.props.onClientDataValueChange({ phone: phone.trim() })}
              keyboardType="numeric"
              editable={this.state.editEnabled}
              errorMessage={this.state.phoneError}
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.renderPhoneError}
            />
          </CardSection>
          <CardSection>
            <Picker
              title="Provincia:"
              placeholder={this.state.pickerPlaceholder}
              items={this.props.provincesList}
              value={this.props.province.provinceId}
              disabled={!this.state.editEnabled}
              onValueChange={value => this.onProvincePickerChange(value)}
            />
          </CardSection>
          <CardSection>
            <Input label="E-Mail:" value={this.props.email} editable={false} />
          </CardSection>
        </View>

        <Menu
          title="Foto de Perfil"
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

const {
  containerStyle,
  headerContainerStyle,
  avatarContainerStyle,
  avatarStyle,
  locationContainerStyle,
  infoContainerStyle,
  ratingStyle
} = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignSelf: 'stretch'
  },
  headerContainerStyle: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20
  },
  avatarContainerStyle: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  avatarStyle: {
    borderWidth: 4,
    borderColor: MAIN_COLOR,
    margin: 10
  },
  locationContainerStyle: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoContainerStyle: {
    alignSelf: 'stretch',
    padding: 10,
    paddingBottom: 22
  },
  ratingStyle: { paddingTop: 14 }
});

const mapStateToProps = state => {
  const {
    clientId,
    firstName,
    lastName,
    phone,
    province,
    email,
    profilePicture,
    rating,
    loading,
    refreshing
  } = state.clientData;

  const { city, provinceName } = state.locationData.userLocation;
  const { provincesList } = state.provinceData;

  return {
    clientId,
    firstName,
    lastName,
    phone,
    province,
    email,
    profilePicture,
    rating,
    loading,
    refreshing,
    city,
    provinceName,
    provincesList
  };
};

export default connect(mapStateToProps, { onUserRead, onUserUpdate, onClientDataValueChange, onProvincesIdRead })(
  ClientProfile
);
