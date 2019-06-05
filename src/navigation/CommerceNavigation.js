import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ServicesList from '../components/ServicesList';
import ServiceForm from '../components/ServiceForm';
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

const rightIcon = (navigation, icon, nextScreen) => <Icon
    name={icon}
    style={{ marginRight: 15 }}
    size={30}
    color='white'
    onPress={() => navigation.navigate(nextScreen)}
/>

const commerceScreenStack = createStackNavigator({
    servicesList: {
        screen: ServicesList,
        navigationOptions: ({ navigation }) => ({
            title: 'Servicios',
            headerRight: rightIcon(navigation, 'add', 'serviceForm')
        })
    },
    serviceForm: {
        screen: ServiceForm,
        navigationOptions: ({ navigation }) => ({
            title: navigation.getParam('title', 'Nuevo Servicio')
        })
    }
},
    navigationOptions
)

const CommerceNavigation = createAppContainer(commerceScreenStack)

export default CommerceNavigation;