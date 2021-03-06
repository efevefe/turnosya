import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import Constants from 'expo-constants';
import { MAIN_COLOR, NAVIGATION_HEIGHT } from '../../constants';

const Drawer = props => {
  const { profilePicture, profilePicturePlaceholder, onProfilePicturePress, name, role, children } = props;

  renderName = name => {
    if (!!name) {
      return <Text style={styles.nameStyle}>{name}</Text>;
    }
  };

  renderRole = role => {
    if (role) {
      return <Text style={styles.roleStyle}>{role}</Text>;
    }
  };

  return (
    <View>
      <View style={styles.drawerHeader}>
        <Image source={require('../../../assets/header-logo.png')} style={styles.headerLogo} />
      </View>
      <View style={styles.drawerHeaderContainer}>
        <Avatar
          rounded
          source={profilePicture ? { uri: profilePicture } : null}
          size={90}
          icon={{ name: profilePicturePlaceholder }}
          containerStyle={styles.avatarStyle}
          onPress={onProfilePicturePress}
        />
        {this.renderName(name)}
        {this.renderRole(role)}
      </View>
      <Divider style={styles.dividerStyle} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerHeaderContainer: {
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  drawerHeader: {
    height: Constants.statusBarHeight + NAVIGATION_HEIGHT,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  headerLogo: {
    height: 30, //50 es el size maximo
    width: 210, //230 es el size maximo
    marginBottom: 10
  },
  nameStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center'
  },
  roleStyle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 0
  },
  avatarStyle: {
    borderWidth: 3,
    borderColor: MAIN_COLOR,
    margin: 10
  },
  dividerStyle: {
    backgroundColor: 'grey',
    marginTop: 4,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15
  }
});

export { Drawer };
