import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { stackNavigationOptions } from './NavigationOptions';

const guestScreenStack = createStackNavigator(
  {
    loginForm: {
      screen: LoginForm,
      navigationOptions: {
        header: null
      }
    },
    registerForm: {
      screen: RegisterForm,
      navigationOptions: {
        title: 'Registrarse'
      }
    }
  },
  stackNavigationOptions
);

export default createAppContainer(guestScreenStack);
