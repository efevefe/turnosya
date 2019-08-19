import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { DrawerItem } from '../components/common';
import { onCommerceOpen, onLogout } from '../actions';

class ClientDrawerContent extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView
          style={{ flex: 1 }}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
          <DrawerItem
            title="Mi Negocio"
            icon='ios-briefcase'
            onPress={() => this.props.onCommerceOpen(this.props.navigation)}
          />
          <DrawerItem
            title="Configuración"
            icon='md-settings'
            onPress={() => this.props.navigation.navigate('clientSettings')}
          />
          <DrawerItem
            title="Cerrar Sesión"
            icon='md-exit'
            loading={this.props.loading}
            onPress={() => this.props.onLogout()}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return { loading: state.auth.loading };
};

export default connect(
  mapStateToProps,
  { onCommerceOpen, onLogout }
)(ClientDrawerContent);
