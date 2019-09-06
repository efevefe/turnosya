import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem, IconButton } from '../components/common';
import { serviceDelete } from '../actions';

class ServicesListItem extends Component {
  state = { optionsVisible: false, deleteVisible: false  };

  onOptionsPress = () => {
    this.setState({ optionsVisible: !this.state.optionsVisible });
  }

  onDeletePress = () => {
    this.setState({ optionsVisible: false, deleteVisible: !this.state.deleteVisible });
  }

  onConfirmDeletePress = () => {
    const { service, commerceId } = this.props;

    this.props.serviceDelete({ id: service.id, commerceId });
    this.setState({ deleteVisible: !this.deleteVisible });
  };

  onUpdatePress = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'serviceForm',
      params: { service: this.props.service, title: 'Editar Servicio' }
    });

    this.setState({ optionsVisible: !this.state.optionsVisible });

    this.props.navigation.navigate(navigateAction);
  }

  render() {
    const { name, duration, price, id } = this.props.service;

    return (
      <View style={{ flex: 1 }}>
        <Menu
          title={name}
          onBackdropPress={this.onOptionsPress}
          isVisible={this.state.optionsVisible}
        >
          <MenuItem
            title="Editar"
            icon="md-create"
            onPress={this.onUpdatePress}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Eliminar"
            icon="md-trash"
            onPress={this.onDeletePress}
          />
        </Menu>

        <Menu
          title={`¿Seguro que desea eliminar "${name}"?`}
          onBackdropPress={this.onDeletePress}
          isVisible={this.state.deleteVisible}
        >
          <MenuItem
            title="Sí"
            icon="md-checkmark"
            onPress={this.onConfirmDeletePress}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="No" icon="md-close" onPress={this.onDeletePress} />
        </Menu>

        <ListItem
          title={name}
          subtitle={`Duración: ${duration} min.`}
          rightTitle={`$${price}`}
          key={id}
          onLongPress={this.onOptionsPress.bind(this)}
          rightElement={
            <IconButton
              icon='md-more'
              color='grey'
              iconSize={22}
              iconStyle={{ marginLeft: 5, marginRight: 8 }}
              onPress={this.onOptionsPress}
            />
          }
          bottomDivider
        />
      </View>
    );
  }
}

export default connect(
  null,
  { serviceDelete }
)(ServicesListItem);
