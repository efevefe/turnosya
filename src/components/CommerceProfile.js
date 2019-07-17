import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Text, Divider, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker, Permissions, Constants } from 'expo';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardSection, Input, Spinner, Menu, MenuItem, Picker } from '../components/common';
import { MAIN_COLOR } from '../constants';
import { imageToBlob } from '../utils';
import { 
    onCommerceRead, 
    onCommerceUpdateWithPicture, 
    onCommerceUpdateNoPicture, 
    onCommerceValueChange, 
    onProvincesRead, 
    onAreasRead 
} from '../actions/CommerceProfileActions';

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
        this.props.onCommerceRead('loading');
        this.props.navigation.setParams({ rightIcon: this.renderEditButton() });
    }

    onRefresh = () => {
        this.props.onCommerceRead('refreshing');
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

    onEditPress = () => {
        this.props.onProvincesRead();
        this.props.onAreasRead();

        const { name, cuit, email, phone, description, address, city, province, area, profilePicture } = this.props;
        this.setState({ editEnabled: true, stateBeforeChanges: { name, cuit, email, phone, description, address, city, province, area, profilePicture } });
        this.props.navigation.setParams({ title: 'Modificar Datos', rightIcon: this.renderSaveButton(), leftIcon: this.renderCancelButton() });
    }

    onSavePress = async () => {
        var { name, cuit, email, phone, description, address, city, province, area, profilePicture, commerceId } = this.props;
        const { newProfilePicture } = this.state;

        if (newProfilePicture) {
            var profilePicture = await imageToBlob(profilePicture);
            this.props.onCommerceUpdateWithPicture({ name, cuit, email, phone, description, address, city, province, area, profilePicture, commerceId });
        } else {
            this.props.onCommerceUpdateNoPicture({ name, cuit, email, phone, description, address, city, province, area, profilePicture, commerceId });
        }

        this.disableEdit();
    }

    onCancelPress = () => {
        _.each(this.state.stateBeforeChanges, (value, prop) => {
            this.props.onCommerceValueChange({ prop, value });
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
            this.props.onCommerceValueChange({ prop: 'profilePicture', value: response.uri });
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
            this.props.onCommerceValueChange({ prop: 'profilePicture', value: response.uri });
            this.setState({ newProfilePicture: true });
        }
    }

    onDeletePicturePress = () => {
        this.props.onCommerceValueChange({ prop: 'profilePicture', value: null });
        this.onEditPicturePress();
    }

    renderName = () => {
        const { name } = this.props;

        if (name) {
            return <Text h4>{name}</Text>;
        }
    }

    renderLocation = () => {
        const { address, city, province } = this.props;

        if (address || city || province) {
            const { locationContainerStyle } = styles;

            return (
                <View style={locationContainerStyle}>
                    <Icon name='md-pin' type='ionicon' size={16} containerStyle={{ marginRight: 5 }} />
                    <Text>{`${address}, ${city}, ${province.name}`}</Text>
                </View>
            );
        }
    }

    onProvincePickerChange = (index) => {
        const { value, label } = this.props.provincesList[index - 1];
        this.props.onCommerceValueChange({ prop: 'province', value: { provinceId: value, name: label } });
    }

    onAreaPickerChange = (index) => {
        const { value, label } = this.props.areasList[index - 1];
        this.props.onCommerceValueChange({ prop: 'area', value: { areaId: value, name: label } });
    }

    render() {
        const { containerStyle, headerContainerStyle, avatarContainerStyle, avatarStyle, infoContainerStyle } = styles;

        if (this.props.loading) {
            return <Spinner />;
        }

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
                            label='Razon Social:'
                            value={this.props.name}
                            onChangeText={value => this.props.onCommerceValueChange({ prop: 'name', value })}
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='CUIT:'
                            value={this.props.cuit}
                            onChangeText={value => this.props.onCommerceValueChange({ prop: 'cuit', value })}
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Telefono:'
                            value={this.props.phone}
                            onChangeText={value => this.props.onCommerceValueChange({ prop: 'phone', value })}
                            keyboardType='numeric'
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='E-Mail:'
                            value={this.props.email}
                            onChangeText={value => this.props.onCommerceValueChange({ prop: 'email', value })}
                            keyboardType='email-address'
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Descripcion:'
                            value={this.props.description}
                            onChangeText={value => this.props.onCommerceValueChange({ prop: 'description', value })}
                            editable={this.state.editEnabled}
                            multiline={true}
                            maxLength={250}
                            maxHeight={180}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Direccion:'
                            value={this.props.address}
                            onChangeText={value => this.props.onCommerceValueChange({ prop: 'address', value })}
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Ciudad:'
                            value={this.props.city}
                            onChangeText={value => this.props.onCommerceValueChange({ prop: 'city', value })}
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Picker
                            title='Provincia:'
                            placeholder={{ label: 'Seleccionar...', value: null }}
                            items={this.props.provincesList}
                            value={this.props.province.provinceId}
                            onValueChange={(value, index) => this.onProvincePickerChange(index)}
                            disabled={!this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Picker
                            title='Rubro:'
                            placeholder={{ label: 'Seleccionar...', value: null }}
                            items={this.props.areasList}
                            value={this.props.area.areaId}
                            onValueChange={(value, index) => this.onAreaPickerChange(index)}
                            disabled={!this.state.editEnabled}
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
        profilePicture,
        commerceId,
        loading,
        refreshing
    } = state.commerceProfile;

    return {
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
        profilePicture,
        commerceId,
        loading,
        refreshing
    };
}

export default connect(
    mapStateToProps, {
        onCommerceRead,
        onCommerceUpdateWithPicture,
        onCommerceUpdateNoPicture,
        onCommerceValueChange,
        onProvincesRead,
        onAreasRead
    }
)(CommerceProfile);