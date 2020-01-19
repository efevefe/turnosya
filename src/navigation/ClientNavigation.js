import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { IconButton } from '../components/common';
import ClientProfile from '../components/client/ClientProfile';
import CommercesList from '../components/client/CommercesList';
import FavoriteCommercesList from '../components/client/FavoriteCommercesList';
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
import CommercesMap from '../components/common/CommercesMap';
import CommerceLocationMap from '../components/common/CommerceLocationMap';
import ClientReviewsList from '../components/ClientReviewsList';
import CommerceProfileView from '../components/CommerceProfileView';
import CommerceProfileInfo from '../components/CommerceProfileInfo';
import CommerceReviewsList from '../components/CommerceReviewsList';

// Aca hay un stack por cada tab que tiene el tab navigation

// como estas pantallas pueden accederse desde la lupita y desde favoritos, las saque
// a un objeto y luego las agregue a cada uno de los stacks para no tener que duplicarlas
const reservationScreens = {
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
    screen: CommerceLocationMap,
    navigationOptions: {
      title: 'Dirección'
    }
  },
  commerceLocationMap: {
    screen: CommerceLocationMap,
    navigationOptions: {
      title: 'Dirección'
    }
  },
  commerceSchedule: {
    screen: ClientCommerceSchedule,
    navigationOptions: {
      title: 'Turnos Disponibles'
    }
  },
  commerceCourtsList: {
    screen: CommerceCourtsList
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
      title: 'Reseñas del Comercio'
    }
  }
};

const filtersStack = createStackNavigator(
  {
    commercesFiltersScreen: {
      screen: CommercesFiltersScreen,
      navigationOptions: {
        headerStyle: {
          ...stackNavigationOptions.defaultNavigationOptions.headerStyle,
          borderBottomWidth: 0,
          elevation: 0
        }
      }
    },
    commercesFiltersMap: {
      screen: CommercesFiltersMap,
      navigationOptions: {
        title: 'Seleccionar ubicación'
      }
    }
  },
  {
    ...stackNavigationOptions,
    mode: 'modal' // necesito iOS para ver si funca esto (Nico)
  }
);

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
    commercesListMap: {
      screen: CommercesMap,
      navigationOptions: {
        title: 'Buscar Negocios'
      }
    },
    ...reservationScreens,
    filtersStack: {
      screen: filtersStack,
      navigationOptions: {
        header: null
      }
    }
  },
  stackNavigationOptions
);

searchStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;

  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === 'filtersStack') {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return { tabBarVisible };
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
    },
    ...reservationScreens
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
    },
    clientReviewsList: {
      screen: ClientReviewsList,
      navigationOptions: {
        title: 'Reseñas del Cliente'
      }
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
