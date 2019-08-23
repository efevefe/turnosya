import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { Avatar, Text, Divider, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker, Permissions, Constants, Location } from 'expo';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  CardSection,
  Input,
  Spinner,
  Menu,
  MenuItem
} from '../components/common';
import { MAIN_COLOR } from '../constants';
import {
  imageToBlob,
  validateValueType,
  trimString
} from '../utils';
import {
  onUserRead,
  onUserUpdateWithPicture,
  onUserUpdateNoPicture,
  onRegisterValueChange,
  servicesRead
} from '../actions';

class ClientProfile extends Component {
  state = {
    editEnabled: false,
    pictureOptionsVisible: false,
    newProfilePicture: false,
    stateBeforeChanges: null,
    firstNameError: '',
    lastNameError: '',
    phoneError: ''
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
    this.getLocation();
  }

  onRefresh = () => {
    this.props.onUserRead();
    this.getLocation();
  };

  renderEditButton = () => {
    return (
      <Ionicons
        name="md-create"
        size={28}
        color="white"
        style={{ marginRight: 15 }}
        onPress={this.onEditPress}
      />
    );
  };

  renderSaveButton = () => {
    return (
      <Ionicons
        name="md-checkmark"
        size={28}
        color="white"
        style={{ marginRight: 15 }}
        onPress={this.onSavePress}
      />
    );
  };

  renderCancelButton = () => {
    return (
      <Ionicons
        name="md-close"
        size={28}
        color="white"
        style={{ marginLeft: 15 }}
        onPress={this.onCancelPress}
      />
    );
  };

  onEditPress = () => {
    const { firstName, lastName, phone, profilePicture } = this.props;
    this.setState({
      editEnabled: true,
      stateBeforeChanges: { firstName, lastName, phone, profilePicture }
    });
    this.props.navigation.setParams({
      title: 'Modificar Datos',
      rightIcon: this.renderSaveButton(),
      leftIcon: this.renderCancelButton()
    });
  };

  onSavePress = async () => {
    if (this.validateMinimumData()) {
      var { firstName, lastName, phone, profilePicture } = this.props;
      const { newProfilePicture } = this.state;

      if (newProfilePicture) {
        var profilePicture = await imageToBlob(profilePicture);
        this.props.onUserUpdateWithPicture({
          firstName,
          lastName,
          phone,
          profilePicture
        });
      } else {
        this.props.onUserUpdateNoPicture({
          firstName,
          lastName,
          phone,
          profilePicture
        });
      }

      this.disableEdit();
    }
  };

  onCancelPress = () => {
    _.each(this.state.stateBeforeChanges, (value, prop) => {
      this.props.onRegisterValueChange({ prop, value });
    });

    this.cleanErrors();
    this.disableEdit();
  };

  disableEdit = () => {
    this.setState({
      editEnabled: false,
      newProfilePicture: false,
      stateBeforeChanges: null
    });
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

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  onChoosePicturePress = async () => {
    this.onEditPicturePress();

    await this.getPermissionAsync();

    const options = {
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1]
    };

    let response = await ImagePicker.launchImageLibraryAsync(options);

    if (!response.cancelled) {
      this.props.onRegisterValueChange({
        prop: 'profilePicture',
        value: response.uri
      });
      this.setState({ newProfilePicture: true });
    }
  };

  onTakePicturePress = async () => {
    this.onEditPicturePress();

    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);

    const options = {
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1]
    };

    let response = await ImagePicker.launchCameraAsync(options);

    if (!response.cancelled) {
      this.props.onRegisterValueChange({
        prop: 'profilePicture',
        value: response.uri
      });
      this.setState({ newProfilePicture: true });
    }
  };

  onDeletePicturePress = () => {
    this.props.onRegisterValueChange({ prop: 'profilePicture', value: '' });
    this.onEditPicturePress();
  };

  renderFullName = () => {
    const { firstName, lastName } = this.props;

    if (firstName || lastName) {
      return <Text h4>{`${firstName} ${lastName}`}</Text>;
    }
  };

  getLocation = async () => {
    await Permissions.askAsync(Permissions.LOCATION);

    let position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    let location = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

    this.props.onRegisterValueChange({
      prop: 'location',
      value: { ...location[0] }
    });
  };

  renderLocation = () => {
    if (this.props.location) {
      const { city, region } = this.props.location;

      if (city || region) {
        const { locationContainerStyle } = styles;

        return (
          <View style={locationContainerStyle}>
            <Icon
              name="md-pin"
              type="ionicon"
              size={16}
              containerStyle={{ marginRight: 5 }}
            />
            <Text>{`${city}, ${region}`}</Text>
          </View>
        );
      }
    }
  };

  renderFirstNameError = () => {
    const { firstName, onRegisterValueChange } = this.props;

    onRegisterValueChange({ prop: 'firstName', value: trimString(firstName) });
    if (trimString(firstName) === '') {
      this.setState({ firstNameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ firstNameError: '' });
      return true;
    }
  };

  renderLastNameError = () => {
    const { lastName, onRegisterValueChange } = this.props;

    onRegisterValueChange({ prop: 'lastName', value: trimString(lastName) });
    if (trimString(lastName) === '') {
      this.setState({ lastNameError: 'Dato requerido' });
      return false;
    } else {
      this.setState({ lastNameError: '' });
      return true;
    }
  };

  renderPhoneError = () => {
    if (
      this.props.phone != '' &&
      !validateValueType('phone', this.props.phone)
    ) {
      this.setState({ phoneError: 'Formato de teléfono incorrecto' });
      return false;
    } else {
      this.setState({ phoneError: '' });
      return true;
    }
  };

  cleanErrors = () => {
    this.setState({
      firstNameError: '',
      lastNameError: '',
      phoneError: ''
    });
  };

  validateMinimumData = () => {
    return (
      this.renderFirstNameError() &&
      this.renderLastNameError() &&
      this.renderPhoneError()
    );
  };

  render() {
    const {
      containerStyle,
      headerContainerStyle,
      avatarContainerStyle,
      avatarStyle,
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
              label="Nombre:"
              value={this.props.firstName}
              onChangeText={value =>
                this.props.onRegisterValueChange({
                  prop: 'firstName',
                  value
                })
              }
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
              onChangeText={value =>
                this.props.onRegisterValueChange({ prop: 'lastName', value })
              }
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
              onChangeText={value =>
                this.props.onRegisterValueChange({ prop: 'phone', value })
              }
              keyboardType="numeric"
              editable={this.state.editEnabled}
              errorMessage={this.state.phoneError}
              onFocus={() => this.setState({ phoneError: '' })}
              onBlur={this.renderPhoneError}
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
    padding: 10
  }
});

const mapStateToProps = state => {
  const {
    firstName,
    lastName,
    phone,
    email,
    profilePicture,
    location,
    loading,
    refreshing
  } = state.clientData;

  return {
    firstName,
    lastName,
    phone,
    email,
    profilePicture,
    location,
    loading,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  {
    onUserRead,
    onUserUpdateWithPicture,
    onUserUpdateNoPicture,
    onRegisterValueChange,
    servicesRead
  }
)(ClientProfile);
