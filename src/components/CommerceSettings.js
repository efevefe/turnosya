import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { onCommerceDelete } from '../actions';
import { MenuItem, Menu, Input, CardSection } from '../components/common';

class CommerceSettings extends Component {
    state = { confirmDelete: '', confirmDeleteVisible: false, confirmDeleteError: '' };

    renderConfirmDelete = () => {
        return (
            <Menu
                title='¿Esta seguro que desea eliminar el negocio?'
                onBackdropPress={() => this.setState({ confirmDeleteVisible: false })}
                isVisible={this.state.confirmDeleteVisible}
            >
                <CardSection>
                    <Input
                        label='Escriba "Eliminar" para confirmar:'
                        value={this.state.confirmDelete}
                        onChangeText={value => this.setState({ confirmDelete: value })}
                        errorMessage={this.state.confirmDeleteError}
                        onFocus={() => this.setState({ confirmDeleteError: '' })}
                    />
                </CardSection>
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title='Confirmar'
                    icon='md-checkmark'
                    onPress={this.confirmDelete}
                />
                <Divider style={{ backgroundColor: 'grey' }} />
                <MenuItem
                    title='Cancelar'
                    icon='md-close'
                    onPress={() => this.setState({ confirmDeleteVisible: false })}
                />
            </Menu>
        );
    }

    confirmDelete = () => {
        if (this.state.confirmDelete == 'Eliminar') {
            this.props.onCommerceDelete(this.props.navigation);
        } else {
            this.setState({ confirmDeleteError: 'Incorrecto' })
        }
    }

    render() {
        return (
            <ScrollView style={styles.containerStyle} >
                <MenuItem
                    title="Eliminar Negocio"
                    icon='md-trash'
                    onPress={() => this.setState({ confirmDeleteVisible: true })}
                />

                {this.renderConfirmDelete()}
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

export default connect(null, { onCommerceDelete })(CommerceSettings);