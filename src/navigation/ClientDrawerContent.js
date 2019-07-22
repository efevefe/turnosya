import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { DrawerItem } from '../components/common';
import { onCommerceOpen, onLogout } from '../actions';

class ClientDrawerContent extends Component {
  leftIcon = name => (
    <Ionicons name={name} size={20} color="black" style={{ marginRight: 8 }} />
  );

  render() {
    return (
      <ScrollView>
        <SafeAreaView
          style={{ flex: 1 }}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
          <DrawerItem
            title="Mi Negocio"
            icon={this.leftIcon('ios-briefcase')}
            onPress={() => this.props.onCommerceOpen(this.props.navigation)}
          />
          <DrawerItem
            title="Cerrar Sesión"
            icon={this.leftIcon('md-exit')}
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
