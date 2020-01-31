import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { onClientServiceReservationCreate } from '../../actions';
import ServiceReservationDetails from '../ServiceReservationDetails';
import { CardSection, Button } from '../common';
import { MAIN_COLOR } from '../../constants';
import { newReservationNotificationFormat } from '../../utils';

class ConfirmServiceReservation extends Component {
  onConfirmReservation = () => {
    const {
      commerce,
      service,
      employee,
      startDate,
      endDate,
      price,
      areaId,
      clientFirstName,
      clientLastName
    } = this.props;
    const notification = newReservationNotificationFormat({
      startDate,
      service: `${service.name}`,
      actorName: `${clientFirstName} ${clientLastName}`,
      receptorName: `${commerce.name}`
    });

    this.props.onClientServiceReservationCreate({
      commerceId: commerce.objectID,
      areaId,
      serviceId: service.id,
      employeeId: employee.id,
      startDate,
      endDate,
      price,
      notification
    });
  };

  renderButtons = () => {
    if (this.props.saved || this.props.exists) {
      return (
        <CardSection style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', flex: 1 }}>
            <RNEButton
              title="Reservar Otro"
              type="clear"
              titleStyle={{ color: MAIN_COLOR }}
              icon={<Ionicons name="ios-arrow-back" size={30} color={MAIN_COLOR} style={{ marginRight: 10 }} />}
              onPress={() => this.props.navigation.navigate('commerceProfileView')}
            />
          </View>
          {this.props.saved ? (
            <View style={{ alignItems: 'flex-end' }}>
              <RNEButton
                title="Finalizar"
                type="clear"
                titleStyle={{ color: MAIN_COLOR }}
                iconRight
                icon={<Ionicons name="ios-arrow-forward" size={30} color={MAIN_COLOR} style={{ marginLeft: 10 }} />}
                onPress={() => this.props.navigation.navigate('commercesAreas')}
              />
            </View>
          ) : null}
        </CardSection>
      );
    }

    return (
      <CardSection>
        <Button title="Confirmar Reserva" loading={this.props.loading} onPress={this.onConfirmReservation} />
      </CardSection>
    );
  };

  render() {
    const { commerce, employee, service, startDate, endDate, price } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ServiceReservationDetails
          mode="commerce"
          name={commerce.name}
          info={commerce.address + ', ' + commerce.city + ', ' + commerce.provinceName}
          infoIcon="md-pin"
          picture={commerce.profilePicture}
          service={service}
          employee={employee}
          startDate={startDate}
          endDate={endDate}
          price={price}
        />
        <View style={styles.confirmButtonContainer}>{this.renderButtons()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardSections: {
    alignItems: 'center'
  },
  confirmButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch'
  }
});

const mapStateToProps = state => {
  const { commerce, service, employee, startDate, endDate, price, saved, exists, areaId, loading } = state.reservation;

  const { firstName: clientFirstName, lastName: clientLastName } = state.clientData;

  return {
    commerce,
    employee,
    service,
    startDate,
    endDate,
    price,
    areaId,
    saved,
    exists,
    loading,
    clientFirstName,
    clientLastName
  };
};

export default connect(mapStateToProps, { onClientServiceReservationCreate })(ConfirmServiceReservation);
