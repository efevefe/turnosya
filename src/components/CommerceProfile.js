import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Text, Divider, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker, Permissions, Constants } from 'expo';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Input, Spinner, Menu, MenuItem } from '../components/common';
import { MAIN_COLOR } from '../constants';
import { imageToBlob } from '../utils';
import { onUserUpdateWithPicture, onUserUpdateNoPicture, onRegisterValueChange } from '../actions/RegisterActions';

class CommerceProfile extends Component {
    state = { editEnabled: false, pictureOptionsVisible: false, newProfilePicture: false, stateBeforeChanges: null };

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title'),
            headerRight: navigation.getParam('rightIcon'),
            headerLeft: navigation.getParam('leftIcon')
        }
    }

    componentWillMount() {
        //this.props.onUserRead('loading'); ACA DEBE IR EL ACTION DE onCommerceRead
        this.props.navigation.setParams({ rightIcon: this.renderEditButton() });
    }

    onRefresh = () => {
        this.props.onUserRead('refreshing');
    }

    renderEditButton = () => {
        return (
            <Ionicons
                name='md-create'
                size={28}
                color='white'
                style={{ marginRight: 15 }}
                onPress={this.onEditPress}
            />
        );
    }

    renderSaveButton = () => {
        return (
            <Ionicons
                name='md-checkmark'
                size={28}
                color='white'
                style={{ marginRight: 15 }}
                onPress={this.onSavePress}
            />
        );
    }

    renderCancelButton = () => {
        return (
            <Ionicons
                name='md-close'
                size={28}
                color='white'
                style={{ marginLeft: 15 }}
                onPress={this.onCancelPress}
            />
        );
    }

    onEditPress = () => {/* ACA DEBERIA COPIAR LOS DATOS DEL NEGOCIO
        const { firstName, lastName, phone, profilePicture } = this.props;
        this.setState({ editEnabled: true, stateBeforeChanges: { firstName, lastName, phone, profilePicture } });*/
        this.props.navigation.setParams({ title: 'Modificar Datos', rightIcon: this.renderSaveButton(), leftIcon: this.renderCancelButton() });
    }

    onSavePress = async () => {/* ACA LO MISMO PERO PARA EL NEGOCIO
        var { firstName, lastName, phone, profilePicture } = this.props;
        const { newProfilePicture } = this.state;

        if (newProfilePicture) {
            var profilePicture = await imageToBlob(profilePicture);
            this.props.onUserUpdateWithPicture({ firstName, lastName, phone, profilePicture });
        } else {
            this.props.onUserUpdateNoPicture({ firstName, lastName, phone, profilePicture });
        }*/

        this.disableEdit();
    }

    onCancelPress = () => {
        _.each(this.state.stateBeforeChanges, (value, prop) => {
            this.props.onRegisterValueChange({ prop, value });
        });

        this.disableEdit();
    }

    disableEdit = () => {
        this.setState({ editEnabled: false, newProfilePicture: false, stateBeforeChanges: null });
        this.props.navigation.setParams({ title: 'Perfil', rightIcon: this.renderEditButton(), leftIcon: null });
    }

    renderEditPictureButton = () => {
        if (this.state.editEnabled) {
            return (
                <Icon
                    name='md-camera'
                    color={MAIN_COLOR}
                    type='ionicon'
                    size={20}
                    reverse
                    containerStyle={{ padding: 5, position: 'absolute' }}
                    onPress={this.onEditPicturePress}
                />
            );
        }
    }

    onEditPicturePress = () => {
        this.setState({ pictureOptionsVisible: !this.state.pictureOptionsVisible });
    }

    onChoosePicturePress = async () => {
        this.onEditPicturePress();

        if (Constants.platform.ios) {
            await Permissions.askAsync(Permissions.CAMERA_ROLL);
        }

        const options = {
            mediaTypes: 'Images',
            allowsEditing: true,
            aspect: [1, 1]
        }

        let response = await ImagePicker.launchImageLibraryAsync(options);

        if (!response.cancelled) {
            this.props.onRegisterValueChange({ prop: 'profilePicture', value: response.uri });
            this.setState({ newProfilePicture: true });
        }
    }

    onTakePicturePress = async () => {
        this.onEditPicturePress();

        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);

        const options = {
            mediaTypes: 'Images',
            allowsEditing: true,
            aspect: [1, 1]
        }

        let response = await ImagePicker.launchCameraAsync(options);

        if (!response.cancelled) {
            this.props.onRegisterValueChange({ prop: 'profilePicture', value: response.uri });
            this.setState({ newProfilePicture: true });
        }
    }

    onDeletePicturePress = () => {
        this.props.onRegisterValueChange({ prop: 'profilePicture', value: null });
        this.onEditPicturePress();
    }

    renderName = () => {/* ACA IRIA SOLO EL NOMBRE DEL NEGOCIO
        const { firstName, lastName } = this.props;

        if (firstName || lastName) {
            return <Text h4>{`${firstName} ${lastName}`}</Text>;
        }*/
    }

    render() {
        const { containerStyle, headerContainerStyle, avatarContainerStyle, avatarStyle, infoContainerStyle } = styles;

        if (this.props.loading) {
            return <Spinner />;
        }

        return (
            <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={60}>
                <ScrollView
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
                    <View style={headerContainerStyle} >
                        <View style={avatarContainerStyle} >
                            <Avatar
                                rounded
                                source={{ uri: this.props.profilePicture }}
                                size='xlarge'
                                icon={{ name: 'person' }}
                                containerStyle={avatarStyle}
                            />

                            {this.renderEditPictureButton()}
                        </View>
                        {this.renderName()}
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
                                label='Razon Social:'
                                placeholder='Razon Social'
                                value={this.props.firstName}
                                onChangeText={value => this.props.onRegisterValueChange({ prop: 'firstName', value })}
                                editable={this.state.editEnabled}
                            />
                        </CardSection>
                        <CardSection>
                            <Input
                                label='CUIT:'
                                placeholder='20-00000000-9'
                                value={this.props.lastName}
                                onChangeText={value => this.props.onRegisterValueChange({ prop: 'lastName', value })}
                                editable={this.state.editEnabled}
                            />
                        </CardSection>
                        <CardSection>
                            <Input
                                label='Telefono:'
                                placeholder='Numero de telefono'
                                value={this.props.phone}
                                onChangeText={value => this.props.onRegisterValueChange({ prop: 'phone', value })}
                                keyboardType='numeric'
                                editable={this.state.editEnabled}
                            />
                        </CardSection>
                        <CardSection>
                            <Input
                                label='E-Mail:'
                                placeholder='Direccion de email'
                                value={this.props.email}
                                onChangeText={value => this.props.onRegisterValueChange({ prop: 'email', value })}
                                keyboardType='email-address'
                                editable={this.state.editEnabled}
                            />
                        </CardSection>
                        <CardSection>
                            <Input
                                label='Descripcion:'
                                placeholder='Descripcion (opcional)'
                                value={this.props.description}
                                onChangeText={value => this.props.onRegisterValueChange({ prop: 'description', value })}
                                editable={this.state.editEnabled}
                                multiline={true}
                                maxLength={250}
                                maxHeight={180}
                            />
                        </CardSection>
                        <CardSection>
                            <Input
                                label='Direccion:'
                                placeholder='Calle Falsa 123'
                                value={this.props.address}
                                onChangeText={value => this.props.onRegisterValueChange({ prop: 'address', value })}
                                editable={this.state.editEnabled}
                            />
                        </CardSection>
                        <CardSection>
                            <Input
                                label='Ciudad:'
                                placeholder='Cordoba'
                                value={this.props.city}
                                onChangeText={value => this.props.onRegisterValueChange({ prop: 'city', value })}
                                editable={this.state.editEnabled}
                            />
                        </CardSection>
                    </View>

                    <Menu
                        title='Foto de Perfil'
                        onBackdropPress={this.onEditPicturePress}
                        isVisible={this.state.pictureOptionsVisible}
                    >
                        <MenuItem
                            title='Elegir de la galeria'
                            icon='md-photos'
                            onPress={this.onChoosePicturePress}
                        />
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <MenuItem
                            title='Tomar Foto'
                            icon='md-camera'
                            onPress={this.onTakePicturePress}
                        />
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <MenuItem
                            title='Eliminar'
                            icon='md-trash'
                            onPress={this.onDeletePicturePress}
                        />
                    </Menu>
                </ScrollView>
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
    infoContainerStyle: {
        alignSelf: 'stretch',
        padding: 10
    }
});

const mapStateToProps = state => {/* ACA PONER LOS DATOS DEL NEGOCIO
    const { firstName, lastName, phone, email, profilePicture, location, loading, refreshing } = state.registerForm;

    return { firstName, lastName, phone, email, profilePicture, location, loading, refreshing };*/
}

export default connect(mapStateToProps, { onUserUpdateWithPicture, onUserUpdateNoPicture, onRegisterValueChange })(CommerceProfile);