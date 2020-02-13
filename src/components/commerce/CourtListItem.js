import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { Menu, MenuItem } from '../common';
import { ROLES } from '../../constants';
import { onCourtDelete, onCourtFormOpen, onCourtValueChange } from '../../actions';

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
    const { court, commerceId, onCourtDelete } = this.props;

    onCourtDelete({ id: court.id, commerceId });
    this.setState({ deleteVisible: !this.deleteVisible });
  };

  onUpdatePress = () => {
    this.props.onCourtFormOpen();
    this.props.onCourtValueChange(this.props.court);
    this.setState({ optionsVisible: !this.state.optionsVisible });
    this.props.navigation.navigate('courtForm', {
      title: 'Editar Cancha'
    });
  };

  formatDisabledDates = () => {
    const { disabledFrom, disabledTo } = this.props.court;
    let text = '';

    if (disabledFrom) {
      text = 'Desde: ' + disabledFrom.format('DD/MM/YYYY') + ' a las ' + disabledFrom.format('HH:mm');

      if (disabledTo) {
        text += '\nHasta: ' + disabledTo.format('DD/MM/YYYY') + ' a las ' + disabledTo.format('HH:mm');
      }
    }

    return text;
  };

  render() {
    const { name, court, ground, price, lightPrice, id } = this.props.court;

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
          titleStyle={{ textAlign: 'left', display: 'flex' }}
          rightTitle={
            <View
              style={{
                justifyContent: 'flex-start',
                width: 120,
                flex: 1,
                paddingTop: 2
              }}
            >
              <Text
                style={{
                  textAlign: 'right',
                  lineHeight: 20
                }}
              >
                {lightPrice ? `Sin Luz: $${price}\nCon Luz: $${lightPrice}` : `Sin Luz: $${price}`}
              </Text>
            </View>
          }
          key={id}
          subtitle={
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ color: 'grey' }}>{`${court} - ${ground}`}</Text>
              {this.props.court.disabled ? (
                <Text style={{ color: 'grey', fontSize: 12, marginTop: 3 }}>
                  {'Deshabilitada\n' + this.formatDisabledDates()}
                </Text>
              ) : null}
            </View>
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

const mapStateToProps = state => {
  const { role } = state.roleData;
  return { role };
};

export default connect(mapStateToProps, {
  onCourtDelete,
  onCourtFormOpen,
  onCourtValueChange
})(CourtListItem);
