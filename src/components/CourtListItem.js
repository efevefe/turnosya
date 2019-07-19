import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ListItem, Button, Overlay, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { Menu, MenuItem } from '../components/common';
import { courtDelete, onCourtFormOpen } from '../actions';

class CourtListItem extends Component {
  state = { optionsVisible: false, deleteVisible: false };

  onOptionsPress() {
    this.setState({ optionsVisible: !this.state.optionsVisible });
  }

  onDeletePress() {
    this.setState({ optionsVisible: false });
    this.setState({ deleteVisible: !this.state.deleteVisible });
  }

  onConfirmDeletePress() {
    this.props.courtDelete({ id: this.props.court.id });
    this.setState({ deleteVisible: !this.deleteVisible });
  }
  onUpdatePress() {
    this.props.onCourtFormOpen();
    const navigateAction = NavigationActions.navigate({
      routeName: 'courtForm',
      params: { court: this.props.court, title: 'Editar Cancha' }
    });

    this.setState({ optionsVisible: !this.state.optionsVisible });

    //hay que ver la forma de que esto se haga en el .then() del update()
    this.props.navigation.navigate(navigateAction);
  }

  render() {
    const {
      name,
      court,
      ground,
      price,
      lightPrice,
      checked,
      courtState,
      id
    } = this.props.court;
    return (
      <View style={{ flex: 1 }}>
        <Menu
          title={name}
          onBackdropPress={this.onOptionsPress.bind(this)}
          isVisible={this.state.optionsVisible}
        >
          <MenuItem
            title="Editar"
            icon="md-create"
            onPress={this.onUpdatePress.bind(this)}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Eliminar"
            icon="md-trash"
            onPress={this.onDeletePress.bind(this)}
          />
        </Menu>

        <Menu
          title={`¿Esta seguro que desea eliminar "${name}"?`}
          onBackdropPress={this.onDeletePress.bind(this)}
          isVisible={this.state.deleteVisible}
        >
          <MenuItem title="Si" onPress={this.onConfirmDeletePress.bind(this)} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="No" onPress={this.onDeletePress.bind(this)} />
        </Menu>

        <ListItem
          containerStyle={
            courtState ? {} : { backgroundColor: 'rgb(242, 242, 242)' }
          }
          title={name}
          titleStyle={
            courtState
              ? { textAlign: 'justify', fontSize: 22, display: 'flex' }
              : {
                  textAlign: 'justify',
                  fontSize: 22,
                  display: 'flex',
                  color: 'grey',
                  fontStyle: 'italic'
                }
          }
          // rightTitle={`$${price}`}
          rightTitle={
            checked ? (
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
              >{`Sin luz: $${price}\nCon luz: $${lightPrice}`}</Text>
            ) : (
              <Text
                style={courtState ? {} : { color: 'grey', fontStyle: 'italic' }}
              >{`Sin luz: $${price}`}</Text>
            )
          }
          key={id}
          subtitle={
            <Text
              style={courtState ? {} : { color: 'grey', fontStyle: 'italic' }}
            >{`${court} - ${ground}`}</Text>
          }
          onLongPress={this.onOptionsPress.bind(this)}
          rightElement={
            <Button
              type="clear"
              buttonStyle={{ padding: 0 }}
              containerStyle={{ borderRadius: 15, overflow: 'hidden' }}
              onPress={this.onOptionsPress.bind(this)}
              icon={<Icon name="more-vert" size={22} color="grey" />}
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
  { courtDelete, onCourtFormOpen }
)(CourtListItem);
