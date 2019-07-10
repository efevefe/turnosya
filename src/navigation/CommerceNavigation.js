import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServicesList from '../components/ServicesList';
import ServiceForm from '../components/ServiceForm';
import CourtList from '../components/CourtList';
import CourtForm from '../components/CourtForm';

import { MAIN_COLOR } from '../constants';

const navigationOptions = {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: MAIN_COLOR
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold'
    }
  }
};

const rightIcon = (navigation, icon, nextScreen) => (
  <Icon
    name={icon}
    size={30}
    color="white"
    style={{ marginRight: 15 }}
    onPress={() => navigation.navigate(nextScreen)}
  />
);

const leftIcon = (navigation, icon) => (
  <Icon
    name={icon}
    size={30}
    color="white"
    style={{ marginLeft: 15 }}
    onPress={() => navigation.openDrawer()}
  />
);

const commerceScreenStack = createStackNavigator(
  {
    courtList: {
      screen: CourtList,
      navigationOptions: ({ navigation }) => ({
        title: 'Canchas',
        headerRight: rightIcon(navigation, 'add', 'courtForm'),
        headerLeft: leftIcon(navigation, 'menu')
      })
    },
    courtForm: {
      screen: CourtForm,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Nueva Cancha')
      })
    }
  },

  //     servicesList: {
  //         screen: ServicesList,
  //         navigationOptions: ({ navigation }) => ({
  //             title: 'Servicios',
  //             headerRight: rightIcon(navigation, 'add', 'serviceForm'),
  //             headerLeft: leftIcon(navigation, 'menu')
  //         })
  //     },
  //     serviceForm: {
  //         screen: ServiceForm,
  //         navigationOptions: ({ navigation }) => ({
  //             title: navigation.getParam('title', 'Nuevo Servicio'),
  //         })
  //     }
  // },
  navigationOptions
);

const CommerceNavigation = createAppContainer(commerceScreenStack);

export default CommerceNavigation;
