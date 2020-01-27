import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { IconButton } from '../components/common';
import { stackNavigationOptions, tabNavigationOptions } from './NavigationOptions';
import { ROLES } from '../constants';
import ServicesList from '../components/commerce/ServicesList';
import ServiceForm from '../components/commerce/ServiceForm';
import CourtList from '../components/commerce/CourtList';
import CourtForm from '../components/commerce/CourtForm';
import ScheduleRegister from '../components/commerce/ScheduleRegister';
import CommerceProfile from '../components/commerce/CommerceProfile';
import ScheduleRegisterConfiguration from '../components/commerce/ScheduleRegisterConfiguration';
import LocationMap from '../components/LocationMap';
import CommerceCourtsStateList from '../components/commerce/CommerceCourtsStateList';
import CommerceReservationsList from '../components/commerce/CommerceReservationsList';
import CommerceReservationDetails from '../components/commerce/CommerceReservationDetails';
import CommerceSchedulesList from '../components/commerce/CommerceSchedulesList';
import CommerceProfileView from '../components/CommerceProfileView';
import CommerceProfileInfo from '../components/CommerceProfileInfo';
import CommerceLocationMap from '../components/common/CommerceLocationMap';
import CommerceReviewsList from '../components/CommerceReviewsList';
import CommerceCourtReservationRegister from '../components/commerce/CommerceCourtReservationRegister';
import ClientProfileView from '../components/ClientProfileView';
import ClientReviewsList from '../components/ClientReviewsList';
import PermissionsAssigner from '../components/common/PermissionsAssigner';
import DashBoard from '../components/commerce/reports/DashBoard';
import DailyReservationsChart from '../components/commerce/reports/DailyReservationsChart';
import MonthlyEarningsChart from '../components/commerce/reports/MonthlyEarningsChart';
import MonthlyReviewsChart from '../components/commerce/reports/MonthlyReviewsChart';
import ReservedAndCancelledShiftChart from '../components/commerce/reports/ReservedAndCancelledShiftChart';
import MostPopularShiftsChart from '../components/commerce/reports/MostPopularShiftsChart';
import CommerceCourtsSchedule from '../components/commerce/CommerceCourtsSchedule';
import CommerceServicesSchedule from '../components/commerce/CommerceServicesSchedule';
import CommerceServiceReservationRegister from '../components/commerce/CommerceServiceReservationRegister';
import EmployeeServicesList from '../components/commerce/EmployeeServicesList';

// Aca hay un stack por cada tab que tiene el tab navigation

// como estas pantallas pueden accederse desde el calendar y desde reservas, las saque
// a un objeto y luego las agregue a cada uno de los stacks para no tener que duplicarlas
const reservationDetailsScreens = {
  reservationDetails: {
    screen: CommerceReservationDetails,
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
    sportsCalendar: {
      screen: CommerceCourtsSchedule,
      navigationOptions: ({ navigation }) => ({
        title: 'Calendario',
        headerLeft: <IconButton icon="md-menu" onPress={navigation.openDrawer} />
      })
    },
    hairdressersCalendar: {
      screen: CommerceServicesSchedule,
      navigationOptions: ({ navigation }) => ({
        title: 'Calendario',
        headerLeft: <IconButton icon="md-menu" onPress={navigation.openDrawer} />
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
    employeeServicesList: {
      screen: EmployeeServicesList
    },
    serviceReservationRegister: {
      screen: CommerceServiceReservationRegister,
      navigationOptions: {
        title: 'Nuevo Turno'
      }
    },
    ...reservationDetailsScreens
  },
  stackNavigationOptions
);

const reservationsStack = createStackNavigator(
  {
    reservationsList: {
      screen: CommerceReservationsList,
      navigationOptions: ({ navigation }) => ({
        title: 'Turnos',
        headerLeft: <IconButton icon="md-menu" onPress={navigation.openDrawer} />
      })
    },
    ...reservationDetailsScreens
  },
  stackNavigationOptions
);

const profileStack = createStackNavigator(
  {
    profile: {
      screen: CommerceProfileView,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: <IconButton icon="md-menu" onPress={navigation.openDrawer} />,
        headerRight: (
          <PermissionsAssigner requiredRole={ROLES.ADMIN}>
            <IconButton icon="md-create" onPress={() => navigation.navigate('profileEdit')} />
          </PermissionsAssigner>
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
        headerLeft: <IconButton icon="md-menu" onPress={navigation.openDrawer} />
      })
    },
    dailyReservationsChart: {
      screen: DailyReservationsChart,
      navigationOptions: {
        title: 'Reservas por Día'
      }
    },
    monthlyEarningsChart: {
      screen: MonthlyEarningsChart,
      navigationOptions: {
        title: 'Ingresos Mensuales'
      }
    },
    monthlyReviewsChart: {
      screen: MonthlyReviewsChart,
      navigationOptions: {
        title: 'Mis Calificaciones'
      }
    },
    reservedAndCancelledShiftChart: {
      screen: ReservedAndCancelledShiftChart,
      navigationOptions: {
        title: 'Cancelados/Realizados'
      }
    },
    mostPopularShiftsChart: {
      screen: MostPopularShiftsChart,
      navigationOptions: {
        title: 'Horarios más populares'
      }
    }
  },
  stackNavigationOptions
);

// SCREENS ONLY FOR HAIRDRESSERS COMMERCES
const servicesStack = createStackNavigator(
  {
    servicesList: {
      screen: ServicesList,
      navigationOptions: ({ navigation }) => ({
        title: 'Servicios',
        headerLeft: <IconButton icon="md-menu" onPress={navigation.openDrawer} />
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

// SCREENS ONLY FOR SPORTS COMMERCES
const courtsStack = createStackNavigator(
  {
    courtsList: {
      screen: CourtList,
      navigationOptions: ({ navigation }) => ({
        title: 'Canchas',
        headerLeft: <IconButton icon="md-menu" onPress={navigation.openDrawer} />
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

// Aca se define el tab navigation y se agrega el stack correspondiente en cada tab

// TABS FOR BOTH AREAS
const commonTabs = {
  reports: reportsStack,
  reservations: reservationsStack,
  calendar: calendarStack,
  profile: profileStack
};

// TABS FOR SPORTS COMMERCES
const sportsTabs = createBottomTabNavigator(
  {
    courts: courtsStack,
    ...commonTabs
  },
  {
    ...tabNavigationOptions,
    initialRouteName: 'calendar'
  }
);

// TABS FOR HAIRDRESSERS COMMERCES
const hairdressersTabs = createBottomTabNavigator(
  {
    services: servicesStack,
    ...commonTabs
  },
  {
    ...tabNavigationOptions,
    initialRouteName: 'calendar'
  }
);

const SportsNavigation = createAppContainer(sportsTabs);
const HairdressersNavigation = createAppContainer(hairdressersTabs);

export { SportsNavigation, HairdressersNavigation };
