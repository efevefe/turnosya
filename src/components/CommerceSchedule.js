import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuItem } from '../components/common';
import { Divider } from 'react-native-elements';

class CommerceSchedule extends Component {
  state = { modal: false };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.getParam('rightIcon')
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({
      rightIcon: this.renderConfigurationButton()
    });
  }

  renderConfigurationButton = () => {
    return (
      <Ionicons
        name="md-options"
        size={28}
        color="white"
        style={{ marginRight: 15 }}
        onPress={() => this.setState({ modal: true })}
      />
    );
  };

  onScheduleShiftPress = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'registerSchedule'
    });

    this.setState({ modal: false });

    //hay que ver la forma de que esto se haga en el .then() del update()
    this.props.navigation.navigate(navigateAction);
  };

  onScheduleConfigurationPress = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'registerConfiguration'
    });

    this.setState({ modal: false });

    //hay que ver la forma de que esto se haga en el .then() del update()
    this.props.navigation.navigate(navigateAction);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch'
        }}
      >
        <Text style={{ padding: 20, textAlign: 'center' }}>
          Acá iría todo el calendario con turnos del commerce
        </Text>

        <Menu
          title="Configuración de diagramación"
          onBackdropPress={() => this.setState({ modal: false })}
          isVisible={this.state.modal}
        >
          <MenuItem
            title="Días y horarios de atención"
            icon="md-grid"
            onPress={this.onScheduleShiftPress}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Tiempo límite y mínimo de turno"
            icon="md-timer"
            onPress={this.onScheduleConfigurationPress}
          />
        </Menu>
      </View>
    );
  }
}

export default CommerceSchedule;
