import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { HeaderBackButton } from 'react-navigation';
import { onUserDelete, onCommerceDelete } from '../actions';
import { MenuItem, Menu, Input, CardSection } from '../components/common';

class ClientSettings extends Component {
    state = { confirmDelete: '', confirmUserDeleteVisible: false, confirmCommerceDeleteVisible: false, confirmDeleteError: '' };

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: <HeaderBackButton tintColor='white' onPress={() => navigation.goBack(null)} />
        }
    }

    renderConfirmUserDelete = () => {
        return (
            <Menu
                title='¿Esta seguro que desea eliminar la cuenta?'
                onBackdropPress={this.onBackdropPress}
                isVisible={this.state.confirmUserDeleteVisible}
            >
                <CardSection style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}>
                    <Input
                        label='Escriba "Eliminar" para confirmar:'
                        value={this.state.confirmDelete}
                        color='black'
                        onChangeText={value => this.setState({ confirmDelete: value })}
                        errorMessage={this.state.confirmDeleteError}
                        onFocus={() => this.setState({ confirmDeleteError: '' })}
                    />
                </CardSection>
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title='Confirmar'
                    icon='md-checkmark'
                    loading={this.props.loadingUserDelete}
                    onPress={this.confirmUserDelete}
                />
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title='Cancelar'
                    icon='md-close'
                    onPress={() => this.setState({ confirmUserDeleteVisible: false })}
                />
            </Menu>
        );
    }

    renderConfirmCommerceDelete = () => {
        return (
            <Menu
                title='¿Esta seguro que desea eliminar su negocio?'
                onBackdropPress={this.onBackdropPress}
                isVisible={this.state.confirmCommerceDeleteVisible}
            >
                <CardSection style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}>
                    <Input
                        label='Escriba "Eliminar" para confirmar:'
                        value={this.state.confirmDelete}
                        color='black'
                        onChangeText={value => this.setState({ confirmDelete: value })}
                        errorMessage={this.state.confirmDeleteError}
                        onFocus={() => this.setState({ confirmDeleteError: '' })}
                    />
                </CardSection>
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title='Confirmar'
                    icon='md-checkmark'
                    loading={this.props.loadingCommerceDelete}
                    onPress={this.confirmCommerceDelete}
                />
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title='Cancelar'
                    icon='md-close'
                    onPress={() => this.setState({ confirmCommerceDeleteVisible: false })}
                />
            </Menu>
        );
    }

    confirmUserDelete = () => {
        if (this.state.confirmDelete == 'Eliminar') {
            this.props.onUserDelete();
        } else {
            this.setState({ confirmDeleteError: 'Incorrecto' })
        }
    }

    confirmCommerceDelete = () => {
        if (this.state.confirmDelete == 'Eliminar') {
            this.props.onCommerceDelete(this.props.navigation);
        } else {
            this.setState({ confirmDeleteError: 'Incorrecto' })
        }
    }

    onBackdropPress = () => {
        this.setState({ confirmDelete: '', confirmUserDeleteVisible: false, confirmCommerceDeleteVisible: false, confirmDeleteError: '' });
    }

    render() {
        return (
            <ScrollView style={styles.containerStyle} >
                <MenuItem
                    title="Eliminar Mi Negocio"
                    icon='md-trash'
                    onPress={() => this.setState({ confirmCommerceDeleteVisible: true })}
                />
                <MenuItem
                    title="Eliminar Cuenta"
                    icon='md-trash'
                    onPress={() => this.setState({ confirmUserDeleteVisible: true })}
                />

                {this.renderConfirmUserDelete()}
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
    return { loadingUserDelete: state.clientData.loading, loadingCommerceDelete: state.commerceData.loading };
}

export default connect(mapStateToProps, { onUserDelete, onCommerceDelete })(ClientSettings);