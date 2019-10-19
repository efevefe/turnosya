import React, { Component } from "react";
import { View } from "react-native";
import CourtReservationDetails from "../CourtReservationDetails";
import { connect } from "react-redux";
import { Divider, Button as ButtonRN } from "react-native-elements";
import { CardSection, Button, Menu, MenuItem } from "../common";
import moment from "moment";
import { onClientCancelReservation, onScheduleCancelRead } from "../../actions";
import { stringFormatHours } from "../../utils/functions";

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);
    const { reservation } = this.props.navigation.state.params;
    this.state = {
      reservation,
      optionsVisible: false
    };
  }

  /*   componentWillMount  () {
     this.props.onScheduleCancelRead(this.props.navigation.state.params.reservation.commerceId);
  } */

  validateCancelTime = async () => {
    await this.props.onScheduleCancelRead(this.state.reservation.commerceId);
  };

  renderCancelButton = () => {
    const { startDate } = this.state.reservation;
    const { reservationMinCancelTime } = this.props;
    if (startDate > moment()) {
     this.validateCancelTime();
      if (startDate.diff(moment(), "hours") > reservationMinCancelTime)
        return (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <CardSection>
              <Button
                title="Cancelar Reserva"
                type="solid"
                onPress={() => this.setState({ optionsVisible: true })}
              />
            </CardSection>
          </View>
        );
      return (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <CardSection>
            <ButtonRN
              title={
                "No puede cancelar el turno, el tiempo minimo permitido es " +
                stringFormatHours(reservationMinCancelTime)
              }
              type="outline"
            />
          </CardSection>
        </View>
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

    return (
      <View style={{ flex: 1 }}>
        <Menu
          title="¿Está seguro que desea cancelar el turno?"
          onBackdropPress={() => this.setState({ optionsVisible: false })}
          isVisible={this.state.optionsVisible || this.props.loading}
        >
          <MenuItem
            title="Aceptar"
            icon="md-checkmark"
            loadingWithText={this.props.loading}
            onPress={() => {
              this.setState({ optionsVisible: false });
              this.props.onClientCancelReservation({
                reservationId: id,
                commerceId,
                navigation: this.props.navigation
              });
            }}
          />
          <Divider style={{ backgroundColor: "grey" }} />
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
        {this.renderCancelButton()}
      </View>
    );
  }
}
const mapStateToProps = state => {
  const { loading } = state.clientReservationsList;
  const { reservationMinCancelTime } = state.commerceSchedule;

  return { loading, reservationMinCancelTime };
};

export default connect(
  mapStateToProps,
  { onClientCancelReservation, onScheduleCancelRead }
)(ClientReservationDetails);
