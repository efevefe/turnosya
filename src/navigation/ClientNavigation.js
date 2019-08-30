import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import EmptyScreen from '../components/EmptyScreen';
import ClientProfile from '../components/ClientProfile';
import CommercesList from '../components/CommercesList';
import FavoriteCommercesList from '../components/FavoriteCommercesList';
import {
  stackNavigationOptions,
  tabNavigationOptions
} from './NavigationOptions';

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
    commercesList: {
      screen: CommercesList,
      navigationOptions: ({ navigation }) => ({
        title: 'Buscar Negocios',
        headerLeft: leftIcon(navigation, 'md-menu')
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
      screen: FavoriteCommercesList,
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

// Aca se define el tab navigation y se agrega el stack correspondiente en cada tab

const clientTabs = createBottomTabNavigator(
  {
    search: searchStack,
    calendar: calendarStack,
    favorites: favoritesStack,
    profile: profileStack
  },
  {
    ...tabNavigationOptions,
    initialRouteName: 'favorites'
  }
);

const ClientNavigation = createAppContainer(clientTabs);

export default ClientNavigation;
