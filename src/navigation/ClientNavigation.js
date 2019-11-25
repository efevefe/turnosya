import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { IconButton } from '../components/common';
import ClientProfile from '../components/client/ClientProfile';
import CommercesList from '../components/client/CommercesList';
import FavoriteCommercesList from '../components/client/FavoriteCommercesList';
import CommerceCourtTypes from '../components/client/CommerceCourtTypes';
import {
  stackNavigationOptions,
  tabNavigationOptions
} from './NavigationOptions';
import CommercesAreas from '../components/client/CommercesAreas';
import ClientCommerceSchedule from '../components/client/ClientCommerceSchedule';
import CommerceCourtsList from '../components/client/CommerceCourtsList';
import ConfirmCourtReservation from '../components/client/ConfirmCourtReservation';
import ClientReservationsList from '../components/client/ClientReservationsList';
import ClientReservationDetails from '../components/client/ClientReservationDetails';
import CommercesFiltersScreen from '../components/client/CommercesFiltersScreen';
import CommercesFiltersMap from '../components/client/CommercesFiltersMap';
import Map from '../components/common/Map';

import CommerceProfileView from '../components/CommerceProfileView';
import CommerceProfileInfo from '../components/CommerceProfileInfo';
import CommerceReviewsList from '../components/CommerceReviewsList';
// Aca hay un stack por cada tab que tiene el tab navigation

const mainSearchStack = createStackNavigator(
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
    commercesListMap: {
      screen: Map,
      navigationOptions: {
        title: 'Buscar Negocios'
      }
    },
    commerceProfileView: {
      screen: CommerceProfileView,
      navigationOptions: {
        title: 'Perfil'
      }
    },
    commerceProfileInfo: {
      screen: CommerceProfileInfo,
      navigationOptions: {
        title: 'Información'
      }
    },
    showMyAddressMap: {
      screen: Map,
      navigationOptions: {
        title: 'Dirección'
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
    },
    commerceReviewsList: {
      screen: CommerceReviewsList,
      navigationOptions: {
        title: 'Reviews'
      }
    }
  },
  stackNavigationOptions
);

const searchStack = createStackNavigator(
  {
    main: {
      screen: mainSearchStack
    },
    commercesFiltersScreen: {
      screen: CommercesFiltersScreen
    },
    commercesFiltersMap: {
      screen: CommercesFiltersMap
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

searchStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (
        route.routeName === 'commercesFiltersScreen' ||
        route.routeName === 'commercesFiltersMap'
      ) {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};

const calendarStack = createStackNavigator(
  {
    reservations: {
      screen: ClientReservationsList,
      navigationOptions: ({ navigation }) => ({
        title: 'Mis Turnos',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    reservationDetails: {
      screen: ClientReservationDetails,
      navigationOptions: {
        title: 'Detalle del Turno'
      }
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
