import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { IconButton } from '../components/common';
import EmptyScreen from '../components/EmptyScreen';
import GeocodingScreen from '../components/GeocodingScreen';
import ClientProfile from '../components/ClientProfile';
import CommercesList from '../components/CommercesList';
import FavoriteCommercesList from '../components/FavoriteCommercesList';
import CommerceCourtTypes from '../components/CommerceCourtTypes';
import {
  stackNavigationOptions,
  tabNavigationOptions
} from './NavigationOptions';
import CommercesAreas from '../components/CommercesAreas';
import ClientCommerceSchedule from '../components/ClientCommerceSchedule';
import CommerceCourtsList from '../components/CommerceCourtsList';
import ConfirmCourtReservation from '../components/ConfirmCourtReservation';

// Aca hay un stack por cada tab que tiene el tab navigation

const searchStack = createStackNavigator(
  {
    commercesAreas: {
      screen: CommercesAreas,
      navigationOptions: ({ navigation }) => ({
        title: 'Buscar Negocios',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    commercesList: {
      screen: CommercesList,
      navigationOptions: {
        title: 'Buscar Negocios'
      }
    },
    commerceCourtTypes: {
      screen: CommerceCourtTypes,
      navigationOptions: {
        title: 'Tipos de Cancha'
      }
    },
    commerceSchedule: {
      screen: ClientCommerceSchedule,
      navigationOptions: {
        title: 'Turnos Disponibles'
      }
    },
    commerceCourtsList: {
      screen: CommerceCourtsList,
      navigationOptions: {
        title: 'Canchas Disponibles'
      }
    },
    confirmCourtReservation: {
      screen: ConfirmCourtReservation,
      navigationOptions: {
        title: 'Turno'
      }
    }
  },
  stackNavigationOptions
);

const calendarStack = createStackNavigator(
  {
    reservations: {
      screen: GeocodingScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Mis Turnos',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
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
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
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
        headerLeft: navigation.getParam('leftIcon') || (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
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
    initialRouteName: 'search'
  }
);

const ClientNavigation = createAppContainer(clientTabs);

export default ClientNavigation;
