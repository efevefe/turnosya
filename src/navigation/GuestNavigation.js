import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { MAIN_COLOR } from '../constants';

const navigationOptions = {
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

const guestScreenStack = createStackNavigator(
  {
    loginForm: {
      screen: LoginForm,
      navigationOptions: () => ({
        header: null
      })
    },
    registerForm: {
      screen: RegisterForm,
      navigationOptions: ({ navigation }) => ({
        title: 'Registrarse'
      })
    }
  },
  navigationOptions
);

export default createAppContainer(guestScreenStack);
