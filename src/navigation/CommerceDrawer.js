import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import { SportsNavigation, HairdressersNavigation } from './CommerceNavigation';
import CommerceDrawerContent from './CommerceDrawerContent';
import CommerceSettings from '../components/commerce/CommerceSettings';
import PaymentSettings from '../components/commerce/PaymentSettings';
import PaymentSettingsWeb from '../components/commerce/PaymentSettingsWeb';
import EmployeesList from '../components/commerce/EmployeesList';
import EmployeeForm from '../components/commerce/EmployeeForm';
import { stackNavigationOptions, drawerNavigationOptions } from './NavigationOptions';

const CommerceSettingsStack = createStackNavigator(
  {
    settings: {
      screen: CommerceSettings,
      navigationOptions: {
        title: 'Configuración',
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="white" title="Back" />
      }
    },
    paymentSettings: {
      screen: PaymentSettings,
      navigationOptions: {
        title: 'Mercado Pago'
      }
    },
    paymentSettingsWeb: {
      screen: PaymentSettingsWeb,
      navigationOptions: {
        title: 'Mercado Pago'
      }
    }
  },
  stackNavigationOptions
);

const CommerceEmployeesStack = createStackNavigator(
  {
    employeesList: {
      screen: EmployeesList,
      navigationOptions: ({ navigation }) => ({
        title: 'Empleados',
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="white" title="Back" />
      })
    },
    employeeForm: {
      screen: EmployeeForm,
      navigationOptions: {
        title: 'Empleado'
      }
    }
  },
  stackNavigationOptions
);

const commonNavigations = {
  commerceSettings: CommerceSettingsStack,
  commerceEmployees: CommerceEmployeesStack
};

const sportsDrawer = createDrawerNavigator(
  {
    sportsNavigation: SportsNavigation,
    ...commonNavigations
  },
  {
    ...drawerNavigationOptions,
    contentComponent: CommerceDrawerContent
  }
);

const hairdressersDrawer = createDrawerNavigator(
  {
    hairdressersNavigation: HairdressersNavigation,
    ...commonNavigations
  },
  {
    ...drawerNavigationOptions,
    contentComponent: CommerceDrawerContent
  }
);

const SportsDrawer = createAppContainer(sportsDrawer);
const HairdressersDrawer = createAppContainer(hairdressersDrawer);

export { SportsDrawer, HairdressersDrawer };
