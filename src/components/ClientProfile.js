import _ from 'lodash';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Divider, Overlay, Icon, Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker, Permissions, Constants } from 'expo';
import { connect } from 'react-redux';
import { CardSection, Input, Spinner } from '../components/common';
import { MAIN_COLOR } from '../constants';
import { onUserRead, onUserUpdate, onRegisterValueChange } from '../actions/RegisterActions';

class ClientProfile extends Component {
    state = { editEnabled: false, photoOptionsVisible: false, newPhoto: null, stateBeforeChanges: null };

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title'),
            headerRight: navigation.getParam('rightIcon'),
            headerLeft: navigation.getParam('leftIcon')
        }
    }

    componentWillMount() {
        this.props.onUserRead();
        this.props.navigation.setParams({ rightIcon: this.renderEditButton() });
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
        const { firstName, lastName, phone } = this.props;
        this.setState({ editEnabled: true, stateBeforeChanges: { firstName, lastName, phone } });
        this.props.navigation.setParams({ title: 'Modificar Datos', rightIcon: this.renderSaveButton(), leftIcon: this.renderCancelButton() });
    }

    onSavePress = () => {
        const { firstName, lastName, phone, photo } = this.props;
        this.props.onUserUpdate({ firstName, lastName, phone, photo });

        this.disableEdit();
    }

    onCancelPress = () => {
        _.each(this.state.stateBeforeChanges, (value, prop) => {
            this.props.onRegisterValueChange({ prop, value });
        });

        this.disableEdit();
    }

    disableEdit = () => {
        this.setState({ editEnabled: false });
        this.props.navigation.setParams({ title: 'Perfil', rightIcon: this.renderEditButton(), leftIcon: null });
    }

    renderEditPhotoButton = () => {
        if (this.state.editEnabled) {
            return (
                <Icon
                    name='md-camera'
                    color={MAIN_COLOR}
                    type='ionicon'
                    size={20}
                    reverse
                    containerStyle={{ padding: 5, position: 'absolute' }}
                    onPress={this.onEditPhotoPress}
                />
            );
        }
    }

    onEditPhotoPress = () => {
        this.setState({ photoOptionsVisible: !this.state.photoOptionsVisible });
    }

    onChoosePhotoPress = async () => {
        this.onEditPhotoPress();

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
            this.setState({ newPhoto: response.uri });
        }
    }

    onTakePhotoPress = async () => {
        this.onEditPhotoPress();

        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);

        const options = {
            mediaTypes: 'Images',
            allowsEditing: true,
            aspect: [1, 1]
        }

        let response = await ImagePicker.launchCameraAsync(options);

        if (!response.cancelled) {
            this.setState({ newPhoto: response.uri });
        }
    }

    renderFullName = () => {
        const { firstName, lastName } = this.props;

        if (firstName || lastName) {
            return `${firstName} ${lastName}`;
        } else {
            return `Sin Nombre`;
        }
    }

    renderEditSpinner = () => {
        if (this.props.loadingUpdate) {
            return <Spinner type='transparent' />
        }
    }

    render() {
        const { containerStyle, headerContainerStyle, avatarContainerStyle, avatarStyle, infoContainerStyle } = styles;

        if (this.props.loading) {
            return <Spinner />;
        }

        return (
            <View style={containerStyle} >
                <View style={headerContainerStyle} >
                    <View style={avatarContainerStyle} >
                        <Avatar
                            rounded
                            source={{ uri: this.state.newPhoto ? this.state.newPhoto : this.props.photo }}
                            size='xlarge'
                            icon={{ name: 'person' }}
                            containerStyle={avatarStyle}
                        />

                        {this.renderEditPhotoButton()}
                    </View>
                    <Text h4>{this.renderFullName()}</Text>
                    <Text>Unquillo, Cordoba</Text>
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
                            label='Nombre:'
                            value={this.props.firstName}
                            onChangeText={value => this.props.onRegisterValueChange({ prop: 'firstName', value })}
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Apellido:'
                            value={this.props.lastName}
                            onChangeText={value => this.props.onRegisterValueChange({ prop: 'lastName', value })}
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='Telefono:'
                            value={this.props.phone}
                            onChangeText={value => this.props.onRegisterValueChange({ prop: 'phoneName', value })}
                            keyboardType='numeric'
                            editable={this.state.editEnabled}
                        />
                    </CardSection>
                    <CardSection>
                        <Input
                            label='E-Mail:'
                            value={this.props.email}
                            editable={false}
                        />
                    </CardSection>
                </View>

                {this.renderEditSpinner()}

                <Overlay
                    height='auto'
                    overlayStyle={{ padding: 0 }}
                    onBackdropPress={this.onEditPhotoPress}
                    isVisible={this.state.photoOptionsVisible}
                    animationType='fade'
                >
                    <View>
                        <View style={{ alignSelf: 'stretch', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16, margin: 15 }}>Foto de Perfil</Text>
                        </View>
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <Button
                            type='clear'
                            title='Elegir de la Galeria'
                            buttonStyle={{ padding: 15 }}
                            titleStyle={{ color: 'grey' }}
                            onPress={this.onChoosePhotoPress}
                        />
                        <Divider style={{ backgroundColor: 'grey', marginLeft: 10, marginRight: 10 }} />
                        <Button
                            type='clear'
                            title='Tomar Foto'
                            buttonStyle={{ padding: 15 }}
                            titleStyle={{ color: 'grey' }}
                            onPress={this.onTakePhotoPress}
                        />
                    </View>
                </Overlay>
            </View>
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

const mapStateToProps = state => {
    const { firstName, lastName, phone, email, photo, loading, loadingUpdate } = state.registerForm;

    return { firstName, lastName, phone, email, photo, loading, loadingUpdate };
}

export default connect(mapStateToProps, { onUserRead, onUserUpdate, onRegisterValueChange })(ClientProfile);