import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import ServicesList from '../components/ServicesList';
import ServiceForm from '../components/ServiceForm';
import EmptyScreen from '../components/EmptyScreen';
import { MAIN_COLOR } from '../constants';
import RegisterCommerceProfile from '../components/RegisterCommerceProfile';

// Stack navigation options

const stackNavigationOptions = {
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
      screen: EmptyScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Calendario',
        headerLeft: leftIcon(navigation, 'md-menu')
      })
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
      screen: EmptyScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Canchas',
        headerRight: rightIcon(navigation, 'md-add', 'serviceForm'),
        headerLeft: leftIcon(navigation, 'md-menu')
      })
    }
  },
  stackNavigationOptions
);

const profileStack = createStackNavigator(
  {
    profile: {
      screen: EmptyScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: leftIcon(navigation, 'md-menu'),
        headerRight: rightIcon(navigation, 'md-create', 'editProfile')
      })
    },
    editProfile: {
      screen: RegisterCommerceProfile,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil'
      })
    }
  },
  stackNavigationOptions
);

// Tab navigation options

const tabNavigationOptions = {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;

      if (routeName === 'courts') {
        iconName = `md-football`;
      } else if (routeName === 'services') {
        iconName = `md-cut`;
      } else if (routeName === 'calendar') {
        iconName = `md-calendar`;
      } else if (routeName === 'profile') {
        iconName = `md-person`;
      }

      return (
        <Ionicons
          name={iconName}
          size={30}
          color={tintColor}
          style={{ opacity: focused ? 1 : 0.5 }}
        />
      );
    }
  }),
  tabBarOptions: {
    showLabel: false,
    activeTintColor: 'white',
    inactiveTintColor: 'white',
    style: {
      backgroundColor: '#c72c41',
      height: 50
    }
  }
};

// Aca se define el tab navigation y se agrega el stack correspondiente en cada tab

const commerceTabs = createBottomTabNavigator(
  {
    courts: courtsStack,
    services: servicesStack,
    calendar: calendarStack,
    profile: profileStack
  },
  tabNavigationOptions
);

const CommerceNavigation = createAppContainer(commerceTabs);

export default CommerceNavigation;
