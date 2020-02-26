import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Menu, MenuItem, Badge, PermissionsAssigner } from '../common';
import { cancelReservationNotificationFormat } from '../../utils';
import { ROLES } from '../../constants';
import { onCourtDelete, onCourtFormOpen, onCourtValueChange, onCourtNextReservationsRead } from '../../actions';

class CourtListItem extends Component {
  state = { optionsVisible: false, deleteVisible: false, deleteWithReservations: false, reservationsToCancel: [] };

  componentDidUpdate(prevProps) {
    // ver si la cancha tenia reservas pendientes
    if (
      prevProps.nextReservations !== this.props.nextReservations &&
      this.props.navigation.isFocused() &&
      this.state.optionsVisible
    ) {
      this.setState({ optionsVisible: false }, this.onCourtDelete);
    }
  }

  onOptionsPress = () => {
    this.setState({ optionsVisible: !this.state.optionsVisible });
  };

  onDeletePress = () => {
    this.props.onCourtNextReservationsRead({
      commerceId: this.props.commerceId,
      courtId: this.props.court.id,
      startDate: moment()
    })

    this.setState({ reservationsToCancel: [] });
  };

  onCourtDelete = () => {
    if (this.props.nextReservations.length) {
      this.setState({ deleteWithReservations: true });
    } else {
      this.setState({ deleteVisible: true });
    }
  }

  onCancelReservations = () => {
    const reservationsToCancel = this.props.nextReservations.map(res => {
      return {
        ...res,
        notification: cancelReservationNotificationFormat({
          startDate: res.startDate,
          actorName: this.props.commerceName,
          cancellationReason: 'Problemas con la cancha'
        })
      }
    })

    this.setState({
      reservationsToCancel,
      deleteWithReservations: false,
      deleteVisible: true
    });
  };

  onConfirmDeletePress = () => {
    const { court, commerceId } = this.props;
    const { reservationsToCancel } = this.state;

    this.props.onCourtDelete({ id: court.id, commerceId, reservationsToCancel });
    this.setState({ deleteVisible: false });
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

  renderDeleteWithReservations = () => {
    return (
      <Menu
        title={
          'La cancha que está tratando de eliminar tiene reservas pendientes. ¿Está seguro de que desea eliminarla? ' +
          'Seleccione la opción "Cancelar reservas y notificar" para dar de baja la cancha y cancelar dichas reservas, ' +
          'o la opción "Volver" si desea cancelar esta acción.'
        }
        onBackdropPress={() => this.setState({ deleteWithReservations: false })}
        isVisible={this.state.deleteWithReservations}
      >
        <MenuItem title="Cancelar reservas y notificar" icon="md-trash" onPress={this.onCancelReservations} />
        <Divider style={{ backgroundColor: 'grey' }} />
        <MenuItem title="Volver" icon="md-close" onPress={() => this.setState({ deleteWithReservations: false })} />
      </Menu>
    );
  }

  render() {
    const { name, court, ground, price, lightPrice, id } = this.props.court;

    return (
      <View style={{ flex: 1 }}>
        <Menu title={name} onBackdropPress={this.onOptionsPress} isVisible={this.state.optionsVisible}>
          <MenuItem title="Editar" icon="md-create" onPress={this.onUpdatePress} />
          <PermissionsAssigner requiredRole={ROLES.ADMIN}>
            <Divider style={{ backgroundColor: 'grey' }} />
            <MenuItem title="Eliminar" icon="md-trash" onPress={this.onDeletePress} />
          </PermissionsAssigner>
        </Menu>

        <Menu
          title={`¿Seguro que desea eliminar "${name}"?`}
          onBackdropPress={() => this.setState({ deleteVisible: false })}
          isVisible={this.state.deleteVisible}
        >
          <MenuItem title="Sí" icon="md-checkmark" onPress={this.onConfirmDeletePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="No" icon="md-close" onPress={() => this.setState({ deleteVisible: false })} />
        </Menu>

        {this.renderDeleteWithReservations()}

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
              {this.props.court.lightHour ?
                <Text style={{ color: 'grey' }}>{`Prenden Luces: ${this.props.court.lightHour} hs.`}</Text> : null}
              {this.props.court.disabled ? <Badge value='Deshabilitada' color='grey' /> : null}
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
  const { name: commerceName } = state.commerceData;
  const { nextReservations } = state.reservationsList;

  return { nextReservations, commerceName };
};

export default connect(mapStateToProps, {
  onCourtDelete,
  onCourtFormOpen,
  onCourtValueChange,
  onCourtNextReservationsRead
})(CourtListItem);
