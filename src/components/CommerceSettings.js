import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';
import firebase from 'firebase';
import { onCommerceDelete, onCommerceValueChange, onLoginValueChange } from '../actions';
import { MenuItem, Menu, Input, CardSection } from '../components/common';

class CommerceSettings extends Component {
    state = { providerId: null };

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor='white' onPress={() => navigation.goBack(null)} />
        }
    }
    
    componentWillMount() {
        this.setState({ providerId: firebase.auth().currentUser.providerData[0].providerId });
    }

    renderPasswordInput = () => {
        // muestra el input de contraseña para confirmar eliminacion de cuenta o negocio si ese es el metodo de autenticacion
        if (this.state.providerId == 'password') {
            return (
                <View style={{ alignSelf: 'stretch' }}>
                    <CardSection style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}>
                        <Input
                            label='Contraseña:'
                            secureTextEntry
                            value={this.props.password}
                            color='black'
                            onChangeText={value => this.props.onLoginValueChange({ prop: 'password', value })}
                            errorMessage={this.props.reauthError}
                            onFocus={() => this.props.onLoginValueChange({ prop: 'error', value: '' })}
                        />
                    </CardSection>
                    <Divider style={{ backgroundColor: 'grey' }} />
                </View>
            );
        }
    }
    
    renderConfirmCommerceDelete = () => {
        // ventana de confirmacion para eliminar negocio
        return (
            <Menu
                title='¿Esta seguro que desea eliminar su negocio?'
                onBackdropPress={this.onBackdropPress}
                isVisible={this.props.confirmCommerceDeleteVisible}
            >
                {this.renderPasswordInput()}
                <MenuItem
                    title='Confirmar'
                    icon='md-checkmark'
                    loading={this.props.loadingCommerceDelete}
                    onPress={() => this.props.onCommerceDelete(this.props.password, this.props.navigation)}
                />
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title='Cancelar'
                    icon='md-close'
                    onPress={this.onBackdropPress}
                />
            </Menu>
        );
    }

    onBackdropPress = () => {
        // auth
        this.props.onLoginValueChange({ prop: 'password', value: '' });
        this.props.onLoginValueChange({ prop: 'error', value: '' });
        // commerce
        this.props.onCommerceValueChange({ prop: 'confirmDeleteVisible', value: false });
    }

    render() {
        return (
            <ScrollView style={styles.containerStyle} >
                <MenuItem
                    title="Eliminar Negocio"
                    icon='md-trash'
                    onPress={() => this.props.onCommerceValueChange({ prop: 'confirmDeleteVisible', value: true })}
                />

                {this.renderConfirmCommerceDelete()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'stretch',
        flex: 1
    }
});

const mapStateToProps = state => {
    // commerce
    const loadingCommerceDelete = state.commerceData.loading
    const confirmCommerceDeleteVisible = state.commerceData.confirmDeleteVisible;
    // auth
    const { password, error } = state.auth;

    return {
        loadingCommerceDelete,
        password,
        reauthError: error,
        confirmCommerceDeleteVisible
    };
}

export default connect(mapStateToProps, { onCommerceDelete, onCommerceValueChange, onLoginValueChange })(CommerceSettings);