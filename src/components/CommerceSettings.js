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
                    loading={this.props.loadingDelete}
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

const mapStateToProps = state => {
    return { loadingDelete: state.commerceData.loading };
}

export default connect(mapStateToProps, { onCommerceDelete })(CommerceSettings);