import React, { Component } from 'react';
import { View } from 'react-native';
import CourtReservationDetails from '../CourtReservationDetails';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import { CardSection, Button, Menu, MenuItem, Spinner, Toast } from '../common';
import moment from 'moment';
import {
  onClientCancelReservation,
  readCancellationTimeAllowed
} from '../../actions';
import { stringFormatHours } from '../../utils/functions';

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);

    const reservation = props.navigation.getParam('reservation');
    this.state = {
      reservation,
      optionsVisible: false
    };
  }

  componentDidMount() {
    this.props.readCancellationTimeAllowed(
      this.props.navigation.state.params.reservation.commerceId
    );
  }

  onPressCancelButton = () => {
    const { reservationMinCancelTime } = this.props;
    const { startDate } = this.state.reservation;
    if (startDate.diff(moment(), 'hours', 'minutes') > reservationMinCancelTime)
      this.setState({ optionsVisible: true });
    else
      Toast.show({
        text:
          'No puede cancelar el turno, el tiempo minimo permitido es ' +
          stringFormatHours(reservationMinCancelTime)
      });
  };

  renderCancelButton = () => {
    const { startDate } = this.state.reservation;
    if (startDate > moment()) {
      return (
        <Button
          title="Cancelar Reserva"
          type="solid"
          onPress={this.onPressCancelButton}
        />
      );
    }
  };

  render() {
    const {
      commerce,
      court,
      endDate,
      startDate,
      light,
      price,
      id,
      commerceId
    } = this.state.reservation;

    if (this.props.loadingCancel) return <Spinner />;

    return (
      <View style={{ flex: 1 }}>
        <Menu
          title="¿Está seguro que desea cancelar el turno?"
          onBackdropPress={() => this.setState({ optionsVisible: false })}
          isVisible={
            this.state.optionsVisible || this.props.loadingReservations
          }
        >
          <MenuItem
            title="Aceptar"
            icon="md-checkmark"
            loadingWithText={this.props.loadingReservations}
            onPress={() => {
              this.setState({ optionsVisible: false });
              this.props.onClientCancelReservation({
                reservationId: id,
                commerceId,
                navigation: this.props.navigation
              });
            }}
          />
          <Divider style={{ backgroundColor: 'grey' }} />
          <MenuItem
            title="Cancelar"
            icon="md-close"
            onPress={() => this.setState({ optionsVisible: false })}
          />
        </Menu>
        <CourtReservationDetails
          commerce={commerce}
          court={court}
          startDate={startDate}
          endDate={endDate}
          price={price}
          light={light}
          showPrice={true}
        />
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <CardSection>{this.renderCancelButton()}</CardSection>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  const loadingReservations = state.clientReservationsList.loading;
  const { reservationMinCancelTime } = state.commerceSchedule;
  const loadingCancel = state.commerceSchedule.loading;

  return {
    loadingReservations,
    loadingCancel,
    reservationMinCancelTime
  };
};

export default connect(mapStateToProps, {
  onClientCancelReservation,
  readCancellationTimeAllowed
})(ClientReservationDetails);
