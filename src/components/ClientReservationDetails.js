import React, { Component } from "react";
import { View } from "react-native";
import CourtReservationDetails from "./CourtReservationDetails";
import { connect } from "react-redux";
import { Divider } from "react-native-elements";
import { CardSection, Button, Menu, MenuItem } from "./common/";
import moment from "moment";
import { onClientCancelReservation } from "../actions";

class ClientReservationDetails extends Component {
  constructor(props) {
    super(props);
    const { reservation } = this.props.navigation.state.params;
    this.state = {
      reservation,
      optionsVisible: false
    };
  }

  renderCancelButton = () => {
    const { startDate } = this.state.reservation;
    if (startDate > moment())
      return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <CardSection>
            <Button
              title="Cancelar Reserva"
              type="solid"
              onPress={() => this.setState({ optionsVisible: true })}
            />
          </CardSection>
        </View>
      );
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
  return { loading };
};

export default connect(
  mapStateToProps,
  { onClientCancelReservation }
)(ClientReservationDetails);
