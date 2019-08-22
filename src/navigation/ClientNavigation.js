import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EmptyScreen from '../components/EmptyScreen';
import ClientProfile from '../components/ClientProfile';
import CommercesList from '../components/CommercesList';
import { MAIN_COLOR } from '../constants';
import CommercesAreas from '../components/CommercesAreas';
import { View } from 'native-base';

// Stack navigation options

const stackNavigationOptions = {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: MAIN_COLOR,
      height: 50
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      textAlign: 'center',
      alignSelf: 'center',
      fontSize: 18,
      color: 'white',
      fontWeight: 'bold'
    }
  }
};

const rightIcon = (navigation, icon, nextScreen) => (
  <Ionicons
    name={icon}
    size={28}
    color="white"
    style={{ marginRight: 15 }}
    onPress={() => navigation.navigate(nextScreen)}
  />
);

const leftIcon = (navigation, icon) => (
  <Ionicons
    name={icon}
    size={28}
    color="white"
    style={{ marginLeft: 15 }}
    onPress={() => navigation.openDrawer()}
  />
);

// Aca hay un stack por cada tab que tiene el tab navigation

const searchStack = createStackNavigator(
  {
    commercesAreas: {
      screen: CommercesAreas,
      navigationOptions: ({ navigation }) => ({
        title: 'Buscar Negocios',
        // headerRight: rightIcon(navigation, 'md-arrow-forward', 'commercesList'),
        headerLeft: leftIcon(navigation, 'md-menu')
      })
    },
    commercesList: {
      screen: CommercesList,
      navigationOptions: ({ navigation }) => ({
        title: 'Buscar Negocios'
      })
    }
  },
  stackNavigationOptions
);

const calendarStack = createStackNavigator(
  {
    reservations: {
      screen: EmptyScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Mis Turnos',
        headerLeft: leftIcon(navigation, 'md-menu')
      })
    }
  },
  stackNavigationOptions
);

const favoritesStack = createStackNavigator(
  {
    favoritesList: {
      screen: EmptyScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Favoritos',
        headerLeft: leftIcon(navigation, 'md-menu')
      })
    }
  },
  stackNavigationOptions
);

const profileStack = createStackNavigator(
  {
    profile: {
      screen: ClientProfile,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft:
          navigation.getParam('leftIcon') || leftIcon(navigation, 'md-menu')
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

      if (routeName === 'search') {
        iconName = `md-search`;
      } else if (routeName === 'calendar') {
        iconName = `md-calendar`;
      } else if (routeName === 'favorites') {
        iconName = `md-heart`;
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
  initialRouteName: 'search',
  tabBarOptions: {
    showLabel: false,
    activeTintColor: 'white',
    inactiveTintColor: 'white',
    style: {
      backgroundColor: MAIN_COLOR,
      height: 50
    }
  }
};

// Aca se define el tab navigation y se agrega el stack correspondiente en cada tab

const clientTabs = createBottomTabNavigator(
  {
    search: searchStack,
    calendar: calendarStack,
    favorites: favoritesStack,
    profile: profileStack
  },
  tabNavigationOptions
);

const ClientNavigation = createAppContainer(clientTabs);

export default ClientNavigation;
