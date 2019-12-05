import React, { Component } from 'react';
import CourtReservationDetails from '../CourtReservationDetails';
import { View } from 'react-native';
import { Button, Menu, MenuItem, Input, CardSection } from '../common';
import { Divider } from 'react-native-elements';
import moment from 'moment';
import {
  onCommerceCancelReservation,
  onCourtReservationsListValueChange
} from '../../actions';
import { connect } from 'react-redux';

class CommerceCourtReservationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservation: props.navigation.getParam('reservation'),
      optionsVisible: false,
      error: ''
    };
  }

  renderCancelButton = () => {
    if (this.state.reservation.startDate > moment()) {
      return (
        <Button
          title="Cancelar Reserva"
          onPress={() =>
            this.setState({ optionsVisible: !this.state.optionsVisible })
          }
        />
      );
    }
  };

  renderError = () => {
    if (this.props.cancelationReason === '') {
      this.setState({ error: 'Debe informar el motivo' });
      return false;
    } else {
      this.setState({ error: '' });
      return true;
    }
  };

  onBackdropPress = () => {
    this.setState({ optionsVisible: false, error: '' });
    this.props.onCourtReservationsListValueChange({
      prop: 'cancelationReason',
      value: ''
    });
  };

  onConfirmDelete = (id, clientId) => {
    if (this.renderError()) {
      this.setState({ optionsVisible: false });
      this.props.onCommerceCancelReservation({
        commerceId: this.props.commerceId,
        reservationId: id,
        clientId,
        cancelationReason: this.props.cancelationReason,
        navigation: this.props.navigation
      });
    }
  };

  render() {
    const {
      client,
      court,
      startDate,
      endDate,
      price,
      light,
      id,
      clientId
    } = this.state.reservation;
    return (
      <View>
        <CourtReservationDetails
          client={client}
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={true}
        />
        <CardSection>{this.renderCancelButton()}</CardSection>

        <Menu
          title="Informar el motivo de la cancelación"
          onBackdropPress={() => this.onBackdropPress()}
          isVisible={this.state.optionsVisible}
        >
          <View style={{ alignSelf: 'stretch' }}>
            <CardSection
              style={{ padding: 20, paddingLeft: 10, paddingRight: 10 }}
            >
              <Input
                placeholder="Motivo de cancelación..."
                multiline={true}
                color="black"
                onChangeText={value => {
                  this.props.onCourtReservationsListValueChange({
                    prop: 'cancelationReason',
                    value
                  });
                  this.setState({ error: '' });
                }}
                value={this.props.cancelationReason}
                errorMessage={this.state.error}
                onFocus={() => this.setState({ error: '' })}
              />
            </CardSection>
            <Divider style={{ backgroundColor: 'grey' }} />
          </View>
          <MenuItem
            title="Confirmar Cancelación"
            icon="md-checkmark"
            loadingWithText={this.props.loading}
            onPress={() => this.onConfirmDelete(id, clientId)}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cerrar"
            icon="md-close"
            onPress={() => this.onBackdropPress()}
          />
        </Menu>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { loading, cancelationReason } = state.courtReservationsList;
  const { commerceId } = state.commerceData;

  return { loading, commerceId, cancelationReason };
};

export default connect(mapStateToProps, {
  onCommerceCancelReservation,
  onCourtReservationsListValueChange
})(CommerceCourtReservationDetails);
