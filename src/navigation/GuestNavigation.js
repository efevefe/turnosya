import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginForm from '../components/LoginForm';

const navigationOptions = {
  headerMode: 'none'
};

const guestScreenStack = createStackNavigator(
  {
    loginForm: {
      screen: LoginForm
    }
  },
  navigationOptions
);

export default createAppContainer(guestScreenStack);
