import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem, Divider, Badge } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem } from '../common';
import { SUCCESS_COLOR, MAIN_COLOR } from '../../constants';
import { onServiceDelete, onFormOpen, onServiceOfferingUpdate } from '../../actions';

class ServicesListItem extends Component {
  state = { optionsVisible: false, deleteVisible: false };

  onOptionsPress = () => {
    this.setState({ optionsVisible: !this.state.optionsVisible });
  };

  onDeletePress = () => {
    this.setState({
      optionsVisible: false,
      deleteVisible: !this.state.deleteVisible,
    });
  };

  onConfirmDeletePress = () => {
    const { service, commerceId } = this.props;

    this.props.onServiceDelete({ id: service.id, commerceId });
    this.setState({ deleteVisible: !this.deleteVisible });
  };

  onUpdatePress = () => {
    this.props.onFormOpen();
    const navigateAction = NavigationActions.navigate({
      routeName: 'serviceForm',
      params: { service: this.props.service, title: 'Editar Servicio' },
    });

    this.setState({ optionsVisible: !this.state.optionsVisible });

    this.props.navigation.navigate(navigateAction);
  };

  onBadgePress = () => {
    const { service, commerceId, employeeId } = this.props;
    let employeesIds = [];

    if (this.isEmployeeOfferingService()) {
      employeesIds = service.employeesIds.filter(id => id !== employeeId);
    } else {
      employeesIds = [...service.employeesIds, employeeId];
    }

    onServiceOfferingUpdate({
      id: service.id,
      employeesIds,
      commerceId,
    });
  };

  isEmployeeOfferingService = () => {
    return this.props.service.employeesIds.includes(this.props.employeeId);
  };

  render() {
    const { name, duration, price, id } = this.props.service;
    const offering = this.isEmployeeOfferingService();

    return (
      <View style={{ flex: 1 }}>
        <Menu title={name} onBackdropPress={this.onOptionsPress} isVisible={this.state.optionsVisible}>
          <MenuItem title="Editar" icon="md-create" onPress={this.onUpdatePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="Eliminar" icon="md-trash" onPress={this.onDeletePress} />
        </Menu>

        <Menu
          title={`¿Seguro que desea eliminar "${name}"?`}
          onBackdropPress={this.onDeletePress}
          isVisible={this.state.deleteVisible}
        >
          <MenuItem title="Sí" icon="md-checkmark" onPress={this.onConfirmDeletePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="No" icon="md-close" onPress={this.onDeletePress} />
        </Menu>

        <ListItem
          title={name}
          subtitle={
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ color: 'grey' }}>{`Duración: ${duration} min.`}</Text>
              <Badge
                value={offering ? 'Dejar de Ofrecer' : 'Ofrecer Servicio'}
                badgeStyle={{
                  height: 25,
                  width: 'auto',
                  borderRadius: 12.5,
                  paddingLeft: 5,
                  paddingRight: 5,
                  backgroundColor: offering ? MAIN_COLOR : SUCCESS_COLOR,
                }}
                containerStyle={{ paddingTop: 3 }}
                onPress={this.onBadgePress}
              />
            </View>
          }
          rightTitle={`$${price}`}
          rightTitleStyle={{ color: 'black', fontWeight: 'bold' }}
          key={id}
          onLongPress={this.onOptionsPress.bind(this)}
          rightIcon={{
            name: 'md-more',
            type: 'ionicon',
            containerStyle: { height: 20, width: 10 },
            onPress: this.onOptionsPress,
          }}
          bottomDivider
        />
      </View>
    );
  }
}

export default connect(null, { onServiceDelete, onFormOpen })(ServicesListItem);
