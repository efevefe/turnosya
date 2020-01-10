import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator, HeaderBackButton } from 'react-navigation-stack';
import CommerceNavigation from './CommerceNavigation';
import CommerceDrawerContent from './CommerceDrawerContent';
import CommerceSettings from '../components/commerce/CommerceSettings';
import EmployeesList from '../components/commerce/EmployeesList';
import EmployeeForm from '../components/commerce/EmployeeForm';
import {
  stackNavigationOptions,
  drawerNavigationOptions
} from './NavigationOptions';

const CommerceSettingsStack = createStackNavigator(
  {
    settings: {
      screen: CommerceSettings,
      navigationOptions: {
        title: 'Configuración'
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
        headerLeft: (
          <HeaderBackButton
            onPress={() => navigation.goBack(null)}
            tintColor="white"
          />
        )
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

const commerceDrawer = createDrawerNavigator(
  {
    tabs: CommerceNavigation,
    commerceSettings: CommerceSettingsStack,
    commerceEmployees: CommerceEmployeesStack
  },
  {
    ...drawerNavigationOptions,
    contentComponent: CommerceDrawerContent
  }
);

const CommerceDrawer = createAppContainer(commerceDrawer);

export default CommerceDrawer;
