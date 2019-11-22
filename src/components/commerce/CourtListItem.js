import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem } from '../common';
import { courtDelete, onCourtFormOpen } from '../../actions';

class CourtListItem extends Component {
  state = { optionsVisible: false, deleteVisible: false };

  onOptionsPress = () => {
    this.setState({ optionsVisible: !this.state.optionsVisible });
  };

  onDeletePress = () => {
    this.setState({
      optionsVisible: false,
      deleteVisible: !this.state.deleteVisible
    });
  };

  onConfirmDeletePress = () => {
    const { court, commerceId, courtDelete } = this.props;

    courtDelete({ id: court.id, commerceId });
    this.setState({ deleteVisible: !this.deleteVisible });
  };

  onUpdatePress = () => {
    this.props.onCourtFormOpen();
    const navigateAction = NavigationActions.navigate({
      routeName: 'courtForm',
      params: { court: this.props.court, title: 'Editar Cancha' }
    });

    this.setState({ optionsVisible: !this.state.optionsVisible });

    //hay que ver la forma de que esto se haga en el .then() del update()
    this.props.navigation.navigate(navigateAction);
  };

  render() {
    const {
      name,
      court,
      ground,
      price,
      lightPrice,
      courtState,
      id
    } = this.props.court;

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
          containerStyle={
            !courtState && { backgroundColor: 'rgb(242, 242, 242)' }
          }
          title={name}
          titleStyle={
            courtState
              ? { textAlign: 'left', display: 'flex' }
              : {
                  textAlign: 'left',
                  display: 'flex',
                  color: 'grey',
                  fontStyle: 'italic'
                }
          }
          rightTitle={
            lightPrice !== '' ? (
              <View style={{ justifyContent: 'space-between' }}>
                <Text
                  style={
                    courtState
                      ? { textAlign: 'right', color: 'black' }
                      : {
                          textAlign: 'right',
                          color: 'grey',
                          fontStyle: 'italic'
                        }
                  }
                >{`Sin luz: $${price}`}</Text>
                <Text
                  style={
                    courtState
                      ? { textAlign: 'right', color: 'black' }
                      : {
                          textAlign: 'right',
                          color: 'grey',
                          fontStyle: 'italic'
                        }
                  }
                >{`Con luz: $${lightPrice}`}</Text>
              </View>
            ) : (
              <Text
                style={courtState ? {} : { color: 'grey', fontStyle: 'italic' }}
              >{`Sin luz: $${price}`}</Text>
            )
          }
          key={id}
          subtitle={
            <Text
              style={
                courtState
                  ? { color: 'grey' }
                  : { color: 'grey', fontStyle: 'italic' }
              }
            >{`${court} - ${ground}`}</Text>
          }
          onLongPress={this.onOptionsPress}
          rightIcon={{
            name: 'md-more',
            type: 'ionicon',
            containerStyle: { height: 20, width: 10 },
            onPress: this.onOptionsPress
          }}
          bottomDivider
        />
      </View>
    );
  }
}

export default connect(
  null,
  { courtDelete, onCourtFormOpen }
)(CourtListItem);
