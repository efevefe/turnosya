import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import ServicesList from '../components/ServicesList';
import ServiceForm from '../components/ServiceForm';
import CourtList from '../components/CourtList';
import CourtForm from '../components/CourtForm';
import ScheduleRegister from '../components/ScheduleRegister';
import CommerceProfile from '../components/CommerceProfile';
import CommerceSchedule from '../components/CommerceSchedule';
import ScheduleRegisterConfiguration from '../components/ScheduleRegisterConfiguration';
import { stackNavigationOptions, tabNavigationOptions } from './NavigationOptions';

const rightIcon = (navigation, icon, nextScreen) => (
  <Ionicons
    name={icon}
    size={30}
    color="white"
    style={{ marginRight: 15 }}
    onPress={() => navigation.navigate(nextScreen)}
  />
);

const leftIcon = (navigation, icon) => (
  <Ionicons
    name={icon}
    size={30}
    color="white"
    style={{ marginLeft: 15 }}
    onPress={() => navigation.openDrawer()}
  />
);

// Aca hay un stack por cada tab que tiene el tab navigation

const calendarStack = createStackNavigator(
  {
    calendar: {
      screen: CommerceSchedule,
      navigationOptions: ({ navigation }) => ({
        title: 'Calendario',
        headerLeft: leftIcon(navigation, 'md-menu')
      })
    },
    scheduleRegister: {
      screen: ScheduleRegister,
      navigationOptions: {
        title: 'Generar calendario'
      }
    },
    registerConfiguration: {
      screen: ScheduleRegisterConfiguration,
      navigationOptions: {
        title: 'Límites de turnos'
      }
    }
  },
  stackNavigationOptions
);

const servicesStack = createStackNavigator(
  {
    servicesList: {
      screen: ServicesList,
      navigationOptions: ({ navigation }) => ({
        title: 'Servicios',
        headerRight: rightIcon(navigation, 'md-add', 'serviceForm'),
        headerLeft: leftIcon(navigation, 'md-menu')
      })
    },
    serviceForm: {
      screen: ServiceForm,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Nuevo Servicio')
      })
    }
  },
  stackNavigationOptions
);

const courtsStack = createStackNavigator(
  {
    courtsList: {
      screen: CourtList,
      navigationOptions: ({ navigation }) => ({
        title: 'Canchas',
        headerRight: rightIcon(navigation, 'md-add', 'courtForm'),
        headerLeft: leftIcon(navigation, 'md-menu')
      })
    },
    courtForm: {
      screen: CourtForm,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Nueva Cancha')
      })
    }
  },
  stackNavigationOptions
);

const profileStack = createStackNavigator(
  {
    profile: {
      screen: CommerceProfile,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft:
          navigation.getParam('leftIcon') || leftIcon(navigation, 'md-menu')
      })
    }
  },
  stackNavigationOptions
);

// Aca se define el tab navigation y se agrega el stack correspondiente en cada tab

const commerceTabs = createBottomTabNavigator(
  {
    courts: courtsStack,
    services: servicesStack,
    calendar: calendarStack,
    profile: profileStack
  },
  {
    ...tabNavigationOptions,
    initialRouteName: 'calendar'
  }
);

const CommerceNavigation = createAppContainer(commerceTabs);

export default CommerceNavigation;
