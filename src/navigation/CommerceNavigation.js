import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { IconButton } from '../components/common';
// import ServicesList from '../components/commerce/ServicesList';
// import ServiceForm from '../components/commerce/ServiceForm';
import CourtList from '../components/commerce/CourtList';
import CourtForm from '../components/commerce/CourtForm';
import ScheduleRegister from '../components/commerce/ScheduleRegister';
import CommerceProfile from '../components/commerce/CommerceProfile';
import CommerceSchedule from '../components/commerce/CommerceSchedule';
import ScheduleRegisterConfiguration from '../components/commerce/ScheduleRegisterConfiguration';
import LocationMap from '../components/LocationMap';
import CommerceCourtsStateList from '../components/commerce/CommerceCourtsStateList';
import CommerceCourtReservations from '../components/commerce/CommerceCourtReservations';
import CommerceCourtReservationDetails from '../components/commerce/CommerceCourtReservationDetails';
import CommerceSchedulesList from '../components/commerce/CommerceSchedulesList';
import CommerceProfileView from '../components/CommerceProfileView';
import CommerceProfileInfo from '../components/CommerceProfileInfo';
import CommerceLocationMap from '../components/common/CommerceLocationMap';
import CommerceReviewsList from '../components/CommerceReviewsList';
import CommerceCourtReservationRegister from '../components/commerce/CommerceCourtReservationRegister';
import ClientProfileView from '../components/ClientProfileView';
import ClientReviewsList from '../components/ClientReviewsList';
// import Map from '../components/common/Map';
import {
  stackNavigationOptions,
  tabNavigationOptions
} from './NavigationOptions';
import DashBoard from '../components/commerce/reports/DashBoard';
import BarChartReport from '../components/commerce/reports/BarChartReport';
import LineChartMoneyReport from '../components/commerce/reports/LineChartMoneyReport';
import LineChartReviewsReport from '../components/commerce/reports/LineChartReviewsReport';
import PieChartReport from '../components/commerce/reports/PieChartReport';

// Aca hay un stack por cada tab que tiene el tab navigation

// como estas pantallas pueden accederse desde el calendar y desde reservas, las saque
// a un objeto y luego las agregue a cada uno de los stacks para no tener que duplicarlas
const reservationDetailsScreens = {
  reservationDetails: {
    screen: CommerceCourtReservationDetails,
    navigationOptions: {
      title: 'Detalles del Turno'
    }
  },
  clientProfileView: {
    screen: ClientProfileView,
    navigationOptions: {
      title: 'Perfil del Cliente'
    }
  },
  clientReviewsList: {
    screen: ClientReviewsList,
    navigationOptions: {
      title: 'Reseñas del Cliente'
    }
  }
};

const calendarStack = createStackNavigator(
  {
    calendar: {
      screen: CommerceSchedule,
      navigationOptions: ({ navigation }) => ({
        title: 'Calendario',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    schedulesList: {
      screen: CommerceSchedulesList,
      navigationOptions: {
        title: 'Horarios de Atención'
      }
    },
    scheduleRegister: {
      screen: ScheduleRegister
    },
    registerConfiguration: {
      screen: ScheduleRegisterConfiguration,
      navigationOptions: {
        title: 'Límites de turnos'
      }
    },
    commerceCourtsList: {
      screen: CommerceCourtsStateList
    },
    courtReservationRegister: {
      screen: CommerceCourtReservationRegister,
      navigationOptions: {
        title: 'Nuevo Turno'
      }
    },
    ...reservationDetailsScreens
  },
  stackNavigationOptions
);

/*
const servicesStack = createStackNavigator(
  {
    servicesList: {
      screen: ServicesList,
      navigationOptions: ({ navigation }) => ({
        title: 'Servicios',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
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
*/

const reservationsStack = createStackNavigator(
  {
    reservationsList: {
      screen: CommerceCourtReservations,
      navigationOptions: ({ navigation }) => ({
        title: 'Turnos',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    ...reservationDetailsScreens
  },
  stackNavigationOptions
);

const courtsStack = createStackNavigator(
  {
    courtsList: {
      screen: CourtList,
      navigationOptions: ({ navigation }) => ({
        title: 'Canchas',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
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
      screen: CommerceProfileView,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        ),
        headerRight: (
          <IconButton
            icon="md-create"
            onPress={() => navigation.navigate('profileEdit')}
          />
        )
      })
    },
    profileEdit: {
      screen: CommerceProfile,
      navigationOptions: ({ navigation }) => ({
        title: 'Editar Perfil',
        headerLeft: navigation.getParam('leftIcon'),
        headerRight: navigation.getParam('rightIcon')
      })
    },
    commerceProfileInfo: {
      screen: CommerceProfileInfo,
      navigationOptions: {
        title: 'Información'
      }
    },
    commerceLocationMap: {
      screen: CommerceLocationMap,
      navigationOptions: {
        title: 'Dirección'
      }
    },
    changeCommerceLocationMap: {
      screen: LocationMap,
      navigationOptions: {
        title: 'Modificar mi Dirección'
      }
    },
    commerceReviewsList: {
      screen: CommerceReviewsList,
      navigationOptions: {
        title: 'Reseñas del Comercio'
      }
    }
  },
  stackNavigationOptions
);
const reportsStack = createStackNavigator(
  {
    dashBoard: {
      screen: DashBoard,
      navigationOptions: ({ navigation }) => ({
        title: 'Reportes',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    barChartReport: {
      screen: BarChartReport,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Reportes'),
        headerRight: navigation.getParam('rightIcon')
      })
    },
    lineChartMoneyReport: {
      screen: LineChartMoneyReport,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Reportes'),
        headerRight: navigation.getParam('rightIcon')
      })
    },
    lineChartReviewsReport: {
      screen: LineChartReviewsReport,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Reportes'),
        headerRight: navigation.getParam('rightIcon')
      })
    },
    pieChartReport: {
      screen: PieChartReport,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Reportes')
      })
    }
  },
  stackNavigationOptions
);

// Aca se define el tab navigation y se agrega el stack correspondiente en cada tab

const commerceTabs = createBottomTabNavigator(
  {
    courts: courtsStack,
    reports: reportsStack,
    reservations: reservationsStack,
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
