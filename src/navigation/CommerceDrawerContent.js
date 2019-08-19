import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { onLogout } from '../actions/AuthActions';
import { DrawerItem } from '../components/common';

class CommerceDrawerContent extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView
          style={{ flex: 1 }}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
          <DrawerItem
            title="Ser Cliente"
            icon='md-person'
            onPress={() => this.props.navigation.navigate('client')}
          />
          <DrawerItem
            title="Configuración"
            icon='md-settings'
            onPress={() => this.props.navigation.navigate('commerceSettings')}
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
  { onLogout }
)(CommerceDrawerContent);
