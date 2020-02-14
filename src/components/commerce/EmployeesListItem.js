import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'firebase';
import { ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import { Menu, MenuItem, Toast } from '../common';
import { onCourtFormOpen, onEmployeeDelete, onEmployeeValueChange, onEmploymentInvitationCancel, onNextReservationsRead } from '../../actions';
import { cancelReservationNotificationFormat } from '../../utils';
import { ROLES, AREAS } from '../../constants';

class CourtListItem extends Component {
  state = {
    optionsVisible: false,
    deleteVisible: false,
    deleteWithReservations: false,
    currentUserEmail: firebase.auth().currentUser.email,
    reservationsToCancel: []
  };

  componentDidUpdate(prevProps) {
    // ver si el empleado tenia reservas pendientes
    if (
      prevProps.nextReservations !== this.props.nextReservations &&
      this.props.navigation.isFocused() &&
      this.state.optionsVisible
    ) {
      this.setState({ optionsVisible: false }, this.onEmployeeDelete)
    }
  }

  onOptionsPress = () => {
    this.setState({ optionsVisible: true });
  };

  onDeletePress = () => {
    if (this.state.currentUserEmail === this.props.employee.email)
      return Toast.show({ text: 'No puede eliminarse usted mismo' });

    if (this.props.areaId === AREAS.sports || !this.props.employee.startDate) {
      this.setState({ deleteVisible: true })
    } else {
      this.props.onNextReservationsRead({
        commerceId: this.props.commerceId,
        startDate: moment(),
        employeeId: this.props.employee.id
      })

      this.setState({ reservationsToCancel: [] });
    }
  };

  onEmployeeDelete = () => {
    if (this.props.nextReservations.length) {
      this.setState({ deleteWithReservations: true });
    } else {
      this.setState({ deleteVisible: true });
    }
  };

  onCancelReservations = () => {
    const reservationsToCancel = this.props.nextReservations.map(res => {
      return {
        ...res,
        notification: cancelReservationNotificationFormat({
          startDate: res.startDate,
          actorName: this.props.commerceName,
          cancellationReason: 'El empleado con quién reservó el turno no trabaja mas ahí'
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
    const { commerceId, employee } = this.props;
    const { reservationsToCancel } = this.state;

    employee.startDate
      ? this.props.onEmployeeDelete({ employeeId: employee.id, commerceId, profileId: employee.profileId, reservationsToCancel })
      : this.props.onEmploymentInvitationCancel({ employeeId: employee.id, commerceId, profileId: employee.profileId });

    this.setState({ deleteVisible: false });
  };

  onUpdatePress = () => {
    const { employee } = this.props;

    this.setState({ optionsVisible: false });

    this.props.onEmployeeValueChange(employee);
    this.props.navigation.navigate('employeeForm', { editing: true });
  };

  renderDeleteWithReservations = () => {
    return (
      <Menu
        title={
          'El empleado que está tratando de eliminar tiene reservas pendientes. ¿Está seguro de que desea eliminarlo? ' +
          'Seleccione la opción "Cancelar reservas y notificar" para dar de baja el empleado y cancelar dichas reservas, ' +
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
    const { firstName, lastName, email, role, id, startDate } = this.props.employee;

    return (
      <View style={{ flex: 1 }}>
        <Menu
          title={`${firstName} ${lastName}`}
          onBackdropPress={() => this.setState({ optionsVisible: false })}
          isVisible={this.state.optionsVisible}
        >
          {startDate ? (
            <View>
              <MenuItem title="Editar" icon="md-create" onPress={this.onUpdatePress} />
              <Divider style={{ backgroundColor: 'grey' }} />
              <MenuItem
                title="Eliminar" icon="md-trash"
                onPress={this.onDeletePress}
                loadingWithText={this.props.loadingReservations}
              />
            </View>
          ) : (
              <MenuItem title="Cancelar Invitación" icon="md-trash" onPress={this.onDeletePress} />
            )}
        </Menu>

        <Menu
          title={`¿Seguro que desea ${
            this.startDate ? 'eliminar el' : 'cancelar la invitación del'
            } empleado '${firstName} ${lastName}'?`}
          onBackdropPress={() => this.setState({ deleteVisible: false })}
          isVisible={this.state.deleteVisible}
        >
          <MenuItem title="Sí" icon="md-checkmark" onPress={this.onConfirmDeletePress} />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem title="No" icon="md-close" onPress={() => this.setState({ deleteVisible: false })} />
        </Menu>

        {this.renderDeleteWithReservations()}

        <ListItem
          title={`${firstName} ${lastName}`}
          titleStyle={
            startDate
              ? { textAlign: 'left', display: 'flex' }
              : {
                textAlign: 'left',
                display: 'flex',
                color: 'grey',
                fontStyle: 'italic'
              }
          }
          rightTitle={<Text style={startDate ? {} : { color: 'grey', fontStyle: 'italic' }}>{role.name}</Text>}
          rightSubtitle={startDate ? null : <Text style={{ color: 'grey', fontStyle: 'italic' }}>(Invitado)</Text>}
          key={id}
          subtitle={<Text style={startDate ? { color: 'grey' } : { color: 'grey', fontStyle: 'italic' }}>{email}</Text>}
          onLongPress={
            this.props.role.value > ROLES[this.props.employee.role.roleId].value ||
              this.state.currentUserEmail === this.props.employee.email
              ? this.onOptionsPress
              : null
          }
          rightIcon={
            this.props.role.value > ROLES[this.props.employee.role.roleId].value ||
              this.state.currentUserEmail === this.props.employee.email
              ? {
                name: 'md-more',
                type: 'ionicon',
                containerStyle: { height: 20, width: 10 },
                onPress: this.onOptionsPress
              }
              : null
          }
          bottomDivider
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { role } = state.roleData;
  const { nextReservations, loading: loadingReservations } = state.reservationsList;
  const { name: commerceName, area: { areaId } } = state.commerceData;

  return { role, nextReservations, commerceName, areaId, loadingReservations };
};

export default connect(mapStateToProps, {
  onCourtFormOpen,
  onEmployeeDelete,
  onEmployeeValueChange,
  onEmploymentInvitationCancel,
  onNextReservationsRead
})(CourtListItem);
