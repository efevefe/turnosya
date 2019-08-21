import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Avatar, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { DrawerItem } from '../components/common';
import { onCommerceOpen, onLogout, onUserRead } from '../actions';
import { MAIN_COLOR } from '../constants';

class ClientDrawerContent extends Component {
  componentWillMount() {
    this.props.onUserRead();
  }

  renderFullName = () => {
    const { firstName, lastName } = this.props;

    if (firstName || lastName) {
      return <Text style={styles.fullName}>{`${firstName} ${lastName}`}</Text>;
    }
  };

  render() {
    return (
      <ScrollView>
        <View style={{
          height: Constants.statusBarHeight + 50,
          backgroundColor: MAIN_COLOR,
          justifyContent: 'flex-end'
        }}>
          <Image
            source={require('../../assets/header-logo.png')}
            style={{ height: 50, width: 230 }}
          />
        </View>
        <SafeAreaView
          style={{ flex: 1 }}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
          <View style={styles.drawerHeaderContainer} >
            <Avatar
              rounded
              source={this.props.profilePicture ? { uri: this.props.profilePicture } : null}
              size={90}
              icon={{ name: 'person' }}
              containerStyle={styles.avatarStyle}
              onPress={() => this.props.navigation.navigate('profile')}
            />
            {this.renderFullName()}
          </View>
          <Divider style={styles.dividerStyle} />
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
            loadingWithText={this.props.loading}
            onPress={() => this.props.onLogout()}
          />
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  drawerHeaderContainer: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  avatarStyle: {
    borderWidth: 3,
    borderColor: MAIN_COLOR,
    margin: 10,
    marginTop: 0
  },
  dividerStyle: {
    backgroundColor: 'grey',
    margin: 5,
    marginLeft: 15,
    marginRight: 15
  }
});

const mapStateToProps = state => {
  const { profilePicture, firstName, lastName } = state.clientData;
  const { loading } = state.auth;

  return { profilePicture, firstName, lastName, loading };
};

export default connect(
  mapStateToProps,
  { onCommerceOpen, onLogout, onUserRead }
)(ClientDrawerContent);
